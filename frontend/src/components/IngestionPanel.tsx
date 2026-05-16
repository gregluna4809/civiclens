import { useState } from 'react';
import type { IngestionJob } from '../types/api';
import { triggerIngestion, fetchIngestionJobs, resetDemoData } from '../services/ingestionApi';

interface Props {
  jobs: IngestionJob[];
  onJobsChange: (jobs: IngestionJob[]) => void;
  loading?: boolean;
  // Called after a successful reset so the parent can reload analytics.
  onReset?: () => Promise<void>;
}

export function IngestionPanel({ jobs, onJobsChange, loading = false, onReset }: Props) {
  const [ingesting, setIngesting] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetConfirming, setResetConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Disable all buttons while any async operation is in flight.
  const busy = ingesting || resetting;

  async function handleIngest(limit: number) {
    setIngesting(true);
    setError(null);
    setSuccessMessage(null);
    setResetConfirming(false);
    try {
      const result = await triggerIngestion(limit);
      // Refresh the full job list after each run.
      const updated = await fetchIngestionJobs();
      onJobsChange(updated);
      // Surface the actual record count from the completed job.
      const count = result.recordsProcessed;
      if (count === 0) {
        setSuccessMessage('Ingestion completed. No new records found (data may already be stored).');
      } else {
        setSuccessMessage(`Ingested ${count.toLocaleString()} new record${count !== 1 ? 's' : ''} successfully.`);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ingestion failed');
    } finally {
      setIngesting(false);
    }
  }

  async function handleResetExecute() {
    setResetting(true);
    setResetConfirming(false);
    setError(null);
    setSuccessMessage(null);
    try {
      await resetDemoData();
      // Clear jobs immediately for responsive feedback before the parent reloads.
      onJobsChange([]);
      // Reload all analytics to reflect the now-empty database.
      if (onReset) await onReset();
      setSuccessMessage('Demo data reset. All records and ingestion history have been deleted.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Reset failed');
    } finally {
      setResetting(false);
    }
  }

  const showTableSkeleton = loading && jobs.length === 0;

  return (
    <div className="card ingestion-panel">
      <h2 className="section-title">Data Ingestion</h2>
      <div className="ingestion-actions">
        <button
          className="btn btn-primary"
          onClick={() => handleIngest(25)}
          disabled={busy}
        >
          {ingesting && <span className="btn-spinner" />}
          {ingesting ? 'Ingesting…' : 'Ingest 25 Records'}
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => handleIngest(100)}
          disabled={busy}
        >
          {ingesting ? 'Ingesting…' : 'Ingest 100 Records'}
        </button>

        {/* Reset area pushed right to visually separate it as a destructive action. */}
        <div className="ingestion-reset-area">
          {resetConfirming ? (
            <>
              <span className="reset-confirm-label">This will delete all data.</span>
              <button
                className="btn btn-danger"
                onClick={handleResetExecute}
                disabled={busy}
              >
                {resetting && <span className="btn-spinner" />}
                Confirm Reset
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => setResetConfirming(false)}
                disabled={busy}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              className="btn btn-danger"
              onClick={() => { setResetConfirming(true); setError(null); setSuccessMessage(null); }}
              disabled={busy}
            >
              {resetting && <span className="btn-spinner" />}
              Reset Demo Data
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: 12 }}>
          <svg className="alert-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{error}</span>
        </div>
      )}
      {successMessage && (
        <div className="alert alert-success" style={{ marginBottom: 12 }}>
          <svg className="alert-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>{successMessage}</span>
        </div>
      )}

      {showTableSkeleton ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="skeleton"
              style={{ height: 40, borderRadius: i === 1 ? '4px 4px 0 0' : i === 3 ? '0 0 4px 4px' : 0 }}
            />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <p className="jobs-empty">No ingestion jobs yet.</p>
      ) : (
        <div className="table-wrapper">
          <table className="jobs-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Status</th>
                <th>Started</th>
                <th>Finished</th>
                <th>Records</th>
                <th>Error</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td className="job-id">{job.id}</td>
                  <td>{formatJobType(job.jobType)}</td>
                  <td>
                    <span className={`status-badge status-${job.status.toLowerCase()}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="timestamp-cell">{formatDateTime(job.startedAt)}</td>
                  <td className="timestamp-cell">{job.finishedAt ? formatDateTime(job.finishedAt) : '—'}</td>
                  <td>{job.recordsProcessed.toLocaleString()}</td>
                  <td className="error-cell" title={job.errorMessage ?? ''}>
                    {job.errorMessage ?? '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return (
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
    ' · ' +
    d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  );
}

// Convert UPPER_SNAKE_CASE job type names to Title Case for display.
function formatJobType(raw: string): string {
  return raw
    .toLowerCase()
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
