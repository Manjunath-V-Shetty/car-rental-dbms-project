import axios from 'axios';

// Create a configured Axios instance pointed directly at your local Node server port
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Automatically inject your secure JWT login token into headers if it exists in local storage
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (credentials) => API.post('/auth/login', credentials),
  register: (userData) => API.post('/auth/register', userData),
};

export const vehicleService = {
  getAvailable: (filters) => API.get('/vehicles/available', { params: filters }),
};

export const aiService = {
  getRecommendations: (promptData) => API.post('/ai/recommend', promptData),
};

export default API;