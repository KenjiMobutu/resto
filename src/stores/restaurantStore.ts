import { create } from 'zustand';
import { supabase } from '../services/supabase';
import { Restaurant } from '../types';

interface RestaurantState {
  restaurant: Restaurant | null;
  loading: boolean;
  fetchRestaurant: (id: string) => Promise<void>;
  updateRestaurant: (id: string, updates: Partial<Restaurant>) => Promise<{ error: any }>;
}

export const useRestaurantStore = create<RestaurantState>((set, get) => ({
  restaurant: null,
  loading: false,

  fetchRestaurant: async (id: string) => {
    try {
      set({ loading: true });
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      // Map snake_case from DB to camelCase for TypeScript
      if (data) {
        const restaurant: Restaurant = {
          id: data.id,
          name: data.name,
          address: data.address,
          phone: data.phone,
          email: data.email,
          ownerId: data.owner_id,
          settings: data.settings,
          stripeAccountId: data.stripe_account_id,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
        set({ restaurant, loading: false });
      } else {
        set({ loading: false });
      }
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      set({ loading: false });
    }
  },

  updateRestaurant: async (id: string, updates: Partial<Restaurant>) => {
    try {
      const { error } = await supabase
        .from('restaurants')
        .update(updates)
        .eq('id', id);

      if (error) return { error };

      set((state) => ({
        restaurant: state.restaurant ? { ...state.restaurant, ...updates } : null,
      }));

      return { error: null };
    } catch (error) {
      return { error };
    }
  },
}));
