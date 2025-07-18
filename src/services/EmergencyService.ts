import { Linking, Alert, Vibration } from 'react-native';
import { Contact, AppSettings } from '../types';
import { EMERGENCY_NUMBERS } from '../constants';
import { loadContacts, loadSettings } from '../utils';

export class EmergencyService {
  // 紧急电话号码映射
  private static readonly EMERGENCY_CONTACTS = {
    police: { number: EMERGENCY_NUMBERS.POLICE, name: '报警电话', icon: '🚔' },
    fire: { number: EMERGENCY_NUMBERS.FIRE, name: '火警电话', icon: '🚒' },
    ambulance: { number: EMERGENCY_NUMBERS.AMBULANCE, name: '急救电话', icon: '🚑' },
    traffic: { number: EMERGENCY_NUMBERS.TRAFFIC, name: '交通事故', icon: '🚦' },
  };

  // 拨打紧急电话
  static async makeEmergencyCall(
    emergencyType: keyof typeof EmergencyService.EMERGENCY_CONTACTS
  ): Promise<void> {
    try {
      const emergency = this.EMERGENCY_CONTACTS[emergencyType];
      
      if (!emergency) {
        Alert.alert('错误', '无效的紧急电话类型');
        return;
      }

      // 震动提醒
      Vibration.vibrate([0, 500, 200, 500]);

      // 显示紧急呼叫确认对话框
      Alert.alert(
        `${emergency.icon} 紧急呼叫`,
        `确定要拨打${emergency.name} ${emergency.number} 吗？\n\n请确保这是真正的紧急情况！`,
        [
          { text: '取消', style: 'cancel' },
          {
            text: '立即拨打',
            style: 'destructive',
            onPress: async () => {
              await this.dialEmergencyNumber(emergency.number, emergency.name);
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('Error making emergency call:', error);
      Alert.alert('错误', '拨打紧急电话失败');
    }
  }

  // 拨打紧急联系人
  static async callEmergencyContact(contactId: string): Promise<void> {
    try {
      const contacts = await loadContacts();
      const contact = contacts.find(c => c.id === contactId && c.isEmergency);
      
      if (!contact) {
        Alert.alert('错误', '紧急联系人不存在');
        return;
      }

      if (!contact.phoneNumber) {
        Alert.alert('错误', `${contact.name} 没有设置电话号码`);
        return;
      }

      // 震动提醒
      Vibration.vibrate([0, 300, 100, 300]);

      Alert.alert(
        '🚨 紧急联系',
        `确定要拨打紧急联系人 ${contact.name} (${contact.phoneNumber}) 吗？`,
        [
          { text: '取消', style: 'cancel' },
          {
            text: '立即拨打',
            style: 'destructive',
            onPress: async () => {
              await this.dialEmergencyNumber(contact.phoneNumber!, contact.name);
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('Error calling emergency contact:', error);
      Alert.alert('错误', '拨打紧急联系人失败');
    }
  }

  // 实际拨打电话
  private static async dialEmergencyNumber(phoneNumber: string, name: string): Promise<void> {
    try {
      const phoneUrl = `tel:${phoneNumber}`;
      const canCall = await Linking.canOpenURL(phoneUrl);
      
      if (!canCall) {
        Alert.alert('错误', '当前设备不支持电话功能');
        return;
      }

      await Linking.openURL(phoneUrl);
      
      // 记录紧急呼叫（可以添加到日志中）
      console.log(`Emergency call made to ${name} (${phoneNumber}) at ${new Date().toISOString()}`);
    } catch (error) {
      console.error('Error dialing emergency number:', error);
      Alert.alert('错误', `拨打 ${name} 失败，请手动拨打 ${phoneNumber}`);
    }
  }

  // 获取所有紧急联系人
  static async getEmergencyContacts(): Promise<Contact[]> {
    try {
      const contacts = await loadContacts();
      return contacts.filter(contact => contact.isEmergency);
    } catch (error) {
      console.error('Error getting emergency contacts:', error);
      return [];
    }
  }

  // 快速拨打最近的紧急联系人
  static async quickEmergencyCall(): Promise<void> {
    try {
      const emergencyContacts = await this.getEmergencyContacts();
      
      if (emergencyContacts.length === 0) {
        Alert.alert(
          '没有紧急联系人',
          '您还没有设置紧急联系人，是否要拨打急救电话 120？',
          [
            { text: '取消', style: 'cancel' },
            {
              text: '拨打 120',
              style: 'destructive',
              onPress: () => this.makeEmergencyCall('ambulance'),
            },
          ]
        );
        return;
      }

      if (emergencyContacts.length === 1) {
        // 只有一个紧急联系人，直接拨打
        await this.callEmergencyContact(emergencyContacts[0].id);
        return;
      }

      // 多个紧急联系人，让用户选择
      const options = emergencyContacts.map(contact => ({
        text: `${contact.name} (${contact.phoneNumber})`,
        onPress: () => this.callEmergencyContact(contact.id),
      }));

      options.push({ text: '取消', onPress: async () => {} });

      Alert.alert(
        '选择紧急联系人',
        '请选择要拨打的紧急联系人：',
        options,
        { cancelable: true }
      );
    } catch (error) {
      console.error('Error in quick emergency call:', error);
      Alert.alert('错误', '紧急呼叫失败');
    }
  }

  // 获取紧急服务信息
  static getEmergencyServices(): Array<{
    type: keyof typeof EmergencyService.EMERGENCY_CONTACTS;
    name: string;
    number: string;
    icon: string;
    description: string;
  }> {
    return [
      {
        type: 'police',
        name: '报警电话',
        number: EMERGENCY_NUMBERS.POLICE,
        icon: '🚔',
        description: '遇到违法犯罪、治安事件时拨打',
      },
      {
        type: 'fire',
        name: '火警电话',
        number: EMERGENCY_NUMBERS.FIRE,
        icon: '🚒',
        description: '发生火灾、爆炸等事故时拨打',
      },
      {
        type: 'ambulance',
        name: '急救电话',
        number: EMERGENCY_NUMBERS.AMBULANCE,
        icon: '🚑',
        description: '遇到医疗急救情况时拨打',
      },
      {
        type: 'traffic',
        name: '交通事故',
        number: EMERGENCY_NUMBERS.TRAFFIC,
        icon: '🚦',
        description: '发生交通事故时拨打',
      },
    ];
  }

  // 获取紧急情况处理指南
  static getEmergencyGuide(): Array<{
    situation: string;
    steps: string[];
    phoneNumber: string;
  }> {
    return [
      {
        situation: '心脏病发作',
        steps: [
          '立即让患者停止活动，保持安静',
          '如有急救药物，协助患者服用',
          '保持患者呼吸道通畅',
          '立即拨打 120 急救电话',
          '记录发病时间和症状',
        ],
        phoneNumber: EMERGENCY_NUMBERS.AMBULANCE,
      },
      {
        situation: '跌倒受伤',
        steps: [
          '不要随意移动患者',
          '检查是否有明显外伤',
          '如有出血，用干净布料压迫止血',
          '保持患者温暖和安静',
          '拨打 120 急救电话',
        ],
        phoneNumber: EMERGENCY_NUMBERS.AMBULANCE,
      },
      {
        situation: '火灾',
        steps: [
          '立即离开危险区域',
          '用湿毛巾捂住口鼻',
          '低姿势快速撤离',
          '到安全地点后拨打 119',
          '不要乘坐电梯',
        ],
        phoneNumber: EMERGENCY_NUMBERS.FIRE,
      },
      {
        situation: '遇到坏人',
        steps: [
          '保持冷静，不要激怒对方',
          '尽量记住对方特征',
          '寻找机会逃离或求助',
          '到安全地点后立即报警',
          '配合警方调查',
        ],
        phoneNumber: EMERGENCY_NUMBERS.POLICE,
      },
    ];
  }

  // 检查紧急功能状态
  static async checkEmergencyStatus(): Promise<{
    canMakeCall: boolean;
    emergencyContactsCount: number;
    hasPhonePermission: boolean;
  }> {
    try {
      const [canMakeCall, emergencyContacts] = await Promise.all([
        Linking.canOpenURL('tel:120'),
        this.getEmergencyContacts(),
      ]);

      return {
        canMakeCall,
        emergencyContactsCount: emergencyContacts.length,
        hasPhonePermission: canMakeCall, // 简化处理
      };
    } catch (error) {
      console.error('Error checking emergency status:', error);
      return {
        canMakeCall: false,
        emergencyContactsCount: 0,
        hasPhonePermission: false,
      };
    }
  }
}
