import type {
  AnalyticsFilters,
  AgencyComplaintCount,
  BoroughComplaintCount,
  ComplaintTrend,
  ComplaintTypeCount,
} from '../types/api';

// Empty in dev (Vite proxy handles routing); set to the deployed backend URL in production.
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

function buildQueryString(
  filters: Partial<AnalyticsFilters>,
  extra?: Record<string, string | number>,
): string {
  const params = new URLSearchParams();
  if (filters.startDate) params.set('startDate', filters.startDate);
  if (filters.endDate) params.set('endDate', filters.endDate);
  if (filters.borough) params.set('borough', filters.borough);
  if (filters.agencyCode) params.set('agencyCode', filters.agencyCode);
  if (filters.complaintType) params.set('complaintType', filters.complaintType);
  if (extra) {
    Object.entries(extra).forEach(([key, value]) => params.set(key, String(value)));
  }
  const str = params.toString();
  return str ? `?${str}` : '';
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Request failed (${res.status}): ${body || res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export function fetchComplaintsByBorough(
  filters: Partial<AnalyticsFilters>,
): Promise<BoroughComplaintCount[]> {
  return get(`/api/analytics/complaints/by-borough${buildQueryString(filters)}`);
}

export function fetchTopComplaintTypes(
  filters: Partial<AnalyticsFilters>,
  limit = 10,
): Promise<ComplaintTypeCount[]> {
  return get(`/api/analytics/complaints/top-types${buildQueryString(filters, { limit })}`);
}

export function fetchTopAgencies(
  filters: Partial<AnalyticsFilters>,
  limit = 10,
): Promise<AgencyComplaintCount[]> {
  return get(`/api/analytics/agencies/top${buildQueryString(filters, { limit })}`);
}

export function fetchComplaintTrends(
  filters: Partial<AnalyticsFilters>,
): Promise<ComplaintTrend[]> {
  return get(`/api/analytics/complaints/trends${buildQueryString(filters)}`);
}
