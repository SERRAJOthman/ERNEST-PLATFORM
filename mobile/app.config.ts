import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    name: 'Ernest Field',
    slug: 'ernest-field',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
        image: './assets/splash.png',
        resizeMode: 'contain',
        backgroundColor: '#ffffff'
    },
    assetBundlePatterns: [
        '**/*'
    ],
    ios: {
        supportsTablet: true,
        bundleIdentifier: 'com.ernest.field',
        infoPlist: {
            NSLocationWhenInUseUsageDescription: 'Ernest needs your location to provide context-aware features',
            NSLocationAlwaysUsageDescription: 'Ernest needs your location to track site activity',
            UIBackgroundModes: ['location', 'fetch', 'processing'],
            NSBluetoothAlwaysUsageDescription: 'Ernest uses Bluetooth to detect nearby beacons and equipment'
        },
        config: {
            usesNonExemptEncryption: false
        }
    },
    android: {
        adaptiveIcon: {
            foregroundImage: './assets/adaptive-icon.png',
            backgroundColor: '#ffffff'
        },
        package: 'com.ernest.field',
        permissions: [
            'android.permission.ACCESS_COARSE_LOCATION',
            'android.permission.ACCESS_FINE_LOCATION',
            'android.permission.BLUETOOTH',
            'android.permission.BLUETOOTH_ADMIN',
            'android.permission.BLUETOOTH_SCAN',
            'android.permission.BLUETOOTH_CONNECT',
            'android.permission.FOREGROUND_SERVICE',
            'android.permission.WAKE_LOCK',
            'android.permission.INTERNET',
            'android.permission.ACCESS_NETWORK_STATE',
            'android.permission.VIBRATE'
        ],
        // googleServicesFile: process.env.GOOGLE_SERVICES_JSON || './google-services.json'
    },
    plugins: [
        'expo-font',
        'expo-secure-store',
        'expo-background-fetch',
        [
            'expo-location',
            {
                locationAlwaysAndWhenInUsePermission: 'Allow Ernest to use your location for context-aware features.'
            }
        ],

    ],
    extra: {
        supabaseUrl: process.env.SUPABASE_URL || 'https://your-project.supabase.co',
        supabaseAnonKey: process.env.SUPABASE_ANON_KEY || 'your-anon-key',
        eas: {
            projectId: 'your-project-id'
        }
    },

});
