import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  if (userId) config.headers['X-User-ID'] = userId;
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

// Activity Service
export const getActivities = () => api.get('/activities');
export const addActivity = (activity) => api.post('/activities', activity);
export const getActivityById = (id) => api.get(`/activities/${id}`);

// AI / Recommendation Service
export const getActivityRecommendation = (activityId) => api.get(`/recommendation/activity/${activityId}`);
export const getUserRecommendations = (userId) => api.get(`/recommendation/user/${userId}`);

// User Service
export const getUserProfile = (userId) => api.get(`/users/${userId}`);
export const registerUser = (data) => api.post('/users/register', data);
export const validateUser = (userId) => api.get(`/users/${userId}/validate`);
export const validateUserByKeycloak = (keycloakId) => api.get(`/users/by-keycloak/${keycloakId}/validate`);

export default api;
