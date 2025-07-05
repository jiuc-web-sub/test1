import request from '../utils/request';

// 获取任务列表
export const fetchTasks = () => request.get('/tasks'); // /api/tasks

// 新建任务
export const createTask = (data) => request.post('/tasks', data);

// 更新任务
export const updateTask = (id, data) => request.put(`/tasks/${id}`, data);

// 软删除任务
export function removeTask(id) {
  return request.delete(`/tasks/${id}`);
}

// 彻底删除任务
export const removeTaskPermanently = (id) => request.delete(`/tasks/permanent/${id}`);

