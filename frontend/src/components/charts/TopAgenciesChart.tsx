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

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return String(n);
}

export function TopAgenciesChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="empty-state">
        <svg className="empty-state-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
        </svg>
        <p className="empty-state-title">No agency data</p>
        <p className="empty-state-hint">Try adjusting your filters or ingesting data first.</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis
          dataKey="agencyCode"
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
        {/* Tooltip shows full agency name since the X-axis only shows the short code. */}
        <Tooltip
          formatter={(value: number) => [value.toLocaleString(), 'Complaints']}
          labelFormatter={(label: string) => {
            const match = data.find((a) => a.agencyCode === label);
            return match ? `${label} — ${match.agencyName}` : label;
          }}
          contentStyle={{ border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 12, boxShadow: '0 2px 6px rgba(0,0,0,0.07)' }}
          cursor={{ fill: 'rgba(241, 245, 249, 0.8)' }}
        />
        <Bar dataKey="count" name="Complaints" fill="#0891b2" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
