import { ServiceState } from './ServiceTile';

interface AISnapshotProps {
  allServiceStates: Map<string, ServiceState & { name: string; id: string }>;
}

export function AISnapshot({ allServiceStates }: AISnapshotProps) {
  const allStates = Array.from(allServiceStates.values());

  // Calculate metrics
  const up = allStates.filter(s => s.status === 'UP').length;
  const degraded = allStates.filter(s => s.status === 'DEGRADED').length;
  const down = allStates.filter(s => s.status === 'DOWN').length;

  // Find slowest and fastest
  let slowest: { id: string; value: number } | null = null;
  let fastest: { id: string; value: number } | null = null;
  
  allStates.forEach(s => {
    const v = s.history.length > 0 
      ? s.history.reduce((a, b) => a + b, 0) / s.history.length 
      : s.responseTime;
    
    if (v != null) {
      if (!slowest || v > slowest.value) {
        slowest = { id: s.id, value: Math.round(v) };
      }
      if (!fastest || v < fastest.value) {
        fastest = { id: s.id, value: Math.round(v) };
      }
    }
  });

  // Find worst and best error rates
  let worstErr: { id: string; rate: number } | null = null;
  let bestErr: { id: string; rate: number } | null = null;
  
  allStates.forEach(s => {
    const err = s.count4xx + s.count5xx;
    const rate = s.totalRequests ? err / s.totalRequests : 0;
    
    if (s.totalRequests > 0) {
      if (!worstErr || rate > worstErr.rate) {
        worstErr = { id: s.id, rate };
      }
      if (bestErr === null || rate < bestErr.rate) {
        bestErr = { id: s.id, rate };
      }
    }
  });

  // Calculate overall risk
  let overall = 'Low';
  if (down > 0 || (worstErr && worstErr.rate > 0.15) || (slowest && slowest.value > 2000)) {
    overall = 'High';
  } else if (degraded > 0 || (worstErr && worstErr.rate > 0.05) || (slowest && slowest.value > 1000)) {
    overall = 'Medium';
  }

  // Generate hint
  let hint = 'Landscape stable.';
  if (down > 0) {
    hint = `${down} service(s) down — check incidents.`;
  } else if (degraded > 0) {
    hint = `${degraded} service(s) slow — watch latency.`;
  } else if (worstErr && worstErr.rate > 0.1) {
    hint = `Errors concentrated on ${worstErr.id}.`;
  }

  const riskColors = {
    Low: 'text-green-700 bg-green-100 border-green-300',
    Medium: 'text-yellow-700 bg-yellow-100 border-yellow-300',
    High: 'text-red-700 bg-red-100 border-red-300',
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-4 shadow-lg border border-purple-200">
      {/* Category Header */}
      <div className="mb-4 pb-3 border-b border-purple-200">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-sm font-bold text-gray-800">
            AI SNAPSHOT
          </h3>
        </div>
        <p className="text-xs text-purple-600 font-medium">
          Intelligent health insights
        </p>
      </div>

      {/* AI Sections */}
      <div className="flex flex-col gap-3">
        {/* Overall Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-purple-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            <div className="text-xs font-bold text-gray-800">
              OVERALL STATUS
            </div>
          </div>
          <div className="text-xs text-gray-700 space-y-1">
            <div className="flex justify-between items-center">
              <span>Risk Level:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${riskColors[overall as keyof typeof riskColors]}`}>{overall}</span>
            </div>
            <div className="flex justify-between">
              <span>Services:</span>
              <span className="font-semibold">{up}↑ {degraded}⚠ {down}↓</span>
            </div>
          </div>
        </div>

        {/* Performance Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-purple-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"></div>
            <div className="text-xs font-bold text-gray-800">
              PERFORMANCE
            </div>
          </div>
          <div className="text-xs text-gray-700 space-y-1">
            <div className="flex justify-between">
              <span>⚡ Fastest:</span>
              <span className="font-semibold text-green-600">{fastest ? `${fastest.id} ${fastest.value}ms` : '—'}</span>
            </div>
            <div className="flex justify-between">
              <span>🐌 Slowest:</span>
              <span className="font-semibold text-orange-600">{slowest ? `${slowest.id} ${slowest.value}ms` : '—'}</span>
            </div>
          </div>
        </div>

        {/* Reliability Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-purple-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-gradient-to-r from-yellow-500 to-red-500 rounded-full"></div>
            <div className="text-xs font-bold text-gray-800">
              RELIABILITY
            </div>
          </div>
          <div className="text-xs text-gray-700 space-y-1">
            <div className="flex justify-between">
              <span>✅ Best:</span>
              <span className="font-semibold text-green-600">{bestErr ? `${bestErr.id} ${(bestErr.rate * 100).toFixed(1)}%` : '—'}</span>
            </div>
            <div className="flex justify-between">
              <span>❌ Worst:</span>
              <span className="font-semibold text-red-600">{worstErr ? `${worstErr.id} ${(worstErr.rate * 100).toFixed(1)}%` : '—'}</span>
            </div>
          </div>
        </div>

        {/* AI Focus Section */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-3 border border-purple-200 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
            <div className="text-xs font-bold text-purple-800">
              🤖 AI INSIGHTS
            </div>
          </div>
          <div className="text-xs text-purple-700 font-medium mb-2">
            {hint}
          </div>
          <div className="text-[10px] text-purple-600 italic">
            💡 Click tiles for detailed analysis
          </div>
        </div>
      </div>
    </div>
  );
}
