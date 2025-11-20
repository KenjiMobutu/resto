import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Order, OrderStatus } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface OrderCardProps {
  order: Order;
  onPress: () => void;
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: '#F59E0B',
  [OrderStatus.IN_PROGRESS]: '#3B82F6',
  [OrderStatus.READY]: '#10B981',
  [OrderStatus.SERVED]: '#6B7280',
  [OrderStatus.PAID]: '#059669',
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'En attente',
  [OrderStatus.IN_PROGRESS]: 'En cours',
  [OrderStatus.READY]: 'Prête',
  [OrderStatus.SERVED]: 'Servie',
  [OrderStatus.PAID]: 'Payée',
};

export const OrderCard: React.FC<OrderCardProps> = ({ order, onPress }) => {
  const tableInfo = order.table ? `Table ${order.table.number}` : 'À emporter';

  return (
    <Card onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.table}>{tableInfo}</Text>
          <Text style={styles.time}>
            {format(new Date(order.createdAt), 'HH:mm', { locale: fr })}
          </Text>
        </View>
        <Badge label={STATUS_LABELS[order.status]} color={STATUS_COLORS[order.status]} />
      </View>

      <View style={styles.items}>
        {order.items.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <Text style={styles.itemQuantity}>{item.quantity}x</Text>
            <Text style={styles.itemName}>{item.menuItem?.name || 'Article'}</Text>
            <Text style={styles.itemPrice}>{item.price.toFixed(2)} €</Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.totalLabel}>Total:</Text>
        <Text style={styles.totalValue}>{order.total.toFixed(2)} €</Text>
      </View>

      {order.notes && (
        <View style={styles.notes}>
          <Text style={styles.notesText}>{order.notes}</Text>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
  },
  table: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  time: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  items: {
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  itemQuantity: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    width: 30,
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
  },
  notes: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#FEF3C7',
    borderRadius: 6,
  },
  notesText: {
    fontSize: 13,
    color: '#92400E',
  },
});
