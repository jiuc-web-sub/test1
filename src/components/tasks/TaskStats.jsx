import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

export default function TaskStats({ tasks }) {
  const data = [
    { name: '已完成', value: tasks.filter(t => t.status === 'completed').length },
    { name: '进行中', value: tasks.filter(t => t.status === 'pending').length },
    { name: '已过期', value: tasks.filter(t => new Date(t.dueDate) < new Date()).length }
  ];

  return (
    <div className="task-stats">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}