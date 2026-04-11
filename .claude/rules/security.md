---
paths:
  - "agents/**/*.ts"
  - "dashboard/**/*.{ts,tsx}"
  - "infra/**/*.ts"
---
# Security Rules

## Authentication
- API Gateway uses CRM JWT validation for seller-facing endpoints.
- API key auth for CRM-to-SiteGen integration endpoints.
- Generated sites are public — no auth needed for preview URLs.
- Dashboard endpoints require valid CRM JWT token.

## Authorization
- Sellers can only see/manage their own projects.
- Multi-tenant isolation: all database queries scoped by seller/CRM client ID.
- Generated sites are scoped to the project that created them.

## AI API Key Security
- Claude/GPT API keys stored in AWS Secrets Manager or SSM Parameter Store.
- Keys passed to agent Lambdas via environment variables referencing Secrets Manager ARNs.
- NEVER hardcode API keys in source code, prompts, or CDK constructs.
- Rotate keys on a regular schedule.

## Input Validation
- All API inputs validated with Zod schemas.
- Agent outputs validated with Zod before passing to next pipeline step.
- Component metadata validated against schema before storage.

## Data Privacy
- Never expose internal database keys or IDs in API responses.
- Strip internal fields before returning data to dashboard.
- Generated sites must not contain internal system data, API keys, or seller information beyond what's intended.

## Vercel Deployment Security
- Vercel API token stored in Secrets Manager.
- Deployment Lambda retrieves token at runtime, never caches in code.
- Generated site source code is sanitized before deployment.
