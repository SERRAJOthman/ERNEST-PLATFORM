import Realm, { BSON, ObjectSchema } from 'realm';

// ChronoThread Schema for Local Storage
export class ChronoThread extends Realm.Object<ChronoThread> {
    _id!: BSON.ObjectId;
    id!: string;
    entity_type!: 'ASSET' | 'TASK' | 'MATERIAL' | 'LOCATION';
    entity_id!: string;
    project_id?: string;
    metadata!: Realm.Dictionary<string>;
    created_at!: Date;
    updated_at!: Date;
    sync_status!: 'pending' | 'synced' | 'failed';
    sync_attempts!: number;
    last_sync_at?: Date;

    static schema: ObjectSchema = {
        name: 'ChronoThread',
        primaryKey: '_id',
        properties: {
            _id: 'objectId',
            id: 'string',
            entity_type: 'string',
            entity_id: 'string',
            project_id: 'string?',
            metadata: '{}',
            created_at: 'date',
            updated_at: 'date',
            sync_status: 'string',
            sync_attempts: 'int',
            last_sync_at: 'date?'
        }
    };
}

// Event Schema for Local Storage
export class Event extends Realm.Object<Event> {
    _id!: BSON.ObjectId;
    id!: string;
    thread_id!: string;
    timestamp!: Date;
    event_type!: 'FIELD_CAPTURE' | 'FINANCIAL_UPDATE' | 'SCHEDULE_CHANGE' | 'COMMUNICATION';
    source!: 'MOBILE_APP' | 'OFFICE_PORTAL' | 'IOT_SENSOR' | 'INTEGRATION';
    data_payload!: Realm.Dictionary<any>;
    procedural_data!: Realm.Dictionary<any>;
    commercial_data!: Realm.Dictionary<any>;
    relationships!: string[];
    monotonic_timestamp!: string;
    sync_priority!: 'critical' | 'high' | 'normal' | 'low';
    is_offline_capture!: boolean;

    static schema: ObjectSchema = {
        name: 'Event',
        primaryKey: '_id',
        properties: {
            _id: 'objectId',
            id: 'string',
            thread_id: 'string',
            timestamp: 'date',
            event_type: 'string',
            source: 'string',
            data_payload: '{}',
            procedural_data: '{}',
            commercial_data: '{}',
            relationships: 'string[]',
            monotonic_timestamp: 'string',
            sync_priority: 'string',
            is_offline_capture: 'bool'
        }
    };
}

// Context State Schema
export class ContextState extends Realm.Object<ContextState> {
    _id!: BSON.ObjectId;
    user_id!: string;
    detected_activity!: 'IDLE' | 'WALKING' | 'LIFTING' | 'OPERATING_MACHINERY' | 'DRIVING';
    confidence!: number;
    location!: Realm.Dictionary<number>;
    nearest_beacon?: string;
    current_project_id?: string;
    current_task_id?: string;
    timestamp!: Date;
    device_orientation!: 'PORTRAIT' | 'LANDSCAPE_LEFT' | 'LANDSCAPE_RIGHT' | 'UPSIDE_DOWN';
    battery_level!: number;
    network_quality!: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'DISCONNECTED';

    static schema: ObjectSchema = {
        name: 'ContextState',
        primaryKey: '_id',
        properties: {
            _id: 'objectId',
            user_id: 'string',
            detected_activity: 'string',
            confidence: 'float',
            location: '{}',
            nearest_beacon: 'string?',
            current_project_id: 'string?',
            current_task_id: 'string?',
            timestamp: 'date',
            device_orientation: 'string',
            battery_level: 'float',
            network_quality: 'string'
        }
    };
}

// Initialize Realm Database
export const getRealm = async (): Promise<Realm> => {
    return await Realm.open({
        schema: [ChronoThread, Event, ContextState],
        schemaVersion: 1,
        onMigration: (oldRealm, newRealm) => {
            // Handle migrations as needed
            if (oldRealm.schemaVersion < 1) {
                // Migration logic
            }
        }
    });
};

import { supabase } from '../lib/supabase';

// Sync Service for Background Operations
export class SyncService {
    private realm: Realm;
    private isSyncing: boolean = false;

    constructor(realm: Realm) {
        this.realm = realm;
    }

    async syncPendingChanges(): Promise<void> {
        if (this.isSyncing) return;

        // Check if user is authenticated before syncing
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            console.log('Sync skipped: No active session');
            return;
        }

        this.isSyncing = true;
        console.log('Syncing starting...');

        try {
            const pendingThreads = this.realm.objects<ChronoThread>('ChronoThread')
                .filtered('sync_status == "pending"')
                .slice(0, 50);

            const pendingEvents = this.realm.objects<Event>('Event')
                .filtered('sync_priority == "critical"')
                .slice(0, 100);

            // 1. Sync Threads
            for (const thread of pendingThreads) {
                const { error } = await supabase
                    .from('chrono_threads')
                    .upsert({
                        id: thread.id,
                        project_id: thread.project_id,
                        entity_type: thread.entity_type,
                        entity_id: thread.entity_id,
                        title: thread.metadata['title'] || 'Mobile Sync',
                        current_state: thread.metadata
                    });

                if (error) {
                    console.error('Thread sync error:', error);
                    continue;
                }

                this.realm.write(() => {
                    thread.sync_status = 'synced';
                    thread.last_sync_at = new Date();
                });
            }

            // 2. Sync Events
            for (const event of pendingEvents) {
                const { error } = await supabase
                    .from('chrono_events')
                    .insert({
                        thread_id: event.thread_id,
                        event_type: event.event_type,
                        payload: event.data_payload,
                        actor_id: session.user.id
                    });

                if (error) {
                    console.error('Event sync error:', error);
                    continue;
                }

                this.realm.write(() => {
                    this.realm.delete(event); // Delete synced transient events
                });
            }

            console.log('Sync cycle complete');

        } catch (error) {
            console.error('Sync process failed:', error);
        } finally {
            this.isSyncing = false;
        }
    }
}
