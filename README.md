# 🏠 老年助手 - Elderly Friendly App

一个专为老年人设计的友好手机应用，提供大字体界面、简化操作和实用功能。

## 📱 应用特色

### 🎯 老年人友好设计
- **🔤 大字体显示** - 清晰易读的大号字体
- **🎨 高对比度** - 易于识别的颜色搭配
- **👆 大按钮设计** - 方便点击的大尺寸按钮
- **🎮 简化操作** - 直观简单的用户界面

### 📞 核心功能
- **联系人管理** - 添加、编辑、删除联系人
- **一键拨号** - 快速拨打电话和微信通话
- **紧急呼叫** - 120急救、110报警、119火警
- **抖音娱乐** - 集成抖音短视频观看
- **语音助手** - 语音指令控制
- **个性化设置** - 字体大小、主题调整

## 🚀 快速体验

### Web演示版 (立即可用)
```bash
# 启动Web演示
cd demo
python -m http.server 8080
# 或
npx http-server -p 8080

# 访问: http://localhost:8080
```

### 完整React Native版本
```bash
# 安装依赖
npm install

# 启动Metro服务器
npx react-native start

# 运行Android版本
npx react-native run-android

# 运行iOS版本 (macOS)
npx react-native run-ios
```

## 📦 APK构建

### 方案1: EAS Build (推荐)
```bash
# 安装EAS CLI
npm install -g @expo/cli eas-cli

# 登录Expo账户
npx eas-cli login

# 构建APK
npx eas-cli build --platform android --profile preview
```

### 方案2: 本地构建
```bash
# 进入Android目录
cd android

# 构建调试版本
./gradlew assembleDebug

# APK位置: app/build/outputs/apk/debug/app-debug.apk
```

### 方案3: GitHub Actions
推送代码到GitHub，自动触发构建并下载APK。

## 🛠️ 开发环境

### 必需工具
- **Node.js** 16+
- **React Native CLI**
- **Android Studio** (Android开发)
- **Xcode** (iOS开发，仅macOS)

### Android环境
- **JDK** 17-20
- **Android SDK** API 35
- **ANDROID_HOME** 环境变量

## 📁 项目结构

```
ElderlyFriendlyApp/
├── src/                    # 源代码
│   ├── components/         # 可复用组件
│   ├── screens/           # 页面组件
│   ├── services/          # 业务逻辑
│   ├── utils/             # 工具函数
│   └── constants/         # 常量定义
├── android/               # Android原生代码
├── ios/                   # iOS原生代码
├── demo/                  # Web演示版本
├── __tests__/             # 测试文件
└── docs/                  # 文档
```

## 🎨 界面预览

### 主要页面
- **🏠 首页** - 常用联系人和快捷功能
- **📞 联系人** - 联系人管理界面
- **🆘 紧急呼叫** - 紧急电话快速拨打
- **🎵 抖音** - 短视频娱乐
- **⚙️ 设置** - 个性化配置

### 设计特点
- **简洁明了** - 避免复杂的界面元素
- **功能突出** - 重要功能显著展示
- **易于导航** - 清晰的页面结构
- **无障碍支持** - 支持屏幕阅读器

## 🔧 技术栈

### 前端框架
- **React Native** - 跨平台移动应用框架
- **TypeScript** - 类型安全的JavaScript
- **React Navigation** - 页面导航
- **AsyncStorage** - 本地数据存储

### 开发工具
- **Metro** - React Native打包工具
- **Flipper** - 调试工具
- **ESLint** - 代码规范检查
- **Prettier** - 代码格式化

## 📋 功能清单

### ✅ 已完成功能
- [x] 用户界面设计
- [x] 联系人管理
- [x] 电话拨打功能
- [x] 紧急呼叫
- [x] 抖音集成
- [x] 设置页面
- [x] 语音助手
- [x] Web演示版本
- [x] 构建配置

### 🔄 计划功能
- [ ] 语音识别优化
- [ ] 更多娱乐功能
- [ ] 健康监测
- [ ] 天气信息
- [ ] 新闻阅读

## 🤝 贡献指南

欢迎贡献代码和建议！

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系我们

如有问题或建议，请通过以下方式联系：

- **GitHub Issues** - 报告问题和功能请求
- **Email** - 技术支持邮箱
- **微信** - 用户交流群

## 🎉 致谢

感谢所有为老年人数字化生活贡献力量的开发者和设计师！

---

**让科技更好地服务老年人，让爱心传递温暖！** ❤️
