// 颜色常量 - 高对比度，适合老年人
export const COLORS = {
  // 主色调
  PRIMARY: '#2E7D32', // 深绿色
  PRIMARY_LIGHT: '#4CAF50', // 浅绿色
  PRIMARY_DARK: '#1B5E20', // 更深绿色
  
  // 次要色调
  SECONDARY: '#1976D2', // 蓝色
  SECONDARY_LIGHT: '#42A5F5', // 浅蓝色
  
  // 背景色
  BACKGROUND: '#FFFFFF', // 白色背景
  SURFACE: '#F5F5F5', // 浅灰色表面
  
  // 文字颜色
  TEXT_PRIMARY: '#212121', // 深灰色文字
  TEXT_SECONDARY: '#757575', // 中灰色文字
  TEXT_ON_PRIMARY: '#FFFFFF', // 主色上的文字
  
  // 状态颜色
  SUCCESS: '#4CAF50', // 成功绿色
  WARNING: '#FF9800', // 警告橙色
  ERROR: '#F44336', // 错误红色
  INFO: '#2196F3', // 信息蓝色
  
  // 紧急呼叫颜色
  EMERGENCY: '#D32F2F', // 紧急红色
  EMERGENCY_LIGHT: '#FFCDD2', // 浅紧急红色
  
  // 边框和分割线
  BORDER: '#E0E0E0',
  DIVIDER: '#BDBDBD',
};

// 字体大小常量
export const FONT_SIZES = {
  small: {
    title: 24,
    subtitle: 20,
    body: 18,
    caption: 16,
    button: 18,
  },
  medium: {
    title: 28,
    subtitle: 24,
    body: 20,
    caption: 18,
    button: 20,
  },
  large: {
    title: 32,
    subtitle: 28,
    body: 24,
    caption: 20,
    button: 24,
  },
  'extra-large': {
    title: 36,
    subtitle: 32,
    body: 28,
    caption: 24,
    button: 28,
  },
};

// 间距常量
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// 圆角常量
export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 50,
};

// 阴影常量
export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

// 默认设置
export const DEFAULT_SETTINGS = {
  fontSize: 'large' as const,
  theme: 'light' as const,
  voiceAssistantEnabled: true,
  emergencyContacts: [],
  language: 'zh-CN' as const,
};

// 存储键名
export const STORAGE_KEYS = {
  CONTACTS: '@elderly_app_contacts',
  SETTINGS: '@elderly_app_settings',
  FIRST_LAUNCH: '@elderly_app_first_launch',
};

// 紧急电话号码
export const EMERGENCY_NUMBERS = {
  POLICE: '110',
  FIRE: '119',
  AMBULANCE: '120',
  TRAFFIC: '122',
};
