# Feature Plan Template

## Feature

<!-- One-sentence description -->

## Affected Workspaces

- [ ] `infra/` — CDK stacks/constructs
- [ ] `agents/` — Pipeline agent functions
- [ ] `dashboard/` — Seller dashboard pages/actions
- [ ] `components/` — Component library templates/metadata

## Agent Changes

| File | Change |
|---|---|
| `agents/<name>/handler.ts` | New handler |
| `agents/<name>/prompt.ts` | System prompt |
| `agents/<name>/types.ts` | Input/output interfaces |

## CDK Changes

| File | Change |
|---|---|
| `infra/stacks/PipelineStack.ts` | Add AgentLambda construct |
| `infra/constructs/AgentPipeline.ts` | Add step to state machine |

## Dashboard Changes

| File | Change |
|---|---|
| `dashboard/src/lib/api/<domain>.ts` | API wrapper |
| `dashboard/src/lib/actions/<domain>.ts` | Server action |
| `dashboard/src/app/<path>/page.tsx` | New page |

## Component Changes

| File | Change |
|---|---|
| `components/library/<category>/<Name>/index.tsx` | Component template |
| `components/library/<category>/<Name>/metadata.json` | Metadata |

## Implementation Order

1. **Shared types** — if cross-workspace
2. **Agents** — handlers + prompts
3. **CDK** — stacks → constructs → synth
4. **Dashboard** — API wrapper → action → page
5. **Components** — templates + metadata

## Gotchas

- [ ] Agent structured output validated
- [ ] Step Function state machine updated
- [ ] Component metadata matches schema
- [ ] IAM permissions correct

## Validation Steps

1. `npm run lint` — Lint passes
2. `npm run build` (dashboard/) — Dashboard builds
3. `npm run synth` — CDK synthesizes
