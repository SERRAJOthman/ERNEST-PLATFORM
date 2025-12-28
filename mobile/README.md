# Ernest Mobile Platform

The mobile component of the Ernest unified construction platform, providing context-aware field execution capabilities.

## Features

- **Context-Aware Interface**: Adapts UI based on user activity (walking, lifting, operating machinery, driving)
- **Offline-First Architecture**: Realm database for local storage with background sync
- **Sensor Integration**: Accelerometer, gyroscope, location, Bluetooth beacons
- **Voice Mode**: Hands-free operation when sensors detect lifting or machinery operation
- **Background Sync**: Automatic data synchronization even when app is closed

## Architecture

### Core Components
1. **ContextDetectionService**: Monitors sensors to detect user activity and environment
2. **RealmService**: Local database for offline data storage
3. **BackgroundSyncService**: Manages data synchronization with backend
4. **ContextAwareInterface**: Dynamic UI that adapts to user context

### Data Flow
```
Sensors → Context Detection → UI Adaptation
    ↓
Local Storage (Realm) ←→ Background Sync ←→ Backend API
```

## Setup

### Prerequisites
- Node.js 18+
- Expo CLI
- iOS: macOS with Xcode
- Android: Android Studio

### Installation
```bash
cd ernest-platform/mobile
npm install
```

### Environment Configuration
Copy the example environment file:
```bash
cp .env.example .env.development
```

Edit `.env.development` with your configuration:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
API_BASE_URL=https://api.ernest.example.com
```

### Running the App

#### Development
```bash
npm start
# Press 'i' for iOS simulator or 'a' for Android emulator
```

#### Production Builds
```bash
# Android
npm run build:android

# iOS
npm run build:ios
```

## Testing

Run tests:
```bash
npm test
```

Run type checking:
```bash
npm run type-check
```

## Deployment

### App Stores
1. **iOS**: Use `eas submit --platform ios`
2. **Android**: Use `eas submit --platform android`

### Environment-Specific Builds
- `development`: For testing
- `preview`: For internal distribution
- `production`: For app stores

## Context Detection Logic

The app detects these activities:
- **IDLE**: Minimal movement
- **WALKING**: Regular walking pattern
- **LIFTING**: High variance, low frequency
- **OPERATING_MACHINERY**: High frequency vibrations
- **DRIVING**: Low variance with GPS speed > 5 m/s

## UI Modes

Based on detected activity:
- **Normal**: Full interface (IDLE, WALKING)
- **Voice**: Simplified voice interface (LIFTING, OPERATING_MACHINERY)
- **Minimal**: Safety-focused interface (DRIVING)

## Contributing

1. Create feature branch: `git checkout -b feature/context-detection`
2. Make changes and commit
3. Run tests: `npm test`
4. Submit pull request

## License

Proprietary - Ernest Platform
