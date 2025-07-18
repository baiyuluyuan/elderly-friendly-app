import { Linking, Alert, Platform } from 'react-native';

export class DouyinService {
  // 抖音应用的URL Scheme和包名
  private static readonly DOUYIN_URL_SCHEME = 'snssdk1128://';
  private static readonly DOUYIN_PACKAGE_NAME = 'com.ss.android.ugc.aweme';
  private static readonly DOUYIN_WEB_URL = 'https://www.douyin.com';

  // 检查抖音是否已安装
  static async isDouyinInstalled(): Promise<boolean> {
    try {
      const canOpen = await Linking.canOpenURL(this.DOUYIN_URL_SCHEME);
      return canOpen;
    } catch (error) {
      console.error('Error checking Douyin installation:', error);
      return false;
    }
  }

  // 打开抖音应用
  static async openDouyinApp(): Promise<boolean> {
    try {
      const isInstalled = await this.isDouyinInstalled();
      
      if (isInstalled) {
        await Linking.openURL(this.DOUYIN_URL_SCHEME);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error opening Douyin app:', error);
      return false;
    }
  }

  // 打开抖音（优先使用应用，否则使用网页）
  static async openDouyin(): Promise<void> {
    try {
      const appOpened = await this.openDouyinApp();
      
      if (!appOpened) {
        // 如果应用未安装或打开失败，询问用户是否要安装或使用网页版
        Alert.alert(
          '抖音未安装',
          '检测到您的设备未安装抖音应用，您可以：',
          [
            { text: '取消', style: 'cancel' },
            {
              text: '安装抖音',
              onPress: () => this.downloadDouyin(),
            },
            {
              text: '使用网页版',
              onPress: () => this.openDouyinWeb(),
            },
          ]
        );
      }
    } catch (error) {
      console.error('Error opening Douyin:', error);
      Alert.alert('错误', '打开抖音失败，请稍后重试');
    }
  }

  // 打开抖音网页版
  static async openDouyinWeb(): Promise<void> {
    try {
      const canOpen = await Linking.canOpenURL(this.DOUYIN_WEB_URL);
      
      if (canOpen) {
        await Linking.openURL(this.DOUYIN_WEB_URL);
      } else {
        Alert.alert('错误', '无法打开抖音网页版');
      }
    } catch (error) {
      console.error('Error opening Douyin web:', error);
      Alert.alert('错误', '打开抖音网页版失败');
    }
  }

  // 引导用户下载抖音
  static async downloadDouyin(): Promise<void> {
    try {
      let downloadUrl: string;
      
      if (Platform.OS === 'android') {
        // Android 应用商店链接
        downloadUrl = 'market://details?id=' + this.DOUYIN_PACKAGE_NAME;
        
        // 如果无法打开应用商店，则使用网页链接
        const canOpenMarket = await Linking.canOpenURL(downloadUrl);
        if (!canOpenMarket) {
          downloadUrl = 'https://www.douyin.com/download';
        }
      } else {
        // iOS App Store 链接
        downloadUrl = 'https://apps.apple.com/cn/app/douyin/id1142110895';
      }

      await Linking.openURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading Douyin:', error);
      Alert.alert('错误', '无法打开下载页面');
    }
  }

  // 获取推荐的抖音内容类型（适合老年人）
  static getRecommendedContent(): Array<{
    title: string;
    description: string;
    searchKeyword: string;
  }> {
    return [
      {
        title: '广场舞',
        description: '健康的广场舞教学和表演',
        searchKeyword: '广场舞',
      },
      {
        title: '养生保健',
        description: '实用的养生知识和健康小贴士',
        searchKeyword: '养生',
      },
      {
        title: '烹饪美食',
        description: '简单易学的家常菜制作',
        searchKeyword: '家常菜',
      },
      {
        title: '太极拳',
        description: '太极拳教学和练习',
        searchKeyword: '太极拳',
      },
      {
        title: '园艺花草',
        description: '花草种植和园艺技巧',
        searchKeyword: '养花',
      },
      {
        title: '戏曲相声',
        description: '传统戏曲和相声表演',
        searchKeyword: '戏曲',
      },
      {
        title: '孙辈教育',
        description: '育儿知识和亲子互动',
        searchKeyword: '育儿',
      },
      {
        title: '旅游风景',
        description: '美丽的风景和旅游景点',
        searchKeyword: '风景',
      },
    ];
  }

  // 获取抖音使用小贴士（针对老年人）
  static getUsageTips(): Array<{
    title: string;
    content: string;
  }> {
    return [
      {
        title: '如何观看视频',
        content: '上下滑动屏幕可以切换视频，点击屏幕可以暂停或播放。',
      },
      {
        title: '如何点赞',
        content: '双击视频画面或点击右侧的红心图标可以给视频点赞。',
      },
      {
        title: '如何关注',
        content: '点击视频左下角的头像或"+"号可以关注喜欢的创作者。',
      },
      {
        title: '如何搜索',
        content: '点击顶部的搜索框，输入关键词可以搜索感兴趣的内容。',
      },
      {
        title: '如何调节音量',
        content: '使用手机侧面的音量键可以调节视频声音大小。',
      },
      {
        title: '如何分享',
        content: '点击右侧的分享按钮可以将喜欢的视频分享给家人朋友。',
      },
      {
        title: '注意事项',
        content: '观看时间不宜过长，注意保护眼睛，适当休息。',
      },
      {
        title: '内容筛选',
        content: '如遇到不合适的内容，可以长按视频选择"不感兴趣"。',
      },
    ];
  }

  // 检查网络连接状态
  static async checkNetworkConnection(): Promise<boolean> {
    try {
      // 简单的网络检查，尝试访问抖音域名
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch('https://www.douyin.com', {
        method: 'HEAD',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.error('Network check failed:', error);
      return false;
    }
  }

  // 获取适合老年人的抖音设置建议
  static getSettingsRecommendations(): Array<{
    setting: string;
    recommendation: string;
    reason: string;
  }> {
    return [
      {
        setting: '字体大小',
        recommendation: '调整为大字体',
        reason: '便于阅读评论和标题',
      },
      {
        setting: '自动播放',
        recommendation: '开启自动播放',
        reason: '减少手动操作，观看更流畅',
      },
      {
        setting: '省流量模式',
        recommendation: '在WiFi环境下关闭',
        reason: '获得更好的视频质量',
      },
      {
        setting: '推送通知',
        recommendation: '适度开启',
        reason: '及时获取关注账号的更新',
      },
      {
        setting: '青少年模式',
        recommendation: '可以考虑开启',
        reason: '过滤不适宜内容，时间管理',
      },
    ];
  }

  // 获取抖音状态信息
  static async getDouyinStatus(): Promise<{
    appInstalled: boolean;
    networkAvailable: boolean;
    canUseWebVersion: boolean;
  }> {
    const [appInstalled, networkAvailable] = await Promise.all([
      this.isDouyinInstalled(),
      this.checkNetworkConnection(),
    ]);

    const canUseWebVersion = networkAvailable && await Linking.canOpenURL(this.DOUYIN_WEB_URL);

    return {
      appInstalled,
      networkAvailable,
      canUseWebVersion,
    };
  }
}
