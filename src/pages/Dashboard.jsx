import { useEffect, useState } from 'react';
import { fetchTasks } from '../services/taskService';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    fetchTasks().then(res => {
      if (res.data.code === 0) setTasks(res.data.data);
    });
  }, []);

  // 只统计未删除任务
  const activeTasks = tasks.filter(t => !t.isDeleted);

  // 已完成
  const completed = activeTasks.filter(t => t.completed).length;
  // 未完成
  const pending = activeTasks.filter(t => !t.completed).length;
  // 总任务数
  const total = activeTasks.length;
  // 回收站
  const trash = tasks.filter(t => t.isDeleted).length;

  // 今日任务
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const todayCount = activeTasks.filter(t => {
    const d = new Date(t.dueDate);
    return d >= today && d < tomorrow;
  }).length;

  // 本周任务
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);
  const weekCount = activeTasks.filter(t => {
    const d = new Date(t.dueDate);
    return d >= weekStart && d < weekEnd;
  }).length;

  // 分类统计
  const categoryMap = {};
  activeTasks.forEach(t => {
    categoryMap[t.category || '未分类'] = (categoryMap[t.category || '未分类'] || 0) + 1;
  });

  // 最近到期任务
  const recent = activeTasks
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  return (
    <div className="dashboard">
      <h1>仪表盘</h1>
      <div className="dashboard-cards">
        <div className="dashboard-card">总任务数：{total}</div>
        <div className="dashboard-card">已完成：{completed}</div>
        <div className="dashboard-card">未完成：{pending}</div>
        <div className="dashboard-card">回收站：{trash}</div>
        <div className="dashboard-card">
          <div>今日任务</div>
          <div>{todayCount}</div>
        </div>
        <div className="dashboard-card">
          <div>本周任务</div>
          <div>{weekCount}</div>
        </div>
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