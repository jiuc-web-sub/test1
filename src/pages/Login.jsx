import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/authService';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await login(username, password);
      if (res.data.code === 0) {
        localStorage.setItem('token', res.data.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.data.user));
        navigate('/');
      } else {
        setError(res.data.msg || '登录失败');
      }
    } catch (err) {
      setError('网络错误或服务器异常');
    }
  };

  return (
    <div className="auth-container">
      <h2>登录</h2>
      <form onSubmit={handleSubmit}>
        <input value={username} onChange={e => setUsername(e.target.value)} placeholder="用户名" required />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="密码" required />
        <button type="submit">登录</button>
      </form>
      {error && <div className="error">{error}</div>}
      <div style={{ marginTop: 16 }}>
        还没有账号？<Link to="/register">注册</Link>
      </div>
    </div>
  );
}