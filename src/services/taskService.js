import request from '../utils/request';

// 获取任务列表
export const fetchTasks = () => request.get('/tasks');

// 新建任务
export const createTask = (task) => request.post('/tasks', task);

// 更新任务
export const updateTask = (id, task) => request.put(`/tasks/${id}`, task);

// 删除任务
export const deleteTask = (id) => request.delete(`/tasks/${id}`);

// 彻底删除任务
export const removeTaskPermanently = (id) => request.delete(`/tasks/permanent/${id}`);

