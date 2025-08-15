# SimpleAccounting APK Build Guide

## Prerequisites

Before building the APK, you need to install the following:

1. **Java Development Kit (JDK) 17 or higher**
   - Download from: https://adoptium.net/
   - Or install using your package manager:
     - macOS: `brew install openjdk@17`
     - Ubuntu/Debian: `sudo apt install openjdk-17-jdk`
     - Windows: Download from Oracle or Adoptium

2. **Android SDK**
   - Install Android Studio: https://developer.android.com/studio
   - OR install Android SDK command line tools

3. **Environment Variables**
   Set these environment variables:
   ```bash
   export JAVA_HOME=/path/to/your/jdk
   export ANDROID_HOME=/path/to/your/android-sdk
   export ANDROID_SDK_ROOT=$ANDROID_HOME
   export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
   ```

## Build Steps

### 1. Build the Next.js Application
```bash
npm run build
```

### 2. Sync with Android Platform
```bash
npx cap sync android
```

### 3. Build the APK
```bash
cd android
./gradlew assembleDebug
```

### 4. Find the APK
The debug APK will be located at:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

## Alternative: Using Android Studio

1. Open Android Studio
2. Select "Open an existing project"
3. Navigate to the `android` folder in your project
4. Wait for Gradle sync to complete
5. Go to Build > Build Bundle(s) / APK(s) > Build APK(s)

## Install the APK

### On Android Device:
1. Enable "Unknown sources" in Settings > Security
2. Transfer the APK to your device
3. Tap on the APK file to install

### Using ADB:
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

## Troubleshooting

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
   - Delete the `.gradle` folder in the android directory
   - Run `./gradlew clean` before building

4. **Missing Android SDK components**
   - Open Android SDK Manager
   - Install required SDK platforms and build tools

## Build Variants

### Debug APK (for testing)
```bash
./gradlew assembleDebug
```

### Release APK (for distribution)
```bash
./gradlew assembleRelease
```

Note: Release APK requires signing configuration. You'll need to create a keystore and configure it in `android/app/build.gradle`.

## App Features

The SimpleAccounting APK includes:
- ✅ Complete offline functionality
- ✅ Local database storage (IndexedDB)
- ✅ Income and expense tracking
- ✅ Budget management
- ✅ Savings goals
- ✅ Multi-currency support
- ✅ Expense trends by category
- ✅ Dark/Light theme support
- ✅ Responsive design for mobile devices

## Notes

- The app is completely offline and doesn't require internet connectivity
- All data is stored locally on the device
- The APK is built for Android devices
- For iOS devices, you would need to add the iOS platform and build through Xcode