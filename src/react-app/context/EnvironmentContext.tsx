import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Environment } from '@/react-app/config/environments';

interface EnvironmentContextType {
  environment: Environment;
  setEnvironment: (env: Environment) => void;
  refreshKey: number;
  triggerRefresh: () => void;
}

const EnvironmentContext = createContext<EnvironmentContextType | undefined>(undefined);

interface EnvironmentProviderProps {
  children: ReactNode;
}

export function EnvironmentProvider({ children }: EnvironmentProviderProps) {
  const [environment, setEnvironmentState] = useState<Environment>('production');
  const [refreshKey, setRefreshKey] = useState(0);

  const setEnvironment = useCallback((env: Environment) => {
    setEnvironmentState(env);
    // Trigger a refresh when environment changes
    setRefreshKey(prev => prev + 1);
  }, []);

  const triggerRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  return (
    <EnvironmentContext.Provider value={{ environment, setEnvironment, refreshKey, triggerRefresh }}>
      {children}
    </EnvironmentContext.Provider>
  );
}

export function useEnvironment() {
  const context = useContext(EnvironmentContext);
  if (context === undefined) {
    throw new Error('useEnvironment must be used within an EnvironmentProvider');
  }
  return context;
}
