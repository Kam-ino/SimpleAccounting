@echo off
echo 🚀 SimpleAccounting APK Build Script for Windows
echo ================================================

:: Check if Java is installed
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Java is not installed. Please install Java 17 or higher.
    echo Visit: https://adoptium.net/
    pause
    exit /b 1
)

echo ✅ Java is installed

:: Check if ANDROID_HOME is set
if "%ANDROID_HOME%"=="" (
    echo ❌ ANDROID_HOME environment variable is not set.
    echo Please set ANDROID_HOME to your Android SDK installation path.
    echo Example: set ANDROID_HOME=C:\Users\YourUser\AppData\Local\Android\Sdk
    pause
    exit /b 1
)

echo ✅ ANDROID_HOME is set to %ANDROID_HOME%

:: Check if adb is available
adb version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ADB not found. Please ensure Android SDK platform-tools are in your PATH.
    echo Add %ANDROID_HOME%\platform-tools to your PATH
    pause
    exit /b 1
)

echo ✅ ADB is available

:: Build the Next.js application
echo 📦 Building Next.js application...
call npm run build

if %errorlevel% neq 0 (
    echo ❌ Next.js build failed
    pause
    exit /b 1
)

echo ✅ Next.js build completed

:: Sync with Android platform
echo 🔄 Syncing with Android platform...
npx cap sync android

if %errorlevel% neq 0 (
    echo ❌ Capacitor sync failed
    pause
    exit /b 1
)

echo ✅ Capacitor sync completed

:: Build the APK
echo 🔨 Building APK...
cd android
call gradlew.bat assembleDebug

if %errorlevel% neq 0 (
    echo ❌ APK build failed
    cd ..
    pause
    exit /b 1
)

echo ✅ APK build completed

:: Check if APK was created
if exist "app\build\outputs\apk\debug\app-debug.apk" (
    echo 🎉 APK successfully built!
    echo 📱 APK Location: %CD%\app\build\outputs\apk\debug\app-debug.apk
    echo.
    echo To install on your device:
    echo 1. Enable "Unknown sources" in Settings > Security
    echo 2. Transfer the APK to your device
    echo 3. Tap on the APK file to install
    echo.
    echo Or using ADB:
    echo adb install app\build\outputs\apk\debug\app-debug.apk
) else (
    echo ❌ APK file not found at expected location
    cd ..
    pause
    exit /b 1
)

cd ..
echo.
echo 🎯 Build completed successfully!
pause