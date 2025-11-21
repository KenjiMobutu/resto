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

      if (error) {
        throw error;
      }

      set({ clients: data || [], loading: false });
    } catch (error) {
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

  updateClient: async (id: string, clientData: Partial<Client>) => {
    set({ loading: true });
    try {
      // 1. Appel à l'API (Supabase, Firebase, ou votre backend)
      const { data, error } = await supabase // ou votre service API
        .from('clients')
        .update(clientData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // 2. JARVIS : C'est ici la clé. On met à jour le state LOCAL immédiatement.
      // On parcourt la liste et on remplace uniquement le client modifié.
      set((state) => ({
        clients: state.clients.map((client) =>
          client.id === id ? { ...client, ...clientData } : client
        ),
        // Si vous avez un tableau séparé pour les résultats de recherche, mettez-le à jour aussi
        // filteredClients: state.filteredClients.map((c) => c.id === id ? { ...c, ...clientData } : c),
        loading: false
      }));

      return data; // ou true
    } catch (error) {
      console.error('Erreur lors de la mise à jour du client:', error);
      set({ loading: false });
      throw error;
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
