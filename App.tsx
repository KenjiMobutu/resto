import React, { useEffect, useState } from 'react';
import { AppNavigator } from './src/navigation/AppNavigator';
import { Text, View, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { ErrorBoundary } from './src/components/ErrorBoundary';

export default function App() {
  const [isClearing, setIsClearing] = useState(true);

  useEffect(() => {
    // TEMPORARY: Clear ALL storage on mount to fix corruption
    const clearAllStorage = async () => {
      try {
        console.log('🧹 Clearing all SecureStore data...');

        // List of all possible Supabase keys
        const keys = [
          'supabase.auth.token',
          '@supabase/auth-token',
          'sb-auth-token',
          'supabase-auth-token',
        ];

        for (const key of keys) {
          try {
            await SecureStore.deleteItemAsync(key);
            console.log(`✅ Cleared: ${key}`);
          } catch (e) {
            // Key doesn't exist, that's fine
          }
        }

        console.log('✅ Storage cleared successfully');
      } catch (error) {
        console.error('Error clearing storage:', error);
      } finally {
        setIsClearing(false);
      }
    };

    clearAllStorage();
  }, []);

  if (isClearing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Nettoyage du cache...</Text>
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <AppNavigator />
    </ErrorBoundary>
  );
}
