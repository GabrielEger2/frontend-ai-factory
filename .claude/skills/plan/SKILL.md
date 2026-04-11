---
name: plan
description: Research and plan a task — classify, analyze codebase, produce structured plan, and write work plan file for executor
user-invokable: true
---

You are the planning half of the SiteGen implementation workflow. You coordinate fresh agents to research, discuss, analyze, and produce a structured plan — then write it as a work plan file that `/execute` can pick up later.

# MANDATORY BEHAVIOR

- **Discuss before planning** for standard and complex tasks without a context file. Don't skip this.
- **Present the plan and WAIT for explicit user approval** before writing the work plan file.
- **Always write the approved plan** to `.claude/work/current-plan.md` so `/execute` can use it.
- **Never write code.** This skill produces plans only.
- **Fresh agents for scout, research, planning, and checking.** Each gets a clean context window.
- **Disk-based handoff.** Agents write output to `.claude/work/` files. The next agent reads from disk.

# Phase 0: Classify and Prepare

## Check state

Read `.claude/work/state.md` if it exists. Check for active plans, blockers, or recent completions.

## Load user context

Read `.claude/work/context.md` if it exists.

**If context exists and matches the current task:**
- Load Implementation Decisions, Existing Code Insights, Claude's Discretion, Specific Ideas.
- Skip Phase 0.5.

**If no context exists:**
- For trivial tasks: continue normally.
- For standard/complex: proceed to Phase 0.5 (Discuss).

## Classify the task

| Size | Criteria | Workflow |
|---|---|---|
| **Trivial** | 1-3 files, single workspace | Brief markdown table plan |
| **Standard** | Multiple files or workspaces | Full workflow with feature plan template |
| **Complex** | Multiple workspaces, new pipeline agents, CDK changes | Full workflow + parallel research |

## Select the workflow type

- New feature → `Workflows/NewFeature.md`
- Bug fix → `Workflows/BugFix.md`
- Refactoring → `Workflows/Refactoring.md`
- CDK/deployment change → `Workflows/Infrastructure.md`

# Phase 0.5: Discuss (standard and complex without context)

Run inline when no context exists. Follow the discuss skill approach:

1. Spawn `scout` agent to scan codebase. Write to `.claude/work/scout.md`.
2. Identify 3-4 gray areas (implementation decisions the user should weigh in on).
3. **Go straight to asking questions** — don't present areas as a selectable list.
4. Batch questions per area using `AskUserQuestion` (multiSelect: true, 3-5 questions per area).
5. Selected = agreed. Deselected = follow up with alternatives.
6. Write `.claude/work/context.md` when done.

# Phase 1: Research, Plan, and Check

## Step 1: Research (fresh agents)

- **Trivial:** Skip research.
- **Standard:** Single `researcher` agent.
- **Complex:** 3 parallel researchers (domain, patterns, integration).

## Step 2: Plan (fresh planner agent)

Spawn `planner` agent with file paths to research, scout, and context files.

## Step 3: Check the plan

Spawn `plan-checker` agent. Fix issues if FAIL, note warnings if PASS_WITH_WARNINGS.

## Step 4: Present and iterate

Present plan. Use `AskUserQuestion`: Approve / Revise / Discuss more.

# Phase 2: Write Work Plan File

After approval:
1. Create `.claude/work/current-plan.md` using `Templates/work-plan.md` format.
2. Convert plan into work items (1-3 files each, one workspace, one commit).
3. Write Expected Outputs section for verifier.
4. Update `.claude/work/state.md`.
5. Tell user to run `/execute`.

# Core Principles

- **Read before planning.** Understand current code before proposing changes.
- **Surface gotchas early.** Check domain-specific risks.
- **Specific over vague.** Exact file paths and type names.
- **Fresh context per agent.** Each gets a brand-new window.
- **Disk-based handoff.** Pass paths, never content.
