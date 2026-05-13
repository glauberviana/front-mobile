import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Cache em memória para o token (evita ler do AsyncStorage a cada request)
let cachedToken: string | null = null;

// Funções utilitárias para gerenciar o token
export const setAuthToken = async (token: string) => {
  cachedToken = token;
  await AsyncStorage.setItem('@TaskCycle:token', token);
};

export const clearAuthToken = async () => {
  cachedToken = null;
  await AsyncStorage.removeItem('@TaskCycle:token');
};

const getBaseUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8000/api';
  }
  return 'http://localhost:8000/api';
};

const API_URL = getBaseUrl();

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // Timeout de 10 segundos
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor para adicionar o token
api.interceptors.request.use(
  async (config) => {
    // Tenta usar o token da memória primeiro (rápido)
    let token = cachedToken;
    
    // Se não estiver na memória, busca do AsyncStorage (mais lento, só na primeira vez)
    if (!token) {
      token = await AsyncStorage.getItem('@TaskCycle:token');
      if (token) {
        cachedToken = token;
      }
    }

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
