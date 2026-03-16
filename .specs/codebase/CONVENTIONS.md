# Code Conventions

## Naming Conventions

### Files

Observed pattern:
- kebab-case for most files
- role folders for screen grouping

Examples:
- components/screens/login-screen.tsx
- components/screens/dentista/novo-tratamento.tsx
- components/screens/paciente/tratamentos-lista.tsx
- lib/store.tsx

### Components/Functions

Observed pattern:
- React components in PascalCase
- utility functions in camelCase

Examples:
- LoginScreen, DentistaNovoTratamento, MobileShell
- handleLogin, handleSubmit, addProcedimento, registrarPaciente

### Variables

Observed pattern:
- camelCase for local variables and state
- Portuguese domain naming is common (pacientes, tratamentos, anamnese)

Examples:
- selectedPaciente, novoProcedimento, firstAccessError
- tiposTratamento, dataInicio, historicoFamiliar

### Constants

Observed pattern:
- UPPER_SNAKE_CASE for true constants
- occasional typed maps with camelCase keys for status enums

Examples:
- MOBILE_BREAKPOINT
- statusLabels, statusIcons, statusColors

## Code Organization

### Imports

Observed pattern:
- External imports first
- Internal imports through @ alias
- Type imports mixed with value imports when convenient

Example (short):
- components/screens/dentista/novo-tratamento.tsx
- imports useApp and types from @/lib/store, MobileShell from @/components/mobile-shell

### File Structure

Observed pattern in screens:
1. imports
2. local types/constants
3. component with hooks/state
4. event handlers
5. conditional render branches (success/steps)
6. main JSX return

Example:
- components/screens/login-screen.tsx
- components/screens/dentista/novo-tratamento.tsx

## Type Safety

Approach:
- TypeScript strict mode enabled in tsconfig
- explicit interfaces for domain entities in store
- occasional type assertions for currentUser based on active role

Examples:
- interfaces Paciente, Dentista, Tratamento in lib/store.tsx
- const paciente = currentUser as Paciente in paciente screens
- const dentista = currentUser as Dentista in dentista screens

## Error Handling

Observed pattern:
- UI-level validation and early returns
- errors stored as local string state and rendered inline
- very little centralized or exception-based handling

Examples:
- handleLogin validates fields and sets error in components/screens/login-screen.tsx
- handleSubmit guards required fields in components/screens/dentista/novo-tratamento.tsx

## Comments and Documentation

Observed style:
- sparse comments, used mainly as section markers in JSX
- no formal architecture docs prior to this mapping

Examples:
- comments like "First access state", "Main login screen", "Filter chips"

## Styling Conventions

Observed pattern:
- utility-first Tailwind classes directly in JSX
- reusable input class strings in component scope
- theme tokens via CSS variables in app/globals.css

Examples:
- inputClasses in login and treatment form screens
- bg-primary/text-primary-foreground token usage across screens

## Variations and Inconsistencies

- Quotation style is mixed (single and double quotes coexist).
- Duplicate hooks exist in hooks/ and components/ui/ with same implementation (use-mobile).
- Some accent-sensitive text is written without diacritics in UI copy and variable names.
