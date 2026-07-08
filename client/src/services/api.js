import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Vite proxy will redirect this to backend port
  withCredentials: true,
});

export default api;
