# Implementation Checklist

## Pre-Flight

- [ ] Read relevant domain rules
- [ ] Read relevant backend rules
- [ ] If dashboard work: read frontend rules
- [ ] If CDK work: read deployment rules

## Agent Lambda

- [ ] Handler exports `handler` function
- [ ] Input validated with Zod schema on entry
- [ ] Output validated before returning
- [ ] Structured JSON output from LLM parsed and validated
- [ ] Error thrown (not swallowed) for Step Function catch
- [ ] Logging with structured JSON (requestId, agent name)
- [ ] No hardcoded API keys

## CDK

- [ ] Lambda uses `LAMBDA_DEFAULTS` or `AgentLambda` construct
- [ ] AI agent Lambdas have higher memory/timeout
- [ ] IAM grants are least-privilege
- [ ] API routes have correct auth
- [ ] Environment variables use `SCREAMING_SNAKE_CASE`
- [ ] Cross-stack resources via MainStage props
- [ ] `npm run synth` passes

## Dashboard

- [ ] Server Components by default
- [ ] Server actions validate with Zod
- [ ] API wrappers use typed responses
- [ ] Loading, error, and empty states handled
- [ ] DaisyUI semantic colors (no raw Tailwind colors)

## Components

- [ ] `metadata.json` matches schema
- [ ] All slots defined with types and constraints
- [ ] PAIRS_WITH data included
- [ ] Assembler can resolve component

## Final

- [ ] Validation pipeline passes (lint → dashboard build → CDK synth)
- [ ] Commits follow `<type>(<scope>): <description>` format
- [ ] Each commit is one logical unit
