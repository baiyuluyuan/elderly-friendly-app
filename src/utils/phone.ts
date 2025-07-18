import { Linking, Alert, Platform } from 'react-native';
import { CallType } from '../types';

// 拨打电话
export const makePhoneCall = async (phoneNumber: string): Promise<void> => {
  try {
    const url = `tel:${phoneNumber}`;

    // Web环境下的特殊处理
    if (Platform.OS === 'web') {
      Alert.alert(
        '拨打电话',
        `在真实设备上将拨打: ${phoneNumber}\n\n(Web演示版本)`,
        [{ text: '确定' }]
      );
      return;
    }

    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('错误', '无法拨打电话，请检查设备是否支持电话功能');
    }
  } catch (error) {
    console.error('Error making phone call:', error);
    Alert.alert('错误', '拨打电话失败，请稍后重试');
  }
};

// 发送短信
export const sendSMS = async (phoneNumber: string, message?: string): Promise<void> => {
  try {
    const url = message 
      ? `sms:${phoneNumber}?body=${encodeURIComponent(message)}`
      : `sms:${phoneNumber}`;
    
    const supported = await Linking.canOpenURL(url);
    
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('错误', '无法发送短信，请检查设备是否支持短信功能');
    }
  } catch (error) {
    console.error('Error sending SMS:', error);
    Alert.alert('错误', '发送短信失败，请稍后重试');
  }
};

// 打开微信（需要微信SDK集成）
export const openWechat = async (wechatId?: string): Promise<void> => {
  try {
    // 这里是简化版本，实际需要集成微信SDK
    const url = 'weixin://';
    const supported = await Linking.canOpenURL(url);
    
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('提示', '请先安装微信应用');
    }
  } catch (error) {
    console.error('Error opening WeChat:', error);
    Alert.alert('错误', '打开微信失败，请稍后重试');
  }
};

// 格式化电话号码
export const formatPhoneNumber = (phoneNumber: string): string => {
  // 移除所有非数字字符
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // 中国手机号码格式化
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 7)} ${cleaned.slice(7)}`;
  }
  
  // 固定电话格式化
  if (cleaned.length >= 7) {
    return cleaned.replace(/(\d{3,4})(\d{4})/, '$1-$2');
  }
  
  return cleaned;
};

// 验证电话号码
export const validatePhoneNumber = (phoneNumber: string): boolean => {
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // 中国手机号码验证
  const mobileRegex = /^1[3-9]\d{9}$/;
  
  // 固定电话验证（简化版）
  const landlineRegex = /^\d{7,12}$/;
  
  return mobileRegex.test(cleaned) || landlineRegex.test(cleaned);
};

// 紧急呼叫确认
export const confirmEmergencyCall = (phoneNumber: string, callback: () => void): void => {
  Alert.alert(
    '紧急呼叫',
    `确定要拨打紧急电话 ${phoneNumber} 吗？`,
    [
      {
        text: '取消',
        style: 'cancel',
      },
      {
        text: '确定',
        style: 'destructive',
        onPress: callback,
      },
    ],
    { cancelable: false }
  );
};
