import { create } from 'zustand';
import { supabase } from '../services/supabase';
import { Order, OrderStatus, OrderItem } from '../types';

interface OrderState {
  orders: Order[];
  loading: boolean;
  fetchOrders: (restaurantId: string, status?: OrderStatus) => Promise<void>;
  createOrder: (order: Partial<Order>) => Promise<{ error: any; data?: Order }>;
  updateOrder: (id: string, updates: Partial<Order>) => Promise<{ error: any }>;
  deleteOrder: (id: string) => Promise<{ error: any }>;
  addItem: (orderId: string, item: OrderItem) => Promise<{ error: any }>;
  removeItem: (orderId: string, itemId: string) => Promise<{ error: any }>;
  updateItemQuantity: (orderId: string, itemId: string, quantity: number) => Promise<{ error: any }>;
  changeStatus: (id: string, status: OrderStatus) => Promise<{ error: any }>;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  loading: false,

  fetchOrders: async (restaurantId: string, status?: OrderStatus) => {
    try {
      set({ loading: true });
      let query = supabase
        .from('orders')
        .select('*, table:tables(*), client:clients(*)')
        .eq('restaurant_id', restaurantId)
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;

      set({ orders: data || [], loading: false });
    } catch (error) {
      console.error('Error fetching orders:', error);
      set({ loading: false });
    }
  },

  createOrder: async (order: Partial<Order>) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert(order)
        .select('*, table:tables(*), client:clients(*)')
        .single();

      if (error) return { error };

      set((state) => ({
        orders: [data, ...state.orders],
      }));

      return { error: null, data };
    } catch (error) {
      return { error };
    }
  },

  updateOrder: async (id: string, updates: Partial<Order>) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', id);

      if (error) return { error };

      set((state) => ({
        orders: state.orders.map((o) =>
          o.id === id ? { ...o, ...updates } : o
        ),
      }));

      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  deleteOrder: async (id: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);

      if (error) return { error };

      set((state) => ({
        orders: state.orders.filter((o) => o.id !== id),
      }));

      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  addItem: async (orderId: string, item: OrderItem) => {
    try {
      const order = get().orders.find((o) => o.id === orderId);
      if (!order) return { error: new Error('Order not found') };

      const items = [...order.items, item];
      const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      const tax = subtotal * 0.1; // 10% tax
      const total = subtotal + tax + (order.tip || 0);

      return get().updateOrder(orderId, { items, subtotal, tax, total });
    } catch (error) {
      return { error };
    }
  },

  removeItem: async (orderId: string, itemId: string) => {
    try {
      const order = get().orders.find((o) => o.id === orderId);
      if (!order) return { error: new Error('Order not found') };

      const items = order.items.filter((i) => i.id !== itemId);
      const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      const tax = subtotal * 0.1;
      const total = subtotal + tax + (order.tip || 0);

      return get().updateOrder(orderId, { items, subtotal, tax, total });
    } catch (error) {
      return { error };
    }
  },

  updateItemQuantity: async (orderId: string, itemId: string, quantity: number) => {
    try {
      const order = get().orders.find((o) => o.id === orderId);
      if (!order) return { error: new Error('Order not found') };

      const items = order.items.map((i) =>
        i.id === itemId ? { ...i, quantity } : i
      );
      const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      const tax = subtotal * 0.1;
      const total = subtotal + tax + (order.tip || 0);

      return get().updateOrder(orderId, { items, subtotal, tax, total });
    } catch (error) {
      return { error };
    }
  },

  changeStatus: async (id: string, status: OrderStatus) => {
    return get().updateOrder(id, { status });
  },
}));
