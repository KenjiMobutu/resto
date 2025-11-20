import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Reservation, ReservationStatus } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ReservationCardProps {
  reservation: Reservation;
  onPress: () => void;
}

const STATUS_COLORS: Record<ReservationStatus, string> = {
  [ReservationStatus.PENDING]: '#F59E0B',
  [ReservationStatus.CONFIRMED]: '#3B82F6',
  [ReservationStatus.SEATED]: '#10B981',
  [ReservationStatus.COMPLETED]: '#6B7280',
  [ReservationStatus.CANCELLED]: '#EF4444',
  [ReservationStatus.NO_SHOW]: '#DC2626',
};

const STATUS_LABELS: Record<ReservationStatus, string> = {
  [ReservationStatus.PENDING]: 'En attente',
  [ReservationStatus.CONFIRMED]: 'Confirmée',
  [ReservationStatus.SEATED]: 'Installée',
  [ReservationStatus.COMPLETED]: 'Terminée',
  [ReservationStatus.CANCELLED]: 'Annulée',
  [ReservationStatus.NO_SHOW]: 'Absent',
};

export const ReservationCard: React.FC<ReservationCardProps> = ({
  reservation,
  onPress,
}) => {
  const clientName = reservation.client
    ? `${reservation.client.firstName} ${reservation.client.lastName}`
    : 'Client inconnu';

  return (
    <Card onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.name}>{clientName}</Text>
        <Badge
          label={STATUS_LABELS[reservation.status]}
          color={STATUS_COLORS[reservation.status]}
        />
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Heure:</Text>
          <Text style={styles.detailValue}>{reservation.time}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Couverts:</Text>
          <Text style={styles.detailValue}>{reservation.partySize}</Text>
        </View>

        {reservation.table && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Table:</Text>
            <Text style={styles.detailValue}>{reservation.table.number}</Text>
          </View>
        )}
      </View>

      {reservation.specialRequests && (
        <View style={styles.notes}>
          <Text style={styles.notesLabel}>Demandes spéciales:</Text>
          <Text style={styles.notesText}>{reservation.specialRequests}</Text>
        </View>
      )}

      {reservation.client?.allergies && reservation.client.allergies.length > 0 && (
        <View style={styles.allergies}>
          <Text style={styles.allergiesLabel}>Allergies:</Text>
          <View style={styles.tags}>
            {reservation.client.allergies.map((allergy, index) => (
              <Badge
                key={index}
                label={allergy}
                color="#FEE2E2"
                textColor="#DC2626"
                size="small"
              />
            ))}
          </View>
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
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  details: {
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  notes: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 13,
    color: '#374151',
  },
  allergies: {
    marginTop: 8,
  },
  allergiesLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#DC2626',
    marginBottom: 4,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
});
