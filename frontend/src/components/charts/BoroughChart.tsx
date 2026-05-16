import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { BoroughComplaintCount } from '../../types/api';

interface Props {
  data: BoroughComplaintCount[];
}

export function BoroughChart({ data }: Props) {
  if (data.length === 0) {
    return <div className="empty-chart">No borough data available.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis dataKey="borough" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip
          formatter={(value: number) => [value.toLocaleString(), 'Complaints']}
          cursor={{ fill: '#f1f5f9' }}
        />
        <Bar dataKey="count" name="Complaints" fill="#2563eb" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
