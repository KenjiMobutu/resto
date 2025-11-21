import { create } from 'zustand';
import { supabase } from '../services/supabase';
import { User } from '../types';

interface AuthState {
  user: User | null;
  session: any;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loadUser: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<{ error: any }>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  loading: true,

  signIn: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) return { error };

      if (data.session) {
        set({ session: data.session });
        await get().loadUser();
      }

      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  signUp: async (email: string, password: string, userData: Partial<User>) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) return { error };

      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase.from('users').insert({
          id: data.user.id,
          email,
          ...userData,
        });

        if (profileError) return { error: profileError };
      }

      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
  },

  loadUser: async () => {
    try {
      set({ loading: true });
      const { data: { session } } = await supabase.auth.getSession();

         // Anti-corruption de session venant de AsyncStorage
    const safeSession = typeof session === 'string' ? null : session;

      if (safeSession) {
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', safeSession.user.id)
          .single();

        if (!error && userData) {
          // Map snake_case from DB to camelCase for TypeScript
          const user: User = {
            id: userData.id,
            email: userData.email,
            firstName: userData.first_name,
            lastName: userData.last_name,
            role: userData.role,
            restaurant_id: userData.restaurant_id,
            phone: userData.phone,
            avatar: userData.avatar,
            createdAt: userData.created_at,
            updatedAt: userData.updated_at,
          };
          set({ user, session: safeSession, loading: false });
        } else {
          // User authenticated but no profile in users table
          console.error('❌ ERREUR: Profil utilisateur non trouvé');
          console.error('User ID:', safeSession.user.id);
          console.error('Email:', safeSession.user.email);
          console.error('\n📋 SOLUTION:');
          console.error('1. Allez dans Supabase SQL Editor');
          console.error('2. Exécutez le SQL dans CREATE_TEST_USER.md');
          console.error('3. Relancez l\'app\n');
          set({ session: safeSession, loading: false });
        }
      } else {
        set({ loading: false });
      }
    } catch (error) {
      console.error('Error loading user:', error);
      set({ loading: false });
    }
  },

  updateUser: async (updates: Partial<User>) => {
    try {
      const { user } = get();
      if (!user) return { error: new Error('No user logged in') };

      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id);

      if (error) return { error };

      set({ user: { ...user, ...updates } });
      return { error: null };
    } catch (error) {
      return { error };
    }
  },
}));
