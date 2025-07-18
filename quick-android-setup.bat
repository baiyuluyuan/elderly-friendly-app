@echo off
echo ========================================
echo 快速安装 Android SDK 命令行工具
echo ========================================
echo.

set ANDROID_HOME=C:\Android
set CMDTOOLS_URL=https://dl.google.com/android/repository/commandlinetools-win-11076708_latest.zip
set CMDTOOLS_ZIP=%TEMP%\commandlinetools.zip

echo 创建Android目录...
if not exist "%ANDROID_HOME%" (
    mkdir "%ANDROID_HOME%"
)

echo 下载Android命令行工具...
echo 下载地址: %CMDTOOLS_URL%
echo 保存位置: %CMDTOOLS_ZIP%
echo.

powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri '%CMDTOOLS_URL%' -OutFile '%CMDTOOLS_ZIP%' -TimeoutSec 300}"

if %errorlevel% neq 0 (
    echo ❌ 下载失败！
    echo 请手动下载: https://developer.android.com/studio#command-tools
    pause
    exit /b 1
)

echo ✅ 下载完成！
echo.

echo 解压命令行工具...
powershell -Command "Expand-Archive -Path '%CMDTOOLS_ZIP%' -DestinationPath '%ANDROID_HOME%' -Force"

if %errorlevel% neq 0 (
    echo ❌ 解压失败！
    pause
    exit /b 1
)

echo 重命名目录...
if exist "%ANDROID_HOME%\cmdline-tools\latest" (
    rmdir /s /q "%ANDROID_HOME%\cmdline-tools\latest"
)
if not exist "%ANDROID_HOME%\cmdline-tools" (
    mkdir "%ANDROID_HOME%\cmdline-tools"
)
move "%ANDROID_HOME%\cmdline-tools" "%ANDROID_HOME%\cmdline-tools\latest"

echo 设置环境变量...
setx ANDROID_HOME "%ANDROID_HOME%" /M
setx PATH "%PATH%;%ANDROID_HOME%\cmdline-tools\latest\bin;%ANDROID_HOME%\platform-tools" /M

echo.
echo 安装Android SDK组件...
set PATH=%PATH%;%ANDROID_HOME%\cmdline-tools\latest\bin

echo y | sdkmanager "platform-tools"
echo y | sdkmanager "platforms;android-35"
echo y | sdkmanager "build-tools;35.0.0"

if %errorlevel% equ 0 (
    echo.
    echo 🎉 Android SDK 安装完成！
    echo.
    echo 验证安装...
    "%ANDROID_HOME%\platform-tools\adb.exe" version
    echo.
    echo 现在可以构建APK了：
    echo cd android
    echo .\gradlew.bat assembleDebug
) else (
    echo ❌ SDK组件安装失败
)

echo.
echo 清理下载文件...
del "%CMDTOOLS_ZIP%"

echo.
echo 安装完成！请重启命令提示符以使环境变量生效。
pause
