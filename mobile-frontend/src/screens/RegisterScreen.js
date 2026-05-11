import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator, ScrollView
} from 'react-native';
import { register } from '../api/api';

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({
    username: '', email: '', password: '', businessName: '', phone: ''
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!form.username || !form.email || !form.password) {
      Alert.alert('Hata', 'Kullanıcı adı, email ve şifre zorunludur.');
      return;
    }

    setLoading(true);
    try {
      await register(form);
      Alert.alert('Başarılı', 'Kayıt tamamlandı! Giriş yapabilirsiniz.', [
        { text: 'Tamam', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (error) {
      const msg = error.response?.data?.message || 'Kayıt yapılamadı.';
      Alert.alert('Hata', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📦 EasyStock</Text>
      <Text style={styles.subtitle}>Yeni Hesap Oluştur</Text>

      {[
        { key: 'username', placeholder: 'Kullanıcı Adı' },
        { key: 'email', placeholder: 'Email', keyboard: 'email-address' },
        { key: 'password', placeholder: 'Şifre', secure: true },
        { key: 'businessName', placeholder: 'İşletme Adı (opsiyonel)' },
        { key: 'phone', placeholder: 'Telefon (opsiyonel)', keyboard: 'phone-pad' }
      ].map((field) => (
        <TextInput
          key={field.key}
          style={styles.input}
          placeholder={field.placeholder}
          value={form[field.key]}
          onChangeText={(val) => setForm({ ...form, [field.key]: val })}
          secureTextEntry={field.secure || false}
          keyboardType={field.keyboard || 'default'}
          autoCapitalize="none"
          placeholderTextColor="#999"
        />
      ))}

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Kayıt Ol</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Zaten hesabın var mı? Giriş yap</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 12,
    color: '#333'
  },
  button: {
    width: '100%',
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  link: {
    color: '#2196F3',
    fontSize: 16
  }
});