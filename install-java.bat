@echo off
echo ========================================
echo 安装 Java 17 JDK
echo ========================================
echo.

echo 正在检查Java环境...
java -version 2>nul
if %errorlevel% equ 0 (
    echo 发现已安装的Java版本：
    java -version
    echo.
    echo 检查是否为Java 17...
    java -version 2>&1 | findstr "17\." >nul
    if %errorlevel% equ 0 (
        echo ✅ Java 17 已安装！
        echo 设置JAVA_HOME环境变量...
        for /f "tokens=*" %%i in ('where java') do set JAVA_PATH=%%i
        for %%i in ("%JAVA_PATH%") do set JAVA_HOME=%%~dpi..
        echo JAVA_HOME=%JAVA_HOME%
        goto :build
    )
)

echo ❌ 未找到Java 17，开始安装...
echo.

echo 方案1: 使用Chocolatey安装 (推荐)
where choco >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 发现Chocolatey，使用choco安装Java 17...
    choco install openjdk17 -y
    if %errorlevel% equ 0 (
        echo ✅ Java 17 安装成功！
        goto :setenv
    )
)

echo 方案2: 手动下载安装
echo.
echo 请手动下载并安装Java 17：
echo 1. 访问: https://adoptium.net/temurin/releases/?version=17
echo 2. 下载 Windows x64 JDK 17
echo 3. 运行安装程序
echo 4. 重新运行此脚本
echo.
pause
exit /b 1

:setenv
echo 设置环境变量...
for /f "tokens=2*" %%i in ('reg query "HKLM\SOFTWARE\JavaSoft\JDK\17" /v JavaHome 2^>nul') do set JAVA_HOME=%%j
if "%JAVA_HOME%"=="" (
    echo 尝试查找Java安装路径...
    for /d %%i in ("C:\Program Files\Eclipse Adoptium\jdk-17*") do set JAVA_HOME=%%i
    for /d %%i in ("C:\Program Files\Java\jdk-17*") do set JAVA_HOME=%%i
)

if "%JAVA_HOME%"=="" (
    echo ❌ 无法找到Java 17安装路径
    echo 请手动设置JAVA_HOME环境变量
    pause
    exit /b 1
)

echo ✅ JAVA_HOME设置为: %JAVA_HOME%
setx JAVA_HOME "%JAVA_HOME%" /M
setx PATH "%PATH%;%JAVA_HOME%\bin" /M

:build
echo.
echo 🔨 开始构建APK...
cd /d "%~dp0android"
.\gradlew.bat assembleDebug

if %errorlevel% equ 0 (
    echo.
    echo 🎉 APK构建成功！
    if exist app\build\outputs\apk\debug\app-debug.apk (
        echo 📱 APK位置: %CD%\app\build\outputs\apk\debug\app-debug.apk
        explorer app\build\outputs\apk\debug
    )
) else (
    echo ❌ 构建失败，请检查错误信息
)

pause
