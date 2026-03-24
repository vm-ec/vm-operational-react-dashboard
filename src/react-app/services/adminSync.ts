// Service to sync dashboard configuration with admin console
export class AdminSyncService {
  private static readonly ADMIN_API_BASE = 'http://localhost:8080/api/tiles';
  
  /**
   * Fetch current dashboard configuration and send to admin console
   */
  static async syncToAdminConsole(): Promise<boolean> {
    try {
      // 1. Get current dashboard configuration
      const dashboardConfig = await this.getCurrentDashboardConfig();
      
      // 2. Transform to admin console format
      const adminPayload = this.transformToAdminFormat(dashboardConfig.tiles);
      
      // 3. Send to admin console H2 database
      const response = await fetch(`${this.ADMIN_API_BASE}/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(adminPayload)
      });
      
      if (!response.ok) {
        throw new Error(`Admin sync failed: ${response.statusText}`);
      }
      
      console.log('Successfully synced to admin console');
      return true;
    } catch (error) {
      console.error('Failed to sync to admin console:', error);
      return false;
    }
  }
  
  /**
   * Get current dashboard configuration
   */
  private static async getCurrentDashboardConfig() {
    const response = await fetch('/api/dashboard-config');
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard config');
    }
    return await response.json();
  }
  
  /**
   * Transform dashboard config to admin console format
   */
  private static transformToAdminFormat(tiles: any[]) {
    return tiles.map(tile => ({
      tileName: tile.tileName,
      prodUrl: tile.prodUrl,
      sandboxUrl: tile.sandboxUrl,
      createdBy: 'dashboard-sync',
      updatedBy: 'dashboard-sync'
    }));
  }
  
  /**
   * Fetch configuration from admin console
   */
  static async fetchFromAdminConsole() {
    try {
      const response = await fetch(`${this.ADMIN_API_BASE}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch from admin: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch from admin console:', error);
      return null;
    }
  }
  
  /**
   * Auto-sync on dashboard startup
   */
  static async initializeSync() {
    console.log('Initializing admin console sync...');
    const success = await this.syncToAdminConsole();
    if (success) {
      console.log('Dashboard configuration synced to admin console');
    } else {
      console.warn('Failed to sync dashboard configuration to admin console');
    }
  }
}