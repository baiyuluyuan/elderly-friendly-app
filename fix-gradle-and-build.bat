@echo off
chcp 65001 >nul
echo ========================================
echo 老年助手 APK 构建修复脚本
echo ========================================
echo.

echo 🔧 正在修复 Gradle 下载问题...
echo.

:: 方案1: 增加超时时间
echo 1️⃣ 修改 Gradle 超时设置...
cd /d "%~dp0android"

:: 备份原文件
if exist gradle\wrapper\gradle-wrapper.properties.bak (
    echo 发现备份文件，跳过备份
) else (
    copy gradle\wrapper\gradle-wrapper.properties gradle\wrapper\gradle-wrapper.properties.bak
    echo ✅ 已备份原配置文件
)

:: 方案2: 尝试使用本地已下载的Gradle
echo.
echo 2️⃣ 检查本地 Gradle 缓存...
set GRADLE_USER_HOME=%USERPROFILE%\.gradle
if exist "%GRADLE_USER_HOME%\wrapper\dists\gradle-8.14.1-bin" (
    echo ✅ 发现本地 Gradle 缓存
) else (
    echo ⚠️ 未发现本地 Gradle 缓存
    echo 正在尝试下载...
    
    :: 创建临时下载脚本
    echo 正在创建下载脚本...
    (
        echo $url = "https://services.gradle.org/distributions/gradle-8.14.1-bin.zip"
        echo $output = "$env:TEMP\gradle-8.14.1-bin.zip"
        echo $gradleHome = "$env:USERPROFILE\.gradle\wrapper\dists\gradle-8.14.1-bin"
        echo.
        echo Write-Host "正在下载 Gradle 8.14.1..."
        echo try {
        echo     [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
        echo     $webClient = New-Object System.Net.WebClient
        echo     $webClient.DownloadFile($url, $output^)
        echo     Write-Host "✅ 下载完成"
        echo.
        echo     Write-Host "正在解压..."
        echo     if (!(Test-Path $gradleHome^)^) {
        echo         New-Item -ItemType Directory -Path $gradleHome -Force
        echo     }
        echo     Expand-Archive -Path $output -DestinationPath $gradleHome -Force
        echo     Remove-Item $output
        echo     Write-Host "✅ 安装完成"
        echo } catch {
        echo     Write-Host "❌ 下载失败: $_"
        echo     exit 1
        echo }
    ) > download_gradle.ps1
    
    powershell -ExecutionPolicy Bypass -File download_gradle.ps1
    del download_gradle.ps1
)

:: 方案3: 尝试构建
echo.
echo 3️⃣ 开始构建 APK...
echo.

:: 清理之前的构建
echo 🧹 清理构建缓存...
if exist app\build (
    rmdir /s /q app\build
)

:: 尝试构建
echo 🔨 开始构建调试版本...
.\gradlew.bat assembleDebug --stacktrace --info

if %errorlevel% equ 0 (
    echo.
    echo 🎉 构建成功！
    echo.
    
    :: 查找APK文件
    if exist app\build\outputs\apk\debug\app-debug.apk (
        echo ✅ APK 文件已生成：
        echo 📱 位置: %CD%\app\build\outputs\apk\debug\app-debug.apk
        echo.
        
        :: 显示文件信息
        dir app\build\outputs\apk\debug\app-debug.apk
        echo.
        
        :: 询问是否打开文件夹
        set /p OPEN_FOLDER="是否打开 APK 文件夹? (y/n): "
        if /i "%OPEN_FOLDER%"=="y" (
            explorer app\build\outputs\apk\debug
        )
        
        echo.
        echo 🎉 恭喜！老年助手 APK 构建完成！
        echo 您现在可以将 app-debug.apk 安装到 Android 设备上测试。
        
    ) else (
        echo ❌ APK 文件未找到，构建可能有问题
    )
) else (
    echo.
    echo ❌ 构建失败！
    echo.
    echo 🔧 可能的解决方案：
    echo 1. 检查网络连接
    echo 2. 使用 VPN 或代理
    echo 3. 手动下载 Gradle: https://services.gradle.org/distributions/gradle-8.14.1-bin.zip
    echo 4. 使用在线构建服务 (Expo EAS Build)
    echo.
    echo 📋 在线构建步骤：
    echo npm install -g @expo/cli eas-cli
    echo eas login
    echo eas build --platform android --profile preview
    echo.
)

echo.
echo 脚本执行完成！
pause
