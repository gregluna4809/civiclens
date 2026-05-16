import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { ComplaintTrend } from '../../types/api';

interface Props {
  data: ComplaintTrend[];
}

export function TrendsChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="empty-chart">
        No trend data available.
        <br />
        Apply a date range to see daily complaint volume.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip formatter={(value: number) => [value.toLocaleString(), 'Complaints']} />
        <Line
          type="monotone"
          dataKey="count"
          name="Complaints"
          stroke="#2563eb"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
