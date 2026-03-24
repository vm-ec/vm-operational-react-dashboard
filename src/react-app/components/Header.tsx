import { useState, useEffect } from 'react';
import { RefreshCw, Clock } from 'lucide-react';
import { useEnvironment } from '@/react-app/context/EnvironmentContext';
import { EnvironmentSelector } from './EnvironmentSelector';
import { DASHBOARD_CONFIG } from '@/react-app/config/environments';

export function Header() {
  const { triggerRefresh } = useEnvironment();
  const [lastChecked, setLastChecked] = useState<string>('Never');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      setLastChecked(new Date().toLocaleTimeString());
    };
    
    // Update immediately and then on interval
    updateTime();
    const interval = setInterval(updateTime, DASHBOARD_CONFIG.refreshInterval);
    
    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    triggerRefresh();
    setLastChecked(new Date().toLocaleTimeString());
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <header className="bg-gradient-to-r from-[#0A2540] via-[#3B1F74] to-[#0A2540] text-white shadow-lg">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <img 
              src="/logo/logo.png" 
              alt="Logo" 
              className="h-12 w-auto object-contain"
            />
            <div>
              <h1 className="text-lg font-bold tracking-tight">
                ValueMomentum
              </h1>
              <p className="text-xs text-white/70">
                Operational Health Dashboard
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <EnvironmentSelector />
            
            <button
              onClick={handleManualRefresh}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <div className="flex items-center gap-4 text-sm">
              {/* <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10">
                <span className="text-white/70">Auto-refresh:</span>
                <span className="font-semibold">{DASHBOARD_CONFIG.refreshInterval / 1000}s</span>
              </div> */}
              
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10">
                <Clock className="w-4 h-4 text-white/70" />
                <span className="text-white/70">Last:</span>
                <span className="font-semibold">{lastChecked}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
