# AGENTS.md - Elaris Project Guidelines

## Project Overview

- **Framework**: Astro 5.x with React 18.x
- **Styling**: Tailwind CSS 4.x (via Vite plugin)
- **Language**: TypeScript (strict mode via `astro/tsconfigs/strict`)
- **Package Manager**: npm

## Commands

### Development
```bash
npm run dev          # Start dev server at localhost:4321
```

### Build & Preview
```bash
npm run build        # Build production site to ./dist
npm run preview      # Preview build locally
```

### Astro CLI
```bash
npm run astro -- check   # Type-check the project
npm run astro -- add     # Add integrations (e.g., astro add tailwind)
```

### Running Tests
**No tests configured.** To add testing, consider:
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

Run a single test with vitest:
```bash
npx vitest run src/components/__tests__/MyComponent.test.tsx
# or watch mode
npx vitest src/components/__tests__/MyComponent.test.tsx
```

## Code Style Guidelines

### Imports & Organization
- Use double quotes for strings (`"react-hook-form"`, not `'react-hook-form'`)
- Group imports logically: external libs → internal types → components
- Use relative imports (`../core/types/FormGetToken`)
- Use `.tsx` for components, `.ts` for types/hooks/utils

### TypeScript
- **Always** define prop interfaces for components:
  ```tsx
  interface PropsInput {
    label?: string;
    name: string;
    type?: string;
  }
  ```
- Use `type` for unions/interfaces, `interface` for object shapes
- Prefer `import type` for types only:
  ```ts
  import type { Path, RegisterOptions } from "react-hook-form";
  ```
- Avoid `any` - use proper types or `unknown` with type guards

### Component Patterns
- Use PascalCase for component names: `InputText`, `ApplicantScreen`
- Use arrow functions for components when no hooks need `this`:
  ```tsx
  export const InputText = ({ label, name }: PropsInput) => { ... }
  ```
- Default export for page components, named exports for reusable components

### Naming Conventions
- **Components**: PascalCase (`FormWizardGetToken`)
- **Hooks**: camelCase with `use` prefix (`useFormWizard`)
- **Constants (arrays)**: SCREAMING_SNAKE_CASE (`BLOOD_TYPES`, `ALLERGIES_DETAILS`)
- **Variables/functions**: camelCase (`handleComplete`, `tabChanged`)
- **Interfaces**: PascalCase (`FormGetToken`, `PropsInput`)
- **Files**: kebab-case (`form-wizard-get-token.tsx`, `info-stadistic.ts`)

### React Hook Form
- Use `useFormContext` for accessing form state in nested components
- Use `Path<T>` for type-safe field names:
  ```ts
  name: Path<FormGetToken>
  ```
- Define validation rules with `RegisterOptions`

### Tailwind CSS
- Use Tailwind 4.x syntax (no `var()` in classes - use direct values)
- Use `dark:` modifier for dark mode support
- Common patterns:
  ```tsx
  className="flex flex-col gap-2 w-full"
  className="text-sm font-medium text-slate-700 dark:text-slate-300"
  className="border border-slate-300 dark:border-slate-700 focus:ring-primary"
  ```

### Error Handling
- Currently: uses `console.log` for debugging
- For production: implement proper error boundaries and user feedback
- Validate forms with Zod (already in dependencies: `zod@^3.25.76`)

### Directory Structure
```
src/
├── components/react/
│   ├── core/
│   │   ├── const/     # Constants (infoStadistic.ts, steps.ts)
│   │   └── types/     # TypeScript interfaces (FormGetToken.ts)
│   ├── form/          # Form input components (InputText, InputSelect)
│   ├── hooks/         # Custom hooks (useFormWizard)
│   ├── layout/        # Layout components (FormWizardGetToken)
│   ├── screens/       # Screen/wizard step components
│   └── ui/            # Reusable UI components
├── content/           # Astro content collections
├── layouts/           # Astro layouts
├── pages/             # Astro pages
└── styles/            # Global styles
```

### File Naming
- Components: `PascalCase.tsx` (e.g., `InputText.tsx`)
- Utils/hooks: `kebab-case.ts` (e.g., `use-form-wizard.ts`)
- Types: `kebab-case.ts` (e.g., `form-get-token.ts`)
- Constants: `kebab-case.ts` (e.g., `info-stadistic.ts`)

### Astro-Specific
- Use `.astro` for static pages, `.tsx` for interactive React components
- Frontmatter in `.astro` files uses `---` fences
- Client directives for React: `client:load`, `client:visible`, etc.

### Common Patterns
- Wrap React components in Astro with hydration directives:
  ```astro
  <FormWizardGetToken client:load />
  ```
- Use `as const` for constant arrays to ensure literal types

## Missing/Incomplete
- No ESLint/Prettier configured
- No test framework
- No error boundaries
- Some interfaces have inconsistent naming (`personalDocumentation` vs `Applicant`)
