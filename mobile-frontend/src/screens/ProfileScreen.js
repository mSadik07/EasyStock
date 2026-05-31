import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator, ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { updateProfile, deleteProfile } from '../api/api';

export default function ProfileScreen({ navigation }) {
  const { user, updateUserData, signOut } = useAuth();
  const [form, setForm] = useState({
    username: user?.username || '',
    businessName: user?.businessName || '',
    phone: user?.phone || '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  // Baş harfleri almak için yardımcı fonksiyon
  const getUserInitials = () => {
    if (!user?.username) return 'U';
    return user.username.slice(0, 2).toUpperCase();
  };

  const handleUpdate = async () => {
    // Şifre kontrolü
    if (form.password) {
      if (form.password.length < 6) {
        Alert.alert('Hata', 'Yeni şifre en az 6 karakter olmalıdır.');
        return;
      }
      if (form.password !== form.confirmPassword) {
        Alert.alert('Hata', 'Şifreler eşleşmiyor.');
        return;
      }
    }

    setLoading(true);
    try {
      const updateData = {
        username: form.username,
        businessName: form.businessName,
        phone: form.phone
      };
      
      if (form.password) {
        updateData.password = form.password;
      }

      const res = await updateProfile(updateData);
      
      // Local state ve AsyncStorage'ı güncelle
      const updatedUser = {
        ...user,
        username: res.data.user.username,
        businessName: res.data.user.businessName,
        phone: res.data.user.phone
      };
      
      await updateUserData(updatedUser);
      
      // Şifre alanlarını temizle
      setForm(prev => ({ ...prev, password: '', confirmPassword: '' }));

      Alert.alert('Başarılı', 'Profil detayları güncellendi.');
    } catch (error) {
      const msg = error.response?.data?.message || 'Profil güncellenemedi.';
      Alert.alert('Hata', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Hesabımı Sil',
      'Hesabınızı silmek istediğinize emin misiniz? Bu işlem geri alınamaz ve tüm ürünleriniz, satış kayıtlarınız silinecektir!',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Hesabı Sil',
          style: 'destructive',
          onPress: async () => {
            Alert.alert(
              'Son Onay',
              'Gerçekten hesabınızı silmek istiyor musunuz?',
              [
                { text: 'İptal', style: 'cancel' },
                {
                  text: 'Evet, Sil',
                  style: 'destructive',
                  onPress: async () => {
                    setLoading(true);
                    try {
                      await deleteProfile();
                      await signOut();
                      Alert.alert('Hesap Silindi', 'Hesabınız başarıyla silindi.');
                    } catch (error) {
                      const msg = error.response?.data?.message || 'Hesap silinemedi.';
                      Alert.alert('Hata', msg);
                    } finally {
                      setLoading(false);
                    }
                  }
                }
              ]
            );
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Avatar Bölümü */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getUserInitials()}</Text>
          </View>
          <Text style={styles.username}>{user?.username || 'Kullanıcı'}</Text>
          <Text style={styles.email}>{user?.email || 'email@example.com'}</Text>
        </View>

        {/* Bilgi Kartı */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Kullanıcı & İşletme Bilgileri</Text>

          <Text style={styles.label}>Kullanıcı Adı</Text>
          <TextInput
            style={styles.input}
            value={form.username}
            onChangeText={(val) => setForm({ ...form, username: val })}
            placeholder="Kullanıcı Adı"
            placeholderTextColor="#999"
            autoCapitalize="none"
          />

          <Text style={styles.label}>İşletme Adı</Text>
          <TextInput
            style={styles.input}
            value={form.businessName}
            onChangeText={(val) => setForm({ ...form, businessName: val })}
            placeholder="İşletme Adı"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Telefon Numarası</Text>
          <TextInput
            style={styles.input}
            value={form.phone}
            onChangeText={(val) => setForm({ ...form, phone: val })}
            placeholder="05xxxxxxxxx"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
          />
        </View>

        {/* Şifre Güncelleme Kartı */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Güvenlik & Şifre Değiştir</Text>

          <Text style={styles.label}>Yeni Şifre (Değiştirmek istemiyorsanız boş bırakın)</Text>
          <TextInput
            style={styles.input}
            value={form.password}
            onChangeText={(val) => setForm({ ...form, password: val })}
            placeholder="Yeni Şifre"
            placeholderTextColor="#999"
            secureTextEntry
          />

          <Text style={styles.label}>Yeni Şifre (Tekrar)</Text>
          <TextInput
            style={styles.input}
            value={form.confirmPassword}
            onChangeText={(val) => setForm({ ...form, confirmPassword: val })}
            placeholder="Şifreyi Onayla"
            placeholderTextColor="#999"
            secureTextEntry
          />
        </View>

        {/* Kaydet Butonu */}
        <TouchableOpacity style={styles.button} onPress={handleUpdate} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Değişiklikleri Kaydet</Text>
          )}
        </TouchableOpacity>

        {/* Hesabı Sil Butonu */}
        <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDeleteAccount} disabled={loading}>
          <Text style={styles.buttonText}>⚠️ Hesabımı Kalıcı Olarak Sil</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    fontSize: 14,
    color: '#777',
    marginTop: 3,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 5,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    marginBottom: 15,
    color: '#333',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#F44336',
    marginTop: 15,
  },
});
