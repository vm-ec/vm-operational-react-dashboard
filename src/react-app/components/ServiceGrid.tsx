import { useDashboardData } from '@/react-app/context/DashboardDataContext';
import { CategoryColumn } from './CategoryColumn';

export function ServiceGrid() {
  const { services, loading, error } = useDashboardData();

  if (loading) return <div className="col-span-6 text-center py-10 text-gray-500">Loading services...</div>;
  if (error) return <div className="col-span-6 text-center py-10 text-red-500">{error}</div>;

  return (
    <>
      {services.map((service) => (
        <CategoryColumn key={service.id} service={service} />
      ))}
    </>
  );
}
