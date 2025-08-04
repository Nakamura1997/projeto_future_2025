// src/lib/apiClient.ts
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptar erros
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 400) {
      console.error('Erro 400:', error.response.data);
    }
    return Promise.reject(error);
  }
);

export default api;