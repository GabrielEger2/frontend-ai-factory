---
paths:
  - "dashboard/**/*.{ts,tsx,css}"
---
# Frontend Styling Rules (Seller Dashboard)

> **Styling approach TBD.** Update this file once a CSS framework is chosen.

## General Principles
- Mobile-first responsive design. Dashboard must work on tablets (sellers use them in-field).
- Fonts: load via `next/font/google` for performance.
- Loading states: use skeleton placeholders.
- Error states: clear error display.
- Empty states: clear message with CTA.
