import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getSales } from '../api/api';

export default function SalesHistoryScreen() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadSales = async () => {
    try {
      const res = await getSales();
      setSales(res.data.sales);
    } catch (error) {
      console.log('Satış geçmişi yüklenemedi:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadSales();
  }, []);

  // Toplam satış sayısı ve geliri hesapla
  const totalSalesCount = sales.length;
  const totalRevenue = sales.reduce((sum, item) => sum + (item.totalPrice || 0), 0);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Özet Kartı */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Toplam Satış</Text>
          <Text style={styles.summaryValue}>{totalSalesCount} İşlem</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Toplam Ciro</Text>
          <Text style={[styles.summaryValue, styles.revenueText]}>
            ₺{totalRevenue.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
        </View>
      </View>

      <FlatList
        data={sales}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadSales(); }} />
        }
        renderItem={({ item }) => (
          <View style={styles.saleCard}>
            <View style={styles.saleHeader}>
              <Text style={styles.productName}>{item.product?.name || 'Bilinmeyen Ürün'}</Text>
              <Text style={styles.totalPrice}>₺{(item.totalPrice || 0).toFixed(2)}</Text>
            </View>

            <View style={styles.saleDetails}>
              <Text style={styles.detailText}>
                Miktar: <Text style={styles.boldText}>{item.quantity} adet</Text>
              </Text>
              {item.product?.barcode ? (
                <Text style={styles.barcodeText}>Barkod: {item.product.barcode}</Text>
              ) : null}
            </View>

            <Text style={styles.dateText}>
              {new Date(item.createdAt).toLocaleDateString('tr-TR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🧾</Text>
            <Text style={styles.emptyText}>Henüz kaydedilmiş bir satış yok.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 5,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  revenueText: {
    color: '#4CAF50',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#eee',
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  saleCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    borderLeftWidth: 5,
    borderLeftColor: '#FF9800',
  },
  saleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  saleDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  boldText: {
    fontWeight: 'bold',
    color: '#333',
  },
  barcodeText: {
    fontSize: 13,
    color: '#999',
  },
  dateText: {
    fontSize: 12,
    color: '#aaa',
    textAlign: 'right',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
