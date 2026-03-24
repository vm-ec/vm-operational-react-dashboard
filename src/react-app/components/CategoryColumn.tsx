import { H2Service, useDashboardData } from '@/react-app/context/DashboardDataContext';
import { ServiceTile } from './ServiceTile';

interface CategoryColumnProps {
  service: H2Service;
}

export function CategoryColumn({ service }: CategoryColumnProps) {
  const { getApplicationsByServiceId } = useDashboardData();
  const applications = getApplicationsByServiceId(service.id);

  return (
    <div className="bg-gradient-to-r from-purple-100 to-sky-100 rounded-xl p-3 shadow-sm">
      {/* Category Header */}
      <div className="mb-3 pb-2 border-b border-dashed border-border/50">
        <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
          {service.serviceName}
        </h3>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          {service.description}
        </p>
      </div>

      {/* Tiles Grid - 2 columns */}
      <div className="grid grid-cols-2 gap-2">
        {applications.map((app, index) => (
          <ServiceTile
            key={app.id}
            tileId={`tile-${service.id}-${index + 1}`}
            name={app.applicationName}
            shortId={String(index + 1)}
            prodUrl={app.prodUrl}
            sandboxUrl={app.sandboxUrl}
          />
        ))}
      </div>
    </div>
  );
}
