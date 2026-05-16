// Response shapes mirror the Spring Boot DTOs exactly.

export interface BoroughComplaintCount {
  borough: string;
  count: number;
}

export interface ComplaintTypeCount {
  complaintType: string;
  count: number;
}

export interface AgencyComplaintCount {
  agencyCode: string;
  agencyName: string;
  count: number;
}

export interface ComplaintTrend {
  date: string; // ISO date string: "2024-01-15"
  count: number;
}

export interface IngestionJob {
  id: number;
  jobType: string;
  status: string;
  startedAt: string;
  finishedAt: string | null;
  recordsProcessed: number;
  errorMessage: string | null;
}

export interface DemoResetResponse {
  message: string;
  deletedAt: string; // ISO-8601 timestamp
}

export interface AnalyticsFilters {
  startDate: string;
  endDate: string;
  borough: string;
  agencyCode: string;
  complaintType: string;
}

export const EMPTY_FILTERS: AnalyticsFilters = {
  startDate: '',
  endDate: '',
  borough: '',
  agencyCode: '',
  complaintType: '',
};
