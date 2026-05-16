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

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return String(n);
}

// Truncate long category names so they don't overflow the Y-axis column.
function truncateLabel(label: string, max = 24): string {
  return label.length > max ? label.slice(0, max) + '…' : label;
}

export function TopTypesChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="empty-state">
        <svg className="empty-state-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
        <p className="empty-state-title">No complaint type data</p>
        <p className="empty-state-hint">Try adjusting your filters or ingesting data first.</p>
      </div>
    );
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
        <XAxis
          type="number"
          tickFormatter={formatCount}
          tick={{ fontSize: 12, fill: '#64748b' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="complaintType"
          tickFormatter={truncateLabel}
          width={175}
          tick={{ fontSize: 11, fill: '#64748b' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          formatter={(value: number) => [value.toLocaleString(), 'Complaints']}
          contentStyle={{ border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 12, boxShadow: '0 2px 6px rgba(0,0,0,0.07)' }}
          cursor={{ fill: 'rgba(241, 245, 249, 0.8)' }}
        />
        <Bar dataKey="count" name="Complaints" fill="#7c3aed" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
