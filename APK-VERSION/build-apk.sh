#!/bin/bash

# SimpleAccounting APK Build Script
# This script helps build the Android APK for SimpleAccounting

echo "🚀 SimpleAccounting APK Build Script"
echo "===================================="

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo "❌ Java is not installed. Please install Java 17 or higher."
    echo "Visit: https://adoptium.net/"
    exit 1
fi

# Check Java version
JAVA_VERSION=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2 | cut -d'.' -f1)
if [ "$JAVA_VERSION" -lt 17 ]; then
    echo "❌ Java version $JAVA_VERSION is not supported. Please install Java 17 or higher."
    exit 1
fi

echo "✅ Java version check passed"

# Check if Android SDK is installed
if [ -z "$ANDROID_HOME" ]; then
    echo "❌ ANDROID_HOME environment variable is not set."
    echo "Please set ANDROID_HOME to your Android SDK installation path."
    echo "Example: export ANDROID_HOME=\$HOME/Android/Sdk"
    exit 1
fi

echo "✅ Android SDK found at $ANDROID_HOME"

# Check if adb is available
if ! command -v adb &> /dev/null; then
    echo "❌ ADB not found. Please ensure Android SDK platform-tools are in your PATH."
    exit 1
fi

echo "✅ ADB found"

# Build the Next.js application
echo "📦 Building Next.js application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Next.js build failed"
    exit 1
fi

echo "✅ Next.js build completed"

# Sync with Android platform
echo "🔄 Syncing with Android platform..."
npx cap sync android

if [ $? -ne 0 ]; then
    echo "❌ Capacitor sync failed"
    exit 1
fi

echo "✅ Capacitor sync completed"

# Build the APK
echo "🔨 Building APK..."
cd android
./gradlew assembleDebug

if [ $? -ne 0 ]; then
    echo "❌ APK build failed"
    exit 1
fi

echo "✅ APK build completed"

# Check if APK was created
APK_PATH="app/build/outputs/apk/debug/app-debug.apk"
if [ -f "$APK_PATH" ]; then
    echo "🎉 APK successfully built!"
    echo "📱 APK Location: $(pwd)/$APK_PATH"
    echo ""
    echo "To install on your device:"
    echo "1. Enable 'Unknown sources' in Settings > Security"
    echo "2. Transfer the APK to your device"
    echo "3. Tap on the APK file to install"
    echo ""
    echo "Or using ADB:"
    echo "adb install $APK_PATH"
else
    echo "❌ APK file not found at expected location"
    exit 1
fi

cd ..