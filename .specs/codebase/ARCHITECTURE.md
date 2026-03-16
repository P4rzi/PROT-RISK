# Architecture

Pattern: Single Next.js app with client-side screen router and in-memory domain store.

## High-Level Structure

- Entry point in app/page.tsx mounts AppProvider and AppRouter.
- AppProvider (lib/store.tsx) contains domain data and navigation state.
- AppRouter (components/app-router.tsx) maps string route IDs to screen components.
- Screen components under components/screens render role-specific flows (paciente and dentista).
- Reusable UI building blocks come from components/ui and MobileShell.

## Identified Patterns

### Client-Side Screen Routing by String Key

Location: components/app-router.tsx + lib/store.tsx
Purpose: emulate mobile app navigation inside a single Next route.
Implementation:
- store keeps screen, screenParams, history, historyParams.
- navigate(newScreen, params) pushes history and updates screen.
- AppRouter uses a screens dictionary and renders based on current screen key.
Example:
- screens map in components/app-router.tsx
- navigate/goBack in lib/store.tsx

### Central In-Memory Domain Store

Location: lib/store.tsx
Purpose: hold all app entities and mutations for prototype/demo behavior.
Implementation:
- typed interfaces for Paciente, Dentista, Tratamento, Anamnese, TipoTratamento.
- mock arrays initialized in provider.
- mutation methods: addAnamnese, addTratamento, registrarPaciente.
- state is volatile and resets on reload.
Example:
- mock data declarations and AppContext provider in lib/store.tsx

### Role-Based UX Separation

Location: components/screens/paciente and components/screens/dentista
Purpose: separate user experiences by profile.
Implementation:
- login flow defines role and currentUser.
- role-specific home and detail screens.
- shared treatment-type screens under components/screens root.
Example:
- login transition to paciente-home or dentista-home in components/screens/login-screen.tsx

### Mobile-First Container Pattern

Location: app/layout.tsx + components/mobile-shell.tsx
Purpose: constrain layout to mobile viewport and standardize headers/back behavior.
Implementation:
- layout body max width fixed to 430px, centered.
- MobileShell provides sticky header with optional back button.
Example:
- max-w-[430px] in app/layout.tsx
- header + goBack wiring in components/mobile-shell.tsx

## Data Flow

### Flow: Login and Session Initialization

1. User enters CPF/CRO and password in login screen.
2. Screen checks in-memory arrays from store.
3. setRole + setCurrentUser are called.
4. navigate sends user to role home screen.

Code path:
- components/screens/login-screen.tsx
- lib/store.tsx

### Flow: Treatment Creation (Dentista)

1. Dentista fills treatment form.
2. Form builds new Tratamento object (id from Date.now).
3. addTratamento appends to tratamentos array in context state.
4. Success state is shown, then navigate back to dentista-home.

Code path:
- components/screens/dentista/novo-tratamento.tsx
- lib/store.tsx

### Flow: Treatment Listing (Paciente)

1. Screen reads currentUser and selected status filter.
2. It filters tratamentos by pacienteId and status.
3. User opens details through navigate with treatment id param.

Code path:
- components/screens/paciente/tratamentos-lista.tsx
- lib/store.tsx

## Code Organization

Approach: feature-oriented UI screens with a shared global state module.

Structure:
- app/: Next app shell and root page.
- components/screens/: business screens by role/capability.
- components/ui/: reusable primitives (mostly shadcn/Radix wrappers).
- lib/: app store and utilities.
- hooks/: duplicated helper hooks for UI support.

Module boundaries:
- Routing/state boundary: lib/store.tsx + components/app-router.tsx
- Feature boundary: components/screens/**
- Reusable UI boundary: components/ui/**
- Styling boundary: app/globals.css + tailwind.config.ts
