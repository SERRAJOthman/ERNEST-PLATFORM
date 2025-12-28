import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

// In a real app, these should come from environment variables
// Using the ones from mobile/.env
const supabaseUrl = 'https://krzxrbihzczksctuefsm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyenhyYmloemN6a3NjdHVlZnNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5MjM4MTcsImV4cCI6MjA4MjQ5OTgxN30.j4RHI7jmk5WBo11yMyj8b1uNe3JJ9mKTokqeaawRZ5g';

// Custom adapter for SecureStore (for auth storage)
const ExpoSecureStoreAdapter = {
    getItem: (key: string) => {
        return SecureStore.getItemAsync(key);
    },
    setItem: (key: string, value: string) => {
        return SecureStore.setItemAsync(key, value);
    },
    removeItem: (key: string) => {
        return SecureStore.deleteItemAsync(key);
    },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: ExpoSecureStoreAdapter as any,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
