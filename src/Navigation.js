import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View, Text } from 'react-native';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { IncidentProvider } from './contexts/IncidentContext';
import { initDatabase } from './services/database';
import logger from './utils/logger';

import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import NewIncidentScreen from './screens/NewIncidentScreen';
import IncidentDetailScreen from './screens/IncidentDetailScreen';
import SignatureScreen from './screens/SignatureScreen';
import ExportScreen from './screens/ExportScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#C41E3A',
        tabBarInactiveTintColor: '#666',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Ocorrências',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🏠</Text>,
        }}
      />
      <Tab.Screen
        name="ExportTab"
        component={ExportScreen}
        options={{
          tabBarLabel: 'Exportar',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>📊</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#C41E3A" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#C41E3A' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      {!isAuthenticated ? (
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          <Stack.Screen
            name="Home"
            component={HomeTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="NewIncident"
            component={NewIncidentScreen}
            options={{ title: 'Nova Ocorrência' }}
          />
          <Stack.Screen
            name="IncidentDetail"
            component={IncidentDetailScreen}
            options={{ title: 'Detalhes da Ocorrência' }}
          />
          <Stack.Screen
            name="Signature"
            component={SignatureScreen}
            options={{ title: 'Assinatura Digital' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function Navigation() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    const initDB = async () => {
      try {
        await initDatabase();
        setDbReady(true);
      } catch (error) {
        logger.error('Failed to initialize database:', error);
      }
    };

    initDB();
  }, []);

  if (!dbReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#C41E3A' }}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={{ color: '#fff', marginTop: 16 }}>Inicializando aplicativo...</Text>
      </View>
    );
  }

  return (
    <AuthProvider>
      <IncidentProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </IncidentProvider>
    </AuthProvider>
  );
}
