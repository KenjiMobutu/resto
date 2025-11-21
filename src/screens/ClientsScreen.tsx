import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  Modal,
} from 'react-native';
import { useAuthStore } from '../stores/authStore';
import { useClientStore } from '../stores/clientStore';
import { ClientCard } from '../components/clients/ClientCard';
import { ClientEditForm } from '../components/clients/ClientEditForm';
import { Client } from '../types';
// JARVIS: Si vous utilisez zustand v4+, l'importation de useShallow est recommandée pour les sélecteurs d'objets
import { useShallow } from 'zustand/react/shallow';

export const ClientsScreen = ({ navigation }: any) => {
  // JARVIS: Sélecteurs atomiques ou utilisation de useShallow pour éviter que
  // le composant ne se re-rende à chaque fois que le store change (ce qui brisait la boucle).
  const user = useAuthStore((state) => state.user);

  const { clients, loading, fetchClients, searchClients, updateClient } = useClientStore(
    useShallow((state) => ({
      clients: state.clients,
      loading: state.loading,
      fetchClients: state.fetchClients,
      searchClients: state.searchClients,
      updateClient: state.updateClient,
    }))
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // JARVIS: Utilisation de useCallback obligatoire ici.
  // Cela garantit que la référence de la fonction ne change pas entre les rendus,
  // empêchant le déclenchement intempestif des useEffects.
  const loadClients = useCallback(() => {
    // JARVIS: Vérification de sécurité sur restaurantId
    const restaurantId = user?.restaurant_id;

    if (restaurantId) {
      if (searchQuery.trim()) {
        searchClients(restaurantId, searchQuery);
      } else {
        fetchClients(restaurantId);
      }
    }
  }, [user?.restaurant_id, searchQuery, searchClients, fetchClients]);

  // JARVIS: Fusion et simplification des effets.
  // Utilisation de la primitive `user.restaurantId` dans le tableau de dépendances
  // au lieu de l'objet `user` complet pour éviter les boucles si l'objet `user` est recréé ailleurs.
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadClients();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [loadClients]); // loadClients est maintenant stable grâce au useCallback

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setModalVisible(true);
  };

  const handleSaveClient = async (updatedClient: Client) => {
    if (selectedClient) {
      await updateClient(selectedClient.id, updatedClient);
      setModalVisible(false);
      setSelectedClient(null);
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
    setSelectedClient(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Rechercher un client..."
          placeholderTextColor="#9CA3AF"
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddClient')}
        >
          <Text style={styles.addButtonText}>+ Nouveau client</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={clients}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ClientCard
            client={item}
            onPress={() => handleEditClient(item)}
          />
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={!!loading} onRefresh={loadClients} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              {searchQuery ? 'Aucun client trouvé' : 'Aucun client enregistré'}
            </Text>
          </View>
        }
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={handleCancel}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedClient && (
              <ClientEditForm
                client={selectedClient}
                onSave={handleSaveClient}
                onCancel={handleCancel}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
    // ... (Vos styles restent inchangés)
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
  searchInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#FFF',
    marginBottom: 12,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
});
