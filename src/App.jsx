import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { router } from './routes';
import './assets/css/App.css';
import './assets/css/variables.css';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Trash from './pages/Trash';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import { useEffect } from 'react';

function App() {
  const theme = 'light'; // 假设默认主题为light，实际应用中可以通过状态管理或上下文获取

  useEffect(() => {
    document.body.setAttribute('data-theme', theme); // theme 为 'dark' 或 'light'
  }, [theme]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/trash" element={<Trash />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* 可选：404页面 */}
        <Route path="*" element={<div style={{padding: 40}}>404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;