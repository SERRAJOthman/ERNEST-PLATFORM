import { ContextDetectionService } from '../src/services/ContextDetectionService';

// Mock expo-sensors
jest.mock('expo-sensors', () => ({
    Accelerometer: {
        setUpdateInterval: jest.fn(),
        addListener: jest.fn((callback) => {
            // Simulate accelerometer data
            setInterval(() => {
                callback({ x: 0.1, y: 0.2, z: 9.8 });
            }, 100);
            return { remove: jest.fn() };
        }),
        removeAllListeners: jest.fn()
    },
    Gyroscope: {
        setUpdateInterval: jest.fn(),
        addListener: jest.fn(() => ({ remove: jest.fn() })),
        removeAllListeners: jest.fn()
    },
    Magnetometer: {
        setUpdateInterval: jest.fn(),
        addListener: jest.fn(() => ({ remove: jest.fn() })),
        removeAllListeners: jest.fn()
    }
}));

// Mock expo-location
jest.mock('expo-location', () => ({
    requestForegroundPermissionsAsync: jest.fn(() =>
        Promise.resolve({ status: 'granted' })
    ),
    watchPositionAsync: jest.fn(() => Promise.resolve())
}));


describe('ContextDetectionService', () => {
    let service: ContextDetectionService;

    beforeEach(() => {
        service = new ContextDetectionService();
    });

    afterEach(() => {
        service.stopMonitoring();
    });

    test('initializes successfully', async () => {
        await expect(service.initialize()).resolves.not.toThrow();
    });

    test('detects activities based on sensor data', async () => {
        await service.initialize();

        // Simulate some time for data collection
        await new Promise(resolve => setTimeout(resolve, 2000));

        const context = service.getCurrentContext();

        expect(context).toHaveProperty('activity');
        expect(context).toHaveProperty('confidence');
        expect(context.confidence).toBeGreaterThanOrEqual(0);
        expect(context.confidence).toBeLessThanOrEqual(1);
    });

    test('stops monitoring correctly', () => {
        service.stopMonitoring();
        expect(service.isActive()).toBe(false);
    });

    test('returns valid context structure', () => {
        const context = service.getCurrentContext();

        expect(context).toMatchObject({
            activity: expect.stringMatching(/^(IDLE|WALKING|LIFTING|OPERATING_MACHINERY|DRIVING)$/),
            confidence: expect.any(Number),
            location: expect.anything(),
            nearestBeacon: expect.anything(),
            orientation: expect.stringMatching(/^(PORTRAIT|LANDSCAPE_LEFT|LANDSCAPE_RIGHT|UPSIDE_DOWN)$/)
        });
    });
});
