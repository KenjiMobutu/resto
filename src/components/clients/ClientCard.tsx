import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Client } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

interface ClientCardProps {
  client: Client;
  onPress: () => void;
}

export const ClientCard: React.FC<ClientCardProps> = ({ client, onPress }) => {
  return (
    <Card onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.name}>
          {client.firstName} {client.lastName}
        </Text>
        <Text style={styles.visits}>{client.visitCount} visites</Text>
      </View>

      <View style={styles.contact}>
        <Text style={styles.contactText}>{client.phone}</Text>
        {client.email && <Text style={styles.contactText}>{client.email}</Text>}
      </View>

      {client.tags && client.tags.length > 0 && (
        <View style={styles.tags}>
          {client.tags.map((tag, index) => (
            <Badge key={index} label={tag} color="#E0E7FF" textColor="#4338CA" size="small" />
          ))}
        </View>
      )}

      {client.allergies && client.allergies.length > 0 && (
        <View style={styles.allergies}>
          <Text style={styles.allergiesLabel}>Allergies:</Text>
          <View style={styles.tags}>
            {client.allergies.map((allergy, index) => (
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
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  visits: {
    fontSize: 13,
    fontWeight: '600',
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
    gap: 4,
    marginTop: 8,
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
  notes: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
  },
  notesText: {
    fontSize: 13,
    color: '#374151',
    fontStyle: 'italic',
  },
});
