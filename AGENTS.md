# Web Agent Context

## Scope
- Project: `web/`
- Stack: React 19 + Vite + Tailwind v4
- Product shape: marketing site + auth modal integrated with cookie-based backend auth

## Entry Points
- App bootstrap: `src/main.tsx`
  - wraps app with `HelmetProvider` for SEO metadata
- Root component: `src/App.tsx`
  - orchestrates layout sections
  - owns menu state + auth modal state
  - wires auth hook and contact actions

## Top-Level UI Flow
1. `SiteHeader` + `MobileMenu` handle navigation and open auth modal.
2. `HeroSection` has primary login CTA.
3. `ServicesSection` exposes service-specific SMS CTA via `ServiceCard`.
4. `AboutSection` shows Instagram carousel and social proof.
5. `ContactSection` drives final conversion (SMS or call).
6. `SiteFooter` repeats contact and navigation.
7. `AuthModal` is mounted once in `App` and toggled by local state.

## Auth Flow (Web Side)

### State Owner
- `useAuthSession` (`src/hooks/useAuthSession.ts`) is the single source for auth state:
  - `session`
  - `isLoading`
  - `isSubmitting`
  - `error`
  - `notice`

### Startup Session Restore
1. On mount, hook calls `fetchCurrentSession()` (`GET /api/auth/me`).
2. `204` means unauthenticated (`session = null`).
3. Any non-auth network failure maps to a generic restore error.

### Login/Register
- Login:
  - calls `POST /api/auth/login`
  - on success stores session object for modal authenticated state
- Register:
  - calls `POST /api/auth/register`
  - does not authenticate user immediately
  - surfaces backend message in `notice`

### Google Login
- `continueWithGoogle()` redirects browser to `/api/auth/google/start`.
- Backend handles full OAuth + callback and redirects back to frontend.

### Logout
- Calls `POST /api/auth/logout`.
- Clears local auth state on success.

## Auth Redirect Query Parameters
`App.tsx` reads `window.location.search` for `auth` and optional `email`, then:
- shows notice in modal for:
  - `verified`
  - `verification-invalid`
  - `google-success`
  - `google-email-unverified`
  - `google-account-inactive`
  - `google-failed`
  - `google-invalid-state`
  - `google-token-exchange-failed`
  - `google-missing-email`
  - `google-unconfigured`
- opens auth modal
- removes consumed params via `history.replaceState`

If backend adds a new auth reason, update this mapping.

## API Client Contract
- `src/lib/auth-client.ts` centralizes all auth HTTP calls.
- Always sends `credentials: "include"` to support cookie auth.
- Supports optional `VITE_API_BASE_URL`; defaults to same-origin.
- In dev, Vite proxy routes `/api` to `VITE_API_PROXY_TARGET` (default `http://localhost:3333`).

## Contact/Conversion Flow
- `onServiceRequest(service)` builds service-specific SMS message:
  - `getSmsMessage` + `createSmsHref` + `navigateToHref`
- `onEstimateClick` uses generic SMS template.
- `onCallClick` uses `tel:` link.
- Constants and templates live in `src/consts/site.ts`.

## Content/SEO Flow
- `AppSeo` injects:
  - title/meta
  - Open Graph + Twitter tags
  - LocalBusiness JSON-LD schema
- Public SEO files:
  - `public/robots.txt`
  - `public/sitemap.xml`
  - Netlify-style SPA fallback in `public/_redirects`

## Component Relationships
- `App.tsx` is the orchestrator; child sections are presentational.
- `AuthModal` receives all auth actions/state via props (no direct API calls inside component).
- `InstagramCarousel` uses `useCarousel` for autoplay/manual slide navigation.
- `useToggle` and `useScrollThreshold` are reusable UI state hooks.

## Shared Contracts With API
- Auth session type (`AuthSession`) must match backend presenter:
  - `expiresAt`
  - `actor: { id, name, email, role }`
- Register response uses `{ message }`.
- `/api/auth/me` and `/api/auth/logout` can return `204` with empty body.

## Change Checklist (for AI agents)
- If auth API changes, update all related files:
  - `src/lib/auth-client.ts`
  - `src/types/auth.ts`
  - `src/hooks/useAuthSession.ts`
  - `src/components/auth/AuthModal.tsx`
  - auth query-param handler in `src/App.tsx`
- Keep modal behavior consistent:
  - local password confirmation check
  - submit/loading/error states
  - body scroll lock while modal is open
- If adding/removing sections:
  - update `NAV_ITEMS`
  - preserve anchor IDs used by header/footer links
- If changing conversion CTA:
  - verify `sms:` and `tel:` generation still works on mobile
- Keep `credentials: include`; removing it breaks session restore.

