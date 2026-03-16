# Testing Infrastructure

## Test Frameworks

- Unit/Integration: not detected
- E2E: not detected
- Coverage tooling: not detected

Evidence:
- package.json scripts include dev/build/start/lint only.
- no dedicated test script found.
- no test files observed in app/components/lib/hooks sampling.

## Test Organization

- Location: no test directories currently present in sampled application code.
- Naming: no active naming pattern observed (e.g., *.test.ts, *.spec.tsx).
- Structure: not established.

## Observed Validation Patterns (Manual)

### UI State and Guard Clauses

Approach:
- screens rely on local validation with early returns and inline error text.

Examples:
- login required field checks and CPF existence checks in components/screens/login-screen.tsx
- required field guards before create treatment in components/screens/dentista/novo-tratamento.tsx

### Manual Flow Validation

Approach:
- behavior appears intended for manual navigation-based validation in browser.
- no assertions or automated regression safety nets.

## Current Gaps

- No automated regression checks for role navigation or screen transitions.
- No unit tests for store mutations (addTratamento, addAnamnese, registrarPaciente).
- No smoke tests for critical flows (login, cadastro primeiro acesso, tratamento creation).
- No accessibility or visual regression checks.

## Recommended Initial Testing Baseline

1. Add unit tests for lib/store.tsx mutation behavior.
2. Add component tests for login guard cases and success paths.
3. Add one end-to-end happy path per role (paciente and dentista).
4. Add CI gate to run lint + tests before merge.

## Risk Level

- High for regressions because app behavior is stateful and route keys are string-based.
- Any refactor in screen names or params can silently break navigation without tests.
