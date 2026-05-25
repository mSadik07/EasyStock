import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, ActivityIndicator, RefreshControl
} from 'react-native';
import { getLowStock, getDeadStock } from '../api/api';

export default function AnalyticsScreen() {
  const [lowStock, setLowStock] = useState([]);
  const [deadStock, setDeadStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('low');

  const loadData = async () => {
    try {
      const [lowRes, deadRes] = await Promise.all([getLowStock(), getDeadStock()]);
      setLowStock(lowRes.data.lowStockProducts);
      setDeadStock(deadRes.data.deadStockProducts);
    } catch (error) {
      console.log('Analiz verisi yüklenemedi:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#2196F3" /></View>;
  }

  const renderLowStock = () => (
    <View>
      {lowStock.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>✅ Tüm stoklar yeterli seviyede!</Text>
        </View>
      ) : (
        lowStock.map((item) => (
          <View
            key={item._id}
            style={[styles.card, item.status === 'critical' ? styles.criticalCard : styles.predictedCard]}
          >
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardStock}>Stok: {item.stock} adet</Text>
            <Text style={styles.cardMessage}>{item.message}</Text>
            <View style={[styles.badge, item.status === 'critical' ? styles.criticalBadge : styles.predictedBadge]}>
              <Text style={styles.badgeText}>
                {item.status === 'critical' ? '🔴 KRİTİK' : '🟡 TAHMİN'}
              </Text>
            </View>
          </View>
        ))
      )}
    </View>
  );

  const renderDeadStock = () => (
    <View>
      {deadStock.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>✅ Ölü stok tespit edilmedi!</Text>
        </View>
      ) : (
        deadStock.map((item) => (
          <View key={item._id} style={[styles.card, styles.deadCard]}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardStock}>Stok: {item.stock} adet</Text>
            <Text style={styles.cardMessage}>{item.message}</Text>
            <View style={[styles.badge, styles.deadBadge]}>
              <Text style={styles.badgeText}>⚫ ÖLÜ STOK</Text>
            </View>
          </View>
        ))
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'low' && styles.activeTab]}
          onPress={() => setActiveTab('low')}
        >
          <Text style={[styles.tabText, activeTab === 'low' && styles.activeTabText]}>
            🔴 Kritik Stok ({lowStock.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'dead' && styles.activeTab]}
          onPress={() => setActiveTab('dead')}
        >
          <Text style={[styles.tabText, activeTab === 'dead' && styles.activeTabText]}>
            ⚫ Ölü Stok ({deadStock.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadData(); }} />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {activeTab === 'low' ? renderLowStock() : renderDeadStock()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  tabs: { flexDirection: 'row', backgroundColor: '#fff', elevation: 2 },
  tab: { flex: 1, padding: 15, alignItems: 'center' },
  activeTab: { borderBottomWidth: 3, borderBottomColor: '#2196F3' },
  tabText: { fontSize: 13, color: '#999', fontWeight: '600' },
  activeTabText: { color: '#2196F3' },
  scrollContent: { padding: 15 },
  emptyBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center'
  },
  emptyText: { fontSize: 16, color: '#4CAF50', fontWeight: '600' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    borderLeftWidth: 5
  },
  criticalCard: { borderLeftColor: '#F44336' },
  predictedCard: { borderLeftColor: '#FF9800' },
  deadCard: { borderLeftColor: '#607D8B' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 3 },
  cardStock: { fontSize: 14, color: '#666', marginBottom: 3 },
  cardMessage: { fontSize: 13, color: '#888', marginBottom: 8 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  criticalBadge: { backgroundColor: '#FFEBEE' },
  predictedBadge: { backgroundColor: '#FFF3E0' },
  deadBadge: { backgroundColor: '#ECEFF1' },
  badgeText: { fontSize: 12, fontWeight: 'bold' }
});