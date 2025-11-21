import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Reservation, ReservationStatus } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { useClientStore } from '../../stores/clientStore';

interface ReservationCardProps {
  reservation: Reservation;
  onPress: () => void;
  onClientPress: (clientId: string) => void; // JARVIS: Nouvelle prop pour la navigation
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

// JARVIS: Logique VIP réutilisée pour la cohérence
const isVip = (totalSpent: number = 0) => totalSpent > 500;

export const ReservationCard: React.FC<ReservationCardProps> = ({
  reservation,
  onPress,
  onClientPress,
}) => {
  const clients = useClientStore((state) => state.clients);

  // JARVIS: Récupération optimisée du client complet pour avoir accès au total_spent
  const clientData = useMemo(() => {
    // 1. Chercher dans le store (source de vérité)
    const found = clients.find(c => c.id === reservation.client_id);
    if (found) return found;

    // 2. Fallback sur les données imbriquées si disponibles
    return reservation.client;
  }, [clients, reservation.client_id, reservation.client]);

  const clientName = clientData
    ? `${clientData.first_name} ${clientData.last_name}`
    : 'Client Inconnu';

  // Vérification du statut VIP
  const isClientVip = clientData ? isVip(Number(clientData.total_spent || 0)) : false;

  return (
    <Card onPress={onPress}>
      <View style={styles.header}>

        {/* JARVIS: Zone cliquable pour le profil client */}
        <TouchableOpacity
          style={styles.clientInfoContainer}
          onPress={() => clientData && onClientPress(clientData.id)}
          disabled={!clientData} // Désactivé si pas de client
        >
          <Text style={styles.name}>
            {clientName}
          </Text>

          {/* Indicateur VIP */}
          {isClientVip && (
            <View style={styles.vipBadge}>
              <Text style={styles.vipText}>👑 VIP</Text>
            </View>
          )}
        </TouchableOpacity>

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
          <Text style={styles.detailValue}>{reservation.party_size} pers.</Text>
        </View>

        {reservation.table && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Table:</Text>
            <Text style={styles.detailValue}>{reservation.table.number}</Text>
          </View>
        )}
      </View>

      {/* Affichage des allergies en rouge pour alerter le serveur */}
      {clientData?.allergies && clientData.allergies.length > 0 && (
        <View style={styles.allergiesContainer}>
          <Text style={styles.allergiesLabel}>⚠️ Allergies:</Text>
          <Text style={styles.allergiesText}>{clientData.allergies.join(', ')}</Text>
        </View>
      )}

      {/* ... reste du code (Notes, etc.) ... */}
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  clientInfoContainer: {
    flex: 1,
    flexDirection: 'row', // Alignement Nom + Badge VIP
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#007AFF', // Bleu pour indiquer que c'est cliquable (convention UI)
    marginRight: 8,
  },
  vipBadge: {
    backgroundColor: '#FFFBEB', // Amber-50
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#FCD34D', // Amber-300
  },
  vipText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#B45309', // Amber-700
  },
  details: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
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
  allergiesContainer: {
    backgroundColor: '#FEF2F2', // Rouge très pâle
    padding: 8,
    borderRadius: 6,
    marginTop: 4,
  },
  allergiesLabel: {
    color: '#DC2626',
    fontWeight: '700',
    fontSize: 12,
    marginBottom: 2,
  },
  allergiesText: {
    color: '#991B1B',
    fontSize: 13,
  },
});
