# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

KOIN is a campus service web application for Korea University of Technology and Education (KOREATECH). It provides timetable management, bus schedules, cafeteria menus, store/shop listings, community articles, clubs, lost & found, and graduation calculators.

Built with **Next.js 15 (Pages Router)**, **React 19**, and **TypeScript** (strict mode).

- Package manager: **Yarn 4 (Berry)** with PnP. Never use `npm install`.
- Node version: **20.11.1**

## Commands

```bash
yarn start              # Dev server (next dev)
yarn build              # Type-check (tsc) then production build
yarn lint               # ESLint + Stylelint
yarn lint:eslint        # ESLint only (src/)
yarn lint:stylelint     # Stylelint only (src/**/*.scss)
yarn log                # Generate analytics logging hooks from Notion spec
```

## Architecture

### Routing (Pages Router)

File-based routing in `src/pages/`. Type-safe route builder in `src/static/routes.ts`:

```typescript
ROUTES.StoreDetail({ id: '123' }); // → '/store/123'
```

Pages can declare static properties:

```typescript
Page.getLayout = (page: React.ReactNode) => <SSRLayout>{page}</SSRLayout>;
Page.requireAuth = true;
Page.title = 'Page Title';
```

### API Layer

`src/api/` uses a class-based pattern with `APIClient` wrapper (`src/utils/ts/apiClient.ts`):

1. Define request class in `APIDetail.ts` implementing `APIRequest<ResponseType>`
2. Define request/response types in `entity.ts`
3. Export callable function via `APIClient.of(DetailClass)` in `index.ts`

```typescript
export class Login implements APIRequest<LoginResponse> {
  path = '/user/login';
  method = HTTP_METHOD.POST;
  data: LoginRequest;
}
// index.ts
export const login = APIClient.of(Login);
```

The APIClient handles token refresh (401), maintenance mode (503), and user type verification (403) automatically.

### State Management

- **Server state**: TanStack React Query (`staleTime: 60000`, `retry: false`). SSR via `getServerSideProps` + `HydrationBoundary`.
- **Client state**: Zustand stores in `src/utils/zustand/`. Many stores separate `State` and `Actions` types — follow the existing pattern of each file.

Zustand stores export selectors:

```typescript
export const useStateSelector = () => useStore((state) => state.prop);
export const useActions = () => useStore((state) => state.action);
```

### Styling

SCSS with CSS Modules (`[Component].module.scss`) using BEM methodology. Desktop-first approach with mobile overrides via responsive mixins in `src/utils/scss/`:

```scss
@include media.media-breakpoint(mobile) {
  /* breakpoint: 576px */
}
```

### Component Organization

Feature-based: `src/components/[Feature]/` with co-located hooks in `hooks/` subdirectory and styles. Split responsive views into `MobileView/` and `PCView/` directories when layouts differ. Shared UI in `src/components/ui/`, layouts in `src/components/layout/`, modals in `src/components/modal/`.

### Layout

Two layout components in `src/components/layout/`:

- **`SSRLayout`**: No Suspense wrapping. Used for SSR pages via `getLayout`.
- **`Layout`** (default): Wraps Header/children in Suspense boundaries. Hides Footer in native WebView.

Misusing these causes hydration errors.

### Custom Hooks

Located in `src/utils/hooks/`, organized by category:

- `auth/` — useAuth, useAutoLogin, useLoginRedirect, useLogout
- `ui/` — useBodyScrollLock, useOutsideClick, useEscapeKeyDown
- `state/` — useBooleanState, useLocalStorage, useWebStorage, useMount
- `layout/` — useMediaQuery, useModalPortal
- `analytics/` — useLogger, useScrollLogging

### Internal Packages

- **`@bcsdlab/koin`**: `isKoinError()` type guard, `sendClientError()` (sends errors to internal Slack).
- **`@bcsdlab/utils`**: `cn()` (className merger), `sha256()` (Web Crypto hashing).

These are internal BCSD Lab packages — do not suggest replacing them with external alternatives.

### Cookie Management

Cookie keys are environment-aware via `IS_STAGE` flag in `src/static/url.ts`. Stage and production use different cookie key names (e.g., `STAGE_AUTH_TOKEN_KEY` vs `AUTH_TOKEN_KEY`) and different domains (`.stage.koreatech.in` vs `.koreatech.in`). Always use `COOKIE_KEY` constants and `getCookieDomain()` — never hard-code cookie names or domains.

### iOS Native Bridge

WebKit message handlers for token sync between web and native app via `window.webkit.messageHandlers`. Bridge functions in `src/utils/ts/iosBridge.ts`.

### Analytics

Generated logging hooks in `src/generated/analytics/` from Notion spec via `yarn log`. Google Analytics + GTM + Sentry error tracking.

## Code Conventions

### Imports

Absolute imports via `*` → `src/*` path mapping. Use `import X from 'components/...'` not `'../../../components/...'`. Relative parent imports (`../*`) are forbidden by ESLint.

Import order (enforced): React/Next → builtins → external packages → internal (`@/**`) → parent/sibling → types → styles (`.scss`).

### Naming

- Components/directories: PascalCase (`ArticleList.tsx`)
- Utilities: camelCase (`apiClient.ts`)
- Hooks: `use[Name].ts`
- Styles: `[Component].module.scss`
- API types: `entity.ts`, API classes: `APIDetail.ts`

### Formatting

Prettier: 120 char width, single quotes, trailing commas, 2-space indent. Stylelint enforces `stylelint-config-standard-scss`.

## PR Review Rules (for claude-code-action)

Write all review comments in Korean.

Focus on correctness, regression risk, security, and performance before style.

Use this output format for every finding:

- Severity: `[P0]` (blocks merge), `[P1]` (should fix), `[P2]` (suggestion)
- Location: `file:line`
- Why it matters
- Minimal fix suggestion

### Error Handling

- Always use `isKoinError()` type guard before accessing error properties on API errors.
- In ErrorBoundary, use `isAxiosError()` type guard to branch handling.

```typescript
onError: (error) => {
  if (isKoinError(error)) {
    showToast('error', error.message || 'fallback message');
  } else {
    showToast('error', 'fallback message');
  }
};
```

### React Query

- Query keys as arrays: `['resource', 'action', params]`.
- Prefer `useSuspenseQuery` when a Suspense boundary wraps the component for blocking UI. Use `useQuery` for conditional fetching (`enabled`), background refresh, or non-blocking patterns.
- Invalidate cache via `queryClient.invalidateQueries()` after mutations.
- Every mutation `onError` must follow the error handling pattern above.

### Analytics Logging

- All user interactions (click, swipe, page load) must include logging.
- Use the `useLogger()` hook with `team`, `event_label`, `value` structure.
- Define logging constants (`loggingTitle`, `loggingValue`) at the top of the component.

### General

- No `console.log` (ESLint warn). Only `console.warn` and `console.error` allowed.
- Import SVGs as React components via `@svgr/webpack`.
- Use `showToast(type, message)` utility instead of calling `toast()` directly. Type: `'success' | 'error' | 'info' | 'warning' | 'default'`.

### Project-Specific Must-Checks

- **SSR safety**: Guard `window`, `document`, `localStorage`, `sessionStorage` with browser checks. Verify correct layout usage (`SSRLayout` for SSR pages, `Layout` for client pages).
- **React Query SSR hydration**: Verify prefetch query keys and hydration state keys are consistent.
- **Auth/API stability**: Do not break token refresh lock, 401/403/503 handling, or retry flow.
- **Cookie safety**: Must use `COOKIE_KEY` constants and `getCookieDomain()` — never hard-code cookie names or domains. Verify stage/production separation is preserved.
- **iOS bridge stability**: Preserve `window.webkit` optional chaining and native callback contract.
- **Routing consistency**: Prefer `ROUTES` helpers over hard-coded path strings.
- **Next.js performance**: Flag async waterfalls, unnecessary heavy static imports, and missed dynamic imports.

### Validation Policy

- Primary check: `yarn lint`.
- `yarn build` may fail due to environment constraints (missing API access, sandbox limitations); treat as non-blocking unless the changed code directly caused the failure.

### Do Not Review

- Pure formatting/import-order noise already covered by lint.
- Generated artifacts only (`analytics.events.json`, `src/generated/**`) unless generation logic changed.
- `@bcsdlab/koin` and `@bcsdlab/utils` are internal packages — do not suggest external replacements.
