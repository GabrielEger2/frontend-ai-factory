# Pipeline Domain Rules

## Step Functions State Machine

The pipeline is a single Step Function execution:

```
SQS trigger → Research → Style → Composer → [Content || SEO] → Humanizer → Assembler → QA → Deploy/Flag
```

### Agent Execution Order
1. **Research Agent** — Input: company brief. Output: company data, competitors, segment analysis.
2. **Style Agent** — Input: research output. Output: palette, typography, mood tags, density.
3. **Composer Agent** — Input: style + component metadata. Output: ordered component list with slots.
4. **Content Agent** (parallel) — Input: research + style + component slots. Output: copy per slot.
5. **SEO Agent** (parallel) — Input: research + company data. Output: JSON-LD, meta tags, Open Graph, sitemap.
6. **Humanizer Agent** — Input: content output. Output: pt-BR adapted copy with brand personality tone.
7. **Assembler** (deterministic, not AI) — Input: blueprint + all agent outputs. Output: Next.js files.
8. **QA Agent** — Input: assembled files. Output: pass/fail with issues list.

### Parallel Branch
Content Agent and SEO Agent run in parallel. Both must complete before Humanizer starts.

### Error Handling
- Each agent step has a `Catch` block.
- Retry policy: 2 retries with exponential backoff for transient failures (API timeouts).
- On permanent failure: mark project as `failed`, notify seller.

### Pipeline State
- Step Functions input accumulates — each agent adds to it.
- Each agent also writes its output to DynamoDB project document.
- WebSocket notifications sent after each step completes.

## Agent Design Patterns

### Input Validation
Every agent validates its input with Zod on entry. Don't trust upstream output blindly.

### Structured Output
AI agents must return structured JSON. Use Claude's structured output or JSON mode.
Parse and validate the response before returning.

### Prompt Organization
- Main system prompt in `prompt.ts`
- Few-shot examples in `examples.ts` if needed
- Input formatting in `formatter.ts` if needed

### Idempotency
Agents should be idempotent — re-running with the same input produces the same output.
This enables Step Function retries without side effects.

## Assembler Rules
- The assembler is **NOT** an AI agent. It's deterministic code.
- It takes the component blueprint (from Composer) and content (from Humanizer) and generates Next.js files.
- It uses component templates from the `components/` workspace.
- It resolves slots, applies styles, and produces deployable code.
- If a slot is missing content, it uses the component's default placeholder.
