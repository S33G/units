# AGENTS.md — Units

## Project Overview

A transparent unit converter built with Next.js 16 (App Router), React 19, TypeScript 5, and Tailwind CSS 4. Purely client-side — no backend, no data collection. Users see the exact formula behind every conversion.

## Tech Stack

| Layer      | Technology                                          |
|------------|-----------------------------------------------------|
| Framework  | Next.js 16 (App Router, Server Components default)  |
| UI         | React 19, Framer Motion (animations), Lucide (icons), cmdk (command palette) |
| Language   | TypeScript 5 (strict mode)                          |
| Styling    | Tailwind CSS 4 (PostCSS), clsx + tailwind-merge via `cn()` helper |
| Linting    | ESLint 9 (flat config: next/core-web-vitals + next/typescript) |
| Fonts      | Geist Sans + Geist Mono (via `next/font/google`)    |

## Commands

```bash
npm run dev              # Dev server at http://localhost:3000
npm run build            # Production build (also validates types)
npm run start            # Serve production build
npm run lint             # ESLint (flat config)
npx tsc --noEmit         # Type-check without emitting
```

### Testing (Vitest)

```bash
npm test                             # Run all tests once
npm run test:watch                   # Run tests in watch mode
npm run test:ui                      # Open Vitest UI
npm run test:coverage                # Run with coverage report (100% threshold)
npx vitest run path/to/file.test.ts  # Run single test file
npx vitest run --testNamePattern="foo" # Run tests matching pattern
npx vitest path/to/file.test.ts      # Watch mode for single file
```

**Coverage**: Target is 100% for lines, functions, branches, and statements. Excludes:
- Test files, layout/page entry points
- `Converter.tsx` (complex state + URL sync)
- `CategoryMobileSelect.tsx`, `CategoryPicker.tsx` (mobile-specific UI)
- `lib/types.ts` (TypeScript type definitions only)

## Project Structure

```
units/
├── app/
│   ├── components/       # Client components (all "use client")
│   │   ├── Converter.tsx          # Main converter (state, URL sync)
│   │   ├── CategorySidebar.tsx    # Desktop category nav
│   │   ├── CategoryMobileSelect.tsx
│   │   ├── CategoryPicker.tsx
│   │   ├── ConversionDisplay.tsx  # Result display
│   │   ├── FormulaExplainer.tsx   # Shows conversion steps
│   │   ├── ShareButton.tsx
│   │   ├── SwapButton.tsx
│   │   └── UnitSelect.tsx
│   ├── globals.css       # Tailwind import, CSS vars, theme tokens
│   ├── layout.tsx        # Root layout (fonts, metadata)
│   ├── manifest.ts       # PWA manifest
│   └── page.tsx          # Home page (server component)
├── lib/
│   ├── types.ts          # Core types: UnitDef, Category, ConversionResult
│   ├── convert.ts        # Conversion engine (A → base → B)
│   ├── utils.ts          # cn() helper (clsx + twMerge)
│   └── categories/       # Unit definitions (one file per category)
│       ├── index.ts      # Re-exports all categories as sorted array
│       ├── length.ts     # Example: length units with factors/formulas
│       ├── temperature.ts # Non-linear (custom toBase/fromBase)
│       └── ...           # 20 categories total
├── public/               # Static assets (icons, SVGs)
└── eslint.config.mjs     # ESLint flat config
```

## Architecture

**Conversion engine** (`lib/convert.ts`): Every unit defines a `factor` (linear) or `toBase`/`fromBase` functions (non-linear like temperature). Converting unit A → B goes A → base unit → B.

**Category definitions** (`lib/categories/*.ts`): Each file exports a `Category` object with `id`, `name`, `icon`, `baseUnitId`, and `units[]`. Every `UnitDef` includes `formulaToBase` (human-readable) and `source` (provenance).

**URL state**: The `Converter` component syncs state to URL search params (`?c=length&from=meters&to=feet&v=5`) for shareability.

## Code Style

### TypeScript
- **Strict mode ON** — never weaken. No `as any`, `@ts-ignore`, `@ts-expect-error`.
- Use `type` keyword for type-only imports: `import type { Foo } from "bar"`.
- Use `type` (not `interface`) for component props and data shapes (project convention).
- Path alias: `@/*` maps to project root. Prefer over relative `../../` paths.

### Import Order (blank line between groups)
1. `"use client"` directive (if needed, must be first line)
2. React / Next.js (`react`, `next/*`)
3. Third-party (`framer-motion`, `lucide-react`, `clsx`, etc.)
4. Internal aliases (`@/lib/*`, `@/app/*`)
5. Relative imports (`./`)
6. CSS imports last

### Naming Conventions

| Entity               | Convention   | Example                        |
|----------------------|-------------|--------------------------------|
| Files (pages/layout) | kebab-case  | `page.tsx`, `flow-rate.ts`     |
| Component files      | PascalCase  | `Converter.tsx`, `SwapButton.tsx` |
| Components/Types     | PascalCase  | `ConversionDisplay`, `UnitDef` |
| Functions/variables  | camelCase   | `formatNum`, `baseUnitId`      |
| CSS variables        | kebab-case  | `--font-geist-sans`            |
| Category IDs         | kebab-case  | `"digital-storage"`, `"flow-rate"` |
| Unit IDs             | kebab-case  | `"nautical-miles"`, `"meters"` |

### Components
- **Named exports** for all components: `export function Converter() { ... }`.
- Page/layout components use `export default function`.
- Props: use `type` aliases, not inline. Use `Readonly<>` for children props.
- Callback props: suffix with `Action` (e.g. `onSelectAction`, `onSwapAction`).
- Server Components by default. Add `"use client"` only when needed (state, effects, browser APIs).

### Styling
- Tailwind CSS 4 with `@import "tailwindcss"` (not v3 `@tailwind` directives).
- Use `cn()` from `@/lib/utils` to merge conditional classes.
- Theme via CSS custom properties in `globals.css` + `@theme inline {}` block.
- Dark mode: `prefers-color-scheme` media query in CSS, `dark:` prefix in Tailwind.
- Avoid inline `style` props. Use Tailwind utilities.

### Adding a New Unit Category
1. Create `lib/categories/my-category.ts` exporting a `Category` object.
2. Every unit needs: `id`, `name`, `symbol`, `factor` (or `toBase`/`fromBase`), `precision`, `formulaToBase`, `source`.
3. Import and add to the array in `lib/categories/index.ts`.

### Error Handling
- Throw descriptive `Error` with context (see `convert.ts` for examples).
- Never swallow errors with empty catch blocks.
- Use Next.js `error.tsx` boundaries for page-level errors.

### ESLint
- Flat config (`eslint.config.mjs`): extends `next/core-web-vitals` + `next/typescript`.
- Run `npm run lint` before committing. Fix all warnings.

## Quick Reference

```bash
npm run dev                         # Start development
npm run lint && npx tsc --noEmit    # Validate before committing
npm run build                       # Full production build check
```
