import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  TextInput,
} from 'react-native';
import { useAuthStore } from '../stores/authStore';
import { useClientStore } from '../stores/clientStore';
import { ClientCard } from '../components/clients/ClientCard';

export const ClientsScreen = ({ navigation }: any) => {
  const user = useAuthStore((state) => state.user);
  const clients = useClientStore((state) => state.clients);
  const loading = useClientStore((state) => state.loading);
  const fetchClients = useClientStore((state) => state.fetchClients);
  const searchClients = useClientStore((state) => state.searchClients);

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user?.restaurantId) {
      loadClients();
    }
  }, [user]);

  const loadClients = () => {
    if (user?.restaurantId) {
      if (searchQuery.trim()) {
        searchClients(user.restaurantId, searchQuery);
      } else {
        fetchClients(user.restaurantId);
      }
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadClients();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

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
            onPress={() => navigation.navigate('ClientDetails', { id: item.id })}
          />
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadClients} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              {searchQuery ? 'Aucun client trouvé' : 'Aucun client enregistré'}
            </Text>
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
});
