# Concerns

Analyzed: 2026-03-14

## High Priority

### Build Safety Disabled

Concern:
- next.config.mjs sets typescript.ignoreBuildErrors = true.

Risk:
- Type errors can ship to production unnoticed.

Impact:
- Runtime failures and broken user flows despite successful build.

Evidence:
- next.config.mjs

### No Automated Tests

Concern:
- no test framework configured in scripts and no test files detected.

Risk:
- navigation regressions and state mutation bugs are hard to catch early.

Impact:
- fragile releases and slower refactors.

Evidence:
- package.json scripts and codebase scan in app/components/lib/hooks

### In-Memory Data and Auth Flow

Concern:
- login and domain entities are entirely in-memory mock state.

Risk:
- no persistence, no real credentials, no security boundaries.

Impact:
- cannot support real users/data without major backend integration.

Evidence:
- lib/store.tsx
- components/screens/login-screen.tsx

## Medium Priority

### String-Based Navigation Keys

Concern:
- screen transitions depend on free-form string IDs.

Risk:
- typo-prone and not compile-time safe across all navigation calls.

Impact:
- blank/fallback screens and broken paths after renames.

Evidence:
- components/app-router.tsx
- lib/store.tsx (navigate signature)

### Duplicate Hook Implementations

Concern:
- useIsMobile exists in both hooks/use-mobile.tsx and components/ui/use-mobile.tsx.

Risk:
- divergence and maintenance overhead.

Impact:
- inconsistent behavior if one copy changes.

Evidence:
- hooks/use-mobile.tsx
- components/ui/use-mobile.tsx

### Mixed Code Style and Inconsistent Text Normalization

Concern:
- mixed quote styles and non-accented UI text.

Risk:
- readability and localization quality degradation.

Impact:
- inconsistent UX copy and harder maintenance.

Evidence:
- components/screens/login-screen.tsx
- components/screens/dentista/novo-tratamento.tsx

## Low Priority

### Minimal README

Concern:
- README currently only contains project title.

Risk:
- onboarding friction for contributors.

Impact:
- slower setup and unclear conventions.

Evidence:
- README.md

### .next Artifacts in Workspace

Concern:
- generated artifacts are present in workspace and can pollute searches.

Risk:
- noisy analysis and accidental references to build output.

Impact:
- slower code discovery and false positives in grep.

Evidence:
- .next/ directory present

## Suggested Stabilization Order

1. Re-enable TypeScript build blocking (or enforce strict CI typecheck).
2. Add smoke tests for core navigation and store mutations.
3. Replace string screen IDs with typed route union.
4. Consolidate duplicate hooks and normalize style rules.
5. Expand README with setup, architecture and testing instructions.
