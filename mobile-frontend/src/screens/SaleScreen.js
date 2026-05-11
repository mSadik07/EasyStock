import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  FlatList, TextInput, Alert, ActivityIndicator
} from 'react-native';
import { getProducts, createSale } from '../api/api';

export default function SaleScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState('1');
  const [selling, setSelling] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async (searchTerm = '') => {
    try {
      const res = await getProducts({ search: searchTerm });
      setProducts(res.data.products.filter(p => p.stock > 0));
    } catch (error) {
      Alert.alert('Hata', 'Ürünler yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  const handleSale = async () => {
    if (!selectedProduct) {
      Alert.alert('Hata', 'Lütfen bir ürün seçin.');
      return;
    }
    const qty = parseInt(quantity);
    if (!qty || qty <= 0) {
      Alert.alert('Hata', 'Geçerli bir miktar girin.');
      return;
    }

    const total = (selectedProduct.price * qty).toFixed(2);
    Alert.alert(
      'Satışı Onayla',
      `${selectedProduct.name}\n${qty} adet × ₺${selectedProduct.price} = ₺${total}`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Satışı Gerçekleştir',
          onPress: async () => {
            setSelling(true);
            try {
              await createSale({ productId: selectedProduct._id, quantity: qty });
              Alert.alert('Başarılı', `Satış kaydedildi! Kalan stok: ${selectedProduct.stock - qty}`);
              setSelectedProduct(null);
              setQuantity('1');
              loadProducts(search);
            } catch (error) {
              const msg = error.response?.data?.message || 'Satış gerçekleştirilemedi.';
              Alert.alert('Hata', msg);
            } finally {
              setSelling(false);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#2196F3" /></View>;
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Ürün ara..."
        value={search}
        onChangeText={(text) => { setSearch(text); loadProducts(text); }}
        placeholderTextColor="#999"
      />

      {selectedProduct && (
        <View style={styles.selectedCard}>
          <Text style={styles.selectedTitle}>Seçili Ürün:</Text>
          <Text style={styles.selectedName}>{selectedProduct.name}</Text>
          <Text style={styles.selectedStock}>Stok: {selectedProduct.stock} adet</Text>
          <Text style={styles.selectedPrice}>Birim Fiyat: ₺{selectedProduct.price}</Text>
          <TextInput
            style={styles.qtyInput}
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="number-pad"
            placeholder="Miktar"
            placeholderTextColor="#999"
          />
          <TouchableOpacity
            style={styles.saleBtn}
            onPress={handleSale}
            disabled={selling}
          >
            {selling ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saleBtnText}>
                💰 Satışı Gerçekleştir (₺{(selectedProduct.price * (parseInt(quantity) || 0)).toFixed(2)})
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedProduct(null)}>
            <Text style={styles.cancelText}>Seçimi İptal Et</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.productItem,
              selectedProduct?._id === item._id && styles.selectedItem
            ]}
            onPress={() => setSelectedProduct(item)}
          >
            <View>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>₺{item.price.toFixed(2)}</Text>
            </View>
            <View style={styles.stockBadge}>
              <Text style={styles.stockText}>{item.stock}</Text>
              <Text style={styles.stockLabel}>adet</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>Stokta ürün bulunamadı.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  searchInput: {
    margin: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    color: '#333'
  },
  selectedCard: {
    backgroundColor: '#E3F2FD',
    margin: 15,
    marginTop: 0,
    borderRadius: 12,
    padding: 15,
    borderWidth: 2,
    borderColor: '#2196F3'
  },
  selectedTitle: { fontSize: 12, color: '#666', marginBottom: 3 },
  selectedName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  selectedStock: { fontSize: 13, color: '#666' },
  selectedPrice: { fontSize: 13, color: '#4CAF50', marginBottom: 10 },
  qtyInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
    color: '#333'
  },
  saleBtn: {
    backgroundColor: '#FF9800',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8
  },
  saleBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  cancelText: { color: '#F44336', textAlign: 'center', fontSize: 14 },
  productItem: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 8,
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 1
  },
  selectedItem: { borderWidth: 2, borderColor: '#2196F3' },
  itemName: { fontSize: 16, fontWeight: '600', color: '#333' },
  itemPrice: { fontSize: 14, color: '#4CAF50' },
  stockBadge: { backgroundColor: '#4CAF50', borderRadius: 8, padding: 8, alignItems: 'center' },
  stockText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  stockLabel: { color: '#fff', fontSize: 11 },
  emptyText: { fontSize: 16, color: '#999' }
});