import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.simpleaccounting.app',
  appName: 'SimpleAccounting',
  webDir: 'out',
  bundledWebRuntime: false,
  server: {
    // In development, you can use this to proxy requests to your Next.js dev server
    // For production, this will be ignored
    androidScheme: 'https'
  },
  android: {
    allowMixedContent: true
  }
};

export default config;
