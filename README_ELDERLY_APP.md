# 老年助手 - Elderly Friendly App

专为老年人设计的简易通讯应用，提供大字体、高对比度界面和简化的操作流程。

## 功能特性

### 核心功能
- ✅ **一键拨打电话** - 简单快捷的电话拨打功能
- ✅ **微信通话集成** - 支持微信语音/视频通话
- ✅ **联系人管理** - 添加、编辑、删除联系人
- ✅ **抖音娱乐** - 内嵌抖音短视频观看
- ✅ **紧急呼叫** - 一键拨打紧急电话和紧急联系人
- ✅ **语音助手** - 语音指令操作应用
- ✅ **个性化设置** - 字体大小、主题调整

### 老年人友好设计
- 🔤 **大字体显示** - 支持小、中、大、特大四种字体
- 🎨 **高对比度界面** - 清晰易读的颜色搭配
- 🖱️ **简化操作** - 减少复杂的手势和操作
- 🔊 **语音辅助** - 语音指令控制应用
- 🚨 **紧急功能** - 快速访问紧急联系人和服务

## 技术架构

### 技术栈
- **React Native 0.80.1** - 跨平台移动应用框架
- **TypeScript** - 类型安全的JavaScript
- **React Navigation** - 导航管理
- **AsyncStorage** - 本地数据存储
- **React Native WebView** - 网页内容集成

### 项目结构
```
src/
├── components/          # 可复用UI组件
│   ├── Button.tsx      # 大字体按钮组件
│   ├── ContactCard.tsx # 联系人卡片组件
│   └── EmergencyButton.tsx # 紧急呼叫按钮
├── screens/            # 页面组件
│   ├── HomeScreen.tsx  # 首页
│   ├── ContactsScreen.tsx # 联系人列表
│   ├── DouyinScreen.tsx # 抖音页面
│   ├── SettingsScreen.tsx # 设置页面
│   └── EmergencyScreen.tsx # 紧急呼叫页面
├── services/           # 业务逻辑服务
│   ├── PhoneService.ts # 电话服务
│   ├── WechatService.ts # 微信服务
│   ├── DouyinService.ts # 抖音服务
│   ├── EmergencyService.ts # 紧急服务
│   └── VoiceAssistantService.ts # 语音助手
├── utils/              # 工具函数
│   ├── storage.ts      # 存储工具
│   ├── phone.ts        # 电话工具
│   └── testUtils.ts    # 测试工具
├── types/              # TypeScript类型定义
├── constants/          # 常量定义
└── assets/             # 静态资源
```

## 安装和运行

### 环境要求
- Node.js >= 16
- React Native CLI
- Android Studio (Android开发)
- Xcode (iOS开发)

### 安装依赖
```bash
cd ElderlyFriendlyApp
npm install
```

### 运行应用

#### Android
```bash
# 启动Metro服务器
npm start

# 在新终端中运行Android应用
npm run android
```

#### iOS
```bash
# 安装iOS依赖
cd ios && pod install && cd ..

# 运行iOS应用
npm run ios
```

## 测试指南

### 功能测试清单

#### 基础功能测试
- [ ] 应用启动正常
- [ ] 首页显示正确
- [ ] 导航功能正常
- [ ] 字体大小调整生效
- [ ] 主题切换正常

#### 联系人管理测试
- [ ] 添加联系人
- [ ] 编辑联系人信息
- [ ] 删除联系人
- [ ] 设置常用联系人
- [ ] 设置紧急联系人
- [ ] 联系人搜索功能

#### 通话功能测试
- [ ] 拨打手机电话
- [ ] 微信语音通话
- [ ] 微信视频通话
- [ ] 紧急电话拨打
- [ ] 电话权限请求

#### 语音助手测试
- [ ] 语音权限请求
- [ ] 语音指令识别
- [ ] "打电话给XXX"指令
- [ ] "微信XXX"指令
- [ ] "紧急呼叫"指令
- [ ] 语音助手开关

#### 抖音集成测试
- [ ] 抖音应用检测
- [ ] 抖音应用启动
- [ ] 网页版抖音加载
- [ ] 网络连接检查

### 性能测试

#### 启动性能
- 应用冷启动时间 < 3秒
- 页面切换响应时间 < 500ms
- 内存使用 < 100MB

#### 稳定性测试
- 连续使用30分钟无崩溃
- 内存泄漏检查
- 电池消耗测试

### 兼容性测试

#### Android设备
- Android 7.0+ 支持
- 不同屏幕尺寸适配
- 不同分辨率适配

#### 老年人用户测试
- 字体大小是否足够大
- 按钮是否容易点击
- 操作流程是否简单
- 错误提示是否清晰

## 使用说明

### 首次使用
1. 打开应用后，建议先进入"设置"调整字体大小
2. 添加常用联系人，设置紧急联系人
3. 启用语音助手功能
4. 熟悉各个功能的位置

### 日常使用
1. **拨打电话**: 在首页点击联系人头像，选择"电话"
2. **微信通话**: 点击联系人头像，选择"微信"
3. **紧急呼叫**: 点击首页的紧急呼叫按钮
4. **语音助手**: 说"打电话给XXX"等指令
5. **观看抖音**: 点击首页的"抖音"按钮

### 语音指令示例
- "打电话给妈妈"
- "微信联系儿子"
- "紧急呼叫"
- "拨打120"
- "打开设置"

## 开发和调试

### 开发模式
```bash
# 启用开发者菜单
在模拟器中按 Cmd+D (iOS) 或 Ctrl+M (Android)
```

### 调试工具
- 使用 `src/utils/testUtils.ts` 中的调试工具
- 性能监控: `PerformanceMonitor`
- 错误日志: `ErrorLogger`
- 用户分析: `UserAnalytics`

### 测试数据
```typescript
import { initializeTestData } from './src/utils/testUtils';

// 初始化测试联系人和设置
await initializeTestData();
```

## 部署

### Android APK构建
```bash
cd android
./gradlew assembleRelease
```

### iOS IPA构建
```bash
# 在Xcode中选择Product -> Archive
```

## 注意事项

### 权限要求
- 电话权限 (CALL_PHONE)
- 麦克风权限 (RECORD_AUDIO)
- 存储权限 (READ_EXTERNAL_STORAGE)

### 第三方集成
- 微信SDK需要申请开发者账号
- 抖音SDK需要申请开放平台权限
- 语音识别需要集成第三方SDK

### 安全考虑
- 联系人数据仅存储在本地
- 不收集用户隐私信息
- 紧急呼叫功能需要谨慎使用

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License

## 联系方式

如有问题或建议，请联系开发团队。

---

**专为老年人设计，让科技更温暖** ❤️
