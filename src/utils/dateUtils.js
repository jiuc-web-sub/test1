export const getTaskColor = (dueDate) => {
  const now = new Date();
  const due = new Date(dueDate);
  const diffHours = (due - now) / (1000 * 60 * 60);

  if (diffHours < 24) return '#ff6b6b';    // 红色：紧急
  if (diffHours < 72) return '#feca57';    // 橙色：即将到期
  return '#1dd1a1';                        // 绿色：时间充足
};