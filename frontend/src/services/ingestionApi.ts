import type { IngestionJob } from '../types/api';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export async function triggerIngestion(limit: number): Promise<IngestionJob> {
  const res = await fetch(`${BASE_URL}/api/admin/ingest/311?limit=${limit}`, {
    method: 'POST',
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Ingestion failed (${res.status}): ${body || res.statusText}`);
  }
  return res.json() as Promise<IngestionJob>;
}

export async function fetchIngestionJobs(): Promise<IngestionJob[]> {
  const res = await fetch(`${BASE_URL}/api/admin/ingest/jobs`);
  if (!res.ok) {
    throw new Error(`Failed to load ingestion jobs (${res.status})`);
  }
  return res.json() as Promise<IngestionJob[]>;
}
