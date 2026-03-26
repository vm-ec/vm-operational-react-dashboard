## Project Description

A real-time operational health monitoring dashboard insurance microservices platform. It continuously polls health endpoints of 50+ microservices across 5 service categories (Policy, Billing, Claims, Product & Filings, Shared Services) and displays their live status, response times, error rates, and resource metrics — all in a single-page UI. Operators can switch between **Production** and **Sandbox** environments, drill into any service tile for detailed diagnostics, and launch external tools (Root Cause Analysis, Deep Health Check, Knowledge Assistance, Automated Job Monitoring) directly from the dashboard.

---

## Features

- **Real-time health polling** — auto-refreshes every 10 seconds via configurable interval
- **50 service tiles** across 5 categories, each showing live HTTP status, response time, and health state (UP / DEGRADED / DOWN)
- **Environment switcher** — toggle between Production and Sandbox endpoints instantly
- **Service Detail Modal** — per-tile drill-down with:
  - Current status & HTTP code
  - Response time history chart (last 32 checks, SVG line chart)
  - Average & P95 latency
  - CPU, memory, and uptime metrics
  - Error distribution (2xx / 4xx / 5xx counts and error rate)
  - One-click external action buttons (Deep Health Check, Root Cause Analysis, etc.)
- **AI Snapshot panel** — intelligent summary showing overall risk level, fastest/slowest services, and best/worst error rates across all tiles
- **Metadata bar** — displays active environment, AWS region, total tile count, and unique API count
- **Manual refresh** button with animated spinner
- **Local API server** (`dashboard-api-server.cjs`) to serve dashboard configuration over REST
- **Responsive layout** — adapts from mobile to wide desktop (up to 1400px)
- **Docker support** — Dockerfile included for containerized backend deployment

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| TypeScript 5.8 | Type safety |
| Vite 7 | Build tool & dev server |
| Tailwind CSS 3 | Utility-first styling |
| Radix UI | Accessible headless UI primitives |
| Lucide React | Icon library |
| React Router 7 | Client-side routing |
| class-variance-authority / clsx / tailwind-merge | Conditional class utilities |

### Backend / API Server
| Technology | Purpose |
|---|---|
| Node.js + Express 5 | Local dashboard config API server |
| Hono 4 + Zod | API framework with schema validation (shared/types) |
| CORS | Cross-origin support for local dev |

### Build & Tooling
| Tool | Purpose |
|---|---|
| PostCSS + Autoprefixer | CSS processing |
| Docker | Containerization |

---

## Project Structure

```
vm-operational-react-dashboard/
├── public/
│   └── logo/logo.png              # Brand logo shown in header
├── src/
│   ├── react-app/
│   │   ├── api/
│   │   │   ├── dashboard-config-api.ts    # API client for dashboard config endpoint
│   │   │   └── dashboard-config.ts        # Config data types/helpers
│   │   ├── components/
│   │   │   ├── ui/                        # Reusable Radix-based UI primitives
│   │   │   ├── AISnapshot.tsx             # AI-powered health summary panel
│   │   │   ├── CategoryColumn.tsx         # Column of tiles per service category
│   │   │   ├── EnvironmentSelector.tsx    # Production / Sandbox dropdown
│   │   │   ├── Header.tsx                 # Top navigation bar with refresh controls
│   │   │   ├── MetadataBar.tsx            # Environment, region, and stats bar
│   │   │   ├── ResponseTimeChart.tsx      # SVG line chart for response time history
│   │   │   ├── ServiceDetailModal.tsx     # Drill-down modal with full service metrics
│   │   │   ├── ServiceGrid.tsx            # Grid layout rendering all category columns
│   │   │   ├── ServiceTile.tsx            # Individual service health tile
│   │   │   └── StatusLegend.tsx           # Color legend for UP/DEGRADED/DOWN states
│   │   ├── config/
│   │   │   └── environments.ts            # All service URLs, categories, tile overrides, and dashboard settings
│   │   ├── context/
│   │   │   ├── DashboardDataContext.tsx   # Fetches services/applications from backend API
│   │   │   ├── EnvironmentContext.tsx     # Global environment state (production/sandbox)
│   │   │   └── ServiceStateContext.tsx    # Aggregates live state of all service tiles
│   │   ├── lib/utils.ts                   # Tailwind class merge utility
│   │   ├── pages/Dashboard.tsx            # Main dashboard page layout
│   │   ├── services/api.ts                # Health fetch, metrics fetch, and formatting helpers
│   │   ├── App.tsx                        # Root app component with context providers
│   │   └── main.tsx                       # React entry point
│   └── shared/types.ts                    # Shared Zod schemas and types (client + server)
├── dashboard-api-server.cjs               # Express API server serving dashboard config
├── Dockerfile                             # Docker build for backend services
├── vite.config.ts                         # Vite config with proxy rules and path aliases
├── tailwind.config.js                     # Tailwind theme configuration
├── tsconfig.json                          # TypeScript project references
└── package.json                           # Dependencies and scripts
```

---

## Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- Internet access to reach the health endpoints hosted on `onrender.com`

> **Optional:** Docker (only needed if running the backend Dockerfile)

---

## Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vm-operational-dashboard/vm-operational-react-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the local API server** (in a separate terminal)
   ```bash
   node dashboard-api-server.cjs
   ```
   The API server starts on `http://localhost:5175`.

4. **Start the frontend dev server**
   ```bash
   npm run dev
   ```
   The app starts on `http://localhost:5173` (default Vite port).

---

## How to Run the Project

### Development mode
```bash
# Terminal 1 — API server
node dashboard-api-server.cjs

# Terminal 2 — Frontend
npm run dev
```
Open `http://localhost:5173` in your browser.

### Production build
```bash
npm run build
```
Output is placed in the `dist/` folder. Serve it with any static file server.

### Lint check
```bash
npm run lint
```

### Type check + build validation
```bash
npm run check
```

---

## API Endpoints

The local Express server (`dashboard-api-server.cjs`) exposes:

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard-config` | Returns all tiles, categories, base services, external service URLs, and metadata |
| GET | `/api/health` | Server health check — returns status, timestamp, and service/application counts |

### Sample response — `/api/dashboard-config`
```json
{
  "tiles": [
    {
      "tileName": "Rating Service",
      "prodUrl": "https://vm-service-policy-submission.onrender.com/fnol/health",
      "sandboxUrl": "https://sandbox-vm-service-policy-submission.onrender.com/fnol/health",
      "category": "Policy Services",
      "categoryId": "policy",
      "tileId": "tile-policy-1",
      "shortId": "1",
      "baseServiceId": "PolicyCore"
    }
  ],
  "categories": [...],
  "baseServices": [...],
  "externalServices": [...],
  "totalTiles": 50,
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

The frontend proxies `/admin-api/*` → `http://localhost:8080/api/*` via Vite's dev server proxy (configured in `vite.config.ts`). Health checks are proxied through `/admin-api/health-proxy?url=<encoded-url>`.

---

## Configuration

### Dashboard settings — `src/react-app/config/environments.ts`

| Setting | Default | Description |
|---|---|---|
| `refreshInterval` | `10000` ms | How often each tile polls its health endpoint |
| `tilesPerCategory` | `20` | Max tiles displayed per category column |
| `region` | `us-east-1` | AWS region shown in the metadata bar |

### Adding or changing service endpoints

All service URLs are centrally managed in `src/react-app/config/environments.ts`:

- **`BASE_SERVICES`** — defines the default health and metrics URLs per base service for both environments
- **`TILE_URL_OVERRIDES`** — per-tile URL overrides using the key format `tile-{categoryId}-{tileNumber}`
- **`CATEGORIES`** — defines the 5 service categories and maps each to a base service
- **`MICROSERVICES`** — lists the 10 microservices per category

### Ports

| Service | Port |
|---|---|
| Vite dev server (frontend) | `5173` |
| Express API server | `5175` |
| Backend proxy target (admin API) | `8080` |

### External action URLs

Configured in `EXTERNAL_URLS` inside `environments.ts`. These are Microsoft Teams app deep-links and an ngrok endpoint used for:
- Root Cause Analysis
- Deep Health Check
- Knowledge Assistance
- Automated Job Monitoring

---

## UI Description

The dashboard is a single-page application with the following layout:

- **Header** — gradient dark-blue/purple bar with the ValueMomentum logo, environment selector dropdown, manual refresh button, and last-checked timestamp
- **Metadata bar** — shows active environment badge, AWS region badge, total tile count, and unique API count
- **Status legend** — color key for UP (green), DEGRADED (yellow), DOWN (red), and CHECKING (gray) states
- **Service grid** — 5 category columns, each containing up to 10 service tiles. Each tile shows:
  - Service name and short ID
  - Colored background indicating health state
  - Status dot + label (Running / Not certain / Down / Checking…)
  - HTTP status code and last response time in milliseconds
  - Clicking a tile opens the **Service Detail Modal**
- **AI Snapshot panel** — right-side panel showing:
  - Overall risk level (Low / Medium / High)
  - Service counts (UP ↑ / DEGRADED ⚠ / DOWN ↓)
  - Fastest and slowest services by average response time
  - Best and worst services by error rate
  - AI-generated hint message
- **Footer** — gradient bar with dashboard title and tagline

---

## Future Enhancements

- Persist service state history across page refreshes using `localStorage` or IndexedDB
- Add alerting / notification support (email, Slack, or Teams webhook) when services go DOWN
- Introduce user authentication to restrict dashboard access
- Add configurable alert thresholds for response time and error rate
- Support dynamic tile configuration via an admin UI instead of editing `environments.ts` directly
- Integrate real CPU/memory metrics from a Prometheus or CloudWatch endpoint instead of simulated values
- Add dark mode support
- Export health report as PDF or CSV
