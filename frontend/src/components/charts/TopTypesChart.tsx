import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { ComplaintTypeCount } from '../../types/api';

interface Props {
  data: ComplaintTypeCount[];
}

export function TopTypesChart({ data }: Props) {
  if (data.length === 0) {
    return <div className="empty-chart">No complaint type data available.</div>;
  }

  return (
    // layout="vertical" puts complaint type names on the Y-axis where long labels fit naturally.
    <ResponsiveContainer width="100%" height={320}>
      <BarChart
        layout="vertical"
        data={data}
        margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis
          type="category"
          dataKey="complaintType"
          width={195}
          tick={{ fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          formatter={(value: number) => [value.toLocaleString(), 'Complaints']}
          cursor={{ fill: '#f1f5f9' }}
        />
        <Bar dataKey="count" name="Complaints" fill="#7c3aed" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
