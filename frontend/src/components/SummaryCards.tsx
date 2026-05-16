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

export function SummaryCards({ boroughs, types, agencies, loading }: Props) {
  // Derive summary values from the top of already-sorted API results.
  const topBorough = boroughs[0]?.borough ?? '—';
  const topType = types[0]?.complaintType ?? '—';
  const topAgency = agencies[0]?.agencyName ?? '—';
  const total = boroughs.reduce((sum, b) => sum + b.count, 0);

  const cards = [
    { label: 'Top Borough', value: topBorough },
    { label: 'Top Complaint Type', value: topType },
    { label: 'Top Agency', value: topAgency },
    { label: 'Total Complaints', value: total > 0 ? total.toLocaleString() : '—' },
  ];

  return (
    <div className="summary-grid">
      {cards.map((card) => (
        <div key={card.label} className="card summary-card">
          <p className="summary-label">{card.label}</p>
          <p className="summary-value">{loading ? '—' : card.value}</p>
        </div>
      ))}
    </div>
  );
}
