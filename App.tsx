import { NavigationContainer } from '@react-navigation/native';
import { BackHandler, Platform, StyleSheet, Text, View } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
import Home from './app/Home';
import Debt from './app/Debt';
import Income from './app/Income';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from './utils/colors';
import { useEffect, useState } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';

type IconName = 'home-outline' | 'cash-outline' | 'wallet-outline' | '';

const Tab = createBottomTabNavigator();

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const authenticate = async () => {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        setAuthenticated(true);
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Autentique-se para acessar o app',
        fallbackLabel: 'Usar senha do dispositivo',
        disableDeviceFallback: false,
      });

      if (result.success) {
        setAuthenticated(true);
      } else {
        BackHandler.exitApp();
      }
    };

    authenticate();
  }, []);

  useEffect(() => {
    NavigationBar.setVisibilityAsync('hidden');
  }, []);

  if (!authenticated) {
    return null;
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.white,
          tabBarStyle: {
            backgroundColor: colors.bg_primary,
            paddingVertical: 8,
            paddingHorizontal: 10,
            marginVertical: 10,
            borderTopWidth: 0,
            height: 70,
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            position: 'absolute',
            bottom: 10,
            left: 10,
            right: 10,
          },
          tabBarIcon: ({ color, size }) => {
            let iconName: IconName = '';

            if (route.name === 'Home') {
              iconName = 'home-outline';
            } else if (route.name === 'Debts') {
              iconName = 'cash-outline';
            } else if (route.name === 'Incomes') {
              iconName = 'wallet-outline';
            }

            if (iconName !== '') {
              return <Ionicons name={iconName} size={size} color={color} />;
            }
          },
        })}
      >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Debts" component={Debt} />
        <Tab.Screen name="Incomes" component={Income} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

