import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Dinamik olarak bilgisayarın yerel IP adresini veya güncel IP'yi belirle
const getBaseUrl = () => {
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    if (ip && !ip.includes('exp.direct') && !ip.includes('ngrok')) {
      return `http://${ip}:5000`;
    }
  }
  return 'http://192.168.31.163:5000'; // Bilgisayarınızın güncel Wi-Fi IP adresi
};

const BASE_URL = getBaseUrl();

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

// Her istekte token ekle
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// AUTH
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const updateProfile = (data) => api.put('/auth/profile', data);
export const deleteProfile = () => api.delete('/auth/profile');

// PRODUCTS
export const getProducts = (params) => api.get('/products', { params });
export const getProductById = (id) => api.get(`/products/${id}`);
export const getProductByBarcode = (code) => api.get(`/products/barcode/${code}`);
export const addProduct = (data) => api.post('/products', data);
export const updateStock = (id, data) => api.put(`/products/${id}/stock`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// CATEGORIES
export const getCategories = () => api.get('/categories');
export const addCategory = (data) => api.post('/categories', data);

// ANALYTICS
export const getLowStock = () => api.get('/analytics/low-stock');
export const getPrediction = (id) => api.get(`/analytics/predict/${id}`);
export const getDeadStock = () => api.get('/analytics/dead-stock');

// SALES
export const createSale = (data) => api.post('/sales', data);
export const getSales = () => api.get('/sales');

// NOTIFICATIONS
export const getNotifications = () => api.get('/notifications');
export const markAsRead = (id) => api.put(`/notifications/${id}/read`);

export default api;