# Agent Delegation Rules

## When to Delegate
- Delegate when a task is well-scoped and can run independently.
- Prefer delegation for tasks that would bloat the main context window.
- Never delegate tasks that require back-and-forth user clarification.

## Agent Selection Guide

| Task | Agent | Notes |
|---|---|---|
| Explore codebase / find patterns | `scout` | Quick, lightweight — use for initial discovery |
| Deep research before planning | `researcher` | Writes structured findings to disk for planner |
| Create implementation plan | `planner` | Reads research, produces structured work plan |
| Validate plan quality | `plan-checker` | Run after planner, before execution |
| Execute work plan items | `executor` | Fresh context per work item, atomic commits |
| Verify deliverables were built | `verifier` | Goal-backward analysis: exists → substantive → wired |
| Review code for security | `security-reviewer` | Handlers, CDK constructs, dashboard code |

## Rules
- Run `scout` or `researcher` before `planner` — never plan blind.
- Run `plan-checker` before `executor` — catch issues before implementation.
- Run `verifier` after `executor` — confirm deliverables actually work.
- Run agents in parallel when tasks are independent.
