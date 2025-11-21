import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  Platform,
  StatusBar
} from 'react-native';
import { useOrderStore } from '../stores/orderStore';
import { useAuthStore } from '../stores/authStore';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Order, OrderStatus } from '../types'; // Assurez-vous que ces types existent
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// JARVIS: Configuration des statuts pour un retour visuel immédiat
const ORDER_STATUS_CONFIG: Record<string, { label: string, color: string, textColor: string }> = {
  pending: { label: '⏳ En attente', color: '#FEF3C7', textColor: '#D97706' },
  in_progress: { label: '👨‍🍳 En cuisine', color: '#DBEAFE', textColor: '#2563EB' },
  ready: { label: '🔔 Prêt', color: '#D1FAE5', textColor: '#059669' },
  served: { label: '🍽️ Servi', color: '#F3F4F6', textColor: '#4B5563' },
  paid: { label: '✅ Payé', color: '#ECFDF5', textColor: '#065F46' },
};

export const OrdersScreen = ({ navigation }: any) => {
  const user = useAuthStore((state) => state.user);
  const orders = useOrderStore((state) => state.orders);
  const loading = useOrderStore((state) => state.loading);
  const fetchOrders = useOrderStore((state) => state.fetchOrders);

  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

  useEffect(() => {
    if (user?.restaurant_id) {
      fetchOrders(user.restaurant_id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.restaurant_id]);

  const loadData = useCallback(() => {
    if (user?.restaurant_id) {
      fetchOrders(user.restaurant_id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.restaurant_id]);

  // JARVIS: Filtrage intelligent selon l'onglet
  const filteredOrders = orders.filter(order => {
    const isFinished = order.status === 'paid';
    return activeTab === 'active' ? !isFinished : isFinished;
  }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const renderOrderItem = ({ item }: { item: Order }) => {
    const statusConfig = ORDER_STATUS_CONFIG[item.status] || ORDER_STATUS_CONFIG['pending'];
    const itemCount = item.items?.reduce((acc, i) => acc + i.quantity, 0) || 0;

    return (
      <View style={styles.cardWrapper}>
        <Card onPress={() => navigation.navigate('OrderDetails', { orderId: item.id })}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.tableText}>Table {item.table?.number || '?'}</Text>
              <Text style={styles.timeText}>
                {format(new Date(item.created_at), 'HH:mm', { locale: fr })}
              </Text>
            </View>
            <Badge
              label={statusConfig.label}
              color={statusConfig.color}
              textColor={statusConfig.textColor}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.cardBody}>
            <Text style={styles.itemsSummary}>
              {itemCount} article{itemCount > 1 ? 's' : ''} • Total: {Number(item.total).toFixed(2)} €
            </Text>
            {/* Aperçu rapide des premiers articles */}
            {item.items?.slice(0, 2).map((lineItem, idx) => (
              <Text key={idx} style={styles.itemRow}>
                {lineItem.quantity}
              </Text>
            ))}
            {(item.items?.length || 0) > 2 && (
              <Text style={styles.moreItems}>+ {(item.items?.length || 0) - 2} autres...</Text>
            )}
          </View>
        </Card>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* En-tête */}
        <View style={styles.headerContainer}>
          <View style={styles.headerTopRow}>
            <Text style={styles.screenTitle}>Commandes</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('CreateOrder')}
            >
              <Text style={styles.addButtonText}>+ Nouvelle</Text>
            </TouchableOpacity>
          </View>

          {/* Onglets de navigation */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'active' && styles.activeTab]}
              onPress={() => setActiveTab('active')}
            >
              <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>En cours</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'history' && styles.activeTab]}
              onPress={() => setActiveTab('history')}
            >
              <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>Historique</Text>
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={!!loading} onRefresh={loadData} />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🍽️</Text>
              <Text style={styles.emptyTitle}>Aucune commande</Text>
              <Text style={styles.emptySubtitle}>
                {activeTab === 'active'
                  ? "Tout est calme en cuisine."
                  : "L'historique des commandes est vide."}
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF' },
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  headerContainer: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 20 : 10,
    paddingBottom: 0, // Padding géré par les tabs
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 5, zIndex: 10,
  },
  headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  screenTitle: { fontSize: 28, fontWeight: '800', color: '#111827' },
  addButton: { backgroundColor: '#007AFF', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20 },
  addButtonText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  tabsContainer: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  tab: { flex: 1, paddingVertical: 16, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: '#007AFF' },
  tabText: { fontSize: 15, fontWeight: '600', color: '#6B7280' },
  activeTabText: { color: '#007AFF' },
  listContent: { padding: 20, paddingBottom: 100 },
  cardWrapper: { marginBottom: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tableText: { fontSize: 18, fontWeight: '700', color: '#111827' },
  timeText: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 12 },
  cardBody: { gap: 4 },
  itemsSummary: { fontSize: 15, fontWeight: '600', color: '#374151', marginBottom: 4 },
  itemRow: { fontSize: 14, color: '#6B7280' },
  moreItems: { fontSize: 13, color: '#9CA3AF', fontStyle: 'italic', marginTop: 2 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 16, opacity: 0.5 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#374151', marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: '#6B7280', textAlign: 'center' },
});
