# Workflow: Bug Fix

## When to Use

- Agent returns wrong/malformed output
- Pipeline fails at a specific step
- Dashboard shows wrong data or broken UI
- CDK deployment issues
- Component rendering issues

## Step-by-Step

### 1. Reproduce and Understand

- Where: which agent, handler, page, or component?
- What: expected vs actual behavior
- When: specific input, state, or sequence?

### 2. Trace the Code Path

- **Agent:** Check prompt, input validation, output parsing
- **Pipeline:** Check Step Function definition, error handling, retry config
- **Dashboard:** Check API wrapper, server action, component rendering
- **CDK:** Check Lambda config, permissions, environment variables

### 3. Identify Root Cause

| Symptom | Likely Cause |
|---|---|
| Agent returns malformed JSON | Prompt needs structured output enforcement |
| Pipeline step timeout | Agent Lambda memory/timeout too low |
| Dashboard shows stale data | Missing revalidation or WebSocket update |
| Deploy fails | Vercel API config or generated code issue |
| Component renders wrong | Metadata mismatch or slot mapping error |

### 4. Plan the Fix

- Minimal change. Fix root cause only.
- Check cascading effects on downstream agents.

### 5. Commit

Single commit: `fix(<scope>): <what was wrong>`

## Quality Checks

- [ ] Root cause identified
- [ ] Fix is minimal
- [ ] All files in code path were read
- [ ] Validation passes after fix
