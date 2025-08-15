# SimpleAccounting - APK Build Instructions

SimpleAccounting has been successfully converted from a PWA to a native Android application using Capacitor. This allows you to install and run the app as a native APK on Android devices.

## 📱 What's Included

The SimpleAccounting APK includes all the features of the web app:
- ✅ **Complete Offline Functionality** - No internet connection required
- ✅ **Local Database Storage** - All data stored locally using IndexedDB
- ✅ **Income & Expense Tracking** - Track your financial transactions
- ✅ **Budget Management** - Set and monitor budget limits
- ✅ **Savings Goals** - Create and track savings objectives
- ✅ **Multi-Currency Support** - Handle multiple currencies
- ✅ **Expense Trends** - Visual charts and analytics
- ✅ **Dark/Light Theme** - Choose your preferred theme
- ✅ **Mobile-Optimized UI** - Designed for touch interfaces

## 🛠️ Prerequisites

Before building the APK, ensure you have:

1. **Java Development Kit (JDK) 17+**
   - Download from [Adoptium](https://adoptium.net/)
   - Or install via package manager:
     ```bash
     # macOS
     brew install openjdk@17
     
     # Ubuntu/Debian
     sudo apt install openjdk-17-jdk
     ```

2. **Android SDK**
   - Install [Android Studio](https://developer.android.com/studio)
   - OR install Android SDK command line tools

3. **Environment Variables**
   ```bash
   export JAVA_HOME=/path/to/your/jdk
   export ANDROID_HOME=/path/to/your/android-sdk
   export ANDROID_SDK_ROOT=$ANDROID_HOME
   export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
   ```

## 🚀 Build Process

### Option 1: Using the Automated Script

1. Run the build script:
   ```bash
   ./build-apk.sh
   ```

2. The script will:
   - Check for Java and Android SDK
   - Build the Next.js application
   - Sync with Android platform
   - Generate the APK

### Option 2: Manual Build

1. **Build the Next.js Application**
   ```bash
   npm run build
   ```

2. **Sync with Android Platform**
   ```bash
   npx cap sync android
   ```

3. **Build the APK**
   ```bash
   cd android
   ./gradlew assembleDebug
   ```

### Option 3: Using Android Studio

1. Open Android Studio
2. Select "Open an existing project"
3. Navigate to the `android` folder
4. Wait for Gradle sync to complete
5. Go to **Build > Build Bundle(s) / APK(s) > Build APK(s)**

## 📦 APK Location

After successful build, the APK will be located at:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

## 📱 Installation

### On Android Device:

1. **Enable Unknown Sources**
   - Go to Settings > Security
   - Enable "Unknown sources" or "Install unknown apps"

2. **Transfer APK to Device**
   - Use USB cable, email, or cloud storage
   - Or use ADB: `adb push app-debug.apk /sdcard/Download/`

3. **Install the APK**
   - Open the APK file on your device
   - Follow the installation prompts

### Using ADB:
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

## 🔧 Troubleshooting

### Common Issues:

1. **JAVA_HOME not set**
   ```bash
   export JAVA_HOME=/usr/lib/jvm/java-17-openjdk
   ```

2. **Android SDK not found**
   ```bash
   export ANDROID_HOME=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

3. **Gradle sync issues**
   ```bash
   cd android
   ./gradlew clean
   ./gradlew assembleDebug
   ```

4. **Missing Android SDK components**
   - Open Android SDK Manager
   - Install required SDK platforms and build tools

5. **Permission denied on build script**
   ```bash
   chmod +x build-apk.sh
   ```

## 🎯 Build Variants

### Debug APK (for testing)
```bash
cd android
./gradlew assembleDebug
```

### Release APK (for distribution)
```bash
cd android
./gradlew assembleRelease
```

**Note:** Release APK requires signing configuration. You'll need to create a keystore and configure it in `android/app/build.gradle`.

## 📋 App Configuration

The app is configured with:
- **App Name**: SimpleAccounting
- **Package ID**: com.simpleaccounting.app
- **Version Code**: 1
- **Version Name**: 1.0.0
- **Minimum SDK**: Android 21 (Android 5.0)
- **Target SDK**: Android 34 (Android 14)

## 🔄 Updates

To update the app with new features:

1. Make your code changes
2. Build the Next.js app: `npm run build`
3. Sync with Android: `npx cap sync android`
4. Build new APK: `cd android && ./gradlew assembleDebug`

## 📱 Device Compatibility

The APK is compatible with:
- Android 5.0 (API level 21) and higher
- ARM and x86 architectures
- Phones and tablets

## 🎉 Success!

Once installed, SimpleAccounting will work completely offline with all your financial data stored locally on your device. No internet connection is required for any functionality.

## 📞 Support

If you encounter any issues during the build process:
1. Check the troubleshooting section above
2. Review the detailed build guide in `APK_BUILD_GUIDE.md`
3. Ensure all prerequisites are properly installed
4. Check the console output for specific error messages