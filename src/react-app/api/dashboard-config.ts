import { CATEGORIES, MICROSERVICES, BASE_SERVICES, TILE_URL_OVERRIDES, DASHBOARD_CONFIG } from '@/react-app/config/environments';

// Define types for the API response
interface TileData {
  tileName: string;
  prodUrl: string;
  sandboxUrl: string;
  category: string;
  categoryId: string;
  tileId: string;
  shortId: string;
  baseServiceId: string;
  createdBy: string;
  updatedBy: string;
}

interface ConfigData {
  tiles: TileData[];
  categories: typeof CATEGORIES;
  baseServices: typeof BASE_SERVICES;
  dashboardConfig: typeof DASHBOARD_CONFIG;
  totalTiles: number;
  timestamp: string;
}

// API endpoint to expose dashboard configuration
export async function GET() {
  try {
    // Transform current config to match admin console format
    const tilesData: TileData[] = [];
    
    CATEGORIES.forEach(category => {
      const microservices = MICROSERVICES[category.id] || [];
      const tilesPerCategory = DASHBOARD_CONFIG.tilesPerCategory;
      
      Array.from({ length: tilesPerCategory }, (_, index) => {
        const microservice = microservices[index % microservices.length] || {
          name: 'Service',
          shortId: String(index + 1),
        };
        const tileId = `tile-${category.id}-${index + 1}`;
        
        // Get base service endpoints
        const baseService = BASE_SERVICES.find(s => s.id === category.baseServiceId);
        const prodUrl = baseService?.endpoints.production?.health || '';
        const sandboxUrl = baseService?.endpoints.sandbox?.health || '';
        
        // Check for tile-specific overrides
        const override = TILE_URL_OVERRIDES[tileId];
        const finalProdUrl = override?.production?.health || prodUrl;
        const finalSandboxUrl = override?.sandbox?.health || sandboxUrl;
        
        tilesData.push({
          tileName: `${microservice.name} (${category.title})`,
          prodUrl: finalProdUrl,
          sandboxUrl: finalSandboxUrl,
          category: category.title,
          categoryId: category.id,
          tileId: tileId,
          shortId: microservice.shortId,
          baseServiceId: category.baseServiceId,
          createdBy: 'system',
          updatedBy: 'system'
        });
      });
    });
    
    const configData: ConfigData = {
      tiles: tilesData,
      categories: CATEGORIES,
      baseServices: BASE_SERVICES,
      dashboardConfig: DASHBOARD_CONFIG,
      totalTiles: tilesData.length,
      timestamp: new Date().toISOString()
    };
    
    return Response.json(configData);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch configuration' }, { status: 500 });
  }
}