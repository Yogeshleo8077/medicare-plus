import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api', // Use Vite env var in Docker, fallback to proxy locally
  withCredentials: true,
});

export default api;
