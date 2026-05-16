import type {
  AgencyComplaintCount,
  BoroughComplaintCount,
  ComplaintTypeCount,
} from '../types/api';

interface Props {
  boroughs: BoroughComplaintCount[];
  types: ComplaintTypeCount[];
  agencies: AgencyComplaintCount[];
  loading: boolean;
}

// Icon + color config per summary metric.
const CARD_META = {
  borough: {
    color: '#2563eb',
    bg: '#eff6ff',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9,22 9,12 15,12 15,22" />
      </svg>
    ),
  },
  type: {
    color: '#7c3aed',
    bg: '#f5f3ff',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
      </svg>
    ),
  },
  agency: {
    color: '#0891b2',
    bg: '#ecfeff',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
      </svg>
    ),
  },
  total: {
    color: '#15803d',
    bg: '#f0fdf4',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
} as const;

export function SummaryCards({ boroughs, types, agencies, loading }: Props) {
  // Derive summary values from the top of already-sorted API results.
  const topBorough = boroughs[0]?.borough ?? '—';
  const topType = types[0]?.complaintType ?? '—';
  const topAgency = agencies[0]?.agencyName ?? '—';
  const total = boroughs.reduce((sum, b) => sum + b.count, 0);

  const cards = [
    { key: 'borough' as const, label: 'Top Borough', value: topBorough },
    { key: 'type'    as const, label: 'Top Complaint Type', value: topType },
    { key: 'agency'  as const, label: 'Top Agency', value: topAgency },
    { key: 'total'   as const, label: 'Total Complaints', value: total > 0 ? total.toLocaleString() : '—' },
  ];

  return (
    <div className="summary-grid">
      {cards.map((card) => {
        const meta = CARD_META[card.key];
        return (
          <div key={card.label} className="card summary-card">
            <div className="summary-icon" style={{ background: meta.bg, color: meta.color }}>
              {meta.icon}
            </div>
            <p className="summary-label">{card.label}</p>
            {loading
              ? <div className="skeleton skeleton-value" />
              : <p className="summary-value">{card.value}</p>}
          </div>
        );
      })}
    </div>
  );
}
