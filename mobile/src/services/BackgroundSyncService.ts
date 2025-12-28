import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { getRealm, SyncService } from './RealmService';

const BACKGROUND_SYNC_TASK = 'ERNEST_BACKGROUND_SYNC';
const SYNC_INTERVAL = 15 * 60 * 1000; // 15 minutes
const MAX_RETRIES = 3;

export class BackgroundSyncService {
    private isInitialized: boolean = false;
    private retryCount: number = 0;

    async initialize(): Promise<void> {
        if (this.isInitialized) return;

        try {
            // Define the background task
            TaskManager.defineTask(BACKGROUND_SYNC_TASK, async () => {
                await this.performSync();
                return BackgroundFetch.BackgroundFetchResult.NewData;
            });

            // Register the task
            const status = await BackgroundFetch.registerTaskAsync(BACKGROUND_SYNC_TASK, {
                minimumInterval: SYNC_INTERVAL / 1000, // Convert to seconds
                stopOnTerminate: false,
                startOnBoot: true,
            });

            console.log('Background sync registered:', status);
            this.isInitialized = true;

        } catch (error) {
            console.error('Background sync initialization failed:', error);
        }
    }

    async performSync(): Promise<boolean> {
        try {
            console.log('Starting background sync...');

            // Check network connectivity
            const netState = await NetInfo.fetch();
            if (!netState.isConnected) {
                console.log('No network connection, skipping sync');
                return false;
            }

            // Check if we should sync (battery, user preferences, etc.)
            const shouldSync = await this.shouldPerformSync();
            if (!shouldSync) {
                console.log('Sync conditions not met, skipping');
                return false;
            }

            // Get Realm instance and perform sync
            const realm = await getRealm();
            const syncService = new SyncService(realm);

            await syncService.syncPendingChanges();

            // Update last sync timestamp
            await AsyncStorage.setItem('last_sync_timestamp', Date.now().toString());

            // Reset retry count on success
            this.retryCount = 0;

            console.log('Background sync completed successfully');
            return true;

        } catch (error) {
            console.error('Background sync failed:', error);

            // Implement retry logic
            if (this.retryCount < MAX_RETRIES) {
                this.retryCount++;
                console.log(`Retrying sync (attempt ${this.retryCount}/${MAX_RETRIES})`);

                // Exponential backoff
                const backoffDelay = Math.min(1000 * Math.pow(2, this.retryCount), 30000);
                await new Promise(resolve => setTimeout(resolve, backoffDelay));

                return await this.performSync();
            }

            return false;
        }
    }

    private async shouldPerformSync(): Promise<boolean> {
        try {
            // Check user preferences
            const syncEnabled = await AsyncStorage.getItem('background_sync_enabled');
            if (syncEnabled === 'false') return false;

            // Check last sync time
            const lastSync = await AsyncStorage.getItem('last_sync_timestamp');
            if (lastSync) {
                const lastSyncTime = parseInt(lastSync, 10);
                const timeSinceLastSync = Date.now() - lastSyncTime;

                // Don't sync if we synced recently (within 5 minutes)
                if (timeSinceLastSync < 5 * 60 * 1000) {
                    return false;
                }
            }

            // Check if there's data to sync
            const realm = await getRealm();
            const pendingThreads = realm.objects('ChronoThread').filtered('sync_status == "pending"');
            const pendingEvents = realm.objects('Event').filtered('sync_priority == "critical"');

            if (pendingThreads.length === 0 && pendingEvents.length === 0) {
                return false;
            }

            return true;

        } catch (error) {
            console.error('Error checking sync conditions:', error);
            return false;
        }
    }

    async manualSync(): Promise<boolean> {
        console.log('Manual sync triggered');
        return await this.performSync();
    }

    async stop(): Promise<void> {
        try {
            await BackgroundFetch.unregisterTaskAsync(BACKGROUND_SYNC_TASK);
            this.isInitialized = false;
            console.log('Background sync stopped');
        } catch (error) {
            console.error('Failed to stop background sync:', error);
        }
    }

    isRunning(): boolean {
        return this.isInitialized;
    }
}

// Singleton instance
export const backgroundSyncService = new BackgroundSyncService();
