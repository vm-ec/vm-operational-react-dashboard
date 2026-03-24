import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ServiceState } from '@/react-app/components/ServiceTile';

interface ServiceStateWithInfo extends ServiceState {
  name: string;
  id: string;
}

interface ServiceStateContextType {
  serviceStates: Map<string, ServiceStateWithInfo>;
  updateServiceState: (tileId: string, name: string, id: string, state: ServiceState) => void;
}

const ServiceStateContext = createContext<ServiceStateContextType | undefined>(undefined);

interface ServiceStateProviderProps {
  children: ReactNode;
}

export function ServiceStateProvider({ children }: ServiceStateProviderProps) {
  const [serviceStates, setServiceStates] = useState<Map<string, ServiceStateWithInfo>>(new Map());

  const updateServiceState = useCallback((tileId: string, name: string, id: string, state: ServiceState) => {
    setServiceStates(prev => {
      const newMap = new Map(prev);
      newMap.set(tileId, { ...state, name, id });
      return newMap;
    });
  }, []);

  return (
    <ServiceStateContext.Provider value={{ serviceStates, updateServiceState }}>
      {children}
    </ServiceStateContext.Provider>
  );
}

export function useServiceState() {
  const context = useContext(ServiceStateContext);
  if (context === undefined) {
    throw new Error('useServiceState must be used within a ServiceStateProvider');
  }
  return context;
}
