import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { getNotifications } from '../api/api';

export default function HomeScreen({ navigation }) {
  const { user, signOut } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const res = await getNotifications();
        setUnreadCount(res.data.unreadCount);
      } catch (error) {
        console.log('Bildirim sayısı alınamadı:', error);
      }
    };

    fetchUnreadCount();

    const unsubscribe = navigation.addListener('focus', () => {
      fetchUnreadCount();
    });

    return unsubscribe;
  }, [navigation]);

  const handleLogout = () => {
    Alert.alert('Çıkış', 'Çıkış yapmak istediğinize emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      { text: 'Çıkış Yap', onPress: signOut, style: 'destructive' }
    ]);
  };

  const menuItems = [
    { title: '📋 Ürün Listesi', screen: 'ProductList', color: '#2196F3' },
    { title: '➕ Yeni Ürün Ekle', screen: 'AddProduct', color: '#4CAF50' },
    { title: '💰 Satış Yap', screen: 'Sale', color: '#FF9800' },
    { title: '📜 Satış Geçmişi', screen: 'SalesHistory', color: '#607D8B' },
    { title: '📊 Analizler', screen: 'Analytics', color: '#9C27B0' },
    { title: '👤 Profilim', screen: 'Profile', color: '#795548' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Hoş geldin,</Text>
          <Text style={styles.username}>{user?.username || 'Kullanıcı'}</Text>
          {user?.businessName ? (
            <Text style={styles.business}>{user.businessName}</Text>
          ) : null}
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.notificationBtn} 
            onPress={() => navigation.navigate('Notifications')}
          >
            <Text style={styles.notificationIcon}>🔔</Text>
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutText}>Çıkış</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Menü</Text>

      <View style={styles.grid}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.card, { backgroundColor: item.color }]}
            onPress={() => navigation.navigate(item.screen)}
          >
            <Text style={styles.cardText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 20,
    paddingTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  welcome: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.8
  },
  username: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold'
  },
  business: {
    color: '#fff',
    fontSize: 13,
    opacity: 0.8
  },
  logoutBtn: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    padding: 8,
    borderRadius: 8
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationBtn: {
    marginRight: 15,
    position: 'relative',
    padding: 5,
  },
  notificationIcon: {
    fontSize: 22,
  },
  badge: {
    position: 'absolute',
    right: -4,
    top: -2,
    backgroundColor: '#F44336',
    borderRadius: 9,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#2196F3',
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    margin: 20,
    marginBottom: 10
  },
  grid: {
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  card: {
    width: '48%',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4
  },
  cardText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center'
  }
});