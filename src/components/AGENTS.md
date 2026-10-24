# src/components: UI components

The full design system (tokens, typography, brand, gaps) is in `docs/design-system.md`. This file
covers the rules for writing components.

## Structure

- `ui/`: shadcn/ui primitives (style "new-york", Radix, `components.json`).
  - Add new ones with `pnpm dlx shadcn@latest add <name>`. Restyle them with tokens. Don't fork the
    behaviour.
- `account/`: account-area components.
- The top level holds storefront feature components (header, footer, cart, gallery cards, home
  sections, audio player).

## Rules

1. **Tokens only.**
   - Use `bg-background`, `bg-card`, `bg-muted`, `text-foreground`, `text-muted-foreground`,
     `text-accent`, `border-border`, `ring-ring`.
   - No raw palette classes (`amber-*`, `green-*`, `red-*`) and no hex values. If a semantic color
     is missing (success, warning), add a token in `globals.css` first.
2. **Typography:**
   - Headings use `font-serif` (Playfair Display) and body text uses `font-sans` (Inter).
   - Eyebrow labels use `text-xs uppercase tracking-wider text-accent font-medium`.
   - Check that the fonts actually render; see known-issues K-6.
3. **CTAs:**
   - The primary action is `<Button className="bg-accent hover:bg-accent/90 text-accent-foreground">`.
   - Prefer adding an `accent` variant to `ui/button.tsx` over repeating those classes.
   - The `default` variant is the dark wood brown and is for secondary emphasis.
4. **Server first.** A component gets `'use client'` only if it uses state, effects, browser APIs or
   event handlers. Split static markup into a server parent and a small client child.
5. **i18n:**
   - Use `useTranslations('<namespace>')` in client components and `getTranslations` on the server.
   - Add every key to all 8 files in `/messages`.
6. **Links**: `Link` from `@/i18n/routing`, never from `next/link`.
7. **Accessibility:**
   - Icon-only buttons need an `aria-label`.
   - Interactive elements must be focusable and show `focus-visible:ring-*`.
   - Images need meaningful `alt` text, taken from `media.alt` or composed (`${title} – back view`).
8. **Named exports** in kebab-case files (`instrument-card-with-audio.tsx` exports
   `InstrumentCardWithAudio`).

## Dead components (delete when touching nearby code)

- `stripe-payment-form.tsx`: 611 lines; the export is a stub and Stripe is disabled.
- `instrument-card.tsx`: superseded by `instrument-card-with-audio.tsx`.
- `session-provider.tsx`: `client-providers.tsx` uses `next-auth/react` directly.
- `ui/card.tsx` and `ui/checkbox.tsx`: unused, but harmless as part of the kit.

## Data-fetching components

These call internal APIs on mount. Keep the count low; each is a request per page view:

- `header` → `/api/account/reservation-count`
- `order-notification-dropdown` → `/api/account/active-orders`
- `cart-drawer` → `/api/account/reservation-count`, only when the drawer opens
