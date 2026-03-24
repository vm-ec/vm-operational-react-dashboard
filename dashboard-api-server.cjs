const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5175;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Import the complete configuration data (matching environments.ts)
const CATEGORIES = [
  { id: 'policy', title: 'Policy Services', subtitle: 'Rating, rules, quotes, lifecycle', baseServiceId: 'PolicyCore' },
  { id: 'billing', title: 'Billing Services', subtitle: 'Accounts, invoices, payments', baseServiceId: 'PolicyEdge' },
  { id: 'claims', title: 'Claims Services', subtitle: 'FNOL, fraud, settlement', baseServiceId: 'ClaimsCore' },
  { id: 'rating', title: 'Product & Filings', subtitle: 'Rates, forms, pricing versions', baseServiceId: 'ClaimsReview' },
  { id: 'shared', title: 'Shared Services', subtitle: 'Enterprise & platform services', baseServiceId: 'FraudCheck' },
];

const MICROSERVICES = {
  policy: [
    { name: 'Rating Service', shortId: '1' },
    { name: 'Infinity Reconcil Service', shortId: '2' },
    { name: 'Quote Service', shortId: '3' },
    { name: 'Policy Issuance Service', shortId: '4' },
    { name: 'Policy Lifecycle Service', shortId: '5' },
    { name: 'Coverage Service', shortId: '6' },
    { name: 'Risk Profile Service', shortId: '7' },
    { name: 'Policy Document Service', shortId: '8' },
    { name: 'Policy Search Service', shortId: '9' },
    { name: 'Product Configuration Service', shortId: '10' },
  ],
  billing: [
    { name: 'Billing Account Service', shortId: '1' },
    { name: 'Invoice Generation Service', shortId: '2' },
    { name: 'Payment Processing Service', shortId: '3' },
    { name: 'Payment Allocation Service', shortId: '4' },
    { name: 'Refund Chargeback Service', shortId: '5' },
    { name: 'Collections Dunning Service', shortId: '6' },
    { name: 'Premium Finance Service', shortId: '7' },
    { name: 'Recurring Payments Service', shortId: '8' },
    { name: 'Billing History Service', shortId: '9' },
    { name: 'Reconciliation Service', shortId: '10' },
  ],
  claims: [
    { name: 'FNOL UI Screen', shortId: '1' },
    { name: 'FNOL Service', shortId: '2' },
    { name: 'Fraud Check UI Screen', shortId: '3' },
    { name: 'Fraud Check Service', shortId: '4' },
    { name: 'Infinity Incidents Service', shortId: '5' },
    { name: 'Coverage Validation Service', shortId: '6' },
    { name: 'Third-party Integration Service', shortId: '7' },
    { name: 'Claim Payments Service', shortId: '8' },
    { name: 'Subrogation Service', shortId: '9' },
    { name: 'Claim Settlement Service', shortId: '10' },
  ],
  rating: [
    { name: 'Product Master Service', shortId: '1' },
    { name: 'Coverage Catalogue Service', shortId: '2' },
    { name: 'Rate Table Service', shortId: '3' },
    { name: 'Form Mapping Service', shortId: '4' },
    { name: 'Discount Surcharge Service', shortId: '5' },
    { name: 'Regulatory Validation Service', shortId: '6' },
    { name: 'Approval Workflow Service', shortId: '7' },
    { name: 'Pricing Versioning Service', shortId: '8' },
    { name: 'Channel Eligibility Service', shortId: '9' },
    { name: 'Sandbox Simulation Service', shortId: '10' },
  ],
  shared: [
    { name: 'Identity Auth Service', shortId: '1' },
    { name: 'Document Storage Service', shortId: '2' },
    { name: 'Notification Service', shortId: '3' },
    { name: 'Audit Trace Service', shortId: '4' },
    { name: 'Search Indexing Service', shortId: '5' },
    { name: 'Event Stream Service', shortId: '6' },
    { name: 'Data Privacy Service', shortId: '7' },
    { name: 'Telemetry Observability Service', shortId: '8' },
    { name: 'Workflow Orchestration Service', shortId: '9' },
    { name: 'AI Decisioning Service', shortId: '10' },
  ],
};

const BASE_SERVICES = [
  {
    id: 'PolicyCore',
    name: 'Policy Core',
    endpoints: {
      production: {
        health: 'https://vm-service-policy-submission.onrender.com/fnol/health',
        metrics: 'https://vm-service-policy-submission.onrender.com/fnol/metrics',
      },
      sandbox: {
        health: 'https://sandbox-vm-service-policy-submission.onrender.com/fnol/health',
        metrics: 'https://sandbox-vm-service-policy-submission.onrender.com/fnol/metrics',
      },
    },
  },
  {
    id: 'PolicyEdge',
    name: 'Policy Edge',
    endpoints: {
      production: {
        health: 'https://vm-service-policy-manager-1.onrender.com/policymanager/health',
        metrics: 'https://vm-service-policy-manager-1.onrender.com/policymanager/metrics',
      },
      sandbox: {
        health: 'https://sandbox-vm-service-policy-manager-1.onrender.com/policymanager/health',
        metrics: 'https://sandbox-vm-service-policy-manager-1.onrender.com/policymanager/metrics',
      },
    },
  },
  {
    id: 'ClaimsCore',
    name: 'Claims Core',
    endpoints: {
      production: {
        health: 'https://vm-service-claims.onrender.com',
        metrics: 'https://vm-service-claims.onrender.com/claims/metrics',
      },
      sandbox: {
        health: 'https://sandbox-vm-service-claims.onrender.com',
        metrics: 'https://sandbox-vm-service-claims.onrender.com/claims/metrics',
      },
    },
  },
  {
    id: 'ClaimsReview',
    name: 'Claims Review',
    endpoints: {
      production: {
        health: 'https://vm-service-claims-review.onrender.com/claimsreview/health',
        metrics: 'https://vm-service-claims-review.onrender.com/claimsreview/metrics',
      },
      sandbox: {
        health: 'https://sandbox-vm-service-claims-review.onrender.com/claimsreview/health',
        metrics: 'https://sandbox-vm-service-claims-review.onrender.com/claimsreview/metrics',
      },
    },
  },
  {
    id: 'FraudCheck',
    name: 'Fraud Check',
    endpoints: {
      production: {
        health: 'https://vm-service-claims-fraud-check.onrender.com/claimsfraud/health',
        metrics: 'https://vm-service-claims-fraud-check.onrender.com/claimsfraud/metrics',
      },
      sandbox: {
        health: 'https://sandbox-vm-service-claims-fraud-check.onrender.com/claimsfraud/health',
        metrics: 'https://sandbox-vm-service-claims-fraud-check.onrender.com/claimsfraud/metrics',
      },
    },
  },
];

const TILE_URL_OVERRIDES = {
  'tile-policy-1': {
    production: {
      health: 'https://vm-service-policy-submission.onrender.com/fnol/health',
    },
    sandbox: {
      health: 'https://sandbox-vm-service-policy-submission.onrender.com/fnol/health',
    },
  },
  'tile-policy-2': {
    production: {
      health: 'https://vm-service-policy-manager-1.onrender.com/policymanager/health1',
    },
    sandbox: {
      health: 'https://sandbox-vm-service-policy-manager-1.onrender.com/policymanager/health1',
    },
  },
  'tile-billing-1': {
    production: {
      health: 'https://vm-service-billing-account.onrender.com/health',
    },
    sandbox: {
      health: 'https://sandbox-vm-service-billing-account.onrender.com/health',
    },
  },
  'tile-claims-2': {
    production: {
      health: 'https://vm-service-claims.onrender.com/health/check',
    },
    sandbox: {
      health: 'https://sandbox-vm-service-claims.onrender.com/health/check',
    },
  },
  'tile-claims-4': {
    production: {
      health: 'https://vm-service-claims.onrender.com/claims/fetch',
    },
    sandbox: {
      health: 'https://sandbox-vm-service-claims.onrender.com/claims/fetch',
    },
  },
  'tile-claims-5': {
    production: {
      health: 'https://vm-service-claims.onrender.com/claims/fetch1',
    },
    sandbox: {
      health: 'https://sandbox-vm-service-claims.onrender.com/claims/fetch1',
    },
  },
};

// External action URLs (for modal buttons)
const EXTERNAL_URLS = {
  rootCauseAnalysis: 'https://teams.microsoft.com/l/app/f6405520-7907-4464-8f6e-9889e2fb7d8f?source=app-header-share-entrypoint&templateInstanceId=19a6974b-869b-465b-b040-5da5fdab88d6&environment=Default-13085c86-4bcb-460a-a6f0-b373421c6323',
  deepHealthCheck: 'https://enzymolytic-cristiano-wartier.ngrok-free.dev/?app=Infinity&env=prod',
  knowledgeAssistance: 'https://teams.microsoft.com/l/app/f6405520-7907-4464-8f6e-9889e2fb7d8f?source=app-header-share-entrypoint&templateInstanceId=a0b68361-3c13-4c9a-b3c5-f9598f059b04&environment=Default-13085c86-4bcb-460a-a6f0-b373421c6323',
  automatedJobMonitoring: 'https://teams.microsoft.com/l/app/f6405520-7907-4464-8f6e-9889e2fb7d8f?source=app-header-share-entrypoint&templateInstanceId=14d0239d-fd42-47a8-842e-9b13597c167b&environment=Default-13085c86-4bcb-460a-a6f0-b373421c6323',
};

// API endpoint to serve complete dashboard configuration
app.get('/api/dashboard-config', (req, res) => {
  try {
    const tilesData = [];
    
    CATEGORIES.forEach(category => {
      const microservices = MICROSERVICES[category.id] || [];
      
      microservices.forEach((microservice, index) => {
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
          tileName: microservice.name,
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
    
    // Transform external URLs to external services format
    const externalServices = Object.entries(EXTERNAL_URLS).map(([key, url]) => ({
      serviceName: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim(),
      serviceUrl: url,
      description: `External ${key.replace(/([A-Z])/g, ' $1').toLowerCase().trim()} service`,
      integrationType: 'External'
    }));
    
    const configData = {
      tiles: tilesData,
      categories: CATEGORIES,
      baseServices: BASE_SERVICES,
      externalServices: externalServices,
      totalTiles: tilesData.length,
      timestamp: new Date().toISOString()
    };
    
    console.log(`Serving ${tilesData.length} tiles across ${CATEGORIES.length} categories`);
    res.json(configData);
  } catch (error) {
    console.error('Error serving dashboard config:', error);
    res.status(500).json({ error: 'Failed to fetch configuration' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    totalServices: CATEGORIES.length,
    totalApplications: Object.values(MICROSERVICES).reduce((sum, services) => sum + services.length, 0)
  });
});

app.listen(PORT, () => {
  console.log(`Dashboard API server running on http://localhost:${PORT}`);
  console.log(`Dashboard config available at: http://localhost:${PORT}/api/dashboard-config`);
  console.log(`Health check available at: http://localhost:${PORT}/api/health`);
  
  // Log summary of available data
  const totalApps = Object.values(MICROSERVICES).reduce((sum, services) => sum + services.length, 0);
  console.log(`\nServing ${totalApps} applications across ${CATEGORIES.length} services:`);
  CATEGORIES.forEach(cat => {
    const count = MICROSERVICES[cat.id]?.length || 0;
    console.log(`  - ${cat.title}: ${count} applications`);
  });
});

module.exports = app;