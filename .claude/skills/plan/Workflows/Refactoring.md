# Workflow: Refactoring

## When to Use

- Renaming types, functions, or files across workspaces
- Restructuring agent internal organization
- Extracting shared utilities
- Migrating patterns

## Step-by-Step

### 1. Define Scope

- What is being refactored and why?
- What must NOT change (external behavior, API contracts)?
- Boundaries: which files in/out of scope?

### 2. Catalog All Consumers

Grep for every import and usage of code being changed.

### 3. Plan Change Order

Follow dependency order. Validate between each step.

### 4. Execute in Small Steps

One workspace at a time. Validate after each. Commit per step.

### 5. Verify No Behavior Change

Full validation pipeline. No API changes, no DDB key changes.

## Quality Checks

- [ ] All consumers identified
- [ ] Changes follow dependency order
- [ ] Validation passes after each step
- [ ] No behavior change
