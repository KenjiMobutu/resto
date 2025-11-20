import { create } from 'zustand';
import { supabase } from '../services/supabase';
import { Table, TableStatus, FloorElement, Position } from '../types';

interface FloorState {
  tables: Table[];
  elements: FloorElement[];
  loading: boolean;
  fetchFloor: (restaurantId: string) => Promise<void>;
  createTable: (table: Partial<Table>) => Promise<{ error: any; data?: Table }>;
  updateTable: (id: string, updates: Partial<Table>) => Promise<{ error: any }>;
  updateTablePosition: (id: string, position: Position) => Promise<{ error: any }>;
  deleteTable: (id: string) => Promise<{ error: any }>;
  changeTableStatus: (id: string, status: TableStatus) => Promise<{ error: any }>;
  createElement: (element: Partial<FloorElement>) => Promise<{ error: any; data?: FloorElement }>;
  updateElement: (id: string, updates: Partial<FloorElement>) => Promise<{ error: any }>;
  updateElementPosition: (id: string, position: Position) => Promise<{ error: any }>;
  deleteElement: (id: string) => Promise<{ error: any }>;
}

export const useFloorStore = create<FloorState>((set, get) => ({
  tables: [],
  elements: [],
  loading: false,

  fetchFloor: async (restaurantId: string) => {
    try {
      set({ loading: true });

      const [tablesResult, elementsResult] = await Promise.all([
        supabase
          .from('tables')
          .select('*')
          .eq('restaurant_id', restaurantId)
          .order('number', { ascending: true }),
        supabase
          .from('floor_elements')
          .select('*')
          .eq('restaurant_id', restaurantId),
      ]);

      if (tablesResult.error) throw tablesResult.error;
      if (elementsResult.error) throw elementsResult.error;

      set({
        tables: tablesResult.data || [],
        elements: elementsResult.data || [],
        loading: false,
      });
    } catch (error) {
      console.error('Error fetching floor:', error);
      set({ loading: false });
    }
  },

  createTable: async (table: Partial<Table>) => {
    try {
      const { data, error } = await supabase
        .from('tables')
        .insert(table)
        .select()
        .single();

      if (error) return { error };

      set((state) => ({
        tables: [...state.tables, data],
      }));

      return { error: null, data };
    } catch (error) {
      return { error };
    }
  },

  updateTable: async (id: string, updates: Partial<Table>) => {
    try {
      const { error } = await supabase
        .from('tables')
        .update(updates)
        .eq('id', id);

      if (error) return { error };

      set((state) => ({
        tables: state.tables.map((t) =>
          t.id === id ? { ...t, ...updates } : t
        ),
      }));

      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  updateTablePosition: async (id: string, position: Position) => {
    return get().updateTable(id, { position });
  },

  deleteTable: async (id: string) => {
    try {
      const { error } = await supabase
        .from('tables')
        .delete()
        .eq('id', id);

      if (error) return { error };

      set((state) => ({
        tables: state.tables.filter((t) => t.id !== id),
      }));

      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  changeTableStatus: async (id: string, status: TableStatus) => {
    return get().updateTable(id, { status });
  },

  createElement: async (element: Partial<FloorElement>) => {
    try {
      const { data, error } = await supabase
        .from('floor_elements')
        .insert(element)
        .select()
        .single();

      if (error) return { error };

      set((state) => ({
        elements: [...state.elements, data],
      }));

      return { error: null, data };
    } catch (error) {
      return { error };
    }
  },

  updateElement: async (id: string, updates: Partial<FloorElement>) => {
    try {
      const { error } = await supabase
        .from('floor_elements')
        .update(updates)
        .eq('id', id);

      if (error) return { error };

      set((state) => ({
        elements: state.elements.map((e) =>
          e.id === id ? { ...e, ...updates } : e
        ),
      }));

      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  updateElementPosition: async (id: string, position: Position) => {
    return get().updateElement(id, { position });
  },

  deleteElement: async (id: string) => {
    try {
      const { error } = await supabase
        .from('floor_elements')
        .delete()
        .eq('id', id);

      if (error) return { error };

      set((state) => ({
        elements: state.elements.filter((e) => e.id !== id),
      }));

      return { error: null };
    } catch (error) {
      return { error };
    }
  },
}));
