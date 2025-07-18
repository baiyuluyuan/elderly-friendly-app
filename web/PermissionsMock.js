// Mock permissions for web
export const PERMISSIONS = {
  ANDROID: {
    CALL_PHONE: 'android.permission.CALL_PHONE',
    RECORD_AUDIO: 'android.permission.RECORD_AUDIO',
  },
  IOS: {
    MICROPHONE: 'ios.permission.MICROPHONE',
  },
};

export const RESULTS = {
  GRANTED: 'granted',
  DENIED: 'denied',
  BLOCKED: 'blocked',
  UNAVAILABLE: 'unavailable',
};

export const request = async (permission) => {
  console.log('Permission requested (Web Mock):', permission);
  return RESULTS.GRANTED; // 在Web版本中总是返回已授权
};

export const check = async (permission) => {
  console.log('Permission checked (Web Mock):', permission);
  return RESULTS.GRANTED; // 在Web版本中总是返回已授权
};

const PermissionsAndroid = {
  PERMISSIONS,
  RESULTS,
  request,
  check,
};

export default PermissionsAndroid;
