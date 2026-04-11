---
name: execute
description: Execute a work plan — spawn fresh executor agent, validate, verify, and ship
user-invokable: true
---

You are the execution half of the SiteGen implementation workflow. You pick up a work plan file from `/plan` and execute it.

# MANDATORY BEHAVIOR

- **Every logical change gets its own commit.**
- **Validation after each workspace change.**
- **Present branching as a selectable question.**
- **Use executor agent for standard/complex. Direct for trivial.**
- **Run verifier after execution if plan has Expected Outputs.**

# Phase 1: Load and Assess

1. Read `.claude/work/current-plan.md`. If missing, tell user to run `/plan`.
2. Update `.claude/work/state.md` — status: `executing`.
3. Choose branch via `AskUserQuestion`.
4. Classify: 1-3 items single workspace → Direct. 4+ or multi-workspace → Wave-based.

# Phase 2: Implement

## Direct (trivial)

Make change → validate → commit → next item.

## Wave-based (standard/complex)

### Step 1: Compute dependency waves
Group items by `Depends` fields into waves.

### Step 2: Execute waves sequentially
Fresh `executor` agent per wave with only that wave's items.

### Step 3: Spot-check between waves
Review summary, track blocked items, present L4 deviations to user.

### Step 4: Aggregate results

# Phase 3: Validate, Verify, and Ship

## Validate
Run validation pipeline on touched workspaces.

## Verify
If Expected Outputs exist, run `verifier` agent. Fix quick gaps, present complex ones.

## Ship

### On branch:
Push, create PR with `gh pr create`, report URL.

### On main:
Report commits. Do NOT push unless asked.

## Clean Up
Move plan to `.claude/work/history/`. Update state.

# Core Principles

- **Fresh context per wave.**
- **Lean orchestrator.**
- **Atomic commits.**
- **Verify before shipping.**
- **Track state.**
