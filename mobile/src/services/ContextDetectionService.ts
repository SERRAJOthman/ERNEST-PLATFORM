import { Accelerometer, Gyroscope, Magnetometer } from 'expo-sensors';
import * as Location from 'expo-location';
// import * as Beacon from 'expo-beacon';
import { Platform } from 'react-native';
import { Buffer } from 'buffer';

// Activity Recognition using TensorFlow.js Lite (simplified)
export class ContextDetectionService {
    private accelerometerData: number[] = [];
    private gyroscopeData: number[] = [];
    private lastLocation: Location.LocationObject | null = null;
    // private detectedBeacons: Beacon.Beacon[] = []; // Mocked below
    private detectedBeacons: any[] = [];
    private currentActivity: string = 'IDLE';
    private activityConfidence: number = 0;
    private isMonitoring: boolean = false;

    // Activity detection thresholds
    private readonly ACTIVITY_THRESHOLDS = {
        WALKING: { variance: 0.5, frequency: 1.5 },
        LIFTING: { variance: 2.0, frequency: 0.5 },
        OPERATING_MACHINERY: { variance: 1.0, frequency: 3.0 },
        DRIVING: { variance: 0.3, frequency: 0.8 }
    };

    constructor() {
        // Set update intervals
        Accelerometer.setUpdateInterval(100); // 10Hz
        Gyroscope.setUpdateInterval(100);
        Magnetometer.setUpdateInterval(1000); // 1Hz
    }

    async initialize(): Promise<void> {
        try {
            // Request permissions
            const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
            // const { status: beaconStatus } = await Beacon.requestPermissionsAsync();

            if (locationStatus !== 'granted') { // || beaconStatus !== 'granted'
                throw new Error('Required permissions not granted');
            }

            // Start sensors
            this.startSensors();

            // Start beacon monitoring if on iOS
            if (Platform.OS === 'ios') {
                await this.startBeaconMonitoring();
            }

            this.isMonitoring = true;

        } catch (error) {
            console.error('Context detection initialization failed:', error);
            throw error;
        }
    }

    private startSensors(): void {
        // Accelerometer subscription
        Accelerometer.addListener(({ x, y, z }) => {
            this.accelerometerData.push(Math.sqrt(x * x + y * y + z * z));

            // Keep only last 100 readings (10 seconds at 10Hz)
            if (this.accelerometerData.length > 100) {
                this.accelerometerData.shift();
            }

            // Detect activity when we have enough data
            if (this.accelerometerData.length >= 50) {
                this.detectActivity();
            }
        });

        // Gyroscope subscription
        Gyroscope.addListener(({ x, y, z }) => {
            this.gyroscopeData.push(Math.abs(x) + Math.abs(y) + Math.abs(z));

            if (this.gyroscopeData.length > 100) {
                this.gyroscopeData.shift();
            }
        });

        // Location subscription
        Location.watchPositionAsync(
            {
                accuracy: Location.Accuracy.Balanced,
                distanceInterval: 5, // Update every 5 meters
                timeInterval: 5000   // Update every 5 seconds
            },
            (location) => {
                this.lastLocation = location;
            }
        );
    }

    private async startBeaconMonitoring(): Promise<void> {
        try {
            console.log('Beacon monitoring disabled (expo-beacon not available)');
            /*
            // Define beacon regions (these would come from project config)
            const regions: Beacon.BeaconRegion[] = [
                {
                    identifier: 'ernest-site-monitoring',
                    uuid: 'B9407F30-F5F8-466E-AFF9-25556B57FE6D', // Estimote UUID
                    minor: 1000,
                    major: 2000
                }
            ];

            await Beacon.startMonitoringForRegions(regions);

            Beacon.EventEmitter.addListener(
                'beaconsDidRange',
                (data: { region: Beacon.BeaconRegion; beacons: Beacon.Beacon[] }) => {
                    this.detectedBeacons = data.beacons
                        .filter(beacon => beacon.proximity !== 'UNKNOWN')
                        .sort((a, b) => a.accuracy - b.accuracy); // Sort by proximity
                }
            );
            */
        } catch (error) {
            console.error('Beacon monitoring failed:', error);
        }
    }

    private detectActivity(): void {
        if (this.accelerometerData.length < 50) return;

        // Calculate variance and frequency
        const mean = this.accelerometerData.reduce((a, b) => a + b) / this.accelerometerData.length;
        const variance = this.accelerometerData.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / this.accelerometerData.length;

        // Zero-crossing rate as frequency proxy
        let zeroCrossings = 0;
        for (let i = 1; i < this.accelerometerData.length; i++) {
            if ((this.accelerometerData[i - 1] - mean) * (this.accelerometerData[i] - mean) < 0) {
                zeroCrossings++;
            }
        }
        const frequency = zeroCrossings / (this.accelerometerData.length / 10); // Normalize to Hz

        // Classify activity based on thresholds
        let detectedActivity = 'IDLE';
        let confidence = 0;

        if (variance > this.ACTIVITY_THRESHOLDS.LIFTING.variance && frequency < 1) {
            detectedActivity = 'LIFTING';
            confidence = Math.min(variance / 3, 0.95);
        } else if (variance > this.ACTIVITY_THRESHOLDS.WALKING.variance &&
            frequency > this.ACTIVITY_THRESHOLDS.WALKING.frequency) {
            detectedActivity = 'WALKING';
            confidence = Math.min(frequency / 3, 0.90);
        } else if (frequency > this.ACTIVITY_THRESHOLDS.OPERATING_MACHINERY.frequency) {
            detectedActivity = 'OPERATING_MACHINERY';
            confidence = Math.min(frequency / 5, 0.85);
        } else if (variance < this.ACTIVITY_THRESHOLDS.DRIVING.variance &&
            this.lastLocation?.coords.speed && this.lastLocation.coords.speed > 5) {
            detectedActivity = 'DRIVING';
            confidence = 0.80;
        }

        // Apply smoothing (low-pass filter)
        if (detectedActivity !== this.currentActivity) {
            // Only change if confidence is high enough and consistent
            if (confidence > 0.7) {
                this.currentActivity = detectedActivity;
                this.activityConfidence = confidence;
            }
        }
    }

    getCurrentContext(): {
        activity: string;
        confidence: number;
        location: { lat: number; lng: number; accuracy: number } | null;
        nearestBeacon: string | null;
        orientation: string;
    } {
        const orientation = this.getDeviceOrientation();

        return {
            activity: this.currentActivity,
            confidence: this.activityConfidence,
            location: this.lastLocation ? {
                lat: this.lastLocation.coords.latitude,
                lng: this.lastLocation.coords.longitude,
                accuracy: this.lastLocation.coords.accuracy
            } : null,
            nearestBeacon: this.detectedBeacons.length > 0 ?
                `${this.detectedBeacons[0].major}:${this.detectedBeacons[0].minor} ` : null,
            orientation
        };
    }

    private getDeviceOrientation(): string {
        // Simplified orientation detection
        // In production, use expo-screen-orientation
        const { width, height } = require('react-native').Dimensions.get('window');

        if (width > height) {
            return height > width ? 'PORTRAIT' : 'LANDSCAPE_LEFT';
        } else {
            return width > height ? 'LANDSCAPE_RIGHT' : 'PORTRAIT';
        }
    }

    stopMonitoring(): void {
        Accelerometer.removeAllListeners();
        Gyroscope.removeAllListeners();
        Magnetometer.removeAllListeners();
        this.isMonitoring = false;
    }

    isActive(): boolean {
        return this.isMonitoring;
    }
}
