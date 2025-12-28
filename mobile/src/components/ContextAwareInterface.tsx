import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { ContextDetectionService } from '../services/ContextDetectionService';
import { MaterialIcons } from '@expo/vector-icons';

interface ContextState {
    activity: string;
    confidence: number;
    location: { lat: number; lng: number; accuracy: number } | null;
    nearestBeacon: string | null;
    orientation: string;
}

export const ContextAwareInterface: React.FC = () => {
    const [context, setContext] = useState<ContextState>({
        activity: 'IDLE',
        confidence: 0,
        location: null,
        nearestBeacon: null,
        orientation: 'PORTRAIT'
    });

    const [contextService, setContextService] = useState<ContextDetectionService | null>(null);
    const [uiMode, setUiMode] = useState<'normal' | 'voice' | 'minimal'>('normal');

    useEffect(() => {
        const service = new ContextDetectionService();
        setContextService(service);

        service.initialize().then(() => {
            // Update context every second
            const interval = setInterval(() => {
                setContext(service.getCurrentContext());
                updateUiMode(service.getCurrentContext().activity);
            }, 1000);

            return () => clearInterval(interval);
        }).catch(console.error);

        return () => {
            service.stopMonitoring();
        };
    }, []);

    const updateUiMode = (activity: string) => {
        switch (activity) {
            case 'LIFTING':
            case 'OPERATING_MACHINERY':
                setUiMode('voice');
                break;
            case 'DRIVING':
                setUiMode('minimal');
                break;
            default:
                setUiMode('normal');
        }
    };

    const getActivityIcon = (activity: string) => {
        switch (activity) {
            case 'WALKING': return 'directions-walk';
            case 'LIFTING': return 'fitness-center';
            case 'OPERATING_MACHINERY': return 'build';
            case 'DRIVING': return 'directions-car';
            default: return 'person';
        }
    };

    const getPriorityTasks = () => {
        // Based on context, show different tasks
        if (context.activity === 'LIFTING') {
            return ['Safety Check', 'Material Verification'];
        } else if (context.nearestBeacon) {
            return [`Zone: ${context.nearestBeacon}`, 'Inspect Equipment'];
        } else {
            return ['Daily Report', 'Task Assignment', 'Site Photos'];
        }
    };

    if (uiMode === 'voice') {
        return (
            <SafeAreaView style={styles.voiceContainer}>
                <View style={styles.voiceHeader}>
                    <MaterialIcons name="keyboard-voice" size={48} color="#4CAF50" />
                    <Text style={styles.voiceText}>Voice Mode Active</Text>
                    <Text style={styles.contextHint}>Say "Log material" or "Report issue"</Text>
                </View>

                <View style={styles.contextBadge}>
                    <MaterialIcons name={getActivityIcon(context.activity)} size={24} color="white" />
                    <Text style={styles.contextText}>{context.activity} • {Math.round(context.confidence * 100)}%</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (uiMode === 'minimal') {
        return (
            <SafeAreaView style={styles.minimalContainer}>
                <Text style={styles.minimalText}>DRIVING MODE</Text>
                <Text style={styles.minimalSubtext}>Navigation active</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Context Header */}
            <View style={styles.contextHeader}>
                <View style={styles.activityDisplay}>
                    <MaterialIcons name={getActivityIcon(context.activity)} size={32} color="#2196F3" />
                    <View style={styles.activityInfo}>
                        <Text style={styles.activityTitle}>{context.activity}</Text>
                        <Text style={styles.confidenceText}>Confidence: {Math.round(context.confidence * 100)}%</Text>
                    </View>
                </View>

                {context.nearestBeacon && (
                    <View style={styles.beaconBadge}>
                        <MaterialIcons name="bluetooth-searching" size={16} color="white" />
                        <Text style={styles.beaconText}>Zone: {context.nearestBeacon}</Text>
                    </View>
                )}
            </View>

            {/* Priority Tasks based on Context */}
            <View style={styles.tasksSection}>
                <Text style={styles.sectionTitle}>Suggested Actions</Text>
                {getPriorityTasks().map((task, index) => (
                    <TouchableOpacity key={index} style={styles.taskCard}>
                        <Text style={styles.taskText}>{task}</Text>
                        <MaterialIcons name="chevron-right" size={24} color="#666" />
                    </TouchableOpacity>
                ))}
            </View>

            {/* Quick Actions based on Location/Activity */}
            <View style={styles.quickActions}>
                {context.activity === 'WALKING' && (
                    <>
                        <TouchableOpacity style={styles.actionButton}>
                            <MaterialIcons name="photo-camera" size={24} color="white" />
                            <Text style={styles.actionText}>Site Photo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                            <MaterialIcons name="check-circle" size={24} color="white" />
                            <Text style={styles.actionText}>Inspection</Text>
                        </TouchableOpacity>
                    </>
                )}

                {context.activity === 'IDLE' && (
                    <TouchableOpacity style={styles.actionButton}>
                        <MaterialIcons name="report" size={24} color="white" />
                        <Text style={styles.actionText}>Daily Report</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Context Debug Info (remove in production) */}
            <View style={styles.debugInfo}>
                <Text style={styles.debugText}>
                    GPS: {context.location ? '✓' : '✗'} |
                    Beacon: {context.nearestBeacon ? '✓' : '✗'} |
                    Mode: {uiMode.toUpperCase()}
                </Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    voiceContainer: {
        flex: 1,
        backgroundColor: '#1a1a1a',
        justifyContent: 'center',
        alignItems: 'center',
    },
    minimalContainer: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    contextHeader: {
        backgroundColor: 'white',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    activityDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    activityInfo: {
        marginLeft: 12,
    },
    activityTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
    },
    confidenceText: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    beaconBadge: {
        backgroundColor: '#6200ee',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        alignSelf: 'flex-start',
        marginTop: 12,
    },
    beaconText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '500',
        marginLeft: 6,
    },
    tasksSection: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    taskCard: {
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    taskText: {
        fontSize: 16,
        color: '#333',
    },
    quickActions: {
        flexDirection: 'row',
        padding: 20,
        justifyContent: 'space-around',
    },
    actionButton: {
        backgroundColor: '#2196F3',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 24,
    },
    actionText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 8,
    },
    debugInfo: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    debugText: {
        fontSize: 12,
        color: '#666',
    },
    voiceHeader: {
        alignItems: 'center',
    },
    voiceText: {
        color: 'white',
        fontSize: 24,
        fontWeight: '600',
        marginTop: 16,
    },
    contextHint: {
        color: '#aaa',
        fontSize: 14,
        marginTop: 8,
    },
    contextBadge: {
        position: 'absolute', top: 60,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.7)',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 16,
    },
    contextText: {
        color: 'white',
        fontSize: 12,
        marginLeft: 6,
    },
    minimalText: {
        color: '#4CAF50',
        fontSize: 32,
        fontWeight: 'bold',
    },
    minimalSubtext: {
        color: '#aaa',
        fontSize: 14,
        marginTop: 8,
    },
});
