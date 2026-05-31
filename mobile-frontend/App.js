import React from 'react';
import { LogBox } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

// Üçüncü taraf kütüphanelerden kaynaklanan InteractionManager uyarılarını gizle
LogBox.ignoreLogs(['InteractionManager has been deprecated']);

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}