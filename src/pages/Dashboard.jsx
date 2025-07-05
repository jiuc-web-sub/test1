import { useEffect, useState } from 'react';
import { fetchTasks } from '../services/taskService';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    fetchTasks().then(res => {
      if (res.data.code === 0) setTasks(res.data.data);
    });
  }, []);

  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const trash = tasks.filter(t => t.isDeleted).length;
  const pending = total - completed - trash;
  const recent = tasks.filter(t => !t.isDeleted).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)).slice(0, 5);

  // 分类统计
  const categoryMap = {};
  tasks.forEach(t => {
    if (!t.isDeleted) {
      categoryMap[t.category || '未分类'] = (categoryMap[t.category || '未分类'] || 0) + 1;
    }
  });

  return (
    <div className="dashboard">
      <h1>仪表盘</h1>
      <div className="dashboard-cards">
        <div className="dashboard-card">总任务数：{total}</div>
        <div className="dashboard-card">已完成：{completed}</div>
        <div className="dashboard-card">未完成：{pending}</div>
        <div className="dashboard-card">回收站：{trash}</div>
      </div>
      <div className="dashboard-section">
        <h2>分类分布</h2>
        <ul>
          {Object.entries(categoryMap).map(([cat, count]) => (
            <li key={cat}>{cat}：{count}</li>
          ))}
        </ul>
      </div>
      <div className="dashboard-section">
        <h2>最近到期任务</h2>
        <ul>
          {recent.map(task => (
            <li key={task.id}>{task.title}（截止：{task.dueDate}）</li>
          ))}
        </ul>
      </div>
    </div>
  );
}