import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Cache em memória para o token (evita ler do AsyncStorage a cada request)
let cachedToken: string | null = null;

// Funções utilitárias para gerenciar o token
export const setAuthToken = async (token: string) => {
  cachedToken = token;
  try {
    await AsyncStorage.setItem('@TaskCycle:token', token);
  } catch (e) {
    console.warn("Erro ao salvar token no AsyncStorage", e);
  }
};

export const clearAuthToken = async () => {
  cachedToken = null;
  try {
    await AsyncStorage.removeItem('@TaskCycle:token');
    await AsyncStorage.removeItem('@TaskCycle:categories');
  } catch (e) {
    console.warn("Erro ao remover dados do AsyncStorage", e);
  }
};

const getBaseUrl = () => {
  const API_PORT = '8000';
  
  // 1. Se estiver rodando na Web (notebook/computador)
  if (Platform.OS === 'web') {
    // Pega automaticamente o IP da rede local
    let hostname = typeof window !== 'undefined' ? window.location.hostname : '127.0.0.1';
    
    // Evita problemas do Docker com IPv6 no Windows (localhost resolvendo para ::1)
    if (hostname === 'localhost') {
      hostname = '127.0.0.1';
    }
    
    return `http://${hostname}:${API_PORT}/api`;
  }

  // 2. Se estiver rodando via Expo Go no celular (pega o IP dinâmico)
  // hostUri ex: "192.168.1.7:8081"
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    // Evitar que pegue o IP da rede interna do WSL/Docker (que começa com 172. ou 10.)
    if (!ip.startsWith('172.') && !ip.startsWith('10.')) {
      return `http://${ip}:${API_PORT}/api`;
    }
  }

  // 3. Fallback (ex: App compilado em produção ou emulador Android sem Expo Go)
  // Este IP foi obtido via ipconfig (é o da sua placa Wi-Fi atual)
  return `http://192.168.1.7:${API_PORT}/api`;
};

const API_URL = getBaseUrl();
console.log("🌍 API_URL resolvida:", API_URL);

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // Timeout de 30 segundos (aumentado devido à lentidão do Docker no Windows)
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
      try {
        token = await AsyncStorage.getItem('@TaskCycle:token');
        if (token) {
          cachedToken = token;
        }
      } catch (e) {
        console.warn("Erro ao ler token do AsyncStorage no interceptor", e);
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

// Retorna o token em cache da memória (sem depender do AsyncStorage)
export const getCachedToken = (): string | null => cachedToken;

export default api;
