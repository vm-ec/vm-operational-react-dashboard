// Environment configuration for the Operational Dashboard
// Update URLs here to change endpoints without modifying component code

export type Environment = 'production' | 'sandbox';

export interface ServiceEndpoint {
  health: string;
  metrics: string;
}

export interface ServiceConfig {
  id: string;
  name: string;
  endpoints: {
    production: ServiceEndpoint;
    sandbox: ServiceEndpoint;
  };
}

// Base service configurations with both environment URLs
export const BASE_SERVICES: ServiceConfig[] = [
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

// Category definitions for organizing tiles
export interface CategoryConfig {
  id: string;
  title: string;
  subtitle: string;
  baseServiceId: string;
}

export const CATEGORIES: CategoryConfig[] = [
  { id: 'policy', title: 'Policy Services', subtitle: 'Rating, rules, quotes, lifecycle', baseServiceId: 'PolicyCore' },
  { id: 'billing', title: 'Billing Services', subtitle: 'Accounts, invoices, payments', baseServiceId: 'PolicyEdge' },
  { id: 'claims', title: 'Claims Services', subtitle: 'FNOL, fraud, settlement', baseServiceId: 'ClaimsCore' },
  { id: 'rating', title: 'Product & Filings', subtitle: 'Rates, forms, pricing versions', baseServiceId: 'ClaimsReview' },
  { id: 'shared', title: 'Shared Services', subtitle: 'Enterprise & platform services', baseServiceId: 'FraudCheck' },
];

// Microservices per category
export interface Microservice {
  name: string;
  shortId: string;
}

export const MICROSERVICES: Record<string, Microservice[]> = {
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

// Per-tile URL overrides for specific customizations
// Keys are in format: "tile-{categoryId}-{tileNumber}"
export interface TileOverride {
  production?: Partial<ServiceEndpoint>;
  sandbox?: Partial<ServiceEndpoint>;
}

export const TILE_URL_OVERRIDES: Record<string, TileOverride> = {
  'tile-policy-2': {
    production: {
      health: 'https://vm-service-policy-manager-1.onrender.com/policymanager/health1',
    },
    sandbox: {
      health: 'https://sandbox-vm-service-policy-manager-1.onrender.com/policymanager/health1',
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
  'tile-billing-1': {
    production: {
      health: 'https://vm-service-billing-account.onrender.com/health/final',
    },
    sandbox: {
      health: 'https://sandbox-vm-service-billing-account.onrender.com/health',
    },
  },
  'tile-policy-1': {
    production: {
      health: 'https://vm-service-policy-submission.onrender.com/fnol/health/final',
    },
    sandbox: {
      health: 'https://sandbox-vm-service-policy-submission.onrender.com/fnol/health',
    },
  }
};

// Dashboard settings
export const DASHBOARD_CONFIG = {
  refreshInterval: 10000, // 10 seconds
  tilesPerCategory: 20,
  region: 'us-east-1',
};

// External action URLs (for modal buttons)
export const EXTERNAL_URLS = {
  rootCauseAnalysis: 'https://teams.microsoft.com/l/app/f6405520-7907-4464-8f6e-9889e2fb7d8f?source=app-header-share-entrypoint&templateInstanceId=19a6974b-869b-465b-b040-5da5fdab88d6&environment=Default-13085c86-4bcb-460a-a6f0-b373421c6323',
  deepHealthCheck: 'https://enzymolytic-cristiano-wartier.ngrok-free.dev/?app=Infinity&env=prod',
  knowledgeAssistance: 'https://teams.microsoft.com/l/app/f6405520-7907-4464-8f6e-9889e2fb7d8f?source=app-header-share-entrypoint&templateInstanceId=a0b68361-3c13-4c9a-b3c5-f9598f059b04&environment=Default-13085c86-4bcb-460a-a6f0-b373421c6323',
  automatedJobMonitoring: 'https://teams.microsoft.com/l/app/f6405520-7907-4464-8f6e-9889e2fb7d8f?source=app-header-share-entrypoint&templateInstanceId=14d0239d-fd42-47a8-842e-9b13597c167b&environment=Default-13085c86-4bcb-460a-a6f0-b373421c6323',
};
