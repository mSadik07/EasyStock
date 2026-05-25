import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View } from 'react-native';

import { useAuth } from '../context/AuthContext';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import ProductListScreen from '../screens/ProductListScreen';
import AddProductScreen from '../screens/AddProductScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import SaleScreen from '../screens/SaleScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import SalesHistoryScreen from '../screens/SalesHistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#2196F3' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' }
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: '📦 EasyStock', headerShown: false }} />
      <Stack.Screen name="ProductList" component={ProductListScreen} options={{ title: 'Ürün Listesi' }} />
      <Stack.Screen name="AddProduct" component={AddProductScreen} options={{ title: 'Yeni Ürün' }} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: 'Ürün Detayı' }} />
      <Stack.Screen name="Sale" component={SaleScreen} options={{ title: 'Satış Yap' }} />
      <Stack.Screen name="Analytics" component={AnalyticsScreen} options={{ title: 'Analizler' }} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Bildirimler' }} />
      <Stack.Screen name="SalesHistory" component={SalesHistoryScreen} options={{ title: 'Satış Geçmişi' }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profilim' }} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {token ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}