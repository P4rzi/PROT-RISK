# Project Structure

Root: PROT-RISK

## Directory Tree

```text
.
├── app
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components
│   ├── app-router.tsx
│   ├── mobile-shell.tsx
│   ├── theme-provider.tsx
│   ├── screens
│   │   ├── login-screen.tsx
│   │   ├── tipo-tratamento-detalhe.tsx
│   │   ├── tipos-tratamento.tsx
│   │   ├── dentista
│   │   └── paciente
│   └── ui
├── hooks
├── lib
├── public
│   └── images
├── styles
├── .github
│   └── skills
└── .specs
    └── codebase
```

## Module Organization

### App Shell

Purpose: root Next.js app setup and global styling.
Location: app/
Key files:
- app/layout.tsx
- app/page.tsx
- app/globals.css

### Navigation and State

Purpose: client routing-like behavior and domain state.
Location: lib/ and components/app-router.tsx
Key files:
- lib/store.tsx
- components/app-router.tsx
- components/mobile-shell.tsx

### Screens (Business UI)

Purpose: role-based workflows and domain interactions.
Location: components/screens/
Key files:
- components/screens/login-screen.tsx
- components/screens/paciente/home.tsx
- components/screens/dentista/home.tsx
- components/screens/dentista/novo-tratamento.tsx

### UI Primitives

Purpose: reusable design-system style components.
Location: components/ui/
Key files:
- components/ui/button.tsx
- components/ui/card.tsx
- components/ui/dialog.tsx
- components/ui/toast.tsx

### Utility and Hooks

Purpose: shared helper functions and React hooks.
Location: lib/ and hooks/
Key files:
- lib/utils.ts
- hooks/use-toast.ts
- hooks/use-mobile.tsx

## Where Things Live

### Authentication and Onboarding

- UI/Interface: components/screens/login-screen.tsx
- Business Logic: inline in login screen + role assignment in store
- Data Access: in-memory arrays from lib/store.tsx
- Configuration: none specific

### Treatment Lifecycle

- UI/Interface: components/screens/paciente/* and components/screens/dentista/*
- Business Logic: filtering/creation logic in screens + mutations in store
- Data Access: context state in lib/store.tsx
- Configuration: none specific

### Styling and Theming

- UI/Interface: Tailwind utility classes in TSX files
- Business Logic: token mapping in tailwind config
- Data Access: CSS variable tokens in app/globals.css
- Configuration: tailwind.config.ts, components.json

## Special Directories

### .github/skills

Purpose: local skill packs/instructions and scripts for the coding agent environment.
Examples:
- .github/skills/tlc-spec-driven/
- .github/skills/codenavi/

### public/images

Purpose: static image assets for treatment type visual references.
Examples:
- public/images/protese-total.jpg
- public/images/implante.jpg

### components/ui

Purpose: reusable UI primitives used across screens.
Examples:
- input.tsx
- select.tsx
- tabs.tsx
- toast.tsx
