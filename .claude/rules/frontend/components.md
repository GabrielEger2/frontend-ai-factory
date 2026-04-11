---
paths:
  - "dashboard/**/*.{ts,tsx}"
---
# Frontend Component Rules (Seller Dashboard)

- Functional components only, no class components.
- Server Components by default. Add `'use client'` only when hooks, events, or browser APIs are needed.
- Shared components live in `dashboard/src/components/`. Page-scoped components live in `_components/` next to their page.
- Server actions in `dashboard/src/lib/actions/`.
- API wrapper functions in `dashboard/src/lib/api/`.

## Key Dashboard Pages
- **Project list:** Shows all seller's projects with status
- **Create project:** Form with company name, segment, description
- **Project detail:** Pipeline progress, preview URL, edit options
- **Visual editor (Phase 4):** Reorder sections, swap variants, edit copy
- **Client preview:** Shareable URL with feedback form

## Real-Time Progress
- WebSocket API pushes pipeline status updates.
- Dashboard shows step-by-step progress: "Researching..." → "Styling..." → "Writing..." → "Deploying..."
