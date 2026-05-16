import type { DemoResetResponse, IngestionJob } from '../types/api';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export async function triggerIngestion(limit: number): Promise<IngestionJob> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/api/admin/ingest/311?limit=${limit}`, { method: 'POST' });
  } catch {
    throw new Error('Unable to reach the server. Check your connection and try again.');
  }
  if (!res.ok) {
    if (res.status >= 500) {
      throw new Error('The server encountered an error during ingestion. Please try again later.');
    }
    const body = await res.text().catch(() => '');
    let message = body;
    try {
      const json = JSON.parse(body) as Record<string, unknown>;
      message = (json.message as string) ?? (json.error as string) ?? body;
    } catch {
      // plain text; use as-is
    }
    throw new Error(message || `Ingestion request failed (${res.status})`);
  }
  return res.json() as Promise<IngestionJob>;
}

export async function resetDemoData(): Promise<DemoResetResponse> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/api/admin/ingest/demo-data`, { method: 'DELETE' });
  } catch {
    throw new Error('Unable to reach the server. Check your connection and try again.');
  }
  if (!res.ok) {
    if (res.status >= 500) {
      throw new Error('The server encountered an error during reset. Please try again later.');
    }
    const body = await res.text().catch(() => '');
    let message = body;
    try {
      const json = JSON.parse(body) as Record<string, unknown>;
      message = (json.message as string) ?? (json.error as string) ?? body;
    } catch {
      // plain text; use as-is
    }
    throw new Error(message || `Reset request failed (${res.status})`);
  }
  return res.json() as Promise<DemoResetResponse>;
}

export async function fetchIngestionJobs(): Promise<IngestionJob[]> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/api/admin/ingest/jobs`);
  } catch {
    throw new Error('Unable to load ingestion history. Check your connection.');
  }
  if (!res.ok) {
    throw new Error(`Failed to load ingestion jobs (${res.status})`);
  }
  return res.json() as Promise<IngestionJob[]>;
}
