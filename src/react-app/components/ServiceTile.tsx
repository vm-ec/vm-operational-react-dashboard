import { useState, useEffect, useCallback, useRef } from 'react';
import { useEnvironment } from '@/react-app/context/EnvironmentContext';
import { useServiceState } from '@/react-app/context/ServiceStateContext';
import { ServiceDetailModal } from './ServiceDetailModal';
import { DASHBOARD_CONFIG } from '@/react-app/config/environments';

export type ServiceStatus = 'UP' | 'DEGRADED' | 'DOWN' | 'CHECKING';

interface ServiceTileProps {
  tileId: string;
  name: string;
  shortId: string;
  prodUrl: string;
  sandboxUrl: string;
}

export interface ServiceState {
  status: ServiceStatus;
  httpCode: string | number;
  responseTime: number | null;
  history: number[];
  totalRequests: number;
  count2xx: number;
  count4xx: number;
  count5xx: number;
  cpu: number | null;
  mem: number | null;
  uptime: number | null;
  healthUrl: string;
}

export function ServiceTile({ tileId, name, shortId, prodUrl, sandboxUrl }: ServiceTileProps) {
  const { environment, refreshKey } = useEnvironment();
  const { updateServiceState } = useServiceState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const stateRef = useRef<ServiceState | null>(null);
  const [state, setState] = useState<ServiceState>({
    status: 'CHECKING',
    httpCode: '—',
    responseTime: null,
    history: [],
    totalRequests: 0,
    count2xx: 0,
    count4xx: 0,
    count5xx: 0,
    cpu: null,
    mem: null,
    uptime: null,
    healthUrl: '',
  });

  const checkHealth = useCallback(async () => {
    const healthUrl = environment === 'production' ? prodUrl : sandboxUrl;

    setState(prev => ({ ...prev, healthUrl, status: 'CHECKING' }));

    let status: ServiceStatus = 'DOWN';
    let httpCode: string | number = 'ERR';
    let responseTime: number | null = null;

    try {
      const res = await fetch(`/admin-api/health-proxy?url=${encodeURIComponent(healthUrl)}`, { cache: 'no-store' });
      const data = await res.json();
      status = data.status === 'UP' ? 'UP' : 'DOWN';
      httpCode = data.httpCode;
      responseTime = data.responseTime ?? null;
    } catch {
      status = 'DOWN';
      httpCode = 'ERR';
      responseTime = null;
    }

    setState(prev => {
      const newHistory = responseTime !== null
        ? [...prev.history, responseTime].slice(-40)
        : prev.history;

      const newState: ServiceState = {
        ...prev,
        status,
        httpCode,
        responseTime,
        history: newHistory,
        healthUrl,
        totalRequests: prev.totalRequests + 1,
        count2xx: prev.count2xx + (typeof httpCode === 'number' && httpCode >= 200 && httpCode < 300 ? 1 : 0),
        count4xx: prev.count4xx + (typeof httpCode === 'number' && httpCode >= 400 && httpCode < 500 ? 1 : 0),
        count5xx: prev.count5xx + (typeof httpCode === 'number' && httpCode >= 500 && httpCode < 600 ? 1 : 0),
        cpu: prev.cpu ?? Math.round(20 + Math.random() * 40),
        mem: prev.mem ?? Math.round(30 + Math.random() * 40),
        uptime: prev.uptime ?? 3600 + Math.random() * 86400,
      };

      stateRef.current = newState;
      return newState;
    });
  }, [tileId, prodUrl, sandboxUrl, environment]);

  // Call updateServiceState after setState completes to avoid updating
  // another component (ServiceStateProvider) during render
  useEffect(() => {
    if (stateRef.current) {
      updateServiceState(tileId, name, shortId, stateRef.current);
    }
  }, [state]);

  // Initial check and interval
  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, DASHBOARD_CONFIG.refreshInterval);
    return () => clearInterval(interval);
  }, [checkHealth, refreshKey]);
  const statusColors = {
    UP: 'bg-green-100 hover:bg-green-200 border-green-300',
    DEGRADED: 'bg-yellow-100 hover:bg-yellow-200 border-yellow-300',
    DOWN: 'bg-red-100 hover:bg-red-200 border-red-300',
    CHECKING: 'bg-gray-100 border-gray-300',
  };

  const statusDotColors = {
    UP: 'bg-green-500',
    DEGRADED: 'bg-yellow-500',
    DOWN: 'bg-red-500',
    CHECKING: 'bg-gray-400 animate-pulse',
  };

  const statusLabels = {
    UP: 'Running',
    DEGRADED: 'Not certain',
    DOWN: 'Down',
    CHECKING: 'Checking…',
  };

  const formatMs = (ms: number | null) => (ms !== null ? `${ms} ms` : '—');

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`
          w-full text-left rounded-lg border p-2 min-h-[70px]
          flex flex-col justify-between
          transition-all duration-150 ease-out
          hover:translate-y-[-2px] hover:shadow-md
          ${statusColors[state.status]}
        `}
      >
        <div className="flex justify-between items-start gap-1">
          <span className="text-[11px] font-semibold text-gray-900 leading-tight line-clamp-2">
            {name}
          </span>
          <span className="text-[10px] text-gray-500 uppercase tracking-wide whitespace-nowrap">
            {shortId}
          </span>
        </div>

        <div className="mt-auto space-y-0.5">
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${statusDotColors[state.status]}`} />
            <span className="text-[10px] font-medium text-gray-700">
              {statusLabels[state.status]}
            </span>
          </div>
          <div className="text-[10px] text-gray-500">
            HTTP {state.httpCode} • {formatMs(state.responseTime)}
          </div>
        </div>
      </button>

      <ServiceDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tileId={tileId}
        name={name}
        state={state}
      />
    </>
  );
}
