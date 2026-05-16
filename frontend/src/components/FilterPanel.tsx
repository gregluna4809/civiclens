import { useState } from 'react';
import type { AnalyticsFilters } from '../types/api';
import { EMPTY_FILTERS } from '../types/api';

interface Props {
  onApply: (filters: AnalyticsFilters) => void;
}

export function FilterPanel({ onApply }: Props) {
  const [draft, setDraft] = useState<AnalyticsFilters>(EMPTY_FILTERS);

  function set(field: keyof AnalyticsFilters, value: string) {
    setDraft((prev) => ({ ...prev, [field]: value }));
  }

  function handleClear() {
    setDraft(EMPTY_FILTERS);
    onApply(EMPTY_FILTERS);
  }

  return (
    <div className="card">
      <h2 className="section-title">Filters</h2>
      <div className="filter-grid">
        <label className="filter-field">
          Start Date
          <input
            type="date"
            value={draft.startDate}
            onChange={(e) => set('startDate', e.target.value)}
          />
        </label>
        <label className="filter-field">
          End Date
          <input
            type="date"
            value={draft.endDate}
            onChange={(e) => set('endDate', e.target.value)}
          />
        </label>
        <label className="filter-field">
          Borough
          <input
            type="text"
            placeholder="e.g. MANHATTAN"
            value={draft.borough}
            onChange={(e) => set('borough', e.target.value)}
          />
        </label>
        <label className="filter-field">
          Agency Code
          <input
            type="text"
            placeholder="e.g. HPD"
            value={draft.agencyCode}
            onChange={(e) => set('agencyCode', e.target.value)}
          />
        </label>
        <label className="filter-field">
          Complaint Type
          <input
            type="text"
            placeholder="e.g. NOISE"
            value={draft.complaintType}
            onChange={(e) => set('complaintType', e.target.value)}
          />
        </label>
      </div>
      <div className="filter-actions">
        <button className="btn btn-primary" onClick={() => onApply(draft)}>
          Apply Filters
        </button>
        <button className="btn btn-secondary" onClick={handleClear}>
          Clear
        </button>
      </div>
    </div>
  );
}
