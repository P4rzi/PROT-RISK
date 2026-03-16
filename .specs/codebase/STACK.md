# Tech Stack

Analyzed: 2026-03-14

## Core

- Framework: Next.js 16.1.6 (App Router)
- Language: TypeScript 5.7.3 + React 19.2.3
- Runtime: Node.js (via Next build/runtime)
- Package manager: npm (lockfile: package-lock.json)

## Frontend

- UI Framework: React 19 + Next.js client components
- Styling: Tailwind CSS 3.4.17 with CSS variables and tailwindcss-animate
- Component system: shadcn/ui style setup + Radix UI primitives
- Icons: lucide-react
- State Management: React Context + local useState (in-memory app store)
- Form Handling: react-hook-form + zod + @hookform/resolvers (installed)
- Charts/UI helpers: recharts, embla-carousel-react, sonner, cmdk, vaul

## Backend

- API Style: none detected inside this repository (no API routes or backend service code sampled)
- Database: none detected
- Authentication: local in-memory role/identifier checks in UI flow (no external auth provider)

## Testing

- Unit: not configured
- Integration: not configured
- E2E: not configured
- Observed status: no test files found in app/components/lib/hooks

## External Services

- None detected in application runtime code
- Assets: local static files in public/images

## Development Tools

- Linting: next lint script available
- Type checking: TypeScript enabled (strict: true)
- Build: next build
- Dev server: next dev --turbo
- CSS tooling: PostCSS + Tailwind

## Notable Config Notes

- next.config.mjs has typescript.ignoreBuildErrors = true
- tsconfig.json has strict mode enabled and alias path @/*
- components.json indicates shadcn-style aliases and cssVariables setup
