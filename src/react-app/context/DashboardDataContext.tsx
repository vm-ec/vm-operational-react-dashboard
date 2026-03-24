import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const ADMIN_API = '/admin-api';

export interface H2Service {
  id: number;
  serviceId: string;
  serviceName: string;
  description: string;
  category: string;
}

export interface H2Application {
  id: number;
  applicationName: string;
  prodUrl: string;
  sandboxUrl: string;
  serviceId: number;
}

interface DashboardDataContextType {
  services: H2Service[];
  applications: H2Application[];
  loading: boolean;
  error: string | null;
  getApplicationsByServiceId: (serviceId: number) => H2Application[];
}

const DashboardDataContext = createContext<DashboardDataContextType | undefined>(undefined);

export function DashboardDataProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<H2Service[]>([]);
  const [applications, setApplications] = useState<H2Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [servicesRes, appsRes] = await Promise.all([
        fetch(`${ADMIN_API}/services`),
        fetch(`${ADMIN_API}/applications`),
      ]);

      if (!servicesRes.ok || !appsRes.ok) throw new Error('Failed to fetch from H2');

      const [servicesData, appsData] = await Promise.all([
        servicesRes.json(),
        appsRes.json(),
      ]);

      setServices(servicesData);
      setApplications(appsData);
      setError(null);
    } catch (err) {
      setError('Failed to load data from H2 database');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Poll every 30 seconds to pick up any admin changes
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getApplicationsByServiceId = (serviceId: number) =>
    applications.filter(app => app.serviceId === serviceId);

  return (
    <DashboardDataContext.Provider value={{ services, applications, loading, error, getApplicationsByServiceId }}>
      {children}
    </DashboardDataContext.Provider>
  );
}

export function useDashboardData() {
  const context = useContext(DashboardDataContext);
  if (!context) throw new Error('useDashboardData must be used within DashboardDataProvider');
  return context;
}
