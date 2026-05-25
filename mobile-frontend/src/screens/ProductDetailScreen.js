import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Alert, TouchableOpacity,
  ScrollView, TextInput, ActivityIndicator
} from 'react-native';
import { getProductById, updateStock, getPrediction } from '../api/api';

export default function ProductDetailScreen({ route, navigation }) {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stockQty, setStockQty] = useState('1');
  const [updating, setUpdating] = useState(false);

  const loadData = async () => {
    try {
      const [productRes, predRes] = await Promise.all([
        getProductById(productId),
        getPrediction(productId)
      ]);
      setProduct(productRes.data.product);
      setPrediction(predRes.data.prediction);
    } catch (error) {
      Alert.alert('Hata', 'Ürün bilgileri yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStockUpdate = async (operation) => {
    const qty = parseInt(stockQty);
    if (!qty || qty <= 0) {
      Alert.alert('Hata', 'Geçerli bir miktar girin.');
      return;
    }

    setUpdating(true);
    try {
      await updateStock(productId, { quantity: qty, operation });
      Alert.alert('Başarılı', 'Stok güncellendi.');
      loadData();
    } catch (error) {
      const msg = error.response?.data?.message || 'Stok güncellenemedi.';
      Alert.alert('Hata', msg);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#2196F3" /></View>;
  }

  if (!product) {
    return <View style={styles.center}><Text>Ürün bulunamadı.</Text></View>;
  }

  const stockColor = product.stock <= product.criticalStock ? '#F44336' : '#4CAF50';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.productName}>{product.name}</Text>
        {product.category && <Text style={styles.category}>{product.category.name}</Text>}
        {product.barcode ? <Text style={styles.barcode}>Barkod: {product.barcode}</Text> : null}

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Fiyat</Text>
            <Text style={[styles.statValue, { color: '#2196F3' }]}>₺{product.price.toFixed(2)}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Stok</Text>
            <Text style={[styles.statValue, { color: stockColor }]}>{product.stock}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Kritik</Text>
            <Text style={[styles.statValue, { color: '#FF9800' }]}>{product.criticalStock}</Text>
          </View>
        </View>
      </View>

      {prediction && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>📊 Tahmin</Text>
          <Text style={styles.predictionText}>{prediction.message}</Text>
          {prediction.dailySaleRate > 0 && (
            <Text style={styles.predictionDetail}>
              Günlük satış hızı: {prediction.dailySaleRate} adet/gün
            </Text>
          )}
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Stok Güncelle</Text>
        <TextInput
          style={styles.input}
          value={stockQty}
          onChangeText={setStockQty}
          keyboardType="number-pad"
          placeholder="Miktar"
          placeholderTextColor="#999"
        />
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.updateBtn, styles.addBtn]}
            onPress={() => handleStockUpdate('add')}
            disabled={updating}
          >
            <Text style={styles.btnText}>+ Ekle (Mal Kabul)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.updateBtn, styles.subtractBtn]}
            onPress={() => handleStockUpdate('subtract')}
            disabled={updating}
          >
            <Text style={styles.btnText}>- Çıkar (Fire)</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    backgroundColor: '#fff',
    margin: 15,
    marginBottom: 0,
    borderRadius: 12,
    padding: 20,
    elevation: 2
  },
  productName: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  category: { fontSize: 14, color: '#2196F3', marginBottom: 3 },
  barcode: { fontSize: 13, color: '#999', marginBottom: 15 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
  statBox: { alignItems: 'center', padding: 10 },
  statLabel: { fontSize: 12, color: '#999', marginBottom: 5 },
  statValue: { fontSize: 22, fontWeight: 'bold' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  predictionText: { fontSize: 15, color: '#555', marginBottom: 5 },
  predictionDetail: { fontSize: 13, color: '#999' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    color: '#333'
  },
  buttonRow: { flexDirection: 'row', gap: 10 },
  updateBtn: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center' },
  addBtn: { backgroundColor: '#4CAF50' },
  subtractBtn: { backgroundColor: '#FF9800' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 }
});