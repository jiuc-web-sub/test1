import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTasks, createTask, updateTask, removeTask } from '../services/taskService';

function getTaskColorClass(dueDate) {
  const now = new Date();
  const due = new Date(dueDate);
  const diffHours = (due - now) / (1000 * 60 * 60);
  if (diffHours < 24) return 'task-urgent';
  if (diffHours < 72) return 'task-warning';
  return 'task-normal';
}

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newTags, setNewTags] = useState('');
  const [expandedIds, setExpandedIds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, []);

  useEffect(() => {
    fetchTasks().then(res => {
      if (res.data.code === 0) setTasks(res.data.data.filter(t => !t.isDeleted));
    });
  }, []);

  const handleAddTask = async () => {
    if (!newTask.trim() || !newDueDate) return;
    const res = await createTask({
      title: newTask,
      dueDate: newDueDate,
      description: newDesc,
      category: newCategory,
      tags: newTags, // 确保这里传递了标签
    });
    if (res.data.code === 0) {
      setTasks([...tasks, res.data.data]);
      setNewTask('');
      setNewDueDate('');
      setNewDesc('');
      setNewCategory('');
      setNewTags('');
    }
  };

  const handleDeleteTask = async (id) => {
    if (!id) return;
    await removeTask(id);
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleUpdateDueDate = async (id, value) => {
    const task = tasks.find(t => t.id === id);
    const res = await updateTask(id, { ...task, dueDate: value });
    if (res.data.code === 0) {
      setTasks(tasks.map(t => t.id === id ? { ...t, dueDate: value } : t));
    } else {
      alert(res.data.msg || '修改失败');
    }
  };

  const handleToggleExpand = (id) => {
    setExpandedIds(expandedIds.includes(id)
      ? expandedIds.filter(eid => eid !== id)
      : [...expandedIds, id]);
  };

  const handleDescChange = async (id, value) => {
    const task = tasks.find(t => t.id === id);
    const res = await updateTask(id, { ...task, description: value });
    if (res.data.code === 0) {
      setTasks(tasks.map(t => t.id === id ? { ...t, description: value } : t));
    } else {
      alert(res.data.msg || '修改失败');
    }
  };

  const handleTagsChange = async (id, value) => {
    const task = tasks.find(t => t.id === id);
    const res = await updateTask(id, { ...task, tags: value });
    if (res.data.code === 0) {
      setTasks(tasks.map(t => t.id === id ? { ...t, tags: value } : t));
    }
  };

  const handleCategoryChange = async (id, newCategory) => {
    if (!id) return;
    await updateTask(id, { category: newCategory });
    setTasks(tasks.map(t => t.id === id ? { ...t, category: newCategory } : t));
  };

  const sortedTasks = [...tasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  return (
    <div>
      <h1>任务列表</h1>
      <div className="task-add">
        <input
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          placeholder="新任务名称"
        />
        <label style={{ marginLeft: 16, color: '#888', minWidth: 80, display: 'inline-block', fontSize: 16 }}>
          截止日期
          <input
            type="date"
            value={newDueDate}
            onChange={e => setNewDueDate(e.target.value)}
            style={{ marginLeft: 4, fontSize: 16 }}
          />
        </label>
        {/* 创建任务表单部分 */}
        <select
          value={newCategory}
          onChange={e => setNewCategory(e.target.value)}
          style={{ marginLeft: 8 }}
        >
          <option value="">请选择分类</option>
          <option value="工作">工作</option>
          <option value="学习">学习</option>
          <option value="生活">生活</option>
        </select>
        <input
          value={newTags}
          onChange={e => setNewTags(e.target.value)}
          placeholder="标签（用逗号分隔）"
          style={{ marginLeft: 8, width: 120 }}
        />
        <input
          value={newDesc}
          onChange={e => setNewDesc(e.target.value)}
          placeholder="任务描述"
          style={{ marginLeft: 8, width: 160 }}
        />
        <button onClick={handleAddTask} style={{ marginLeft: 8 }}>添加任务</button>
      </div>
      <div className="task-list">
        {tasks.map(task => (
          <div key={task.id} className="task-card">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <strong>{task.title}</strong>
              <button
                className="expand-btn"
                style={{ marginLeft: 'auto', marginRight: 8 }}
                onClick={() => handleToggleExpand(task.id)}
              >
                {expandedIds.includes(task.id) ? '收起' : '展开'}
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDeleteTask(task.id)}
              >删除</button>
            </div>
            <div style={{ marginTop: 8, display: 'flex', gap: 24, alignItems: 'center' }}>
              <span style={{ color: '#888', fontSize: 13 }}>
                分类：
                <select
                  value={task.category || ''}
                  onChange={e => handleCategoryChange(task.id, e.target.value)}
                  style={{ marginLeft: 4 }}
                >
                  <option value="">未分类</option>
                  <option value="工作">工作</option>
                  <option value="学习">学习</option>
                  <option value="生活">生活</option>
                </select>
              </span>
              <span style={{ color: '#888', fontSize: 13 }}>
                标签：
                <input
                  type="text"
                  value={task.tags || ''}
                  onChange={e => handleTagsChange(task.id, e.target.value)}
                  style={{ width: 120, marginLeft: 4 }}
                  placeholder="用逗号分隔"
                />
              </span>
            </div>
            <div style={{ marginTop: 8 }}>
              截止时间：
              <input
                type="date"
                value={task.dueDate ? task.dueDate.split(' ')[0] : ''} // 只取日期部分
                onChange={e => handleUpdateDueDate(task.id, e.target.value)}
                style={{ marginLeft: 4 }}
              />
            </div>
            {expandedIds.includes(task.id) && (
              <div style={{ marginTop: 8 }}>
                <textarea
                  value={task.description || ''}
                  onChange={e => handleDescChange(task.id, e.target.value)}
                  rows={3}
                  style={{ width: '100%' }}
                  placeholder="任务详细描述"
                />
              </div>
            )}
          </div>
        ))}
      </div>
      <div>
        <h2>最近任务</h2>
        <ul>
          {tasks.filter(task => !task.isDeleted).map(task => (
            <li key={task.id}>{task.title}（截止：{task.dueDate}）</li>
          ))}
        </ul>
      </div>
    </div>
  );
}