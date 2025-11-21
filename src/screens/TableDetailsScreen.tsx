import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  Alert
} from 'react-native';
import { useFloorStore } from '../stores/floorStore';
import { useOrderStore } from '../stores/orderStore';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { TableStatus, OrderStatus } from '../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const TABLE_STATUS_CONFIG: Record<TableStatus, { label: string, color: string, textColor: string }> = {
  [TableStatus.AVAILABLE]: { label: 'Disponible', color: '#D1FAE5', textColor: '#059669' },
  [TableStatus.OCCUPIED]: { label: 'Occupée', color: '#FEE2E2', textColor: '#DC2626' },
  [TableStatus.RESERVED]: { label: 'Réservée', color: '#FEF3C7', textColor: '#D97706' },
  [TableStatus.CLEANING]: { label: 'Nettoyage', color: '#F3F4F6', textColor: '#6B7280' },
};

const ORDER_STATUS_CONFIG: Record<string, { label: string, color: string, textColor: string }> = {
  pending: { label: '⏳ En attente', color: '#FEF3C7', textColor: '#D97706' },
  in_progress: { label: '👨‍🍳 En cuisine', color: '#DBEAFE', textColor: '#2563EB' },
  ready: { label: '🔔 Prêt', color: '#D1FAE5', textColor: '#059669' },
  served: { label: '🍽️ Servi', color: '#F3F4F6', textColor: '#4B5563' },
  paid: { label: '✅ Payé', color: '#ECFDF5', textColor: '#065F46' },
};

export const TableDetailsScreen = ({ route, navigation }: any) => {
  const { tableId } = route.params;
  const tables = useFloorStore((state) => state.tables);
  const orders = useOrderStore((state) => state.orders);
  const changeTableStatus = useFloorStore((state) => state.changeTableStatus);

  const [table, setTable] = useState(tables.find(t => t.id === tableId));
  const [currentOrder, setCurrentOrder] = useState(
    orders.find(o => o.table_id === tableId && o.status !== 'paid')
  );

  useEffect(() => {
    const foundTable = tables.find(t => t.id === tableId);
    setTable(foundTable);

    const foundOrder = orders.find(o => o.table_id === tableId && o.status !== 'paid');
    setCurrentOrder(foundOrder);
  }, [tables, orders, tableId]);

  if (!table) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.errorText}>Table introuvable</Text>
          <Button title="Retour" onPress={() => navigation.goBack()} />
        </View>
      </SafeAreaView>
    );
  }

  const statusConfig = TABLE_STATUS_CONFIG[table.status];

  const handleChangeStatus = async (newStatus: TableStatus) => {
    const { error } = await changeTableStatus(table.id, newStatus);
    if (error) {
      Alert.alert('Erreur', 'Impossible de changer le statut');
    }
  };

  const handleCreateOrder = () => {
    navigation.navigate('CreateOrder', { tableId: table.id });
  };

  const handleViewOrderDetails = () => {
    if (currentOrder) {
      navigation.navigate('OrderDetails', { orderId: currentOrder.id });
    }
  };

  const handleFreeTable = () => {
    Alert.alert(
      'Libérer la table',
      `Voulez-vous marquer la table ${table.number} comme disponible ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Libérer',
          onPress: () => handleChangeStatus(TableStatus.AVAILABLE)
        }
      ]
    );
  };

  const handleStartCleaning = () => {
    handleChangeStatus(TableStatus.CLEANING);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Retour</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Table {table.number}</Text>
          <View style={{ width: 70 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Info table */}
          <Card style={styles.section}>
            <View style={styles.tableHeader}>
              <View>
                <Text style={styles.tableNumber}>Table {table.number}</Text>
                <Text style={styles.tableCapacity}>{table.capacity} personnes</Text>
              </View>
              <Badge
                label={statusConfig.label}
                color={statusConfig.color}
                textColor={statusConfig.textColor}
              />
            </View>
          </Card>

          {/* Commande en cours */}
          {currentOrder ? (
            <Card style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Commande en cours</Text>
                <Badge
                  label={ORDER_STATUS_CONFIG[currentOrder.status]?.label || currentOrder.status}
                  color={ORDER_STATUS_CONFIG[currentOrder.status]?.color || '#F3F4F6'}
                  textColor={ORDER_STATUS_CONFIG[currentOrder.status]?.textColor || '#6B7280'}
                />
              </View>

              <View style={styles.orderInfo}>
                <Text style={styles.orderTime}>
                  Créée le {format(new Date(currentOrder.created_at), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                </Text>
              </View>

              <View style={styles.divider} />

              {/* Articles */}
              <Text style={styles.itemsTitle}>Articles ({currentOrder.items?.length || 0})</Text>
              {currentOrder.items && currentOrder.items.length > 0 ? (
                currentOrder.items.map((item, index) => (
                  <View key={index} style={styles.itemRow}>
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemQuantity}>{item.quantity}×</Text>
                      <Text style={styles.itemName}>
                        {item.menuItem?.name || `Article #${item.menuItemId}`}
                      </Text>
                    </View>
                    <Text style={styles.itemPrice}>
                      {(item.price * item.quantity).toFixed(2)} €
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>Aucun article</Text>
              )}

              <View style={styles.divider} />

              {/* Total */}
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>{currentOrder.total.toFixed(2)} €</Text>
              </View>

              {currentOrder.notes && (
                <View style={styles.notesContainer}>
                  <Text style={styles.notesLabel}>Notes:</Text>
                  <Text style={styles.notesText}>{currentOrder.notes}</Text>
                </View>
              )}

              <Button
                title="Voir les détails de la commande"
                onPress={handleViewOrderDetails}
                style={styles.viewOrderButton}
              />
            </Card>
          ) : (
            <Card style={styles.section}>
              <Text style={styles.sectionTitle}>Aucune commande</Text>
              <Text style={styles.noOrderText}>
                Cette table n'a pas de commande en cours
              </Text>
              {table.status === TableStatus.OCCUPIED && (
                <Button
                  title="Créer une commande"
                  onPress={handleCreateOrder}
                  style={styles.createOrderButton}
                />
              )}
            </Card>
          )}

          {/* Actions rapides */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Actions rapides</Text>

            {table.status === TableStatus.AVAILABLE && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleCreateOrder}
              >
                <Text style={styles.actionIcon}>🍽️</Text>
                <Text style={styles.actionText}>Créer une commande</Text>
              </TouchableOpacity>
            )}

            {table.status === TableStatus.OCCUPIED && !currentOrder && (
              <>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleCreateOrder}
                >
                  <Text style={styles.actionIcon}>🍽️</Text>
                  <Text style={styles.actionText}>Créer une commande</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleFreeTable}
                >
                  <Text style={styles.actionIcon}>✅</Text>
                  <Text style={styles.actionText}>Libérer la table</Text>
                </TouchableOpacity>
              </>
            )}

            {table.status === TableStatus.OCCUPIED && currentOrder && currentOrder.status === 'paid' && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleStartCleaning}
              >
                <Text style={styles.actionIcon}>🧹</Text>
                <Text style={styles.actionText}>Commencer le nettoyage</Text>
              </TouchableOpacity>
            )}

            {table.status === TableStatus.CLEANING && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleFreeTable}
              >
                <Text style={styles.actionIcon}>✅</Text>
                <Text style={styles.actionText}>Marquer comme disponible</Text>
              </TouchableOpacity>
            )}

            {table.status === TableStatus.RESERVED && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleChangeStatus(TableStatus.OCCUPIED)}
              >
                <Text style={styles.actionIcon}>👥</Text>
                <Text style={styles.actionText}>Clients installés</Text>
              </TouchableOpacity>
            )}
          </Card>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF' },
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 20 : 10,
    paddingBottom: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: { width: 70 },
  backButtonText: { fontSize: 16, color: '#007AFF', fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  content: { flex: 1, padding: 20 },
  section: { marginBottom: 16 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 8 },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tableNumber: { fontSize: 24, fontWeight: '700', color: '#111827' },
  tableCapacity: { fontSize: 14, color: '#6B7280', marginTop: 2 },
  orderInfo: { marginBottom: 8 },
  orderTime: { fontSize: 14, color: '#6B7280' },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 12 },
  itemsTitle: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 8 },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  itemQuantity: { fontSize: 15, fontWeight: '700', color: '#111827', width: 40 },
  itemName: { fontSize: 15, color: '#374151', flex: 1 },
  itemPrice: { fontSize: 15, fontWeight: '600', color: '#111827', marginLeft: 12 },
  emptyText: { fontSize: 14, color: '#9CA3AF', fontStyle: 'italic', textAlign: 'center', paddingVertical: 12 },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: { fontSize: 18, fontWeight: '700', color: '#111827' },
  totalValue: { fontSize: 20, fontWeight: '700', color: '#007AFF' },
  notesContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#FFFBEB',
    borderRadius: 8,
  },
  notesLabel: { fontSize: 13, fontWeight: '600', color: '#92400E', marginBottom: 4 },
  notesText: { fontSize: 14, color: '#92400E' },
  viewOrderButton: { marginTop: 12 },
  noOrderText: { fontSize: 14, color: '#6B7280', marginBottom: 16, textAlign: 'center' },
  createOrderButton: { marginTop: 8 },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionIcon: { fontSize: 24, marginRight: 12 },
  actionText: { fontSize: 16, fontWeight: '600', color: '#111827' },
  errorText: { fontSize: 16, color: '#EF4444', textAlign: 'center', marginTop: 40, marginBottom: 20 },
});
