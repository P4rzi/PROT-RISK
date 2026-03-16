# Integrations

## External Runtime Services

No external service integrations were detected in sampled runtime code.

Observed:
- no HTTP client usage in sampled app screens/store
- no API route handlers in app/
- no SDK initialization for third-party backends

## UI/Library Integrations

### shadcn-style + Radix UI

Purpose: provide composable, accessible UI primitives.
Evidence:
- components.json configured for shadcn schema and aliases
- many @radix-ui/react-* dependencies in package.json
- wrappers in components/ui/

### Tailwind + CSS Variable Theming

Purpose: tokenized styling through design tokens.
Evidence:
- app/globals.css defines --primary, --background, etc.
- tailwind.config.ts maps tokens to semantic color names

### next-themes

Purpose: theme provider abstraction (currently available, light usage observed).
Evidence:
- components/theme-provider.tsx wraps NextThemesProvider

### Icon and Utility Libraries

- lucide-react for icons
- clsx + tailwind-merge via lib/utils.ts (cn helper)
- sonner/react-toast infrastructure present

## Assets Integration

- local static images in public/images used by treatment type data in store.

## Development-Only Tooling Present in Repository

- .github/skills contains local agent skills and scripts.
- These are not part of end-user runtime behavior.

## Missing/Planned Integration Areas

- backend API integration
- persistent database integration
- real authentication/authorization provider
- observability/logging integration
