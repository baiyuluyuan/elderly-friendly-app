# 老年助手 APK 生成指南

## 🚀 方案1：使用 Expo EAS Build (推荐)

### 1. 安装 Expo CLI
```bash
npm install -g @expo/cli
npm install -g eas-cli
```

### 2. 登录 Expo 账户
```bash
eas login
```

### 3. 配置项目
```bash
eas build:configure
```

### 4. 构建 APK
```bash
# 构建开发版本
eas build --platform android --profile development

# 构建生产版本
eas build --platform android --profile production
```

## 🔧 方案2：本地环境配置

### 1. 安装 JDK 17-20
- 下载：https://adoptium.net/
- 设置 JAVA_HOME 环境变量

### 2. 安装 Android Studio
- 下载：https://developer.android.com/studio
- 安装 Android SDK (API 35)
- 设置 ANDROID_HOME 环境变量

### 3. 配置环境变量
```bash
# Windows
set ANDROID_HOME=C:\Users\%USERNAME%\AppData\Local\Android\Sdk
set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.x-hotspot

# 添加到 PATH
set PATH=%PATH%;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools;%JAVA_HOME%\bin
```

### 4. 生成 APK
```bash
# 调试版本
cd android
.\gradlew assembleDebug

# 发布版本
.\gradlew assembleRelease
```

## 📱 方案3：使用 GitHub Actions (自动化)

创建 `.github/workflows/build.yml`：

```yaml
name: Build APK
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    - name: Setup Java
      uses: actions/setup-java@v3
      with:
        distribution: 'temurin'
        java-version: '17'
    - name: Setup Android SDK
      uses: android-actions/setup-android@v2
    - name: Install dependencies
      run: npm install
    - name: Build APK
      run: |
        cd android
        ./gradlew assembleDebug
    - name: Upload APK
      uses: actions/upload-artifact@v3
      with:
        name: app-debug.apk
        path: android/app/build/outputs/apk/debug/app-debug.apk
```

## 🎯 方案4：使用 Appetize.io (在线模拟器)

1. 访问：https://appetize.io/
2. 上传应用代码
3. 在线测试和生成APK

## 📋 当前项目状态

### ✅ 已完成：
- React Native 项目结构
- 所有功能代码
- TypeScript 配置
- 依赖包安装

### ❌ 需要配置：
- Android 开发环境
- JDK 安装
- Android SDK
- 环境变量设置

## 🔥 立即可用的解决方案

### 使用 Expo Snack (在线预览)
1. 访问：https://snack.expo.dev/
2. 上传项目代码
3. 在线预览和测试
4. 生成 APK 链接

### 使用 CodeSandbox
1. 访问：https://codesandbox.io/
2. 导入 React Native 项目
3. 在线编辑和预览

## 📞 技术支持

如果需要帮助配置环境或生成APK，可以：
1. 使用在线构建服务 (最简单)
2. 配置本地开发环境 (最灵活)
3. 使用CI/CD自动化构建 (最专业)

## 🎉 Web版本 (已可用)

当前可以立即使用的版本：
- Web演示版：http://localhost:8080
- 完整功能展示
- 老年人友好界面
- 所有交互功能
