import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({ baseURL: API_BASE });

// Attach token automatically
api.interceptors.request.use(config => {
  const token = localStorage.getItem('admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Public account endpoints
export const getAccounts = (params) => api.get('/accounts', { params });
export const getAccount = (id) => api.get(`/accounts/${id}`);

// Admin endpoints
export const adminLogin = (data) => api.post('/auth/login', data);
export const getAdminAccounts = (params) => api.get('/accounts/admin/all', { params });
export const createAccount = (formData) => api.post('/accounts', formData);
export const bulkCreateAccounts = (data) => api.post('/accounts/bulk', data);
export const updateAccount = (id, formData) => api.put(`/accounts/${id}`, formData);
export const deleteAccount = (id) => api.delete(`/accounts/${id}`);

// WhatsApp redirect
export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '1234567890';
export const getWhatsAppLink = (accountId, rank) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=Hi!%20I'm%20interested%20in%20buying%20account%20${accountId}%20(${rank})`;
