---
paths:
  - "agents/**/*.ts"
---
# Backend API Rules

## Lambda Architecture

### Dashboard API Handlers
- **Handlers:** Thin Lambda entry points. Extract params, call service, return response.
- **Services:** Business logic. One file per operation.

### Pipeline Agent Handlers
- Each agent is a Lambda function triggered by Step Functions.
- Input: previous agent's output (or initial brief from SQS).
- Output: structured JSON for the next agent.
- Error: throw to trigger Step Function retry/catch.

## Error Handling
- Agent handlers: throw errors to trigger Step Function error handling and retry logic.
- Never swallow errors in agents — Step Functions needs to know about failures.

## Agent Input/Output Contracts
- Each agent defines its input and output TypeScript interfaces.
- Validate input with Zod at agent entry. Validate output before returning.
- Agent output becomes next agent's input — schema mismatches break the pipeline.

## Step Functions Integration
- Agents receive `event` with the accumulated pipeline state.
- Each agent reads what it needs, adds its contribution, passes forward.
- Parallel branches (Content + SEO) merge results before Humanizer.

## Logging
- Use structured JSON logging with requestId and agent name.
- Log agent input/output summaries (not full content — LLM responses can be large).
- Never log API keys or full LLM prompts in production.
