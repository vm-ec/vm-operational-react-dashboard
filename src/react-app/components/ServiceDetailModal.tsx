import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/react-app/components/ui/dialog';
import { Button } from '@/react-app/components/ui/button';
import { ServiceState } from './ServiceTile';
import { EXTERNAL_URLS } from '@/react-app/config/environments';
import { computeAverage, computeP95, formatMs, formatPercent, formatUptime } from '@/react-app/services/api';
import { ExternalLink, Activity, Cpu, HardDrive, Clock, AlertTriangle } from 'lucide-react';
import { ResponseTimeChart } from './ResponseTimeChart';

interface ServiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  tileId: string;
  name: string;
  state: ServiceState;
}

export function ServiceDetailModal({
  isOpen,
  onClose,
  tileId,
  name,
  state,
}: ServiceDetailModalProps) {
  const avgResponseTime = computeAverage(state.history);
  const p95ResponseTime = computeP95(state.history);
  
  const errorCount = state.count4xx + state.count5xx;
  const errorRate = state.totalRequests > 0 ? errorCount / state.totalRequests : 0;

  // Extract service name from URL
  const extractServiceName = (url: string): string => {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname;
      
      // Extract service name from hostname
      // Example: vm-service-policy-rating.onrender.com -> vm-service-policy-rating
      const serviceName = hostname.split('.')[0];
      
      // Remove 'vm-service-' prefix if present to get clean service name
      const cleanServiceName = serviceName.replace(/^(vm-service-|sandbox-vm-service-)/, '');
      
      return cleanServiceName;
    } catch {
      return 'unknown-service';
    }
  };

  // Extract environment from URL
  const extractEnvironment = (url: string): 'prod' | 'sandbox' => {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname;
      
      // Check if URL contains 'sandbox' prefix
      if (hostname.includes('sandbox-') || hostname.includes('sandbox.')) {
        return 'sandbox';
      }
      
      return 'prod';
    } catch {
      return 'prod';
    }
  };

  const serviceName = extractServiceName(state.healthUrl);
  const environment = extractEnvironment(state.healthUrl);

  // Dynamic external URLs with service name and environment
  const getDynamicExternalUrls = (serviceName: string, env: 'prod' | 'sandbox') => {
    const baseUrls = {
      deepHealthCheck: `https://enzymolytic-cristiano-wartier.ngrok-free.dev/?app=${serviceName}&env=${env}`,
      rootCauseAnalysis: `https://teams.microsoft.com/l/app/f6405520-7907-4464-8f6e-9889e2fb7d8f?source=app-header-share-entrypoint&templateInstanceId=19a6974b-869b-465b-b040-5da5fdab88d6&environment=Default-13085c86-4bcb-460a-a6f0-b373421c6323&service=${serviceName}&env=${env}`,
      knowledgeAssistance: `https://teams.microsoft.com/l/app/f6405520-7907-4464-8f6e-9889e2fb7d8f?source=app-header-share-entrypoint&templateInstanceId=a0b68361-3c13-4c9a-b3c5-f9598f059b04&environment=Default-13085c86-4bcb-460a-a6f0-b373421c6323&service=${serviceName}&env=${env}`,
      automatedJobMonitoring: `https://teams.microsoft.com/l/app/f6405520-7907-4464-8f6e-9889e2fb7d8f?source=app-header-share-entrypoint&templateInstanceId=14d0239d-fd42-47a8-842e-9b13597c167b&environment=Default-13085c86-4bcb-460a-a6f0-b373421c6323&service=${serviceName}&env=${env}`,
    };
    return baseUrls;
  };

  const dynamicUrls = getDynamicExternalUrls(serviceName, environment);

  const statusColors = {
    UP: 'text-green-600 bg-green-100',
    DEGRADED: 'text-yellow-600 bg-yellow-100',
    DOWN: 'text-red-600 bg-red-100',
    CHECKING: 'text-gray-600 bg-gray-100',
  };

  const statusLabels = {
    UP: 'Running',
    DEGRADED: 'Not certain',
    DOWN: 'Down',
    CHECKING: 'Checking…',
  };

  const openExternalUrl = (url: string) => {
    window.open(url, '_blank'); 
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-2">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">{name}</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {tileId} • {state.healthUrl}
          </p>
        </DialogHeader>

        {/* Health & Latency Section */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Health & Latency
          </h4>
          
          <div className="grid grid-cols-2 gap-2">
            <MetricCard
              label="Current status"
              value={
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-sm font-medium ${statusColors[state.status]}`}>
                  {statusLabels[state.status]}
                </span>
              }
              footer={`HTTP ${state.httpCode}`}
            />
            <MetricCard
              label="Last response time"
              value={formatMs(state.responseTime)}
              footer={`Average: ${formatMs(avgResponseTime)} • P95: ${formatMs(p95ResponseTime)}`}
            />
          </div>
        </div>

        {/* Response Time Chart */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground">
            Time vs Response Time (last checks)
          </h4>
          <div className="bg-muted/50 rounded-lg p-4 border">
            <ResponseTimeChart history={state.history} />
          </div>
        </div>

        {/* Resources Section */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Cpu className="w-4 h-4" />
            Resources
          </h4>
          
          <div className="grid grid-cols-4 gap-2">
            <MetricCard
              label="CPU usage"
              value={state.cpu !== null ? `${state.cpu}%` : '—'}
              footer="From /metrics if available"
              icon={<Cpu className="w-3 h-3" />}
            />
            <MetricCard
              label="Memory usage"
              value={state.mem !== null ? `${state.mem}%` : '—'}
              footer="From /metrics if available"
              icon={<HardDrive className="w-3 h-3" />}
            />
            <MetricCard
              label="Uptime"
              value={formatUptime(state.uptime)}
              footer="Reported by server"
              icon={<Clock className="w-3 h-3" />}
            />
            <MetricCard
              label="Response rate"
              value={state.totalRequests > 0 ? `${(state.totalRequests * 6).toFixed(1)} / min` : '—'}
              footer="Per dashboard polling"
            />
          </div>
        </div>

        {/* Error Distribution */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Error Distribution
          </h4>
          
          <div className="grid grid-cols-2 gap-2">
            <MetricCard
              label="Request counts"
              value={`Total: ${state.totalRequests}`}
              footer={`2xx: ${state.count2xx} • 4xx: ${state.count4xx} • 5xx: ${state.count5xx}`}
            />
            <MetricCard
              label="Error rate"
              value={formatPercent(errorRate)}
              footer={`Includes 4xx and 5xx over ${state.totalRequests} checks`}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-2">
          <h4 className="text-sm font-semibold text-foreground">Actions</h4>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => openExternalUrl(dynamicUrls.deepHealthCheck)}
              className="bg-primary text-primary-foreground"
            >
              Run Deep Health Check
              <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
            <Button
              variant="outline"
              onClick={() => openExternalUrl(dynamicUrls.rootCauseAnalysis)}
            >
              Root Cause Analysis
              <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
            <Button
              variant="outline"
              onClick={() => openExternalUrl(dynamicUrls.knowledgeAssistance)}
            >
              Knowledge Assistance
              <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
            <Button
              variant="outline"
              onClick={() => openExternalUrl(dynamicUrls.automatedJobMonitoring)}
            >
              Automated Job Monitoring
              <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface MetricCardProps {
  label: string;
  value: React.ReactNode;
  footer: string;
  icon?: React.ReactNode;
}

function MetricCard({ label, value, footer, icon }: MetricCardProps) {
  return (
    <div className="bg-muted/50 rounded-lg p-2 border">
      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
        {icon}
        {label}
      </div>
      <div className="text-sm font-semibold text-foreground">
        {value}
      </div>
      <div className="text-[11px] text-muted-foreground mt-1">
        {footer}
      </div>
    </div>
  );
}
