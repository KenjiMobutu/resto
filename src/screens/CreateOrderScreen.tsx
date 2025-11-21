import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  Alert,
  TextInput
} from 'react-native';
import { useOrderStore } from '../stores/orderStore';
import { useAuthStore } from '../stores/authStore';
import { useFloorStore } from '../stores/floorStore';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { OrderItem, OrderStatus } from '../types';

export const CreateOrderScreen = ({ route, navigation }: any) => {
  const user = useAuthStore((state) => state.user);
  const tables = useFloorStore((state) => state.tables);
  const createOrder = useOrderStore((state) => state.createOrder);

  const [selectedTableId, setSelectedTableId] = useState(route.params?.tableId || '');
  const [items, setItems] = useState<OrderItem[]>([]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  // Exemple d'articles (à remplacer par un vrai menu)
  const menuItems = [
    { id: '1', name: 'Burger', price: 12.50 },
    { id: '2', name: 'Pizza Margherita', price: 10.00 },
    { id: '3', name: 'Salade César', price: 8.50 },
    { id: '4', name: 'Pâtes Carbonara', price: 11.00 },
    { id: '5', name: 'Steak frites', price: 18.00 },
    { id: '6', name: 'Coca Cola', price: 3.50 },
    { id: '7', name: 'Eau minérale', price: 2.50 },
    { id: '8', name: 'Café', price: 2.00 },
  ];

  const availableTables = tables.filter(t => t.status === 'available' || t.id === selectedTableId);

  const addItem = (menuItem: any) => {
    const existingItem = items.find(i => i.menuItemId === menuItem.id);

    if (existingItem) {
      setItems(items.map(i =>
        i.menuItemId === menuItem.id
          ? { ...i, quantity: i.quantity + 1 }
          : i
      ));
    } else {
      setItems([...items, {
        id: `temp-${Date.now()}`,
        menuItemId: menuItem.id,
        menuItem: menuItem,
        quantity: 1,
        price: menuItem.price,
        notes: ''
      }]);
    }
  };

  const removeItem = (itemId: string) => {
    setItems(items.filter(i => i.id !== itemId));
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setItems(items.map(i => {
      if (i.id === itemId) {
        const newQuantity = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQuantity };
      }
      return i;
    }));
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1; // 10% de taxes
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const handleCreateOrder = async () => {
    if (!selectedTableId) {
      Alert.alert('Erreur', 'Veuillez sélectionner une table');
      return;
    }

    if (items.length === 0) {
      Alert.alert('Erreur', 'Veuillez ajouter au moins un article');
      return;
    }

    if (!user?.restaurant_id || !user?.id) {
      Alert.alert('Erreur', 'Utilisateur non authentifié');
      return;
    }

    setLoading(true);

    const { subtotal, tax, total } = calculateTotals();

    const { error, data } = await createOrder({
      restaurant_id: user.restaurant_id,
      table_id: selectedTableId,
      items: items,
      status: 'pending' as OrderStatus,
      subtotal,
      tax,
      total,
      notes,
      created_by: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    setLoading(false);

    if (error) {
      Alert.alert('Erreur', 'Impossible de créer la commande');
      console.error('Create order error:', error);
    } else {
      Alert.alert('Succès', 'Commande créée avec succès', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    }
  };

  const { subtotal, tax, total } = calculateTotals();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Annuler</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nouvelle commande</Text>
          <View style={{ width: 70 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Sélection de table */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Table</Text>
            <View style={styles.tablesGrid}>
              {availableTables.map(table => (
                <TouchableOpacity
                  key={table.id}
                  style={[
                    styles.tableChip,
                    selectedTableId === table.id && styles.tableChipSelected
                  ]}
                  onPress={() => setSelectedTableId(table.id)}
                >
                  <Text style={[
                    styles.tableChipText,
                    selectedTableId === table.id && styles.tableChipTextSelected
                  ]}>
                    Table {table.number}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {availableTables.length === 0 && (
              <Text style={styles.emptyText}>Aucune table disponible</Text>
            )}
          </Card>

          {/* Menu */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Menu</Text>
            <View style={styles.menuGrid}>
              {menuItems.map(menuItem => (
                <TouchableOpacity
                  key={menuItem.id}
                  style={styles.menuItem}
                  onPress={() => addItem(menuItem)}
                >
                  <Text style={styles.menuItemName}>{menuItem.name}</Text>
                  <Text style={styles.menuItemPrice}>{menuItem.price.toFixed(2)} €</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>

          {/* Articles ajoutés */}
          {items.length > 0 && (
            <Card style={styles.section}>
              <Text style={styles.sectionTitle}>Articles ({items.length})</Text>
              {items.map(item => (
                <View key={item.id} style={styles.cartItem}>
                  <View style={styles.cartItemInfo}>
                    <Text style={styles.cartItemName}>{item.menuItem?.name}</Text>
                    <Text style={styles.cartItemPrice}>
                      {item.quantity} × {item.price.toFixed(2)} € = {(item.quantity * item.price).toFixed(2)} €
                    </Text>
                  </View>
                  <View style={styles.quantityControls}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => updateQuantity(item.id, -1)}
                    >
                      <Text style={styles.quantityButtonText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => updateQuantity(item.id, 1)}
                    >
                      <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeItem(item.id)}
                    >
                      <Text style={styles.removeButtonText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </Card>
          )}

          {/* Notes */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Notes (optionnel)</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="Remarques particulières..."
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
            />
          </Card>

          {/* Résumé */}
          {items.length > 0 && (
            <Card style={styles.section}>
              <Text style={styles.sectionTitle}>Résumé</Text>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Sous-total</Text>
                <Text style={styles.totalValue}>{subtotal.toFixed(2)} €</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Taxes (10%)</Text>
                <Text style={styles.totalValue}>{tax.toFixed(2)} €</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.totalRow}>
                <Text style={styles.totalLabelBold}>Total</Text>
                <Text style={styles.totalValueBold}>{total.toFixed(2)} €</Text>
              </View>
            </Card>
          )}

          <Button
            title="Créer la commande"
            onPress={handleCreateOrder}
            disabled={loading || items.length === 0 || !selectedTableId}
            style={styles.createButton}
          />

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
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 12 },
  tablesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tableChip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  tableChipSelected: {
    backgroundColor: '#DBEAFE',
    borderColor: '#007AFF',
  },
  tableChipText: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  tableChipTextSelected: { color: '#007AFF' },
  menuGrid: { gap: 8 },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  menuItemName: { fontSize: 15, fontWeight: '600', color: '#111827', flex: 1 },
  menuItemPrice: { fontSize: 15, fontWeight: '700', color: '#007AFF', marginLeft: 12 },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  cartItemInfo: { flex: 1, marginRight: 12 },
  cartItemName: { fontSize: 15, fontWeight: '600', color: '#111827', marginBottom: 2 },
  cartItemPrice: { fontSize: 13, color: '#6B7280' },
  quantityControls: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  quantityButton: {
    width: 32,
    height: 32,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: { fontSize: 18, fontWeight: '600', color: '#111827' },
  quantityText: { fontSize: 15, fontWeight: '600', color: '#111827', minWidth: 20, textAlign: 'center' },
  removeButton: {
    width: 32,
    height: 32,
    backgroundColor: '#FEE2E2',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  removeButtonText: { fontSize: 16, fontWeight: '600', color: '#EF4444' },
  notesInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#111827',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  totalLabel: { fontSize: 15, color: '#6B7280' },
  totalValue: { fontSize: 15, color: '#111827', fontWeight: '500' },
  totalLabelBold: { fontSize: 18, fontWeight: '700', color: '#111827' },
  totalValueBold: { fontSize: 18, fontWeight: '700', color: '#007AFF' },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 12 },
  createButton: { marginTop: 8 },
  emptyText: { fontSize: 14, color: '#9CA3AF', fontStyle: 'italic', textAlign: 'center', paddingVertical: 12 },
});
