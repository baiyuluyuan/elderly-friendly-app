# 🚀 GitHub推送命令

## 📝 在GitHub创建仓库后，运行以下命令：

### 1. 添加远程仓库
```bash
# 替换 YOUR_USERNAME 为您的GitHub用户名
git remote add origin https://github.com/YOUR_USERNAME/elderly-friendly-app.git
```

### 2. 推送代码到GitHub
```bash
git branch -M main
git push -u origin main
```

## 🎯 完整示例

假设您的GitHub用户名是 `yourname`：

```bash
# 添加远程仓库
git remote add origin https://github.com/yourname/elderly-friendly-app.git

# 推送代码
git branch -M main
git push -u origin main
```

## 📱 推送完成后

1. **访问您的仓库页面**
2. **点击 "Actions" 标签页**
3. **查看自动构建进度**
4. **构建完成后下载APK**

## 🔧 如果遇到问题

### 认证问题
如果推送时要求认证：
1. 使用GitHub用户名和Personal Access Token
2. 或配置SSH密钥

### 创建Personal Access Token
1. GitHub Settings > Developer settings > Personal access tokens
2. Generate new token (classic)
3. 选择 repo 权限
4. 复制token用作密码

## 📋 推送后的自动构建

推送完成后，GitHub Actions会自动：
1. ✅ 检出代码
2. ✅ 设置Node.js环境
3. ✅ 设置Java和Android SDK
4. ✅ 安装依赖
5. ✅ 构建APK
6. ✅ 上传APK文件

## 📱 下载APK

构建完成后：
1. 访问仓库的 Actions 页面
2. 点击最新的构建
3. 在 Artifacts 部分下载 `elderly-friendly-app-debug`
4. 解压得到 `app-debug.apk`

## 🎉 恭喜！

您的老年助手应用APK即将自动构建完成！
