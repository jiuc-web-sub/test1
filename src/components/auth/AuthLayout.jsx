import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import UserProfileModal from '../settings/UserProfileModal';

export default function AuthLayout() {
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  });
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  // 只要 user 变化就同步到 localStorage
  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="layout-root">
      <nav className="navbar">
        <div className="nav-links">
          <Link to="/">仪表盘</Link>
          <Link to="/tasks">任务列表</Link>
          <Link to="/trash">回收站</Link>
          <Link to="/settings">设置</Link>
        </div>
        <div className="nav-user">
          {user ? (
            <>
              <span style={{ marginRight: 8 }}>
                欢迎，{user.nickname}！
              </span>
              <button onClick={() => setShowProfile(true)} style={{ marginRight: 8 }}>用户设置</button>
              <button onClick={handleLogout}>退出</button>
              <UserProfileModal
                open={showProfile}
                onClose={() => setShowProfile(false)}
                user={user}
                setUser={setUser}
              />
            </>
          ) : (
            <>
              <Link to="/login">登录</Link>
              <Link to="/register" style={{ marginLeft: 8 }}>注册</Link>
            </>
          )}
        </div>
      </nav>
      <main className="page-content">
        <Outlet context={{ user, setUser }} />
      </main>
    </div>
  );
}