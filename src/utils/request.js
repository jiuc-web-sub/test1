import axios from 'axios';

const instance = axios.create({
  baseURL: '/api', // 或你的后端API前缀
  timeout: 10000,
});

instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default instance;