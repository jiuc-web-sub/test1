import request from '../utils/request';

// 登录
export const login = (username, password) =>
  request.post('/login', { username, password });

// 注册
export const register = (username, password) =>
  request.post('/register', { username, password });