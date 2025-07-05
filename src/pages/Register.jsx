import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/authService';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await register(username, password);
      if (res.data.code === 0) {
        alert('注册成功，请登录');
        navigate('/login');
      } else {
        alert(res.data.msg || '注册失败');
      }
    } catch (e) {
      alert('注册请求失败');
    }
  };

  return (
    <div>
      <h1>注册</h1>
      <form onSubmit={handleRegister}>
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
        <button type="submit">注册</button>
      </form>
      <div style={{ marginTop: 16 }}>
        已有账号？<Link to="/login">去登录</Link>
      </div>
    </div>
  );
}