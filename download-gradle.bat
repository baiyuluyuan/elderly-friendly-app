@echo off
echo ========================================
echo 手动下载 Gradle 8.14.1
echo ========================================
echo.

set GRADLE_VERSION=8.14.1
set GRADLE_URL=https://services.gradle.org/distributions/gradle-%GRADLE_VERSION%-bin.zip
set GRADLE_HOME=%USERPROFILE%\.gradle\wrapper\dists\gradle-%GRADLE_VERSION%-bin
set GRADLE_ZIP=%TEMP%\gradle-%GRADLE_VERSION%-bin.zip

echo 正在下载 Gradle %GRADLE_VERSION%...
echo 下载地址: %GRADLE_URL%
echo 保存位置: %GRADLE_ZIP%
echo.

:: 使用PowerShell下载文件
powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri '%GRADLE_URL%' -OutFile '%GRADLE_ZIP%' -TimeoutSec 300}"

if %errorlevel% neq 0 (
    echo ❌ 下载失败！
    echo.
    echo 请尝试以下解决方案：
    echo 1. 检查网络连接
    echo 2. 使用VPN或代理
    echo 3. 手动下载: %GRADLE_URL%
    echo 4. 使用国内镜像源
    echo.
    pause
    exit /b 1
)

echo ✅ 下载完成！
echo.

:: 创建Gradle目录
if not exist "%GRADLE_HOME%" (
    mkdir "%GRADLE_HOME%"
)

echo 正在解压 Gradle...
powershell -Command "Expand-Archive -Path '%GRADLE_ZIP%' -DestinationPath '%GRADLE_HOME%' -Force"

if %errorlevel% neq 0 (
    echo ❌ 解压失败！
    pause
    exit /b 1
)

echo ✅ 解压完成！
echo.

:: 清理下载的zip文件
del "%GRADLE_ZIP%"

echo 🎉 Gradle 安装完成！
echo 安装位置: %GRADLE_HOME%
echo.
echo 现在可以重新运行构建命令：
echo cd android
echo .\gradlew.bat assembleDebug
echo.
pause
