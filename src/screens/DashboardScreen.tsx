import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAuthStore } from '../stores/authStore';
import { useReservationStore } from '../stores/reservationStore';
import { useWaitlistStore } from '../stores/waitlistStore';
import { useOrderStore } from '../stores/orderStore';
import { Card } from '../components/common/Card';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const DashboardScreen = ({ navigation }: any) => {
  const user = useAuthStore((state) => state.user);
  const reservations = useReservationStore((state) => state.reservations);
  const waitlist = useWaitlistStore((state) => state.waitlist);
  const orders = useOrderStore((state) => state.orders);

  const fetchReservations = useReservationStore((state) => state.fetchReservations);
  const fetchWaitlist = useWaitlistStore((state) => state.fetchWaitlist);
  const fetchOrders = useOrderStore((state) => state.fetchOrders);

  useEffect(() => {
    if (user?.restaurantId) {
      const today = format(new Date(), 'yyyy-MM-dd');
      fetchReservations(user.restaurantId, today);
      fetchWaitlist(user.restaurantId);
      fetchOrders(user.restaurantId);
    }
  }, [user]);

  const todayReservations = reservations.filter(
    (r) => r.date === format(new Date(), 'yyyy-MM-dd')
  );

  const activeOrders = orders.filter(
    (o) => o.status !== 'paid' && o.status !== 'served'
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tableau de bord</Text>
        <Text style={styles.date}>
          {format(new Date(), "EEEE d MMMM yyyy", { locale: fr })}
        </Text>
      </View>

      <View style={styles.stats}>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{todayReservations.length}</Text>
          <Text style={styles.statLabel}>Réservations</Text>
          <Text style={styles.statSubtext}>aujourd'hui</Text>
        </Card>

        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{waitlist.length}</Text>
          <Text style={styles.statLabel}>Liste d'attente</Text>
          <Text style={styles.statSubtext}>en cours</Text>
        </Card>

        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{activeOrders.length}</Text>
          <Text style={styles.statLabel}>Commandes</Text>
          <Text style={styles.statSubtext}>actives</Text>
        </Card>
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Actions rapides</Text>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Reservations')}
        >
          <Text style={styles.actionIcon}>📅</Text>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Réservations</Text>
            <Text style={styles.actionDescription}>Gérer les réservations</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Clients')}
        >
          <Text style={styles.actionIcon}>👥</Text>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Clients</Text>
            <Text style={styles.actionDescription}>Liste des clients</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Orders')}
        >
          <Text style={styles.actionIcon}>🍽️</Text>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Commandes</Text>
            <Text style={styles.actionDescription}>Prendre une commande</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Floor')}
        >
          <Text style={styles.actionIcon}>🏢</Text>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Plan de salle</Text>
            <Text style={styles.actionDescription}>Organiser les tables</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  stats: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 4,
  },
  statSubtext: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  quickActions: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 13,
    color: '#6B7280',
  },
});
