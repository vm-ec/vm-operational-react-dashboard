import { useEnvironment } from '@/react-app/context/EnvironmentContext';
import { DASHBOARD_CONFIG, CATEGORIES, BASE_SERVICES } from '@/react-app/config/environments';
import { Globe, Layers, Server } from 'lucide-react';

export function MetadataBar() {
  const { environment } = useEnvironment();
  const totalTiles = CATEGORIES.length * DASHBOARD_CONFIG.tilesPerCategory;
  const uniqueAPIs = BASE_SERVICES.length;

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      {/* Environment Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-card rounded-full shadow-sm border">
        <Server className="w-4 h-4 text-accent" />
        <span className="text-sm text-muted-foreground">Environment:</span>
        <span className="text-sm font-semibold capitalize">{environment}</span>
      </div>

      {/* Region Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-card rounded-full shadow-sm border">
        <Globe className="w-4 h-4 text-accent" />
        <span className="text-sm text-muted-foreground">Region:</span>
        <span className="text-sm font-semibold">{DASHBOARD_CONFIG.region}</span>
      </div>

      {/* Stats (right aligned) */}
      <div className="ml-auto flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4" />
          <span>Total tiles: <strong className="text-foreground">{totalTiles}</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4" />
          <span>Unique APIs: <strong className="text-foreground">{uniqueAPIs}</strong></span>
        </div>
      </div>
    </div>
  );
}
