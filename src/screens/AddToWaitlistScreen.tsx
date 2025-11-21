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
  Alert
} from 'react-native';
import { useWaitlistStore } from '../stores/waitlistStore';
import { useAuthStore } from '../stores/authStore';
import { useClientStore } from '../stores/clientStore';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { WaitlistStatus } from '../types';

export const AddToWaitlistScreen = ({ navigation }: any) => {
  const user = useAuthStore((state) => state.user);
  const addToWaitlist = useWaitlistStore((state) => state.addToWaitlist);
  const clients = useClientStore((state) => state.clients);
  const createClient = useClientStore((state) => state.createClient);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [partySize, setPartySize] = useState('2');
  const [notes, setNotes] = useState('');
  const [estimatedWait, setEstimatedWait] = useState('15');
  const [loading, setLoading] = useState(false);
  const [useExistingClient, setUseExistingClient] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState('');

  const handleAdd = async () => {
    if (!name.trim() && !selectedClientId) {
      Alert.alert('Erreur', 'Veuillez entrer un nom');
      return;
    }

    if (!phone.trim() && !selectedClientId) {
      Alert.alert('Erreur', 'Veuillez entrer un numéro de téléphone');
      return;
    }

    const partySizeNum = parseInt(partySize);
    if (isNaN(partySizeNum) || partySizeNum < 1) {
      Alert.alert('Erreur', 'Veuillez entrer un nombre de personnes valide');
      return;
    }

    if (!user?.restaurant_id) {
      Alert.alert('Erreur', 'Restaurant non identifié');
      return;
    }

    setLoading(true);

    let clientId = selectedClientId;

    // Si pas de client existant sélectionné, créer un nouveau client
    if (!clientId && !useExistingClient) {
      const { error, data } = await createClient({
        restaurantId: user.restaurant_id,
        first_name: name.split(' ')[0],
        last_name: name.split(' ').slice(1).join(' ') || '',
        phone: phone,
        tags: [],
        allergies: [],
        dietaryRestrictions: [],
        preferences: [],
        visit_count: 0,
        total_spent: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      if (error) {
        Alert.alert('Erreur', 'Impossible de créer le client');
        setLoading(false);
        return;
      }

      clientId = data?.id || '';
    }

    const { error } = await addToWaitlist({
      restaurant_id: user.restaurant_id,
      clientId: clientId,
      party_size: partySizeNum,
      status: 'waiting' as WaitlistStatus,
      estimatedWaitTime: parseInt(estimatedWait) || 15,
      notes: notes.trim() || undefined,
      joined_at: new Date().toISOString()
    });

    setLoading(false);

    if (error) {
      Alert.alert('Erreur', 'Impossible d\'ajouter à la liste d\'attente');
      console.error('Add to waitlist error:', error);
    } else {
      Alert.alert('Succès', 'Client ajouté à la liste d\'attente', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    }
  };

  const partySizeOptions = [1, 2, 3, 4, 5, 6, 7, 8];
  const waitTimeOptions = [5, 10, 15, 20, 30, 45, 60];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Annuler</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Ajouter à la liste</Text>
          <View style={{ width: 70 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Client existant ou nouveau */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Client</Text>
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[styles.toggleButton, !useExistingClient && styles.toggleButtonActive]}
                onPress={() => setUseExistingClient(false)}
              >
                <Text style={[styles.toggleText, !useExistingClient && styles.toggleTextActive]}>
                  Nouveau
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleButton, useExistingClient && styles.toggleButtonActive]}
                onPress={() => setUseExistingClient(true)}
              >
                <Text style={[styles.toggleText, useExistingClient && styles.toggleTextActive]}>
                  Existant
                </Text>
              </TouchableOpacity>
            </View>

            {!useExistingClient ? (
              <>
                <Input
                  label="Nom complet"
                  value={name}
                  onChangeText={setName}
                  placeholder="Jean Dupont"
                />
                <Input
                  label="Téléphone"
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="+33 6 12 34 56 78"
                  keyboardType="phone-pad"
                />
              </>
            ) : (
              <View style={styles.clientsList}>
                {clients.map(client => (
                  <TouchableOpacity
                    key={client.id}
                    style={[
                      styles.clientChip,
                      selectedClientId === client.id && styles.clientChipSelected
                    ]}
                    onPress={() => setSelectedClientId(client.id)}
                  >
                    <Text style={[
                      styles.clientChipText,
                      selectedClientId === client.id && styles.clientChipTextSelected
                    ]}>
                      {client.first_name} {client.last_name}
                    </Text>
                    <Text style={styles.clientChipPhone}>{client.phone}</Text>
                  </TouchableOpacity>
                ))}
                {clients.length === 0 && (
                  <Text style={styles.emptyText}>Aucun client enregistré</Text>
                )}
              </View>
            )}
          </Card>

          {/* Nombre de personnes */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Nombre de personnes</Text>
            <View style={styles.optionsGrid}>
              {partySizeOptions.map(size => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.optionChip,
                    partySize === size.toString() && styles.optionChipSelected
                  ]}
                  onPress={() => setPartySize(size.toString())}
                >
                  <Text style={[
                    styles.optionChipText,
                    partySize === size.toString() && styles.optionChipTextSelected
                  ]}>
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Input
              label="Autre nombre"
              value={partySize}
              onChangeText={setPartySize}
              keyboardType="number-pad"
              placeholder="2"
            />
          </Card>

          {/* Temps d'attente estimé */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Temps d'attente estimé (min)</Text>
            <View style={styles.optionsGrid}>
              {waitTimeOptions.map(time => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.optionChip,
                    estimatedWait === time.toString() && styles.optionChipSelected
                  ]}
                  onPress={() => setEstimatedWait(time.toString())}
                >
                  <Text style={[
                    styles.optionChipText,
                    estimatedWait === time.toString() && styles.optionChipTextSelected
                  ]}>
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>

          {/* Notes */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Notes (optionnel)</Text>
            <Input
              value={notes}
              onChangeText={setNotes}
              placeholder="Remarques particulières..."
              multiline
              numberOfLines={3}
            />
          </Card>

          <Button
            title="Ajouter à la liste d'attente"
            onPress={handleAdd}
            disabled={loading}
            style={styles.addButton}
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
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleText: { fontSize: 15, fontWeight: '600', color: '#6B7280' },
  toggleTextActive: { color: '#007AFF' },
  clientsList: { gap: 8 },
  clientChip: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  clientChipSelected: {
    backgroundColor: '#DBEAFE',
    borderColor: '#007AFF',
  },
  clientChipText: { fontSize: 15, fontWeight: '600', color: '#111827', marginBottom: 2 },
  clientChipTextSelected: { color: '#007AFF' },
  clientChipPhone: { fontSize: 13, color: '#6B7280' },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  optionChip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 60,
    alignItems: 'center',
  },
  optionChipSelected: {
    backgroundColor: '#DBEAFE',
    borderColor: '#007AFF',
  },
  optionChipText: { fontSize: 15, fontWeight: '600', color: '#6B7280' },
  optionChipTextSelected: { color: '#007AFF' },
  addButton: { marginTop: 8 },
  emptyText: { fontSize: 14, color: '#9CA3AF', fontStyle: 'italic', textAlign: 'center', paddingVertical: 12 },
});
