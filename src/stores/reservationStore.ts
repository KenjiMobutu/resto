import { create } from 'zustand';
import { supabase } from '../services/supabase';
import { Reservation, ReservationStatus } from '../types';

interface ReservationState {
  reservations: Reservation[];
  loading: boolean;
  fetchReservations: (restaurantId: string, date?: string) => Promise<void>;
  createReservation: (reservation: Partial<Reservation>) => Promise<{ error: any; data?: Reservation }>;
  updateReservation: (id: string, updates: Partial<Reservation>) => Promise<{ error: any }>;
  deleteReservation: (id: string) => Promise<{ error: any }>;
  changeStatus: (id: string, status: ReservationStatus) => Promise<{ error: any }>;
}

export const useReservationStore = create<ReservationState>((set, get) => ({
  reservations: [],
  loading: false,

  fetchReservations: async (restaurantId: string, date?: string) => {
    try {
      set({ loading: true });
      let query = supabase
        .from('reservations')
        .select('*, client:clients(*), table:tables(*)')
        .eq('restaurant_id', restaurantId)
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (date) {
        query = query.eq('date', date);
      }

      const { data, error } = await query;

      if (error) throw error;

      set({ reservations: data || [], loading: false });
    } catch (error) {
      console.error('Error fetching reservations:', error);
      set({ loading: false });
    }
  },

  createReservation: async (reservation: Partial<Reservation>) => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .insert(reservation)
        .select('*, client:clients(*), table:tables(*)')
        .single();

      if (error) return { error };

      set((state) => ({
        reservations: [...state.reservations, data],
      }));

      return { error: null, data };
    } catch (error) {
      return { error };
    }
  },

  updateReservation: async (id: string, updates: Partial<Reservation>) => {
    try {
      const { error } = await supabase
        .from('reservations')
        .update(updates)
        .eq('id', id);

      if (error) return { error };

      set((state) => ({
        reservations: state.reservations.map((r) =>
          r.id === id ? { ...r, ...updates } : r
        ),
      }));

      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  deleteReservation: async (id: string) => {
    try {
      const { error } = await supabase
        .from('reservations')
        .delete()
        .eq('id', id);

      if (error) return { error };

      set((state) => ({
        reservations: state.reservations.filter((r) => r.id !== id),
      }));

      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  changeStatus: async (id: string, status: ReservationStatus) => {
    return get().updateReservation(id, { status });
  },
}));
