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
import { useReservationStore } from '../stores/reservationStore';
import { ReservationCard } from '../components/reservations/ReservationCard';
import { format, addDays, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';

export const ReservationsScreen = ({ navigation }: any) => {
  const user = useAuthStore((state) => state.user);
  const reservations = useReservationStore((state) => state.reservations);
  const loading = useReservationStore((state) => state.loading);
  const fetchReservations = useReservationStore((state) => state.fetchReservations);

  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (user?.restaurantId) {
      loadReservations();
    }
  }, [user, selectedDate]);

  const loadReservations = () => {
    if (user?.restaurantId) {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      fetchReservations(user.restaurantId, dateStr);
    }
  };

  const previousDay = () => {
    setSelectedDate(subDays(selectedDate, 1));
  };

  const nextDay = () => {
    setSelectedDate(addDays(selectedDate, 1));
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.dateNav}>
          <TouchableOpacity onPress={previousDay} style={styles.navButton}>
            <Text style={styles.navButtonText}>←</Text>
          </TouchableOpacity>

          <View style={styles.dateDisplay}>
            <Text style={styles.dateText}>
              {format(selectedDate, 'EEEE d MMMM', { locale: fr })}
            </Text>
            {format(selectedDate, 'yyyy-MM-dd') !== format(new Date(), 'yyyy-MM-dd') && (
              <TouchableOpacity onPress={goToToday}>
                <Text style={styles.todayButton}>Aujourd'hui</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity onPress={nextDay} style={styles.navButton}>
            <Text style={styles.navButtonText}>→</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddReservation')}
        >
          <Text style={styles.addButtonText}>+ Nouvelle réservation</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={reservations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ReservationCard
            reservation={item}
            onPress={() => navigation.navigate('ReservationDetails', { id: item.id })}
          />
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadReservations} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Aucune réservation pour cette date</Text>
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
  dateNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  navButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  navButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
  },
  dateDisplay: {
    flex: 1,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    textTransform: 'capitalize',
  },
  todayButton: {
    fontSize: 13,
    color: '#007AFF',
    marginTop: 4,
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
