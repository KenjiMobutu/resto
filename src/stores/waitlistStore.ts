import { create } from 'zustand';
import { supabase } from '../services/supabase';
import { Waitlist, WaitlistStatus } from '../types';
import { notifyWaitlistClient } from '../services/sms';

interface WaitlistState {
  waitlist: Waitlist[];
  loading: boolean;
  fetchWaitlist: (restaurantId: string) => Promise<void>;
  addToWaitlist: (entry: Partial<Waitlist>) => Promise<{ error: any; data?: Waitlist }>;
  updateWaitlistEntry: (id: string, updates: Partial<Waitlist>) => Promise<{ error: any }>;
  removeFromWaitlist: (id: string) => Promise<{ error: any }>;
  notifyClient: (id: string, restaurantName: string, restaurantId: string) => Promise<{ error: any }>;
  changeStatus: (id: string, status: WaitlistStatus) => Promise<{ error: any }>;
}

export const useWaitlistStore = create<WaitlistState>((set, get) => ({
  waitlist: [],
  loading: false,

  fetchWaitlist: async (restaurantId: string) => {
    try {
      set({ loading: true });
      const { data, error } = await supabase
        .from('waitlist')
        .select('*, client:clients(*)')
        .eq('restaurant_id', restaurantId)
        .in('status', ['waiting', 'notified'])
        .order('joined_at', { ascending: true });

      if (error) throw error;

      set({ waitlist: data || [], loading: false });
    } catch (error) {
      console.error('Error fetching waitlist:', error);
      set({ loading: false });
    }
  },

  addToWaitlist: async (entry: Partial<Waitlist>) => {
    try {
      const { data, error } = await supabase
        .from('waitlist')
        .insert({ ...entry, joined_at: new Date().toISOString() })
        .select('*, client:clients(*)')
        .single();

      if (error) return { error };

      set((state) => ({
        waitlist: [...state.waitlist, data],
      }));

      return { error: null, data };
    } catch (error) {
      return { error };
    }
  },

  updateWaitlistEntry: async (id: string, updates: Partial<Waitlist>) => {
    try {
      const { error } = await supabase
        .from('waitlist')
        .update(updates)
        .eq('id', id);

      if (error) return { error };

      set((state) => ({
        waitlist: state.waitlist.map((w) =>
          w.id === id ? { ...w, ...updates } : w
        ),
      }));

      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  removeFromWaitlist: async (id: string) => {
    try {
      const { error } = await supabase
        .from('waitlist')
        .delete()
        .eq('id', id);

      if (error) return { error };

      set((state) => ({
        waitlist: state.waitlist.filter((w) => w.id !== id),
      }));

      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  notifyClient: async (id: string, restaurantName: string, restaurantId: string) => {
    try {
      const entry = get().waitlist.find((w) => w.id === id);
      if (!entry || !entry.client) {
        return { error: new Error('Waitlist entry or client not found') };
      }

      const result = await notifyWaitlistClient(
        entry.client.phone,
        restaurantName,
        entry.estimatedWaitTime || 15,
        restaurantId
      );

      if (result.success) {
        await get().updateWaitlistEntry(id, {
          status: WaitlistStatus.NOTIFIED,
          notifiedAt: new Date().toISOString(),
        });
      }

      return { error: result.error };
    } catch (error) {
      return { error };
    }
  },

  changeStatus: async (id: string, status: WaitlistStatus) => {
    const updates: Partial<Waitlist> = { status };

    if (status === WaitlistStatus.SEATED) {
      updates.seatedAt = new Date().toISOString();
    }

    return get().updateWaitlistEntry(id, updates);
  },
}));
