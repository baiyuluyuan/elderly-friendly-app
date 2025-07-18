import { Linking, Alert, PermissionsAndroid, Platform } from 'react-native';
import { Contact } from '../types';

export class PhoneService {
  // 请求电话权限
  static async requestPhonePermission(): Promise<boolean> {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CALL_PHONE,
          {
            title: '电话权限',
            message: '应用需要电话权限来拨打电话',
            buttonNeutral: '稍后询问',
            buttonNegative: '拒绝',
            buttonPositive: '允许',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn('Permission request error:', err);
        return false;
      }
    }
    return true; // iOS 不需要运行时权限
  }

  // 拨打电话
  static async makeCall(phoneNumber: string, contactName?: string): Promise<void> {
    try {
      // 清理电话号码
      const cleanNumber = phoneNumber.replace(/\D/g, '');
      
      if (!cleanNumber) {
        Alert.alert('错误', '无效的电话号码');
        return;
      }

      // 检查权限
      const hasPermission = await this.requestPhonePermission();
      if (!hasPermission) {
        Alert.alert('权限不足', '需要电话权限才能拨打电话');
        return;
      }

      // 构建电话URL
      const phoneUrl = `tel:${cleanNumber}`;
      
      // 检查设备是否支持电话功能
      const canCall = await Linking.canOpenURL(phoneUrl);
      if (!canCall) {
        Alert.alert('不支持', '当前设备不支持电话功能');
        return;
      }

      // 显示确认对话框
      const contactInfo = contactName ? `${contactName} (${phoneNumber})` : phoneNumber;
      Alert.alert(
        '拨打电话',
        `确定要拨打 ${contactInfo} 吗？`,
        [
          { text: '取消', style: 'cancel' },
          {
            text: '拨打',
            onPress: async () => {
              try {
                await Linking.openURL(phoneUrl);
              } catch (error) {
                console.error('Error making call:', error);
                Alert.alert('错误', '拨打电话失败，请稍后重试');
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error in makeCall:', error);
      Alert.alert('错误', '拨打电话失败，请稍后重试');
    }
  }

  // 紧急呼叫（无需确认）
  static async makeEmergencyCall(phoneNumber: string): Promise<void> {
    try {
      const cleanNumber = phoneNumber.replace(/\D/g, '');
      
      if (!cleanNumber) {
        Alert.alert('错误', '无效的紧急电话号码');
        return;
      }

      const phoneUrl = `tel:${cleanNumber}`;
      const canCall = await Linking.canOpenURL(phoneUrl);
      
      if (!canCall) {
        Alert.alert('不支持', '当前设备不支持电话功能');
        return;
      }

      // 紧急电话直接拨打，但仍显示确认
      Alert.alert(
        '紧急呼叫',
        `确定要拨打紧急电话 ${phoneNumber} 吗？`,
        [
          { text: '取消', style: 'cancel' },
          {
            text: '立即拨打',
            style: 'destructive',
            onPress: async () => {
              try {
                await Linking.openURL(phoneUrl);
              } catch (error) {
                console.error('Error making emergency call:', error);
                Alert.alert('错误', '拨打紧急电话失败');
              }
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('Error in makeEmergencyCall:', error);
      Alert.alert('错误', '拨打紧急电话失败');
    }
  }

  // 发送短信
  static async sendSMS(phoneNumber: string, message?: string, contactName?: string): Promise<void> {
    try {
      const cleanNumber = phoneNumber.replace(/\D/g, '');
      
      if (!cleanNumber) {
        Alert.alert('错误', '无效的电话号码');
        return;
      }

      const smsUrl = message 
        ? `sms:${cleanNumber}?body=${encodeURIComponent(message)}`
        : `sms:${cleanNumber}`;
      
      const canSendSMS = await Linking.canOpenURL(smsUrl);
      if (!canSendSMS) {
        Alert.alert('不支持', '当前设备不支持短信功能');
        return;
      }

      const contactInfo = contactName ? `${contactName} (${phoneNumber})` : phoneNumber;
      Alert.alert(
        '发送短信',
        `确定要给 ${contactInfo} 发送短信吗？`,
        [
          { text: '取消', style: 'cancel' },
          {
            text: '发送',
            onPress: async () => {
              try {
                await Linking.openURL(smsUrl);
              } catch (error) {
                console.error('Error sending SMS:', error);
                Alert.alert('错误', '发送短信失败，请稍后重试');
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error in sendSMS:', error);
      Alert.alert('错误', '发送短信失败，请稍后重试');
    }
  }

  // 快速拨打联系人电话
  static async callContact(contact: Contact): Promise<void> {
    if (!contact.phoneNumber) {
      Alert.alert('提示', `${contact.name} 没有设置电话号码`);
      return;
    }

    await this.makeCall(contact.phoneNumber, contact.name);
  }

  // 格式化电话号码显示
  static formatPhoneNumber(phoneNumber: string): string {
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // 中国手机号码格式化 (11位)
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 7)} ${cleaned.slice(7)}`;
    }
    
    // 固定电话格式化
    if (cleaned.length >= 7 && cleaned.length <= 12) {
      if (cleaned.length === 7) {
        return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
      } else if (cleaned.length === 8) {
        return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
      } else if (cleaned.length >= 10) {
        // 带区号的固定电话
        const areaCodeLength = cleaned.length - 8;
        return `${cleaned.slice(0, areaCodeLength)}-${cleaned.slice(areaCodeLength, areaCodeLength + 4)}-${cleaned.slice(areaCodeLength + 4)}`;
      }
    }
    
    return phoneNumber; // 如果无法格式化，返回原始号码
  }

  // 验证电话号码
  static validatePhoneNumber(phoneNumber: string): boolean {
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // 中国手机号码验证 (1开头的11位数字)
    const mobileRegex = /^1[3-9]\d{9}$/;
    
    // 固定电话验证 (7-12位数字)
    const landlineRegex = /^\d{7,12}$/;
    
    return mobileRegex.test(cleaned) || landlineRegex.test(cleaned);
  }

  // 获取电话号码类型
  static getPhoneNumberType(phoneNumber: string): 'mobile' | 'landline' | 'unknown' {
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    if (/^1[3-9]\d{9}$/.test(cleaned)) {
      return 'mobile';
    } else if (/^\d{7,12}$/.test(cleaned)) {
      return 'landline';
    } else {
      return 'unknown';
    }
  }
}
