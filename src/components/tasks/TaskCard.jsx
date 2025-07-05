import { useEffect, useState } from 'react';
import './TaskCard.css'; // 组件级CSS[2](@ref)

export default function TaskCard({ task }) {
  const [timeClass, setTimeClass] = useState('');

  useEffect(() => {
    const diffHours = (new Date(task.dueDate) - Date.now()) / (1000 * 60 * 60);
    setTimeClass(
      diffHours < 24 ? 'task-urgent' : 
      diffHours < 72 ? 'task-warning' : 'task-normal'
    );
  }, [task.dueDate]);

  return (
    <div className={`task-card ${timeClass}`}>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <div className="task-meta">
        <span>截止: {new Date(task.dueDate).toLocaleString()}</span>
      </div>
    </div>
  );
}