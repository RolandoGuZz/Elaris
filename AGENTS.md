# AGENTS.md - Elaris Project Guidelines

## Project Overview

- **Framework**: Astro 5.x with React 18.x
- **Styling**: Tailwind CSS 4.x (via Vite plugin)
- **Language**: TypeScript (strict mode via `astro/tsconfigs/strict`)
- **Package Manager**: npm
- **Key Dependencies**:
  - React Hook Form (`react-hook-form@^7.71.2`)
  - Zod (`zod@^3.25.76`) for validation
  - `@hookform/resolvers` for Zod integration
  - react-form-wizard-component for form wizard
  - leaflet/react-leaflet for maps
  - swiper for sliders

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
- Use generic component patterns for reusability:
  ```tsx
  export function InputText<T extends FieldValues>({ name }: InputTextProps<T>) {...}
  ```

### Component Patterns
- Use PascalCase for component names: `InputText`, `ApplicantScreen`
- Use arrow functions or function declarations for components:
  ```tsx
  export const InputText = ({ label, name }: PropsInput) => { ... }
  // or
  export function InputText({ label, name }: PropsInput) { ... }
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
- Use `zodResolver` for Zod validation:
  ```tsx
  import { zodResolver } from "@hookform/resolvers/zod";
  const methods = useForm({
    resolver: zodResolver(formGetTokenSchema),
    mode: "onChange",
  });
  ```
- Define validation rules with `RegisterOptions`

### Zod Validation
- Create validation schemas in `src/components/react/core/validations/`
- Use sub-schemas for nested objects:
  ```ts
  const identificationUserSchema = z.object({...});
  const personalDocumentationSchema = z.object({...});
  export const formGetTokenSchema = z.object({
    identification: identificationUserSchema,
    personalDocumentation: personalDocumentationSchema,
  });
  ```
- Export inferred types:
  ```ts
  export type FormGetTokenSchemaType = z.infer<typeof formGetTokenSchema>;
  ```

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
- Use Zod for form validation with clear error messages
- Display validation errors in components:
  ```tsx
  {error && (
    <span className="text-xs text-red-500">{error.message}</span>
  )}
  ```
- Use modal components for form submission feedback

### Directory Structure
```
src/
├── components/react/
│   ├── core/
│   │   ├── const/        # Constants (infoStadistic.ts, steps.ts)
│   │   ├── types/       # TypeScript interfaces (IFormGetToken.ts)
│   │   └── validations/  # Zod schemas (FormGetTokenValidations.ts)
│   ├── form/            # Form input components (InputText, InputSelect)
│   ├── hooks/           # Custom hooks (useFormWizard)
│   ├── layout/          # Layout components (FormWizardGetToken)
│   ├── screens/         # Screen/wizard step components
│   │   └── Inscriptions/
│   └── ui/             # Reusable UI components (Modal)
├── content/             # Astro content collections
├── layouts/             # Astro layouts
├── pages/               # Astro pages
└── styles/             # Global styles
```

### File Naming
- Components: `PascalCase.tsx` (e.g., `InputText.tsx`)
- Utils/hooks: `kebab-case.ts` (e.g., `use-form-wizard.ts`)
- Types: `PascalCase.ts` (e.g., `IFormGetToken.ts`)
- Validations: `PascalCaseValidations.ts` (e.g., `FormGetTokenValidations.ts`)
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
- Some interfaces have inconsistent naming
