import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ScrollView, ActivityIndicator
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { addProduct, getCategories } from '../api/api';

export default function AddProductScreen({ navigation }) {
  const [form, setForm] = useState({
    name: '',
    barcode: '',
    price: '',
    stock: '',
    criticalStock: '5',
    category: ''
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data.categories);
    } catch (error) {
      console.log('Kategoriler yüklenemedi:', error);
    }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.stock) {
      Alert.alert('Hata', 'Ürün adı, fiyat ve stok zorunludur.');
      return;
    }

    setLoading(true);
    try {
      await addProduct({
        name: form.name,
        barcode: form.barcode,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        criticalStock: parseInt(form.criticalStock),
        category: form.category || null
      });
      Alert.alert('Başarılı', 'Ürün eklendi.', [
        { text: 'Tamam', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      const msg = error.response?.data?.message || 'Ürün eklenemedi.';
      Alert.alert('Hata', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Yeni Ürün Ekle</Text>

      <Text style={styles.label}>Ürün Adı *</Text>
      <TextInput
        style={styles.input}
        value={form.name}
        onChangeText={(v) => setForm({ ...form, name: v })}
        placeholder="Ürün adını girin"
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Barkod</Text>
      <TextInput
        style={styles.input}
        value={form.barcode}
        onChangeText={(v) => setForm({ ...form, barcode: v })}
        placeholder="Barkod (opsiyonel)"
        placeholderTextColor="#999"
        keyboardType="number-pad"
      />

      <Text style={styles.label}>Fiyat (₺) *</Text>
      <TextInput
        style={styles.input}
        value={form.price}
        onChangeText={(v) => setForm({ ...form, price: v })}
        placeholder="0.00"
        placeholderTextColor="#999"
        keyboardType="decimal-pad"
      />

      <Text style={styles.label}>Başlangıç Stok Miktarı *</Text>
      <TextInput
        style={styles.input}
        value={form.stock}
        onChangeText={(v) => setForm({ ...form, stock: v })}
        placeholder="0"
        placeholderTextColor="#999"
        keyboardType="number-pad"
      />

      <Text style={styles.label}>Kritik Stok Sınırı</Text>
      <TextInput
        style={styles.input}
        value={form.criticalStock}
        onChangeText={(v) => setForm({ ...form, criticalStock: v })}
        placeholder="5"
        placeholderTextColor="#999"
        keyboardType="number-pad"
      />

      <Text style={styles.label}>Kategori</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={form.category}
          onValueChange={(val) => setForm({ ...form, category: val })}
        >
          <Picker.Item label="Kategori seçin..." value="" />
          {categories.map((cat) => (
            <Picker.Item key={cat._id} label={cat.name} value={cat._id} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Ürün Ekle</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#555', marginBottom: 5 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
    color: '#333'
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 15
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});