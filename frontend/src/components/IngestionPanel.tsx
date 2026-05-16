import { useState } from 'react';
import type { IngestionJob } from '../types/api';
import { triggerIngestion, fetchIngestionJobs } from '../services/ingestionApi';

interface Props {
  jobs: IngestionJob[];
  onJobsChange: (jobs: IngestionJob[]) => void;
}

export function IngestionPanel({ jobs, onJobsChange }: Props) {
  const [ingesting, setIngesting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleIngest(limit: number) {
    setIngesting(true);
    setError(null);
    try {
      await triggerIngestion(limit);
      // Refresh the full job list after each run.
      const updated = await fetchIngestionJobs();
      onJobsChange(updated);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ingestion failed');
    } finally {
      setIngesting(false);
    }
  }

  return (
    <div className="card ingestion-panel">
      <h2 className="section-title">Data Ingestion</h2>
      <div className="ingestion-actions">
        <button
          className="btn btn-primary"
          onClick={() => handleIngest(25)}
          disabled={ingesting}
        >
          {ingesting ? 'Ingesting…' : 'Ingest 25 Records'}
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => handleIngest(100)}
          disabled={ingesting}
        >
          {ingesting ? 'Ingesting…' : 'Ingest 100 Records'}
        </button>
      </div>

      {error && <p className="ingestion-error">{error}</p>}

      {jobs.length === 0 ? (
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
                  <td>{job.id}</td>
                  <td>{job.jobType}</td>
                  <td>
                    <span className={`status-badge status-${job.status.toLowerCase()}`}>
                      {job.status}
                    </span>
                  </td>
                  <td>{formatDateTime(job.startedAt)}</td>
                  <td>{job.finishedAt ? formatDateTime(job.finishedAt) : '—'}</td>
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
  return new Date(iso).toLocaleString();
}
