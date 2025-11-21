import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Client } from '../../types';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
// JARVIS: Assurez-vous d'importer votre composant Badge existant
import { Badge } from '../common/Badge';

interface ClientEditFormProps {
  client: Client;
  onSave: (client: Client) => void;
  onCancel: () => void;
}

// JARVIS: Logique de statut centralisée (similaire à ClientCard)
const getClientStatusConfig = (amount: number) => {
  if (amount > 500) return { label: '👑 VIP', color: '#FFFBEB', textColor: '#B45309', borderColor: '#FCD34D' };
  if (amount > 100) return { label: '🌟 Fidèle', color: '#ECFDF5', textColor: '#059669', borderColor: '#6EE7B7' };
  return { label: '👤 Standard', color: '#F3F4F6', textColor: '#4B5563', borderColor: '#E5E7EB' };
};

export const ClientEditForm: React.FC<ClientEditFormProps> = ({ client, onSave, onCancel }) => {
  const [first_name, setFirstName] = useState(client.first_name);
  const [last_name, setLastName] = useState(client.last_name);
  const [email, setEmail] = useState(client.email || '');
  const [phone, setPhone] = useState(client.phone);

  // JARVIS: Calcul des données en lecture seule
  const totalSpent = Number(client.total_spent || 0);
  const statusConfig = getClientStatusConfig(totalSpent);

  const handleSave = () => {
    onSave({
      ...client,
      first_name,
      last_name,
      email,
      phone,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fiche Client</Text>

      {/* JARVIS: Zone de statistiques (Read-Only) */}
      <View style={styles.statsContainer}>
        {/* Bloc Montant */}
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Total Dépensé</Text>
          <Text style={styles.statValue}>{totalSpent.toFixed(2)} €</Text>
        </View>

        {/* Separateur vertical */}
        <View style={styles.divider} />

        {/* Bloc Statut */}
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Statut Actuel</Text>
          <View style={styles.badgeWrapper}>
            <Badge
              label={statusConfig.label}
              color={statusConfig.color}
              textColor={statusConfig.textColor}
              size="medium"
            />
          </View>
        </View>
      </View>

      <Text style={styles.sectionHeader}>Coordonnées</Text>

      <View style={styles.formContent}>
        <Input
          label="Prénom"
          value={first_name}
          onChangeText={setFirstName}
          placeholder="Ex: Jean"
        />
        <Input
          label="Nom"
          value={last_name}
          onChangeText={setLastName}
          placeholder="Ex: Dupont"
        />
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="jean.dupont@email.com"
          keyboardType="email-address"

        />
        <Input
          label="Téléphone"
          value={phone}
          onChangeText={setPhone}
          placeholder="06 12 34 56 78"
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.buttons}>
        <Button title="Annuler" onPress={onCancel} variant="secondary"/>
        <Button title="Enregistrer" onPress={handleSave} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 24,
    // JARVIS: Pas de padding ici pour laisser le header respirer, on gère le padding par section
    paddingBottom: 24,
    width: '100%',
    overflow: 'hidden', // Pour que le borderRadius s'applique aux enfants
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    paddingVertical: 20,
    color: '#111827',
    backgroundColor: '#F9FAFB', // Fond gris très léger pour le titre
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#FFF',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    color: '#9CA3AF',
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  badgeWrapper: {
    // Wrapper pour centrer le badge si nécessaire
  },
  divider: {
    width: 1,
    height: '60%',
    backgroundColor: '#E5E7EB',
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 24,
    marginTop: 20,
    marginBottom: 10,
  },
  formContent: {
    paddingHorizontal: 24,
    gap: 8, // Espacement entre les inputs
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginTop: 24,
  },
  buttonSpacing: {
    flex: 0.48, // Pour que les boutons prennent chacun environ la moitié de la largeur
  }
});
