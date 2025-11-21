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
import { useOrderStore } from '../stores/orderStore';
import { useAuthStore } from '../stores/authStore';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { OrderStatus } from '../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const ORDER_STATUS_CONFIG: Record<string, { label: string, color: string, textColor: string, next?: OrderStatus }> = {
  pending: { label: '⏳ En attente', color: '#FEF3C7', textColor: '#D97706', next: OrderStatus.IN_PROGRESS },
  in_progress: { label: '👨‍🍳 En cuisine', color: '#DBEAFE', textColor: '#2563EB', next: OrderStatus.READY },
  ready: { label: '🔔 Prêt', color: '#D1FAE5', textColor: '#059669', next: OrderStatus.SERVED },
  served: { label: '🍽️ Servi', color: '#F3F4F6', textColor: '#4B5563', next: OrderStatus.PAID },
  paid: { label: '✅ Payé', color: '#ECFDF5', textColor: '#065F46' },
};

export const OrderDetailsScreen = ({ route, navigation }: any) => {
  const { orderId } = route.params;
  const user = useAuthStore((state) => state.user);
  const orders = useOrderStore((state) => state.orders);
  const changeStatus = useOrderStore((state) => state.changeStatus);
  const deleteOrder = useOrderStore((state) => state.deleteOrder);

  const [order, setOrder] = useState(orders.find(o => o.id === orderId));

  useEffect(() => {
    const foundOrder = orders.find(o => o.id === orderId);
    setOrder(foundOrder);
  }, [orders, orderId]);

  if (!order) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.errorText}>Commande introuvable</Text>
          <Button title="Retour" onPress={() => navigation.goBack()} />
        </View>
      </SafeAreaView>
    );
  }

  const statusConfig = ORDER_STATUS_CONFIG[order.status] || ORDER_STATUS_CONFIG['pending'];

  const handleChangeStatus = async () => {
    if (!statusConfig.next) return;

    const { error } = await changeStatus(order.id, statusConfig.next);
    if (error) {
      Alert.alert('Erreur', 'Impossible de changer le statut');
    }
  };

  const handleDeleteOrder = () => {
    Alert.alert(
      'Supprimer la commande',
      'Voulez-vous vraiment supprimer cette commande ? Cette action est irréversible.',
      [
        { text: 'Non', style: 'cancel' },
        {
          text: 'Oui, supprimer',
          style: 'destructive',
          onPress: async () => {
            const { error } = await deleteOrder(order.id);
            if (!error) {
              navigation.goBack();
            } else {
              Alert.alert('Erreur', 'Impossible de supprimer la commande');
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Retour</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Détails de la commande</Text>
          <View style={{ width: 70 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Info principale */}
          <Card style={styles.mainCard}>
            <View style={styles.mainInfo}>
              <View>
                <Text style={styles.tableText}>Table {order.table?.number || '?'}</Text>
                <Text style={styles.timeText}>
                  {format(new Date(order.created_at), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                </Text>
                {order.client && (
                  <Text style={styles.clientText}>
                    Client: {order.client.first_name} {order.client.last_name}
                  </Text>
                )}
              </View>
              <Badge
                label={statusConfig.label}
                color={statusConfig.color}
                textColor={statusConfig.textColor}
              />
            </View>
          </Card>

          {/* Articles */}
          <Card style={styles.itemsCard}>
            <Text style={styles.sectionTitle}>Articles commandés</Text>
            <View style={styles.divider} />
            {order.items && order.items.length > 0 ? (
              order.items.map((item, index) => (
                <View key={index} style={styles.itemRow}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemQuantity}>{item.quantity}x</Text>
                    <View style={styles.itemDetails}>
                      <Text style={styles.itemName}>
                        {item.menuItem?.name || `Article #${item.menuItemId}`}
                      </Text>
                      {item.notes && (
                        <Text style={styles.itemNotes}>Note: {item.notes}</Text>
                      )}
                    </View>
                  </View>
                  <Text style={styles.itemPrice}>{(item.price * item.quantity).toFixed(2)} €</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>Aucun article</Text>
            )}
          </Card>

          {/* Totaux */}
          <Card style={styles.totalsCard}>
            <Text style={styles.sectionTitle}>Résumé</Text>
            <View style={styles.divider} />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Sous-total</Text>
              <Text style={styles.totalValue}>{order.subtotal.toFixed(2)} €</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Taxes</Text>
              <Text style={styles.totalValue}>{order.tax.toFixed(2)} €</Text>
            </View>
            {order.tip && order.tip > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Pourboire</Text>
                <Text style={styles.totalValue}>{order.tip.toFixed(2)} €</Text>
              </View>
            )}
            <View style={styles.divider} />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabelBold}>Total</Text>
              <Text style={styles.totalValueBold}>{order.total.toFixed(2)} €</Text>
            </View>
            {order.payment_method && (
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentLabel}>
                  Payé par:{' '}
                  {order.payment_method === 'cash' ? 'Espèces' :
                   order.payment_method === 'card' ? 'Carte' : 'Mobile'}
                </Text>
              </View>
            )}
          </Card>

          {/* Notes */}
          {order.notes && (
            <Card style={styles.notesCard}>
              <Text style={styles.sectionTitle}>Notes</Text>
              <View style={styles.divider} />
              <Text style={styles.notesText}>{order.notes}</Text>
            </Card>
          )}

          {/* Actions */}
          <View style={styles.actions}>
            {statusConfig.next && order.status !== 'paid' && (
              <Button
                title={`Marquer comme "${ORDER_STATUS_CONFIG[statusConfig.next].label}"`}
                onPress={handleChangeStatus}
                style={styles.actionButton}
              />
            )}

            {order.status === 'paid' && (
              <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteOrder}>
                <Text style={styles.deleteButtonText}>Supprimer la commande</Text>
              </TouchableOpacity>
            )}
          </View>

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
  mainCard: { marginBottom: 16 },
  mainInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  tableText: { fontSize: 24, fontWeight: '700', color: '#111827', marginBottom: 4 },
  timeText: { fontSize: 14, color: '#6B7280', marginBottom: 2 },
  clientText: { fontSize: 14, color: '#374151', fontWeight: '500', marginTop: 4 },
  itemsCard: { marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 12 },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 12 },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  itemInfo: { flexDirection: 'row', flex: 1, marginRight: 12 },
  itemQuantity: { fontSize: 16, fontWeight: '700', color: '#111827', width: 40 },
  itemDetails: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 2 },
  itemNotes: { fontSize: 13, color: '#6B7280', fontStyle: 'italic' },
  itemPrice: { fontSize: 16, fontWeight: '600', color: '#111827' },
  emptyText: { fontSize: 14, color: '#9CA3AF', fontStyle: 'italic', textAlign: 'center', paddingVertical: 20 },
  totalsCard: { marginBottom: 16 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  totalLabel: { fontSize: 15, color: '#6B7280' },
  totalValue: { fontSize: 15, color: '#111827', fontWeight: '500' },
  totalLabelBold: { fontSize: 18, fontWeight: '700', color: '#111827' },
  totalValueBold: { fontSize: 18, fontWeight: '700', color: '#111827' },
  paymentInfo: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  paymentLabel: { fontSize: 14, color: '#374151', fontWeight: '500' },
  notesCard: { marginBottom: 16 },
  notesText: { fontSize: 14, color: '#374151', lineHeight: 20 },
  actions: { gap: 12, marginTop: 8 },
  actionButton: { marginBottom: 0 },
  cancelButton: {
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#EF4444',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: { fontSize: 16, fontWeight: '700', color: '#EF4444' },
  deleteButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  deleteButtonText: { fontSize: 16, fontWeight: '700', color: '#FFF' },
  errorText: { fontSize: 16, color: '#EF4444', textAlign: 'center', marginTop: 40, marginBottom: 20 },
});
