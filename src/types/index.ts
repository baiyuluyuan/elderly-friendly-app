// 联系人类型定义
export interface Contact {
  id: string;
  name: string;
  phoneNumber?: string;
  wechatId?: string;
  avatar?: string;
  isEmergency?: boolean;
  isFavorite?: boolean;
}

// 导航参数类型
export type RootStackParamList = {
  Home: undefined;
  Contacts: undefined;
  ContactDetail: { contactId: string };
  AddContact: undefined;
  EditContact: { contactId: string };
  Douyin: undefined;
  Settings: undefined;
  Emergency: undefined;
};

// 设置类型
export interface AppSettings {
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  theme: 'light' | 'dark' | 'high-contrast';
  voiceAssistantEnabled: boolean;
  emergencyContacts: string[]; // contact IDs
  language: 'zh-CN' | 'en-US';
}

// 通话类型
export type CallType = 'phone' | 'wechat-voice' | 'wechat-video';

// 应用状态类型
export interface AppState {
  contacts: Contact[];
  settings: AppSettings;
  isLoading: boolean;
  error?: string;
}
