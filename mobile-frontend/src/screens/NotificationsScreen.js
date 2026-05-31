import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, RefreshControl
} from 'react-native';
import { getNotifications, markAsRead } from '../api/api';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadNotifications = async () => {
    try {
      const res = await getNotifications();
      // Sadece okunmamış bildirimleri filtrele (baktıktan sonra gitmesi için)
      const unreadOnly = res.data.notifications.filter(item => !item.isRead);
      setNotifications(unreadOnly);
      setUnreadCount(res.data.unreadCount);
    } catch (error) {
      console.log('Bildirimler yüklenemedi:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await markAsRead(id);
      loadNotifications();
    } catch (error) {
      console.log('Hata:', error);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'low_stock': return '🔴';
      case 'dead_stock': return '⚫';
      default: return '🔵';
    }
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#2196F3" /></View>;
  }

  return (
    <View style={styles.container}>
      {unreadCount > 0 && (
        <View style={styles.unreadBanner}>
          <Text style={styles.unreadText}>{unreadCount} okunmamış bildirim</Text>
        </View>
      )}

      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); loadNotifications(); }}
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, !item.isRead && styles.unreadCard]}
            onPress={() => !item.isRead && handleMarkRead(item._id)}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.icon}>{getTypeIcon(item.type)}</Text>
              <Text style={styles.title}>{item.title}</Text>
              {!item.isRead && <View style={styles.dot} />}
            </View>
            <Text style={styles.message}>{item.message}</Text>
            <Text style={styles.time}>
              {new Date(item.createdAt).toLocaleDateString('tr-TR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Text>
            {!item.isRead && (
              <Text style={styles.tapToRead}>Okundu olarak işaretlemek için dokun</Text>
            )}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>Henüz bildirim yok.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  unreadBanner: {
    backgroundColor: '#F44336',
    padding: 10,
    alignItems: 'center'
  },
  unreadText: { color: '#fff', fontWeight: 'bold' },
  card: {
    backgroundColor: '#fff',
    margin: 10,
    marginBottom: 0,
    borderRadius: 12,
    padding: 15,
    elevation: 1
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
    backgroundColor: '#F3F9FF'
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5
  },
  icon: { fontSize: 18, marginRight: 8 },
  title: { fontSize: 15, fontWeight: 'bold', color: '#333', flex: 1 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2196F3'
  },
  message: { fontSize: 14, color: '#555', marginBottom: 5, marginLeft: 26 },
  time: { fontSize: 12, color: '#999', marginLeft: 26 },
  tapToRead: { fontSize: 11, color: '#2196F3', marginLeft: 26, marginTop: 4 },
  emptyText: { fontSize: 16, color: '#999' }
});