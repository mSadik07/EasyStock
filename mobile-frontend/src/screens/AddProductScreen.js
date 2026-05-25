import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ScrollView, ActivityIndicator
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { addProduct, getCategories, addCategory } from '../api/api';

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
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const loadCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data.categories);
    } catch (error) {
      console.log('Kategoriler yüklenemedi:', error);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.stock) {
      Alert.alert('Hata', 'Ürün adı, fiyat ve stok zorunludur.');
      return;
    }

    if (showNewCategoryInput && !newCategoryName.trim()) {
      Alert.alert('Hata', 'Lütfen yeni kategori adını girin.');
      return;
    }

    setLoading(true);
    try {
      let categoryId = form.category || null;

      // Yeni kategori ekleme işlemi
      if (showNewCategoryInput && newCategoryName.trim()) {
        const normalizedName = newCategoryName.trim();
        // Zaten listede var mı kontrol et
        const existingCat = categories.find(
          (c) => c.name.toLowerCase() === normalizedName.toLowerCase()
        );

        if (existingCat) {
          categoryId = existingCat._id;
        } else {
          // Sunucuya ekle
          const res = await addCategory({ name: normalizedName });
          categoryId = res.data.category._id;
        }
      }

      await addProduct({
        name: form.name,
        barcode: form.barcode,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        criticalStock: parseInt(form.criticalStock),
        category: categoryId
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
          selectedValue={showNewCategoryInput ? 'new' : form.category}
          onValueChange={(val) => {
            if (val === 'new') {
              setShowNewCategoryInput(true);
              setForm({ ...form, category: '' });
            } else {
              setShowNewCategoryInput(false);
              setForm({ ...form, category: val });
            }
          }}
        >
          <Picker.Item label="Kategori seçin..." value="" />
          {categories.map((cat) => (
            <Picker.Item key={cat._id} label={cat.name} value={cat._id} />
          ))}
          <Picker.Item label="➕ Yeni Kategori Ekle..." value="new" />
        </Picker>
      </View>

      {showNewCategoryInput && (
        <View style={styles.newCategoryContainer}>
          <Text style={styles.label}>Yeni Kategori Adı *</Text>
          <TextInput
            style={styles.input}
            value={newCategoryName}
            onChangeText={setNewCategoryName}
            placeholder="Yeni kategori adını girin"
            placeholderTextColor="#999"
          />
        </View>
      )}

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