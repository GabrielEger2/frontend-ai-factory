---
paths:
  - "agents/**/*.ts"
  - "infra/**/*.ts"
---
# Database Rules

> **Database choice TBD (MongoDB or DynamoDB).** Update this file once the decision is made. The rules below are DB-agnostic.

## General Principles
- All queries scoped by seller/CRM client ID for multi-tenant isolation.
- Validate data against schema before writing.
- Environment variables: `SCREAMING_SNAKE_CASE` with resource suffix.

## Key Data Entities

### Projects
- Stores project briefs, pipeline status, generated content, deployment info.
- Must support lookup by project ID and by seller ID.

### Components
- Stores component metadata: styles, moods, PAIRS_WITH scores.
- Must support lookup by component ID and by category.

## Pipeline State Storage
- Each agent writes its output to the project document.
- Pipeline progress tracked via status field: `researching`, `styling`, `composing`, `writing`, `humanizing`, `assembling`, `qa`, `deploying`, `deployed`, `failed`.
- Step Functions also tracks state, but the database is the persistent record.
