import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8080/api', // 后端API地址
  withCredentials: true, // 如需携带cookie
  timeout: 10000,
});

// 请求拦截器：自动加token
instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default instance;