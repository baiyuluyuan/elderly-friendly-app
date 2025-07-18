import { Alert, PermissionsAndroid, Platform } from 'react-native';
import { Contact } from '../types';
import { loadContacts } from '../utils';
import { PhoneService } from './PhoneService';
import { WechatService } from './WechatService';
import { EmergencyService } from './EmergencyService';

// 语音指令类型
export interface VoiceCommand {
  command: string;
  action: string;
  parameters?: any;
}

export class VoiceAssistantService {
  private static isListening = false;
  private static isEnabled = true;

  // 语音指令模式匹配
  private static readonly COMMAND_PATTERNS = {
    // 拨打电话相关
    call: [
      /打电话给(.+)/,
      /拨打(.+)/,
      /给(.+)打电话/,
      /联系(.+)/,
      /呼叫(.+)/,
    ],
    // 微信相关
    wechat: [
      /微信(.+)/,
      /给(.+)发微信/,
      /微信联系(.+)/,
      /微信通话(.+)/,
    ],
    // 紧急呼叫
    emergency: [
      /紧急呼叫/,
      /求救/,
      /救命/,
      /报警/,
      /叫救护车/,
      /火警/,
    ],
    // 导航相关
    navigate: [
      /打开(.+)/,
      /进入(.+)/,
      /去(.+)/,
      /显示(.+)/,
    ],
    // 设置相关
    settings: [
      /调整字体/,
      /设置(.+)/,
      /更改(.+)/,
      /修改(.+)/,
    ],
  };

  // 请求麦克风权限
  static async requestMicrophonePermission(): Promise<boolean> {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: '麦克风权限',
            message: '语音助手需要麦克风权限来识别语音指令',
            buttonNeutral: '稍后询问',
            buttonNegative: '拒绝',
            buttonPositive: '允许',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn('Microphone permission request error:', err);
        return false;
      }
    }
    return true; // iOS 权限在使用时请求
  }

  // 启用/禁用语音助手
  static setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    if (!enabled && this.isListening) {
      this.stopListening();
    }
  }

  // 检查是否启用
  static getEnabled(): boolean {
    return this.isEnabled;
  }

  // 开始语音识别
  static async startListening(): Promise<void> {
    if (!this.isEnabled) {
      Alert.alert('提示', '语音助手已禁用，请在设置中启用');
      return;
    }

    if (this.isListening) {
      Alert.alert('提示', '语音助手正在监听中');
      return;
    }

    try {
      const hasPermission = await this.requestMicrophonePermission();
      if (!hasPermission) {
        Alert.alert('权限不足', '需要麦克风权限才能使用语音助手');
        return;
      }

      this.isListening = true;
      
      // 这里应该集成实际的语音识别SDK
      // 例如：科大讯飞、百度语音、Google Speech等
      Alert.alert(
        '语音助手',
        '请说出您的指令...\n\n支持的指令示例：\n• "打电话给张三"\n• "微信联系李四"\n• "紧急呼叫"\n• "打开设置"',
        [
          { text: '取消', onPress: () => this.stopListening() },
          { text: '模拟指令', onPress: () => this.simulateVoiceInput() },
        ]
      );
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      Alert.alert('错误', '启动语音识别失败');
      this.isListening = false;
    }
  }

  // 停止语音识别
  static stopListening(): void {
    this.isListening = false;
    // 这里应该停止实际的语音识别
  }

  // 模拟语音输入（用于演示）
  private static simulateVoiceInput(): void {
    const sampleCommands = [
      '打电话给妈妈',
      '微信联系儿子',
      '紧急呼叫',
      '打开设置',
      '拨打120',
    ];

    Alert.alert(
      '选择模拟指令',
      '请选择一个指令进行演示：',
      [
        ...sampleCommands.map(command => ({
          text: command,
          onPress: () => this.processVoiceCommand(command),
        })),
        { text: '取消', style: 'cancel' },
      ]
    );
  }

  // 处理语音指令
  static async processVoiceCommand(voiceText: string): Promise<void> {
    try {
      this.stopListening();
      
      const command = this.parseVoiceCommand(voiceText);
      if (!command) {
        Alert.alert('未识别', `抱歉，我没有理解您的指令："${voiceText}"`);
        return;
      }

      await this.executeCommand(command);
    } catch (error) {
      console.error('Error processing voice command:', error);
      Alert.alert('错误', '处理语音指令时出错');
    }
  }

  // 解析语音指令
  private static parseVoiceCommand(voiceText: string): VoiceCommand | null {
    const text = voiceText.trim();

    // 检查拨打电话指令
    for (const pattern of this.COMMAND_PATTERNS.call) {
      const match = text.match(pattern);
      if (match) {
        return {
          command: 'call',
          action: 'phone',
          parameters: { contactName: match[1] },
        };
      }
    }

    // 检查微信指令
    for (const pattern of this.COMMAND_PATTERNS.wechat) {
      const match = text.match(pattern);
      if (match) {
        return {
          command: 'wechat',
          action: 'voice_call',
          parameters: { contactName: match[1] },
        };
      }
    }

    // 检查紧急呼叫指令
    for (const pattern of this.COMMAND_PATTERNS.emergency) {
      if (pattern.test(text)) {
        if (text.includes('报警') || text.includes('110')) {
          return { command: 'emergency', action: 'police' };
        } else if (text.includes('火警') || text.includes('119')) {
          return { command: 'emergency', action: 'fire' };
        } else if (text.includes('救护车') || text.includes('120')) {
          return { command: 'emergency', action: 'ambulance' };
        } else {
          return { command: 'emergency', action: 'quick_call' };
        }
      }
    }

    // 检查导航指令
    for (const pattern of this.COMMAND_PATTERNS.navigate) {
      const match = text.match(pattern);
      if (match) {
        const target = match[1];
        if (target.includes('联系人')) {
          return { command: 'navigate', action: 'contacts' };
        } else if (target.includes('抖音')) {
          return { command: 'navigate', action: 'douyin' };
        } else if (target.includes('设置')) {
          return { command: 'navigate', action: 'settings' };
        }
      }
    }

    return null;
  }

  // 执行指令
  private static async executeCommand(command: VoiceCommand): Promise<void> {
    switch (command.command) {
      case 'call':
        await this.handleCallCommand(command);
        break;
      case 'wechat':
        await this.handleWechatCommand(command);
        break;
      case 'emergency':
        await this.handleEmergencyCommand(command);
        break;
      case 'navigate':
        await this.handleNavigateCommand(command);
        break;
      default:
        Alert.alert('未支持', '该指令暂不支持');
    }
  }

  // 处理拨打电话指令
  private static async handleCallCommand(command: VoiceCommand): Promise<void> {
    const { contactName } = command.parameters;
    const contacts = await loadContacts();
    const contact = contacts.find(c => 
      c.name.includes(contactName) || contactName.includes(c.name)
    );

    if (contact && contact.phoneNumber) {
      Alert.alert(
        '确认拨打',
        `确定要拨打 ${contact.name} (${contact.phoneNumber}) 吗？`,
        [
          { text: '取消', style: 'cancel' },
          {
            text: '拨打',
            onPress: () => PhoneService.makeCall(contact.phoneNumber!, contact.name),
          },
        ]
      );
    } else {
      Alert.alert('未找到', `没有找到联系人"${contactName}"或该联系人没有电话号码`);
    }
  }

  // 处理微信指令
  private static async handleWechatCommand(command: VoiceCommand): Promise<void> {
    const { contactName } = command.parameters;
    const contacts = await loadContacts();
    const contact = contacts.find(c => 
      c.name.includes(contactName) || contactName.includes(c.name)
    );

    if (contact && contact.wechatId) {
      Alert.alert(
        '确认微信通话',
        `确定要通过微信联系 ${contact.name} 吗？`,
        [
          { text: '取消', style: 'cancel' },
          {
            text: '确定',
            onPress: () => WechatService.makeVoiceCall(contact),
          },
        ]
      );
    } else {
      Alert.alert('未找到', `没有找到联系人"${contactName}"或该联系人没有微信号`);
    }
  }

  // 处理紧急呼叫指令
  private static async handleEmergencyCommand(command: VoiceCommand): Promise<void> {
    switch (command.action) {
      case 'police':
        await EmergencyService.makeEmergencyCall('police');
        break;
      case 'fire':
        await EmergencyService.makeEmergencyCall('fire');
        break;
      case 'ambulance':
        await EmergencyService.makeEmergencyCall('ambulance');
        break;
      case 'quick_call':
        await EmergencyService.quickEmergencyCall();
        break;
    }
  }

  // 处理导航指令
  private static async handleNavigateCommand(command: VoiceCommand): Promise<void> {
    // 这里需要传入navigation对象，实际使用时需要从外部传入
    Alert.alert('导航', `即将打开${command.action}页面`);
  }

  // 获取支持的语音指令列表
  static getSupportedCommands(): Array<{
    category: string;
    commands: string[];
    examples: string[];
  }> {
    return [
      {
        category: '拨打电话',
        commands: ['打电话给[联系人]', '拨打[联系人]', '联系[联系人]'],
        examples: ['打电话给妈妈', '拨打张三', '联系李四'],
      },
      {
        category: '微信通话',
        commands: ['微信[联系人]', '微信联系[联系人]', '微信通话[联系人]'],
        examples: ['微信儿子', '微信联系女儿', '微信通话老王'],
      },
      {
        category: '紧急呼叫',
        commands: ['紧急呼叫', '求救', '报警', '叫救护车', '火警'],
        examples: ['紧急呼叫', '报警', '叫救护车'],
      },
      {
        category: '页面导航',
        commands: ['打开[页面]', '进入[页面]', '显示[页面]'],
        examples: ['打开联系人', '进入设置', '显示抖音'],
      },
    ];
  }

  // 获取语音助手状态
  static getStatus(): {
    enabled: boolean;
    listening: boolean;
    hasPermission: boolean;
  } {
    return {
      enabled: this.isEnabled,
      listening: this.isListening,
      hasPermission: true, // 简化处理，实际需要检查权限
    };
  }
}
