import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  Platform,
  StatusBar,
  Alert
} from 'react-native';
import { useWaitlistStore } from '../stores/waitlistStore';
import { useAuthStore } from '../stores/authStore';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { differenceInMinutes } from 'date-fns';

export const WaitlistScreen = ({ navigation }: any) => {
  const user = useAuthStore((state) => state.user);
  const waitlist = useWaitlistStore((state) => state.waitlist);
  const loading = useWaitlistStore((state) => state.loading);
  const fetchWaitlist = useWaitlistStore((state) => state.fetchWaitlist);
  const removeFromWaitlist = useWaitlistStore((state) => state.removeFromWaitlist);

  const loadData = useCallback(() => {
    if (user?.restaurant_id) {
      fetchWaitlist(user.restaurant_id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.restaurant_id]);

  useEffect(() => {
    loadData();
    // Optionnel : Rafraîchir le temps d'attente chaque minute
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.restaurant_id]);

  const handleSeatClient = (item: any) => {
    // JARVIS: Redirection vers le plan de salle pour choisir une table
    Alert.alert(
      "Installer le client",
      `Voulez-vous installer ${item.name} ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Choisir une table",
          onPress: () => navigation.navigate('Floor', {
            mode: 'assign',
            waitlistId: item.id,
            partySize: item.party_size
          })
        }
      ]
    );
  };

  const renderWaitlistItem = ({ item }: { item: any }) => {
    // Calcul du temps d'attente
    const waitingSince = new Date(item.created_at);
    const waitTime = differenceInMinutes(new Date(), waitingSince);

    // Indicateur de couleur si l'attente est longue (> 15 min)
    const isUrgent = waitTime > 15;

    return (
      <View style={styles.cardWrapper}>
        <Card>
          <View style={styles.cardHeader}>
            <View style={styles.headerLeft}>
              <Text style={styles.clientName}>{item.name}</Text>
              <View style={styles.partyBadge}>
                <Text style={styles.partyText}>👥 {item.party_size} pers.</Text>
              </View>
            </View>
            <Badge
              label={`${waitTime} min`}
              color={isUrgent ? '#FEE2E2' : '#F3F4F6'}
              textColor={isUrgent ? '#DC2626' : '#4B5563'}
            />
          </View>

          <View style={styles.notesContainer}>
            {item.notes ? (
              <Text style={styles.notes}>📝 {item.notes}</Text>
            ) : (
              <Text style={styles.noNotes}>Aucune note particulière</Text>
            )}
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => {
                Alert.alert("Retirer", "Supprimer de la liste d'attente ?", [
                  { text: "Non", style: "cancel" },
                  { text: "Oui", style: "destructive", onPress: () => removeFromWaitlist(item.id) }
                ])
              }}
            >
              <Text style={styles.cancelButtonText}>Retirer</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.seatButton]}
              onPress={() => handleSeatClient(item)}
            >
              <Text style={styles.seatButtonText}>Installer à table</Text>
            </TouchableOpacity>
          </View>
        </Card>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.headerTopRow}>
            <Text style={styles.screenTitle}>Liste d'attente</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('AddToWaitlist')}
            >
              <Text style={styles.addButtonText}>+ Ajouter</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>
            {waitlist.length} groupe{waitlist.length > 1 ? 's' : ''} en attente
          </Text>
        </View>

        <FlatList
          data={waitlist}
          keyExtractor={(item) => item.id}
          renderItem={renderWaitlistItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={!!loading} onRefresh={loadData} />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>⏱️</Text>
              <Text style={styles.emptyTitle}>Liste vide</Text>
              <Text style={styles.emptySubtitle}>Il n'y a personne en attente pour le moment.</Text>
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
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 5, zIndex: 10,
  },
  headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  screenTitle: { fontSize: 28, fontWeight: '800', color: '#111827' },
  subtitle: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
  addButton: { backgroundColor: '#007AFF', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20 },
  addButtonText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  listContent: { padding: 20, paddingBottom: 100 },
  cardWrapper: { marginBottom: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  headerLeft: { gap: 4 },
  clientName: { fontSize: 18, fontWeight: '700', color: '#111827' },
  partyBadge: { backgroundColor: '#F3F4F6', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  partyText: { fontSize: 12, fontWeight: '600', color: '#4B5563' },
  notesContainer: { marginBottom: 16, backgroundColor: '#FFFBEB', padding: 8, borderRadius: 6 },
  notes: { fontSize: 14, color: '#92400E', fontStyle: 'italic' },
  noNotes: { fontSize: 13, color: '#9CA3AF', fontStyle: 'italic' },
  actionsRow: { flexDirection: 'row', gap: 12 },
  actionButton: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  seatButton: { backgroundColor: '#007AFF' },
  seatButtonText: { color: '#FFF', fontWeight: '600', fontSize: 14 },
  cancelButton: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB' },
  cancelButtonText: { color: '#EF4444', fontWeight: '600', fontSize: 14 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 16, opacity: 0.5 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#374151', marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: '#6B7280', textAlign: 'center' },
});
