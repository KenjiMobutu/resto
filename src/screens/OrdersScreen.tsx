import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useAuthStore } from '../stores/authStore';
import { useOrderStore } from '../stores/orderStore';
import { OrderCard } from '../components/orders/OrderCard';
import { OrderStatus } from '../types';

const FILTER_OPTIONS: { label: string; value: OrderStatus | 'all' }[] = [
  { label: 'Toutes', value: 'all' },
  { label: 'En attente', value: OrderStatus.PENDING },
  { label: 'En cours', value: OrderStatus.IN_PROGRESS },
  { label: 'Prêtes', value: OrderStatus.READY },
  { label: 'Servies', value: OrderStatus.SERVED },
];

export const OrdersScreen = ({ navigation }: any) => {
  const user = useAuthStore((state) => state.user);
  const orders = useOrderStore((state) => state.orders);
  const loading = useOrderStore((state) => state.loading);
  const fetchOrders = useOrderStore((state) => state.fetchOrders);

  const [selectedFilter, setSelectedFilter] = useState<OrderStatus | 'all'>('all');

  useEffect(() => {
    if (user?.restaurantId) {
      loadOrders();
    }
  }, [user, selectedFilter]);

  const loadOrders = () => {
    if (user?.restaurantId) {
      if (selectedFilter === 'all') {
        fetchOrders(user.restaurantId);
      } else {
        fetchOrders(user.restaurantId, selectedFilter as OrderStatus);
      }
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (selectedFilter === 'all') return true;
    return order.status === selectedFilter;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.filters}>
          {FILTER_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.filterButton,
                selectedFilter === option.value && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedFilter(option.value)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedFilter === option.value && styles.filterButtonTextActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('CreateOrder')}
        >
          <Text style={styles.addButtonText}>+ Nouvelle commande</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <OrderCard
            order={item}
            onPress={() => navigation.navigate('OrderDetails', { id: item.id })}
          />
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadOrders} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Aucune commande</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filters: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFF',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  filterButtonTextActive: {
    color: '#FFF',
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  list: {
    padding: 16,
    gap: 12,
  },
  empty: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
  },
});
