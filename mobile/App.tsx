import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ContextAwareInterface } from './src/components/ContextAwareInterface';
import { backgroundSyncService } from './src/services/BackgroundSyncService';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

const Stack = createNativeStackNavigator();

export default function App() {
    const [isInitialized, setIsInitialized] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        initializeApp();
    }, []);

    const initializeApp = async () => {
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/376cf253-9ee7-4985-8009-63bb4501810c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:20',message:'App initialization started',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        try {
            console.log('Initializing Ernest Mobile Platform...');

            // Initialize background sync
            // #region agent log
            fetch('http://127.0.0.1:7243/ingest/376cf253-9ee7-4985-8009-63bb4501810c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:25',message:'Before backgroundSyncService.initialize',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
            // #endregion
            await backgroundSyncService.initialize();
            // #region agent log
            fetch('http://127.0.0.1:7243/ingest/376cf253-9ee7-4985-8009-63bb4501810c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:28',message:'After backgroundSyncService.initialize',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
            // #endregion

            // Perform initial sync
            // #region agent log
            fetch('http://127.0.0.1:7243/ingest/376cf253-9ee7-4985-8009-63bb4501810c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:31',message:'Before manualSync',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
            // #endregion
            await backgroundSyncService.manualSync();
            // #region agent log
            fetch('http://127.0.0.1:7243/ingest/376cf253-9ee7-4985-8009-63bb4501810c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:34',message:'After manualSync',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
            // #endregion

            setIsInitialized(true);
            console.log('App initialization complete');
            // #region agent log
            fetch('http://127.0.0.1:7243/ingest/376cf253-9ee7-4985-8009-63bb4501810c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:38',message:'App initialization complete',data:{isInitialized:true},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
            // #endregion

        } catch (error) {
            console.error('App initialization failed:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            // #region agent log
            fetch('http://127.0.0.1:7243/ingest/376cf253-9ee7-4985-8009-63bb4501810c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:42',message:'App initialization failed',data:{error:errorMessage,errorType:error instanceof Error ? error.constructor.name : typeof error},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
            // #endregion
            setError(errorMessage);
        }
    };

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorTitle}>Initialization Error</Text>
                <Text style={styles.errorText}>{error}</Text>
                <Text style={styles.errorHint}>Please restart the application</Text>
            </View>
        );
    }

    if (!isInitialized) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2196F3" />
                <Text style={styles.loadingText}>Initializing Ernest Platform...</Text>
            </View>
        );
    }

    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <StatusBar style="auto" />
                <Stack.Navigator
                    screenOptions={{
                        headerShown: false,
                        contentStyle: { backgroundColor: '#f5f5f5' }
                    }}
                >
                    <Stack.Screen
                        name="ContextAwareInterface"
                        component={ContextAwareInterface}
                    />
                    {/* Additional screens will be added here */}
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    loadingText: {
        marginTop: 20,
        fontSize: 16,
        color: '#666',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#ffebee',
    },
    errorTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#d32f2f',
        marginBottom: 10,
    },
    errorText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    errorHint: {
        fontSize: 14,
        color: '#999',
        fontStyle: 'italic',
    },
});
