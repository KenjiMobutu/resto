// Script to clear SecureStore - Run this in your app if needed
import * as SecureStore from 'expo-secure-store';

export async function clearAllStorage() {
  try {
    // Clear Supabase auth keys
    const keysToDelete = [
      'supabase.auth.token',
      '@supabase/auth-token',
      'sb-auth-token',
    ];

    for (const key of keysToDelete) {
      try {
        await SecureStore.deleteItemAsync(key);
        console.log(`Deleted key: ${key}`);
      } catch (e) {
        console.log(`Key not found: ${key}`);
      }
    }

    console.log('✅ Storage cleared successfully');
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
}
