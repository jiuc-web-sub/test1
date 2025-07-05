import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await login(username, password);
      if (res.data.code === 0) {
        localStorage.setItem('token', res.data.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.data.user));
        navigate('/');
      } else {
        alert(res.data.msg || '登录失败');
      }
    } catch (e) {
      alert('登录请求失败');
    }
  };

  return (
    <div>
      <h1>登录</h1>
      <form onSubmit={handleLogin}>
        <input
          placeholder="用户名"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="密码"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit">登录</button>
      </form>
      <button onClick={() => navigate('/register')} style={{ marginTop: 8 }}>没有账号？去注册</button>
    </div>
  );
}