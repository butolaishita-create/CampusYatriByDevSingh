import axios from 'axios';

const FALLBACK_RENDER_API = 'https://campusyatribydevsingh.onrender.com/api';
const configuredApi = process.env.REACT_APP_API_URL;
const apiBaseUrl = !configuredApi || configuredApi.includes('campus-rideshare-backend.onrender.com')
  ? FALLBACK_RENDER_API
  : configuredApi;

const API = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10000,
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

// Rides
export const getRides = (params) => API.get('/rides', { params });
export const getRideById = (id) => API.get(`/rides/${id}`);
export const createRide = (data) => API.post('/rides', data);
export const joinRide = (id) => API.post(`/rides/${id}/join`);
export const leaveRide = (id) => API.post(`/rides/${id}/leave`);
export const deleteRide = (id) => API.delete(`/rides/${id}`);
export const getUserRides = (userId) => API.get(`/rides/user/${userId}`);

// Messages
export const sendMessage = (data) => API.post('/messages', data);
export const getMessages = (userId) => API.get(`/messages/${userId}`);
export const getConversations = () => API.get('/messages/conversations');

// Users
export const getUserById = (id) => API.get(`/users/${id}`);
export const updateProfile = (data) => API.put('/users/profile', data);
export const rateUser = (id, rating) => API.post(`/users/${id}/rate`, { rating });

export default API;
