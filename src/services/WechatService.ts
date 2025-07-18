import { Linking, Alert, Platform } from 'react-native';
import { Contact } from '../types';

export class WechatService {
  // 微信应用的URL Scheme
  private static readonly WECHAT_URL_SCHEME = 'weixin://';
  private static readonly WECHAT_PACKAGE_NAME = 'com.tencent.mm';

  // 检查微信是否已安装
  static async isWechatInstalled(): Promise<boolean> {
    try {
      const canOpen = await Linking.canOpenURL(this.WECHAT_URL_SCHEME);
      return canOpen;
    } catch (error) {
      console.error('Error checking WeChat installation:', error);
      return false;
    }
  }

  // 打开微信应用
  static async openWechat(): Promise<void> {
    try {
      const isInstalled = await this.isWechatInstalled();
      
      if (!isInstalled) {
        Alert.alert(
          '微信未安装',
          '请先安装微信应用',
          [
            { text: '取消', style: 'cancel' },
            {
              text: '去安装',
              onPress: () => this.downloadWechat(),
            },
          ]
        );
        return;
      }

      await Linking.openURL(this.WECHAT_URL_SCHEME);
    } catch (error) {
      console.error('Error opening WeChat:', error);
      Alert.alert('错误', '打开微信失败，请稍后重试');
    }
  }

  // 引导用户下载微信
  static async downloadWechat(): Promise<void> {
    try {
      let downloadUrl: string;
      
      if (Platform.OS === 'android') {
        // Android 应用商店链接
        downloadUrl = 'market://details?id=' + this.WECHAT_PACKAGE_NAME;
        
        // 如果无法打开应用商店，则使用网页链接
        const canOpenMarket = await Linking.canOpenURL(downloadUrl);
        if (!canOpenMarket) {
          downloadUrl = 'https://weixin.qq.com/';
        }
      } else {
        // iOS App Store 链接
        downloadUrl = 'https://apps.apple.com/cn/app/wechat/id414478124';
      }

      await Linking.openURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading WeChat:', error);
      Alert.alert('错误', '无法打开下载页面');
    }
  }

  // 发起微信语音通话（模拟功能，实际需要微信SDK）
  static async makeVoiceCall(contact: Contact): Promise<void> {
    try {
      const isInstalled = await this.isWechatInstalled();
      
      if (!isInstalled) {
        Alert.alert(
          '微信未安装',
          '请先安装微信应用',
          [
            { text: '取消', style: 'cancel' },
            {
              text: '去安装',
              onPress: () => this.downloadWechat(),
            },
          ]
        );
        return;
      }

      if (!contact.wechatId) {
        Alert.alert('提示', `${contact.name} 没有设置微信号`);
        return;
      }

      // 显示确认对话框
      Alert.alert(
        '微信语音通话',
        `确定要通过微信语音联系 ${contact.name} 吗？\n\n注意：这将打开微信应用，您需要手动发起语音通话。`,
        [
          { text: '取消', style: 'cancel' },
          {
            text: '打开微信',
            onPress: async () => {
              try {
                await this.openWechat();
                // 这里可以添加更多逻辑，比如复制微信号到剪贴板
                Alert.alert(
                  '提示',
                  `微信号：${contact.wechatId}\n\n请在微信中搜索此微信号并发起语音通话。`,
                  [{ text: '知道了' }]
                );
              } catch (error) {
                console.error('Error opening WeChat for voice call:', error);
                Alert.alert('错误', '打开微信失败');
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error in makeVoiceCall:', error);
      Alert.alert('错误', '发起微信语音通话失败');
    }
  }

  // 发起微信视频通话（模拟功能，实际需要微信SDK）
  static async makeVideoCall(contact: Contact): Promise<void> {
    try {
      const isInstalled = await this.isWechatInstalled();
      
      if (!isInstalled) {
        Alert.alert(
          '微信未安装',
          '请先安装微信应用',
          [
            { text: '取消', style: 'cancel' },
            {
              text: '去安装',
              onPress: () => this.downloadWechat(),
            },
          ]
        );
        return;
      }

      if (!contact.wechatId) {
        Alert.alert('提示', `${contact.name} 没有设置微信号`);
        return;
      }

      // 显示确认对话框
      Alert.alert(
        '微信视频通话',
        `确定要通过微信视频联系 ${contact.name} 吗？\n\n注意：这将打开微信应用，您需要手动发起视频通话。`,
        [
          { text: '取消', style: 'cancel' },
          {
            text: '打开微信',
            onPress: async () => {
              try {
                await this.openWechat();
                Alert.alert(
                  '提示',
                  `微信号：${contact.wechatId}\n\n请在微信中搜索此微信号并发起视频通话。`,
                  [{ text: '知道了' }]
                );
              } catch (error) {
                console.error('Error opening WeChat for video call:', error);
                Alert.alert('错误', '打开微信失败');
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error in makeVideoCall:', error);
      Alert.alert('错误', '发起微信视频通话失败');
    }
  }

  // 发送微信消息（模拟功能）
  static async sendMessage(contact: Contact, message?: string): Promise<void> {
    try {
      const isInstalled = await this.isWechatInstalled();
      
      if (!isInstalled) {
        Alert.alert(
          '微信未安装',
          '请先安装微信应用',
          [
            { text: '取消', style: 'cancel' },
            {
              text: '去安装',
              onPress: () => this.downloadWechat(),
            },
          ]
        );
        return;
      }

      if (!contact.wechatId) {
        Alert.alert('提示', `${contact.name} 没有设置微信号`);
        return;
      }

      Alert.alert(
        '发送微信消息',
        `确定要给 ${contact.name} 发送微信消息吗？`,
        [
          { text: '取消', style: 'cancel' },
          {
            text: '打开微信',
            onPress: async () => {
              try {
                await this.openWechat();
                const messageText = message || '您好！';
                Alert.alert(
                  '提示',
                  `微信号：${contact.wechatId}\n消息内容：${messageText}\n\n请在微信中搜索此微信号并发送消息。`,
                  [{ text: '知道了' }]
                );
              } catch (error) {
                console.error('Error opening WeChat for message:', error);
                Alert.alert('错误', '打开微信失败');
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error in sendMessage:', error);
      Alert.alert('错误', '发送微信消息失败');
    }
  }

  // 验证微信号格式
  static validateWechatId(wechatId: string): boolean {
    // 微信号规则：6-20位，字母、数字、下划线、减号，必须以字母开头
    const wechatRegex = /^[a-zA-Z][a-zA-Z0-9_-]{5,19}$/;
    return wechatRegex.test(wechatId);
  }

  // 格式化微信号显示
  static formatWechatId(wechatId: string): string {
    // 微信号通常不需要特殊格式化，直接返回
    return wechatId.trim();
  }

  // 获取微信功能状态
  static async getWechatStatus(): Promise<{
    installed: boolean;
    canMakeCall: boolean;
    canSendMessage: boolean;
  }> {
    const installed = await this.isWechatInstalled();
    
    return {
      installed,
      canMakeCall: installed, // 简化处理，实际需要检查更多权限
      canSendMessage: installed,
    };
  }
}
