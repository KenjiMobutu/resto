import { create } from 'zustand';
import { supabase } from '../services/supabase';
import { Client } from '../types';

interface ClientState {
  clients: Client[];
  loading: boolean;
  fetchClients: (restaurantId: string) => Promise<void>;
  searchClients: (restaurantId: string, query: string) => Promise<void>;
  createClient: (client: Partial<Client>) => Promise<{ error: any; data?: Client }>;
  updateClient: (id: string, updates: Partial<Client>) => Promise<{ error: any }>;
  deleteClient: (id: string) => Promise<{ error: any }>;
  addTag: (id: string, tag: string) => Promise<{ error: any }>;
  removeTag: (id: string, tag: string) => Promise<{ error: any }>;
}

export const useClientStore = create<ClientState>((set, get) => ({
  clients: [],
  loading: false,

  fetchClients: async (restaurantId: string) => {
    try {
      set({ loading: true });
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('last_visit', { ascending: false, nullsFirst: false });

      if (error) throw error;

      set({ clients: data || [], loading: false });
    } catch (error) {
      console.error('Error fetching clients:', error);
      set({ loading: false });
    }
  },

  searchClients: async (restaurantId: string, query: string) => {
    try {
      set({ loading: true });
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,phone.ilike.%${query}%,email.ilike.%${query}%`)
        .order('last_visit', { ascending: false, nullsFirst: false });

      if (error) throw error;

      set({ clients: data || [], loading: false });
    } catch (error) {
      console.error('Error searching clients:', error);
      set({ loading: false });
    }
  },

  createClient: async (client: Partial<Client>) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert(client)
        .select()
        .single();

      if (error) return { error };

      set((state) => ({
        clients: [data, ...state.clients],
      }));

      return { error: null, data };
    } catch (error) {
      return { error };
    }
  },

  updateClient: async (id: string, updates: Partial<Client>) => {
    try {
      const { error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', id);

      if (error) return { error };

      set((state) => ({
        clients: state.clients.map((c) =>
          c.id === id ? { ...c, ...updates } : c
        ),
      }));

      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  deleteClient: async (id: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) return { error };

      set((state) => ({
        clients: state.clients.filter((c) => c.id !== id),
      }));

      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  addTag: async (id: string, tag: string) => {
    try {
      const client = get().clients.find((c) => c.id === id);
      if (!client) return { error: new Error('Client not found') };

      const tags = [...(client.tags || []), tag];
      return get().updateClient(id, { tags });
    } catch (error) {
      return { error };
    }
  },

  removeTag: async (id: string, tag: string) => {
    try {
      const client = get().clients.find((c) => c.id === id);
      if (!client) return { error: new Error('Client not found') };

      const tags = client.tags.filter((t) => t !== tag);
      return get().updateClient(id, { tags });
    } catch (error) {
      return { error };
    }
  },
}));
