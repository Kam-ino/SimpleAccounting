# SimpleAccounting (Full Stack)
React native/ TypeScript based simple accounting mobile app

# PWA Installation Guide for Android

Your Accounting Tracker app is now a Progressive Web App (PWA)! Here's how to install it on your Android phone:

## Step 1: Make Sure the App is Running

1. **Start the development server** on your computer:
   ```bash
   npm run dev
   ```

2. **Find your computer's local IP address**:
   - **Windows**: Open Command Prompt and type `ipconfig` (look for "IPv4 Address")
   - **Mac**: Open Terminal and type `ifconfig` (look for "inet" under en0 or en1)
   - **Linux**: Open Terminal and type `ip addr show` (look for "inet" under your network interface)

   Your IP will look something like: `192.168.1.100`

## Step 2: Connect to the Same Network

1. **Connect your Android phone to the same Wi-Fi network** as your computer
2. **Make sure both devices are on the same network** (this is crucial!)

## Step 3: Access the App on Your Phone

1. **Open Chrome browser** on your Android phone
2. **Enter the URL**: `http://[your-computer-ip]:3000`
   - Replace `[your-computer-ip]` with your actual IP address
   - Example: `http://192.168.1.100:3000`

3. **Wait for the app to load** - you should see the Accounting Tracker dashboard

## Step 4: Install the PWA

### Method 1: Chrome Browser (Recommended)

1. **Tap the menu button** (three dots) in the top-right corner of Chrome
2. **Select "Add to Home screen"** or "Install app"
3. **Tap "Add"** or "Install" when prompted
4. **Choose a name** for the app (default is "Accounting Tracker")
5. **Tap "Add"** to confirm

### Method 2: Chrome Address Bar

1. **Look for the install icon** in the address bar (it looks like a plus sign inside a square or a download icon)
2. **Tap the install icon**
3. **Confirm the installation** when prompted

## Step 5: Use the Installed App

1. **Go to your home screen** - you should see the new "Accounting Tracker" icon
2. **Tap the icon** to open the app
3. **The app will open in full-screen mode** just like a native app
4. **You can now use all features** offline (once cached)

## What You Get with PWA Installation

✅ **Full-screen experience** - No browser address bar or navigation buttons
✅ **Home screen icon** - Easy access just like native apps
✅ **Offline functionality** - Works even without internet connection
✅ **Push notifications** - Can receive notifications (if implemented)
✅ **Automatic updates** - Always gets the latest version
✅ **No app store required** - Install directly from the browser

## Troubleshooting

### If "Add to Home screen" doesn't appear:

1. **Make sure you're using Chrome** - Some browsers don't support PWA installation
2. **Check your connection** - Ensure both devices are on the same network
3. **Clear browser cache** - Sometimes cached data prevents installation
4. **Try a different URL** - Use `http://` instead of `https://` for local development

### If the app doesn't work offline:

1. **First visit all pages** while online to cache them
2. **Check service worker status** in Chrome DevTools (if you know how)
3. **Reinstall the PWA** by removing it and installing again

### If you can't connect to your computer:

1. **Check firewall settings** on your computer
2. **Verify both devices are on the same network**
3. **Try pinging your computer's IP** from your phone (use a network tools app)

## Updating the App

The PWA will automatically check for updates when you open it:
1. **Open the app** while connected to the internet
2. **New versions will download automatically**
3. **Refresh the app** to get the latest version

## Removing the PWA

To uninstall the app from your phone:
1. **Long-press the app icon** on your home screen
2. **Tap "Uninstall"** or drag to the "Remove" option
3. **Confirm the removal**

## Tips for Best Experience

1. **Use Chrome browser** for the best PWA support
2. **Keep your computer running** while using the app (for local development)
3. **Check for updates** regularly by opening the app with internet connection
4. **Report any issues** if you encounter bugs or problems

## Future Enhancements

The PWA can be enhanced with:
- **Push notifications** for budget alerts and goal reminders
- **Background sync** for offline data synchronization
- **Home screen widgets** for quick balance checks
- **Share functionality** to share financial reports
- **Biometric authentication** for added security

Enjoy using your Accounting Tracker app on your Android phone! 🎉
