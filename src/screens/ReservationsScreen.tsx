import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useAuthStore } from "../stores/authStore";
import { useReservationStore } from "../stores/reservationStore";
import { ReservationCard } from "../components/reservations/ReservationCard";
import { format, addDays, subDays } from "date-fns";
import { fr } from "date-fns/locale/fr";
import { Client } from "../types";
import { Modal } from "react-native";
import { ClientEditForm } from "../components/clients/ClientEditForm";
import { useClientStore } from "../stores/clientStore";
import { useShallow } from "zustand/react/shallow";

export const ReservationsScreen = ({ navigation }: any) => {
  const user = useAuthStore((state) => state.user);
  const reservations = useReservationStore((state) => state.reservations);
  const loading = useReservationStore((state) => state.loading);
  const fetchReservations = useReservationStore(
    (state) => state.fetchReservations
  );
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (user?.restaurant_id) {
      loadReservations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.restaurant_id, selectedDate]);

  const loadReservations = () => {
    if (user?.restaurant_id) {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      fetchReservations(user.restaurant_id, dateStr);
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

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setModalVisible(true);
  };
  const { updateClient } = useClientStore(
    useShallow((state) => ({
      updateClient: state.updateClient,
    }))
  );

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

  // JARVIS: Fonction pour gérer le clic sur le client
  const handleClientPress = (clientId: string) => {
    // Option A: Si vous avez un écran de détail dédié
    navigation.navigate("ClientEditForm", { clientId });

    // Option B (Plus simple pour l'instant): Naviguer vers la liste et filtrer/ouvrir
    // Note: Cela dépend de la configuration de votre routeur (React Navigation)
    // Vous pourriez avoir besoin de passer params: { screen: 'Clients', params: { highlightClientId: clientId } }
    console.log("Navigation vers le client :", clientId);
    //navigation.navigate('Clients', { screen: 'ClientsScreen', params: { searchQuery: clientId } });
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
              {format(selectedDate, "EEEE d MMMM", { locale: fr })}
            </Text>
            {format(selectedDate, "yyyy-MM-dd") !==
              format(new Date(), "yyyy-MM-dd") && (
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
          onPress={() => navigation.navigate("AddReservation")}
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
            onClientPress={() => handleEditClient(item.client!)}
            onPress={() =>
              navigation.navigate("ReservationDetails", { id: item.id })
            }
          />
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={!!loading} onRefresh={loadReservations} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              Aucune réservation pour cette date
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
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    backgroundColor: "#FFF",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  dateNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  navButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  navButtonText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#374151",
  },
  dateDisplay: {
    flex: 1,
    alignItems: "center",
  },
  dateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    textTransform: "capitalize",
  },
  todayButton: {
    fontSize: 13,
    color: "#007AFF",
    marginTop: 4,
  },
  addButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  list: {
    padding: 16,
    gap: 12,
  },
  empty: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
});
