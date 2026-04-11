# Debug Session Template

```markdown
---
slug: <kebab-case-slug>
status: gathering | investigating | fixing | resolved
mode: build-failure | runtime-bug | plan-deviation
plan: <path to archived plan>
created: <ISO timestamp>
updated: <ISO timestamp>
---

## Current Focus

hypothesis: <current theory>
test: <how testing>
expecting: <what confirms/denies>
next_action: <next step>

## Symptoms

<!-- IMMUTABLE after gathering phase -->

- **Error:** <error or unexpected behavior>
- **Expected:** <what should have happened>
- **Actual:** <what actually happened>
- **When:** <during execution, after deploy, etc.>

## Hypotheses

| # | Hypothesis | Status | Evidence |
|---|-----------|--------|----------|

## Evidence

<!-- APPEND-ONLY per round -->

### Round 1

- **Checked:** <what>
- **Found:** <what>
- **Implication:** <what it means>

## Eliminated

<!-- APPEND-ONLY -->

## Resolution

- **Root cause:**
- **Fix:**
- **Commit:**
- **Verification:**
```

## Guidelines

- Slug: descriptive, max 30 chars
- Status transitions: gathering → investigating → fixing → resolved
- Never delete evidence or eliminated hypotheses
- Symptoms are immutable after Phase 1
