import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Client } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

interface ClientCardProps {
  client: Client;
  onPress: () => void;
}

// JARVIS: Fonction utilitaire pour déterminer le style du badge selon le montant
const getSpendingBadgeStyle = (amount: number = 0) => {
  if (amount > 500) {
    return {
      color: '#FFFBEB', // Amber-50 (Or très clair)
      textColor: '#B45309', // Amber-700 (Or foncé)
      labelSuffix: '👑' // Optionnel : un petit indicateur visuel
    };
  } else if (amount > 100) {
    return {
      color: '#ECFDF5', // Emerald-50
      textColor: '#059669', // Emerald-600
      labelSuffix: ''
    };
  } else {
    return {
      color: '#F3F4F6', // Gray-100
      textColor: '#4B5563', // Gray-600
      labelSuffix: ''
    };
  }
};

export const ClientCard: React.FC<ClientCardProps> = ({ client, onPress }) => {
  // Conversion sécurisée
  const totalSpent = Number(client.total_spent || 0);

  // Calcul du style
  const badgeStyle = getSpendingBadgeStyle(totalSpent);

  // Formatage du texte
  const formattedLabel = `${totalSpent.toFixed(2)} € ${badgeStyle.labelSuffix}`;

  return (
    <Card onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <Text style={styles.name}>
            {client.first_name} {client.last_name}
          </Text>
          <Text style={styles.visits}>{client.visit_count} visites</Text>
        </View>

        {/* JARVIS: Badge avec couleurs dynamiques */}
        <Badge
          label={formattedLabel}
          color={badgeStyle.color}
          textColor={badgeStyle.textColor}
          size="small"
        />
      </View>

      <View style={styles.contact}>
        <Text style={styles.contactText}>{client.phone}</Text>
        {client.email && <Text style={styles.contactText}>{client.email}</Text>}
      </View>

      {client.tags && client.tags.length > 0 && (
        <View style={styles.tags}>
          {client.tags.map((tag, index) => (
            <Badge
              key={`tag-${index}`}
              label={tag}
              color="#E0E7FF"
              textColor="#4338CA"
              size="small"
            />
          ))}
        </View>
      )}

      {client.allergies && client.allergies.length > 0 && (
        <View style={styles.allergies}>
          <Text style={styles.allergiesLabel}>Allergies:</Text>
          <View style={styles.tags}>
            {client.allergies.map((allergy, index) => (
              <Badge
                key={`allergy-${index}`}
                label={allergy}
                color="#FEE2E2"
                textColor="#DC2626"
                size="small"
              />
            ))}
          </View>
        </View>
      )}

      {client.notes && (
        <View style={styles.notes}>
          <Text style={styles.notesText}>{client.notes}</Text>
        </View>
      )}
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
  headerInfo: {
    flex: 1,
    marginRight: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  visits: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  contact: {
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  allergies: {
    marginTop: 10,
  },
  allergiesLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#DC2626',
    marginBottom: 6,
  },
  notes: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  notesText: {
    fontSize: 13,
    color: '#4B5563',
    fontStyle: 'italic',
  },
});
