import {
  Environment,
  ServiceEndpoint,
  BASE_SERVICES,
  TILE_URL_OVERRIDES,
} from '@/react-app/config/environments';

/**
 * Get the service endpoint URLs for a specific tile based on environment
 */
export function getServiceEndpoint(
  tileId: string,
  baseServiceId: string,
  environment: Environment
): ServiceEndpoint {
  // Check for tile-specific overrides first
  const override = TILE_URL_OVERRIDES[tileId];
  
  // Find the base service configuration
  const baseService = BASE_SERVICES.find(s => s.id === baseServiceId);
  
  if (!baseService) {
    throw new Error(`Base service not found: ${baseServiceId}`);
  }

  const baseEndpoint = baseService.endpoints[environment];

  // Merge override with base endpoint
  if (override && override[environment]) {
    return {
      health: override[environment]?.health || baseEndpoint.health,
      metrics: override[environment]?.metrics || baseEndpoint.metrics,
    };
  }

  return baseEndpoint;
}

/**
 * Fetch health status from a service endpoint
 */
export async function fetchHealthStatus(healthUrl: string): Promise<{
  status: 'UP' | 'DEGRADED' | 'DOWN';
  httpCode: number | string;
  responseTime: number | null;
}> {
  const start = performance.now();

  try {
    const res = await fetch(healthUrl, { method: 'GET', cache: 'no-store' });
    const duration = Math.round(performance.now() - start);

    let status: 'UP' | 'DEGRADED' | 'DOWN' = 'DOWN';
    
    if (res.status >= 200 && res.status < 300) {
      status = 'UP';
    } else if (res.status >= 400 || res.status === 0) {
      status = 'DOWN';
    } else {
      status = 'DEGRADED';
    }

    return {
      status,
      httpCode: res.status,
      responseTime: duration,
    };
  } catch {
    return {
      status: 'DOWN',
      httpCode: 'ERR',
      responseTime: null,
    };
  }
}

/**
 * Fetch metrics from a service endpoint
 */
export async function fetchMetrics(metricsUrl: string): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetch(metricsUrl, { method: 'GET', cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Calculate average from an array of numbers
 */
export function computeAverage(arr: number[]): number | null {
  if (!arr.length) return null;
  const sum = arr.reduce((a, b) => a + b, 0);
  return Math.round(sum / arr.length);
}

/**
 * Calculate P95 percentile from an array of numbers
 */
export function computeP95(arr: number[]): number | null {
  if (!arr.length) return null;
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = Math.floor(0.95 * (sorted.length - 1));
  return Math.round(sorted[idx]);
}

/**
 * Format milliseconds for display
 */
export function formatMs(ms: number | null): string {
  if (ms === null) return '—';
  return `${ms} ms`;
}

/**
 * Format percentage for display
 */
export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

/**
 * Format uptime duration
 */
export function formatUptime(seconds: number | null): string {
  if (seconds === null) return '—';
  
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}
