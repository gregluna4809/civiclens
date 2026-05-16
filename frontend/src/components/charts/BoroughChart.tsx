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

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return String(n);
}

export function BoroughChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="empty-state">
        <svg className="empty-state-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          <polyline points="9,22 9,12 15,12 15,22" />
        </svg>
        <p className="empty-state-title">No borough data</p>
        <p className="empty-state-hint">Try adjusting your filters or ingesting data first.</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis
          dataKey="borough"
          tick={{ fontSize: 12, fill: '#64748b' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={formatCount}
          tick={{ fontSize: 12, fill: '#64748b' }}
          axisLine={false}
          tickLine={false}
          width={40}
        />
        <Tooltip
          formatter={(value: number) => [value.toLocaleString(), 'Complaints']}
          contentStyle={{ border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 12, boxShadow: '0 2px 6px rgba(0,0,0,0.07)' }}
          cursor={{ fill: 'rgba(241, 245, 249, 0.8)' }}
        />
        <Bar dataKey="count" name="Complaints" fill="#2563eb" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
