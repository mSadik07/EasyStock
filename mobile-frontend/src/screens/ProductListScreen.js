import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, Alert, TextInput, ActivityIndicator, RefreshControl
} from 'react-native';
import { getProducts, deleteProduct } from '../api/api';
import { useFocusEffect } from '@react-navigation/native';

export default function ProductListScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  const fetchProducts = async (searchTerm = '') => {
    try {
      const res = await getProducts({ search: searchTerm });
      setProducts(res.data.products);
    } catch (error) {
      Alert.alert('Hata', 'Ürünler yüklenemedi.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProducts(search);
    }, [])
  );

  const handleDelete = (id, name) => {
    Alert.alert(
      'Ürün Sil',
      `"${name}" ürününü silmek istediğinize emin misiniz?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil', style: 'destructive',
          onPress: async () => {
            try {
              await deleteProduct(id);
              fetchProducts(search);
            } catch (error) {
              Alert.alert('Hata', 'Ürün silinemedi.');
            }
          }
        }
      ]
    );
  };

  const getStockColor = (product) => {
    if (product.stock === 0) return '#F44336';
    if (product.stock <= product.criticalStock) return '#FF9800';
    return '#4CAF50';
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.cardContent}
        onPress={() => navigation.navigate('ProductDetail', { productId: item._id })}
      >
        <View style={styles.cardLeft}>
          <Text style={styles.productName}>{item.name}</Text>
          {item.category && (
            <Text style={styles.category}>{item.category.name}</Text>
          )}
          <Text style={styles.price}>₺{item.price.toFixed(2)}</Text>
          {item.barcode ? (
            <Text style={styles.barcode}>Barkod: {item.barcode}</Text>
          ) : null}
        </View>
        <View style={styles.cardRight}>
          <View style={[styles.stockBadge, { backgroundColor: getStockColor(item) }]}>
            <Text style={styles.stockText}>{item.stock}</Text>
            <Text style={styles.stockLabel}>adet</Text>
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.editBtn]}
          onPress={() => navigation.navigate('ProductDetail', { productId: item._id })}
        >
          <Text style={styles.actionText}>Detay</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, styles.deleteBtn]}
          onPress={() => handleDelete(item._id, item.name)}
        >
          <Text style={styles.actionText}>Sil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Ürün ara..."
        value={search}
        onChangeText={(text) => {
          setSearch(text);
          fetchProducts(text);
        }}
        placeholderTextColor="#999"
      />

      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); fetchProducts(search); }}
          />
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>Ürün bulunamadı.</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddProduct')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
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
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15
  },
  cardLeft: { flex: 1 },
  cardRight: { marginLeft: 10 },
  productName: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 3 },
  category: { fontSize: 12, color: '#2196F3', marginBottom: 3 },
  price: { fontSize: 15, color: '#4CAF50', fontWeight: '600' },
  barcode: { fontSize: 11, color: '#999', marginTop: 2 },
  stockBadge: {
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    minWidth: 60
  },
  stockText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  stockLabel: { color: '#fff', fontSize: 11 },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0'
  },
  actionBtn: {
    flex: 1,
    padding: 10,
    alignItems: 'center'
  },
  editBtn: { borderRightWidth: 1, borderRightColor: '#f0f0f0' },
  deleteBtn: {},
  actionText: { fontSize: 14, fontWeight: '600', color: '#666' },
  emptyText: { fontSize: 16, color: '#999' },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5
  },
  fabText: { color: '#fff', fontSize: 28, fontWeight: 'bold' }
});