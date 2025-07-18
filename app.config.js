export default {
  expo: {
    name: "老年助手",
    slug: "elderly-friendly-app",
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "light",
    splash: {
      backgroundColor: "#2E7D32",
      resizeMode: "contain"
    },
    android: {
      package: "com.elderlyapp.friendlyassistant",
      versionCode: 1,
      compileSdkVersion: 35,
      targetSdkVersion: 35,
      buildToolsVersion: "35.0.0",
      permissions: [
        "android.permission.CALL_PHONE",
        "android.permission.RECORD_AUDIO",
        "android.permission.INTERNET",
        "android.permission.ACCESS_NETWORK_STATE",
        "android.permission.VIBRATE"
      ],
      adaptiveIcon: {
        backgroundColor: "#2E7D32"
      }
    },
    extra: {
      eas: {
        projectId: "07249a1f-4141-4e10-b1e5-7a45c712a7a7"
      }
    },
    plugins: [
      [
        "expo-build-properties",
        {
          android: {
            compileSdkVersion: 35,
            targetSdkVersion: 35,
            buildToolsVersion: "35.0.0"
          }
        }
      ]
    ]
  }
};
