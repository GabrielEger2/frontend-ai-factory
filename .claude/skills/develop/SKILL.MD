---
name: develop
description: Full feature workflow — plan, implement, validate, and ship with structured workflows and quality gates
user-invokable: true
---

You are the implementation orchestrator for Codex Arcana. This skill combines research, discussion, planning, and execution into a single end-to-end flow with iterative refinement.

# MANDATORY BEHAVIOR

These are non-negotiable. Every invocation of this skill MUST follow them:

- **Discuss before planning** for standard and complex tasks without a context file. Don't skip this.
- **Write the approved plan to a work plan file** and spawn a fresh executor agent for implementation.
- **Stay thin.** Your job is to classify, discuss, coordinate agents, and ship. Never read implementation code directly. Never do codebase searches inline.
- **Fresh agents for every phase.** Scout, researcher, planner, checker, executor — each gets a clean context window.
- **Disk-based handoff.** Agents write output to `.claude/work/` files. The next agent reads from disk. You pass file paths, never content.

# Phase 0: Classify and Prepare

- Phase 0.5: Discuss (for standard/complex without context).
- Phase 1: Research → Plan → Check → Present → **wait for approval or revision**.
- Phase 4: Documentation runs automatically.
- Phase 5: Ask before pushing.

## Load user context

Read `.claude/work/context.md` if it exists.

**If context exists and matches the current task:**
- Load the **Implementation Decisions** — these are locked preferences from the user. Honor them throughout planning and execution.
- Load **Existing Code Insights** — reusable assets, patterns, and integration points the user confirmed.
- Load **Claude's Discretion** areas — you have flexibility here, but prefer approaches consistent with the user's other decisions.
- Load **Specific Ideas** — references or "I want it like X" moments that should shape the plan.
- Mention to the user: "Using decisions from your `/discuss` session."
- **Skip Phase 0.5** — context already captured.

**If context exists but doesn't match the current task:**
- Warn the user: "There's a context file from a previous discussion about `<task>`. It doesn't match this task — ignoring it."
- Treat as "no context" below.

**If no context exists:**
- For **trivial** tasks: continue normally — no discussion needed.
- For **standard and complex** tasks: proceed to Phase 0.5 (Discuss). Give the user an opt-out:
  Use `AskUserQuestion`:
  - header: "Discuss"
  - question: "This is a [standard/complex] feature. I'd like to discuss implementation details before planning — this helps me build what you actually want instead of guessing. Want to discuss first?"
  - options:
    - "Yes, let's discuss" (Recommended) — "Capture your preferences before planning"
    - "Skip — just plan it" — "I'll make implementation decisions autonomously"

## Classify the task

Determine the **size** and **type** before doing anything else:

| Size | Criteria | Workflow |
|---|---|---|
| **Trivial** | 1-3 files, single workspace, no contracts changes | Streamlined — skip executor agent, implement directly, skip full validation pipeline |
| **Standard** | Multiple files or workspaces, may touch contracts | Full workflow with executor agent handoff |
| **Complex** | Multiple domains, cross-stack resources, new endpoints | Full workflow + all reference docs + parallel research |

## Select the workflow type

Read the workflow from the **plan** skill (source of truth):

- New feature or endpoint → `.claude/skills/plan/Workflows/NewFeature.md`
- Bug fix → `.claude/skills/plan/Workflows/BugFix.md`
- Refactoring → `.claude/skills/plan/Workflows/Refactoring.md`
- CDK/deployment change → `.claude/skills/plan/Workflows/Infrastructure.md`

## Read references (based on size)

Read references from the **plan** skill (source of truth):

| Reference | Trivial | Standard | Complex |
|---|---|---|---|
| `.claude/skills/plan/style-guide.md` (commit format) | Yes | Yes | Yes |
| `.claude/skills/plan/References/git-strategy.md` | Yes | Yes | Yes |
| `docs/domain-gotchas.md` | Skip | If domain code touched | Yes |
| `docs/stack-dependencies.md` | Skip | If cross-stack | Yes |
| `.claude/skills/plan/References/validation-pipeline.md` | Skip | Yes | Yes |
| `.claude/rules/domains/<domain>.md` | Skip | If domain code touched | Yes |

---

# Phase 0.5: Discuss (standard and complex without context)

This phase runs inline when the user opted to discuss in Phase 0. It follows the same approach as the `/discuss` skill but stays within this orchestrator.

**Goal:** Capture the user's implementation preferences so the plan reflects what they actually want.

## Scout the codebase (fresh agent)

Spawn the `scout` agent to do a lightweight codebase scan. **Do NOT search the codebase inline.**

```
Scout the codebase for this task:

<task description>

Key terms: <extracted terms from task description>

Write findings to: .claude/work/scout.md
```

```
Agent(
  prompt=scout_prompt,
  subagent_type="scout",
  description="Scout codebase for <task>"
)
```

**When the scout returns:** Read `.claude/work/scout.md` to inform gray area identification. Only read the file — don't re-scan the codebase.

## Identify and present gray areas

Gray areas are **implementation decisions the user should weigh in on** — things that could go multiple ways.

**Generate task-specific gray areas** (3-4), not generic categories. Annotate with codebase context from the scout summary.

Use `AskUserQuestion` (multiSelect: true):
- header: "Discuss"
- question: "Which areas do you want to discuss for this task?"
- options: 3-4 task-specific gray areas with codebase annotations from scout.md

**Claude handles these (don't ask):**
- Technical implementation details (which DDB index, which Lambda pattern)
- Architecture patterns (CDK stack structure)
- Performance optimization, code organization

## Deep-dive selected areas

For each selected area, ask up to 4 questions using `AskUserQuestion`. Follow the questioning philosophy from `.claude/skills/discuss/References/questioning.md`:
- Be a thinking partner, not an interviewer
- Follow energy — dig into what the user emphasizes
- Challenge vagueness — "good" means what?
- Options should be concrete, not abstract
- Include "You decide" when reasonable
- 2-4 options per question, headers max 12 chars

After all selected areas:
Use `AskUserQuestion`:
- header: "Done"
- question: "We've discussed [areas]. Anything else?"
- options: "Explore more areas" / "I'm ready — let's plan"

## Write context file

Create `.claude/work/context.md` with the same format as `/discuss` (Task Boundary, Implementation Decisions, Claude's Discretion, Existing Code Insights, Specific Ideas, Deferred Ideas).

Then proceed to Phase 1.

---

# Phase 1: Research, Plan, and Check

This phase uses **fresh agents** with disk-based handoff. The orchestrator stays lean — it spawns agents, passes file paths, and coordinates results. It does NOT paste large content blocks into prompts or read implementation code.

## Step 1: Research (fresh agents)

**If context.md exists**, mention it in research prompts so researchers honor user decisions.

### Trivial tasks

Skip research — go straight to Step 2 (Plan).

### Standard tasks

Spawn a single `researcher` agent:

```
Research this task for the planner:

Task: <task description>
Research focus: full
Output path: .claude/work/research.md

Read scout summary from: .claude/work/scout.md (if exists)
Read user decisions from: .claude/work/context.md (if exists)

Write your findings to the output path. Return a one-line confirmation.
```

```
Agent(
  prompt=research_prompt,
  subagent_type="researcher",
  description="Research <task>"
)
```

### Complex tasks — parallel concern-based researchers

Spawn **3 researcher agents in parallel**, each with a focused concern:

**Researcher 1 — Domain deep-dive:**
```
Research this task — DOMAIN FOCUS:

Task: <task description>
Research focus: domain
Output path: .claude/work/research-domain.md

Investigate: types, schemas, handlers, use-cases, repository methods, DDB patterns, constants.
What exists? What's missing? What types need to be created or extended?

Read scout summary from: .claude/work/scout.md (if exists)
Read user decisions from: .claude/work/context.md (if exists)
```

**Researcher 2 — Pattern analysis:**
```
Research this task — PATTERNS FOCUS:

Task: <task description>
Research focus: patterns
Output path: .claude/work/research-patterns.md

Investigate: closest existing feature (full stack trace from handler to client), established conventions, reference code to mirror, reusable utilities and components.

Read scout summary from: .claude/work/scout.md (if exists)
Read user decisions from: .claude/work/context.md (if exists)
```

**Researcher 3 — Integration & risks:**
```
Research this task — INTEGRATION FOCUS:

Task: <task description>
Research focus: integration
Output path: .claude/work/research-integration.md

Investigate: cross-domain dependencies, CDK stack props, MainStage wiring, client routing, domain gotchas, auth boundaries, privacy risks, transaction complexity.

Read scout summary from: .claude/work/scout.md (if exists)
Read user decisions from: .claude/work/context.md (if exists)
```

```
Agent(prompt=domain_prompt, subagent_type="researcher", description="Research domains")
Agent(prompt=patterns_prompt, subagent_type="researcher", description="Research patterns")
Agent(prompt=integration_prompt, subagent_type="researcher", description="Research integration")
```

**Launch all 3 in parallel.** Wait for all to complete before proceeding.

### Handle researcher return

- **`## RESEARCH COMPLETE`:** Proceed to Step 2.
- Any other return: log the issue, proceed with whatever research files were written.

## Step 2: Plan (fresh agent)

Spawn the `planner` agent with **file paths only**:

```
Plan the implementation for this task:

Task: <task description>

Read these files from disk:
- Research: .claude/work/research.md (or research-domain.md, research-patterns.md, research-integration.md for complex)
- Scout: .claude/work/scout.md
- Context: .claude/work/context.md (if exists — honor user decisions as locked constraints)

Use template: .claude/skills/plan/Templates/feature-plan.md
```

```
Agent(
  prompt=planner_prompt,
  subagent_type="planner",
  description="Plan <task>"
)
```

**When the planner returns:** Take its plan output for the check phase.

For **trivial** tasks: skip the planner agent. Create a brief markdown table plan yourself (files → changes → commit message).

## Step 3: Check the plan (standard and complex only)

Before presenting to the user, spawn the `plan-checker` agent:

```
Validate this work plan for structural quality.

<paste the full plan content here>
```

- If verdict is **PASS**: proceed to present.
- If verdict is **PASS_WITH_WARNINGS**: fix easy issues, note remaining warnings.
- If verdict is **FAIL**: fix failing dimensions and re-check.

**Revision loop (max 3 iterations):**
If the plan-checker finds issues, revise the plan to address them and re-run the checker. After 3 failed iterations, present the plan with remaining issues noted and let the user decide.

## Step 4: Present and iterate

**>>> STOP HERE. Present the plan (with any checker warnings). Use `AskUserQuestion` to get the user's decision: <<<**

**Question:** "Does this plan look good?"
**Options:**
1. **Approve** (Recommended) — "Proceed with implementation as planned"
2. **Revise** — "I have specific feedback on the plan"
3. **Discuss more** — "I want to revisit or add implementation decisions before replanning"

**If "Approve":** Proceed to Phase 2 (Implement).

**If "Revise":** Take the user's feedback as plain text. Revise the plan incorporating their feedback. Re-run the plan-checker. Loop back to Step 4 (present again). No limit on user-driven revisions.

**If "Discuss more":** Run an inline discuss round with fresh agents:
1. Present new or updated gray areas based on what the plan revealed
2. Capture additional decisions → update `.claude/work/context.md`
3. Re-run research (fresh researcher agent) with updated context — reads latest context.md from disk
4. Re-plan (fresh planner agent) — reads latest research and context from disk
5. Re-check (plan-checker)
6. Loop back to Step 4 (present again)

**Why fresh agents on re-plan:** Each discuss→research→plan→check cycle spawns new agents. This prevents context rot — each agent reads the latest files from disk and starts clean. The orchestrator only coordinates.

---

# Phase 2: Implement

## Branching

**Both modes use this step.** Use the `AskUserQuestion` tool to present branching as a selectable question.

Derive a suggested branch name from the task type and title (e.g., `feat/node-creation`, `fix/broken-sk-format`).

**Question:** "Which branch do you want to work on?"
**Options:**
1. **`<suggested-branch>`** (Recommended) — "Auto-generated from task type and title"
2. **main** — "Commit directly to main"
3. _(User can always select "Other" to type a custom branch name)_

Wait for the user's selection. Then:
- If **branch selected**: create and checkout the branch before implementing.
- If **main**: stay on main — commits go directly to main.

## Trivial tasks — Direct implementation

For trivial tasks (1-3 files, single workspace), implement directly in this context:

```
1. Make the change
2. Validate the affected workspace:
   - contracts/ changed  → cd contracts && npm run build
   - lambdas/ changed    → npm run lint:fix (from root)
   - infra/ changed      → npm run synth (from root)
   - client/ changed     → cd client && npm run build
3. Commit immediately with scoped conventional format
4. Move to the next logical unit
```

## Standard and Complex tasks — Wave-based executor handoff

For standard and complex tasks, use wave-based execution with fresh agents per wave:

### Step 1: Write the work plan file

Create a work plan at `.claude/work/current-plan.md` using the `.claude/skills/plan/Templates/work-plan.md` format.

Convert the approved plan into work items:
- Each logical unit of work = one item
- 1-3 files per item (max 5 for tightly coupled changes)
- One workspace per item (contracts, lambdas, infra, or client)
- One commit per item
- Explicit dependencies between items
- Specific action instructions (not vague — reference existing patterns)
- Validation command for each item
- Pre-formatted commit message for each item

Include in the work plan:
- **Docs to Read** — only the docs relevant to this task
- **Rules to Read** — only the domain/area rules that apply
- **Reference Patterns** — existing similar code the executor should study
- **Gotchas** — domain-specific risks from the research phase

### Step 2: Compute dependency waves

Analyze the work items' `Depends` fields and group into waves:

```
Wave 1: Items with no dependencies (Depends: —)
Wave 2: Items that depend only on Wave 1 items
Wave 3: Items that depend only on Wave 1-2 items
...continue until all items are assigned
```

Report the wave plan before executing.

### Step 3: Execute waves with fresh agents

For each wave, spawn a **fresh executor agent** with only that wave's items:

```
Execute items <N, M, ...> from the work plan at .claude/work/current-plan.md

Read the plan file first, then load all docs and rules listed in it.
Execute only the listed items in order. Their dependencies from prior waves are complete.
<if any prior items were blocked>
Note: Item <X> from a prior wave was blocked. Skip any items that depend on it.
</if blocked>
Commit atomically per item. Apply deviation rules for issues.
Return the wave execution summary when done.
```

**Between waves:**
1. Review the wave summary — check for blocked items or L4 deviations.
2. Track blocked items across waves.
3. If L4 deviation: present to user, wait for decision before next wave.
4. If all items passed: report wave completion and spawn next wave.

**Why wave-based:** Each executor gets a fresh context window with zero accumulated rot from prior waves. The orchestrator stays lean — it only coordinates, never reads implementation code.

### Step 4: Aggregate and proceed

After all waves complete, merge wave summaries into the full Execution Summary. Append to the plan file. Move to Phase 3.

---

# Phase 3: Validate (standard and complex only)

After all changes are committed, run the full 5-step validation pipeline:

1. `cd contracts && npm run build`
2. `npm run lint:fix` (root)
3. `cd client && npm run lint`
4. `cd client && npm run build`
5. `npm run synth` (root)

Only run steps relevant to the workspaces that were touched. If a step fails, fix, commit the fix, and re-validate.

**For trivial tasks:** Skip this phase — workspace validation in Phase 2 is sufficient.

---

# Phase 4: Documentation (standard and complex only)

After validation passes, spawn the `code-change-documenter` agent:

Launch the `code-change-documenter` agent with this prompt:

```
Analyze code changes on the current branch and update all affected documentation.

Work plan: .claude/work/current-plan.md
Compare against: main branch

Follow your step-by-step workflow. Read the code, map changes to docs, update docs, run quality checks, return the report.
```

When the documenter returns:
- Review the documentation update report
- If docs were updated: commit them with `docs(<scope>): update documentation for <feature>`
- If the documenter found issues it couldn't resolve: note them in the PR description

**For trivial tasks:** Skip this phase unless a new domain was created.

---

# Phase 5: Ship (only if on a branch)

This phase only applies if the user chose to work on a new branch in Phase 2.

If on a **branch**:
1. Push the branch.
2. Create a PR with `gh pr create` using:
   - A short, descriptive title (under 70 chars)
   - A body with: summary bullets, test plan, and the footer
3. Report the PR URL to the user.
4. Archive: move `.claude/work/current-plan.md` to `.claude/work/history/<YYYY-MM-DD>-<slug>.md`.

If on **main**:
1. Report the completed commits to the user.
2. Archive: move `.claude/work/current-plan.md` to `.claude/work/history/<YYYY-MM-DD>-<slug>.md`.
3. Do NOT push unless the user explicitly asks.

---

# Core Principles

- **Contracts first.** Types and schemas before handlers, CDK, or client code. Always.
- **Read before changing.** Understand the current code before modifying it.
- **Small, scoped commits.** One logical unit per commit.
- **Surface gotchas early.** Check domain-specific risks before writing code, not after.
- **Stay thin as orchestrator.** Classify, spawn agents, compute waves, and ship. Never read implementation code yourself.
- **Fresh context per agent.** Every agent (scout, researcher, planner, checker, executor) gets a brand-new context window.
- **Disk-based handoff.** Agents write to `.claude/work/` files. The next agent reads from disk. You pass paths, never content.
