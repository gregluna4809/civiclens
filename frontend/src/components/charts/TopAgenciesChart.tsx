import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { AgencyComplaintCount } from '../../types/api';

interface Props {
  data: AgencyComplaintCount[];
}

export function TopAgenciesChart({ data }: Props) {
  if (data.length === 0) {
    return <div className="empty-chart">No agency data available.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis dataKey="agencyCode" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
        {/* Tooltip shows full agency name since the X-axis only shows the short code. */}
        <Tooltip
          formatter={(value: number) => [value.toLocaleString(), 'Complaints']}
          labelFormatter={(label: string) => {
            const match = data.find((a) => a.agencyCode === label);
            return match ? `${label} — ${match.agencyName}` : label;
          }}
          cursor={{ fill: '#f1f5f9' }}
        />
        <Bar dataKey="count" name="Complaints" fill="#0891b2" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
