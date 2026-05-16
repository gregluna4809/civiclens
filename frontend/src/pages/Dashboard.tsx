import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { FilterPanel } from '../components/FilterPanel';
import { SummaryCards } from '../components/SummaryCards';
import { BoroughChart } from '../components/charts/BoroughChart';
import { TopTypesChart } from '../components/charts/TopTypesChart';
import { TopAgenciesChart } from '../components/charts/TopAgenciesChart';
import { TrendsChart } from '../components/charts/TrendsChart';
import { IngestionPanel } from '../components/IngestionPanel';
import type {
  AnalyticsFilters,
  AgencyComplaintCount,
  BoroughComplaintCount,
  ComplaintTrend,
  ComplaintTypeCount,
  IngestionJob,
} from '../types/api';
import { EMPTY_FILTERS } from '../types/api';
import {
  fetchComplaintsByBorough,
  fetchTopComplaintTypes,
  fetchTopAgencies,
  fetchComplaintTrends,
} from '../services/analyticsApi';
import { fetchIngestionJobs } from '../services/ingestionApi';

export function Dashboard() {
  const [boroughs, setBoroughs] = useState<BoroughComplaintCount[]>([]);
  const [types, setTypes] = useState<ComplaintTypeCount[]>([]);
  const [agencies, setAgencies] = useState<AgencyComplaintCount[]>([]);
  const [trends, setTrends] = useState<ComplaintTrend[]>([]);
  const [jobs, setJobs] = useState<IngestionJob[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load all analytics and ingestion history on first render.
  useEffect(() => {
    async function init() {
      setLoading(true);
      setError(null);
      try {
        const [boroughData, typeData, agencyData, trendData, jobData] = await Promise.all([
          fetchComplaintsByBorough(EMPTY_FILTERS),
          fetchTopComplaintTypes(EMPTY_FILTERS),
          fetchTopAgencies(EMPTY_FILTERS),
          fetchComplaintTrends(EMPTY_FILTERS),
          fetchIngestionJobs(),
        ]);
        setBoroughs(boroughData);
        setTypes(typeData);
        setAgencies(agencyData);
        setTrends(trendData);
        setJobs(jobData);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load data from the backend');
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  async function handleApply(filters: AnalyticsFilters) {
    setLoading(true);
    setError(null);
    try {
      const [boroughData, typeData, agencyData, trendData] = await Promise.all([
        fetchComplaintsByBorough(filters),
        fetchTopComplaintTypes(filters),
        fetchTopAgencies(filters),
        fetchComplaintTrends(filters),
      ]);
      setBoroughs(boroughData);
      setTypes(typeData);
      setAgencies(agencyData);
      setTrends(trendData);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <main className="main-content">
        <FilterPanel onApply={handleApply} />

        {error && (
          <div className="alert alert-error">
            <strong>Error:</strong> {error}
          </div>
        )}

        <SummaryCards
          boroughs={boroughs}
          types={types}
          agencies={agencies}
          loading={loading}
        />

        <div className="charts-grid">
          <div className="card chart-card">
            <h2 className="section-title">Complaints by Borough</h2>
            {loading
              ? <div className="loading-placeholder">Loading…</div>
              : <BoroughChart data={boroughs} />}
          </div>
          <div className="card chart-card">
            <h2 className="section-title">Complaint Trends</h2>
            {loading
              ? <div className="loading-placeholder">Loading…</div>
              : <TrendsChart data={trends} />}
          </div>
          <div className="card chart-card">
            <h2 className="section-title">Top Complaint Types</h2>
            {loading
              ? <div className="loading-placeholder">Loading…</div>
              : <TopTypesChart data={types} />}
          </div>
          <div className="card chart-card">
            <h2 className="section-title">Top Agencies</h2>
            {loading
              ? <div className="loading-placeholder">Loading…</div>
              : <TopAgenciesChart data={agencies} />}
          </div>
        </div>

        <IngestionPanel jobs={jobs} onJobsChange={setJobs} />
      </main>
    </>
  );
}
