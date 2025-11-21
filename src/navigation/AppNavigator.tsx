import React, { useEffect } from "react";
import { Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useAuthStore } from "../stores/authStore";

import { LoginScreen } from "../screens/LoginScreen";
import { DashboardScreen } from "../screens/DashboardScreen";
import { ReservationsScreen } from "../screens/ReservationsScreen";
import { ClientsScreen } from "../screens/ClientsScreen";
import { OrdersScreen } from "../screens/OrdersScreen";
import { FloorScreen } from "../screens/FloorScreen";
import { WaitlistScreen } from "../screens/WaitlistScreen";
import { OrderDetailsScreen } from "../screens/OrderDetailsScreen";
import { CreateOrderScreen } from "../screens/CreateOrderScreen";
import { AddToWaitlistScreen } from "../screens/AddToWaitlistScreen";
import { AddTableScreen } from "../screens/AddTableScreen";
import { AddElementScreen } from "../screens/AddElementScreen";
import { TableDetailsScreen } from "../screens/TableDetailsScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#6B7280",
        tabBarStyle: {
          backgroundColor: "#FFF",
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        headerStyle: {
          backgroundColor: "#FFF",
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: "#E5E7EB",
        },
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: "700",
          color: "#111827",
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: "Tableau de bord",
          tabBarLabel: "Accueil",
          tabBarIcon: ({ color }) => <TabIcon icon="🏠" color={color} />,
        }}
      />
      <Tab.Screen
        name="Reservations"
        component={ReservationsScreen}
        options={{
          title: "Réservations",
          tabBarIcon: ({ color }) => <TabIcon icon="📅" color={color} />,
        }}
      />
      <Tab.Screen
        name="Clients"
        component={ClientsScreen}
        options={{
          title: "Clients",
          tabBarIcon: ({ color }) => <TabIcon icon="👥" color={color} />,
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{
          title: "Commandes",
          tabBarIcon: ({ color }) => <TabIcon icon="🍽️" color={color} />,
        }}
      />
      <Tab.Screen
        name="Floor"
        component={FloorScreen}
        options={{
          title: "Plan de salle",
          tabBarLabel: "Salle",
          tabBarIcon: ({ color }) => <TabIcon icon="🏢" color={color} />,
        }}
      />
      <Tab.Screen
        name="Waitlist"
        component={WaitlistScreen}
        options={{
          title: "Liste d'attente",
          tabBarLabel: "Attente",
          tabBarIcon: ({ color }) => <TabIcon icon="⏱️" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

const TabIcon = ({ icon, color }: { icon: string; color: string }) => {
  return <Text style={{ fontSize: 24, color }}>{icon}</Text>;
};

export const AppNavigator = () => {
  const user = useAuthStore((state) => state.user);
  const loadingFromStore = useAuthStore((state) => state.loading);
  const loadUser = useAuthStore((state) => state.loadUser);

  // Force loading to ALWAYS be a boolean
  const loading = Boolean(loadingFromStore);

  console.log('🔍 [AppNavigator] loading type:', typeof loadingFromStore, 'value:', loadingFromStore);
  console.log('🔍 [AppNavigator] loading converted:', typeof loading, 'value:', loading);

  useEffect(() => {
    loadUser();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false as boolean,
        }}
      >
        {!user ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen
              name="OrderDetails"
              component={OrderDetailsScreen}
              options={{ presentation: 'card' }}
            />
            <Stack.Screen
              name="CreateOrder"
              component={CreateOrderScreen}
              options={{ presentation: 'card' }}
            />
            <Stack.Screen
              name="AddToWaitlist"
              component={AddToWaitlistScreen}
              options={{ presentation: 'card' }}
            />
            <Stack.Screen
              name="AddTable"
              component={AddTableScreen}
              options={{ presentation: 'card' }}
            />
            <Stack.Screen
              name="AddElement"
              component={AddElementScreen}
              options={{ presentation: 'card' }}
            />
            <Stack.Screen
              name="TableDetails"
              component={TableDetailsScreen}
              options={{ presentation: 'card' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
