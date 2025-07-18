@echo off
echo ========================================
echo 老年助手 APK 构建脚本
echo ========================================
echo.

echo 检查环境...
echo.

:: 检查 Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js 未安装
    echo 请从 https://nodejs.org/ 下载安装
    pause
    exit /b 1
) else (
    echo ✅ Node.js 已安装
)

:: 检查 Java
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Java 未安装
    echo 请安装 JDK 17-20
    echo 下载地址: https://adoptium.net/
    pause
    exit /b 1
) else (
    echo ✅ Java 已安装
)

:: 检查 ANDROID_HOME
if "%ANDROID_HOME%"=="" (
    echo ❌ ANDROID_HOME 环境变量未设置
    echo 请安装 Android Studio 并设置环境变量
    echo.
    echo 设置方法:
    echo 1. 安装 Android Studio
    echo 2. 设置 ANDROID_HOME=C:\Users\%USERNAME%\AppData\Local\Android\Sdk
    echo 3. 添加到 PATH: %%ANDROID_HOME%%\platform-tools;%%ANDROID_HOME%%\tools
    echo.
    pause
    exit /b 1
) else (
    echo ✅ ANDROID_HOME 已设置: %ANDROID_HOME%
)

echo.
echo 开始构建 APK...
echo.

:: 安装依赖
echo 📦 安装依赖包...
call npm install
if %errorlevel% neq 0 (
    echo ❌ 依赖安装失败
    pause
    exit /b 1
)

:: 清理构建
echo 🧹 清理之前的构建...
cd android
call .\gradlew clean
if %errorlevel% neq 0 (
    echo ⚠️ 清理失败，继续构建...
)

:: 构建调试版本
echo 🔨 构建调试版本 APK...
call .\gradlew assembleDebug
if %errorlevel% neq 0 (
    echo ❌ APK 构建失败
    echo.
    echo 可能的解决方案:
    echo 1. 检查网络连接
    echo 2. 配置代理设置
    echo 3. 使用在线构建服务
    echo.
    pause
    exit /b 1
)

:: 检查 APK 文件
set APK_PATH=app\build\outputs\apk\debug\app-debug.apk
if exist "%APK_PATH%" (
    echo.
    echo ✅ APK 构建成功！
    echo 📱 文件位置: android\%APK_PATH%
    echo.
    echo 文件信息:
    dir "%APK_PATH%"
    echo.
    echo 🎉 您可以将此 APK 文件安装到 Android 设备上！
    echo.
    
    :: 询问是否打开文件夹
    set /p OPEN_FOLDER="是否打开 APK 文件夹? (y/n): "
    if /i "%OPEN_FOLDER%"=="y" (
        explorer app\build\outputs\apk\debug\
    )
) else (
    echo ❌ APK 文件未找到
    echo 构建可能失败，请检查错误信息
)

echo.
echo 构建完成！
pause
