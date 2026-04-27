# AGENTS.md

## Stack & Tooling
- Astro 5 with React 18 islands; TypeScript extends `astro/tsconfigs/strict`.
- Tailwind 4 runs through `@tailwindcss/vite`; styles come from `src/styles/global.css` (no separate config file).
- npm scripts only: `npm run dev`, `npm run build`, `npm run preview`, `npm run astro -- check`. No lint or test commands exist.
- `CLAUDE.md` in repo root overrides tooling usage (no `cat`/`grep`, no builds after edits, aggressive tone rules); always skim it before changes.

## Project Layout
- `src/pages/*.astro` define routes and hydrate React islands (`client:only="react"`) for interactive pieces.
- `src/components/react/` holds the form platform: `core` (const/types/zod), `form` (inputs built on `useFormContext`), `layout` (wizard shell), `screens` (per-step containers), `ui` (Modal, headers), `utils` (helpers).
- Markdown-driven catalog pages live in `src/pages/catalog/[slug].astro` and pull data from `src/content/career` via collections defined in `src/content/config.ts`.

## Form Wizard Domain
- `layout/FormWizardGetToken.tsx` wraps `react-form-wizard-component` and imports its CSS; breaking that import destroys the wizard styling.
- Wizard steps are declared in `core/const/steps.ts`. Any new step needs matching schema updates in `core/validations/FormGetTokenValidations.ts` and UI in `screens/`.
- Form types live in `core/types/IFormGetToken.ts`. Types and Zod schema are currently out of sync (e.g. `school.location` vs coordinates objects); fix both when changing fields.
- Inputs in `form/` register nested paths via `Path<T>` generics. When adding fields, mirror the existing dotted names used in `STEPS` and extend the schema, types, and default values together.
- Validation uses `zod/v4-mini`; keep that import to avoid bundling the entire library and to ensure client builds succeed.
- File uploads rely on browser `File` instances in Zod refinements; running the wizard in non-browser contexts will fail.

## Styling
- Components rely on raw Tailwind class strings (double quotes); no `clsx` helper is used.
- The wizard theme color and icons come from Themify (`<style>@import ...themify-icons.css</style>` inside the component). Verify new icons exist in that CDN before referencing them.

## Content & Catalog
- Astro content collections (`career`, `homeInfo`, `news`) validate Markdown frontmatter. Add fields in both the Markdown files and `src/content/config.ts`.
- Catalog sidebar/cards components expect those schema fields; keep names identical to avoid runtime undefineds.

## Known Gaps
- No automated tests or linting; only `astro -- check` is available for quick validation.
- `src/layouts/Layout.astro` ignores the `title` prop currently passed from pages—set `<title>` manually if SEO matters.
- Legacy TypeScript interfaces and actual form schema drift easily. Double-check both before trusting types or reusing shapes.
