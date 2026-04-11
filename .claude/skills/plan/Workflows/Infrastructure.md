# Workflow: Infrastructure Changes

## When to Use

- Adding/modifying CDK stacks or constructs
- Changing Lambda configuration
- Modifying Step Functions definition
- Adding API Gateway routes
- Changing DynamoDB table config

## Step-by-Step

### 1. Understand Current State

Read `infra/` stacks and constructs. Run `npm run synth`.

### 2. Plan Stack Changes

| Concern | Question |
|---|---|
| Isolation | Direct import between stacks? → Must flow through MainStage |
| Order | Needs prop from earlier stack? → Check instantiation order |
| Permissions | Minimum IAM grant needed? |
| Lambda config | Needs non-default memory/timeout? |

### 3. Plan Step Function Changes

- New agent step? Add to state machine definition
- Parallel branch? Configure parallel state with merge
- Error handling? Add Catch and Retry blocks
- State size? Check payload doesn't exceed Step Functions limits

### 4. Validate

1. `npm run synth` — Must pass
2. `npx cdk diff` — Review changes

### 5. Commit

Format: `feat(infra): <what changed>`

## Quality Checks

- [ ] No direct imports between stacks
- [ ] MainStage order respects dependencies
- [ ] IAM grants are least-privilege
- [ ] Agent Lambdas use `AgentLambda` construct
- [ ] `npm run synth` passes
