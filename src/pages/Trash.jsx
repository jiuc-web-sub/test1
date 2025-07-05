import { fetchTasks, updateTask, removeTaskPermanently } from '../services/taskService';
import { useEffect, useState } from 'react';

export default function Trash() {
  const [tasks, setTasks] = useState([]);

  const loadTasks = () => {
    fetchTasks().then(res => {
      if (res.data.code === 0) setTasks(res.data.data.filter(t => t.isDeleted));
    });
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleRestore = async (id) => {
    const task = tasks.find(t => t.id === id);
    const res = await updateTask(id, { ...task, isDeleted: false });
    if (res.data.code === 0) {
      loadTasks();
    }
  };

  const handleRemove = async (id) => {
    const res = await removeTaskPermanently(id);
    if (res.data.code === 0) {
      loadTasks();
    }
  };

  return (
    <div>
      <h1>回收站</h1>
      <div className="task-list">
        {tasks.map(task => (
          <div key={task.id} className="task-card">
            <div>
              <strong>{task.title}</strong>
              <button onClick={() => handleRestore(task.id)} style={{ marginLeft: 8 }}>恢复</button>
              <button onClick={() => handleRemove(task.id)} style={{ marginLeft: 8, color: 'red' }}>彻底删除</button>
            </div>
            <div>截止日期：{task.dueDate ? task.dueDate.split('T')[0] : ''}</div>
          </div>
        ))}
      </div>
    </div>
  );
}