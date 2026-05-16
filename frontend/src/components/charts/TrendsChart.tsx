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

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return String(n);
}

// Format ISO date strings as "Jan 15" for X-axis readability.
function formatAxisDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Full date in the tooltip (e.g. "Jan 15, 2024").
function formatTooltipDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function TrendsChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="empty-state">
        <svg className="empty-state-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
        <p className="empty-state-title">No trend data</p>
        <p className="empty-state-hint">Apply a date range to see daily complaint volume.</p>
      </div>
    );
  }

  // Show every nth tick so the axis doesn't crowd on long date ranges.
  const tickInterval = Math.max(0, Math.floor(data.length / 8) - 1);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={formatAxisDate}
          interval={tickInterval}
          tick={{ fontSize: 11, fill: '#64748b' }}
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
          labelFormatter={formatTooltipDate}
          contentStyle={{ border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 12, boxShadow: '0 2px 6px rgba(0,0,0,0.07)' }}
        />
        <Line
          type="monotone"
          dataKey="count"
          name="Complaints"
          stroke="#2563eb"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
