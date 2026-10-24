# src/app/(frontend): storefront routes

All public pages live under `[locale]/`.

- `[locale]/layout.tsx` renders `<html lang>` and loads fonts.
- It also mounts `NextIntlClientProvider`, the `ClientProviders` (Auth.js `SessionProvider`, cart,
  cart drawer) and the (inert) Vercel Analytics.
- `globals.css` holds the design tokens; see `docs/design-system.md`.

## Route map

| Path | File | Rendering | Data |
|---|---|---|---|
| `/[locale]` | `page.tsx` | Server shell, client sections | Static content + `public/gallery/*` |
| `/[locale]/gallery` | `gallery/page.tsx` + `gallery-client.tsx` | `force-dynamic` | `instruments` (limit 100, depth 1), filtered client-side (`?type=Violin\|Viola\|Cello\|Contrabass`) |
| `/[locale]/gallery/[id]` | `gallery/[id]/page.tsx` + `product-detail.tsx` | `force-dynamic` | Looks up by slug, then by numeric id. **Queries twice** (`generateMetadata` + page); wrap the lookup in React `cache()` |
| `/[locale]/photos` | `photos/page.tsx` | **Fully client**; no metadata | Static workshop images |
| `/[locale]/faq` | `faq/page.tsx` | Server | `messages.faq.questions.*` |
| `/[locale]/contact` | `contact/page.tsx` | Client | Pre-fill from `?instrument=&inquiry=price`. Google Maps iframe |
| `/[locale]/checkout` | `checkout/page.tsx` | Client; no header or footer | Cart + reservation; see `docs/domain-and-business-logic.md` §4 |
| `/[locale]/checkout/success` | `checkout/success/page.tsx` | Client | `?mode=reservation\|inquiry&number=`. Stripe states are dead |
| `/[locale]/login`, `/register`, `/verify-email` | client pages | Client | Auth.js `signIn`, OTP flow |
| `/[locale]/account/**` | `account/*` | Dashboard + order detail: server, `force-dynamic`. Orders list + profile: client | Session-scoped orders and profile |

## Rules

1. **Server Components by default.** Push `'use client'` down to the smallest interactive island.
   - Today `hero`, `footer`, `instrument-showcase`, `photos/page.tsx` and most account pages are
     client components for no reason. That costs bundle size and SEO.
2. **Navigation:**
   - Use `Link`, `redirect`, `useRouter` and `usePathname` from `@/i18n/routing`.
   - `next/navigation`'s router drops the locale, so the middleware has to add a 307 hop. Five pages
     still use it: `checkout`, `login`, `register`, `verify-email`, `account/orders`.
3. **Metadata:**
   - Every page needs `generateMetadata` with a translated title and description, `alternates`
     (canonical + `languages` for hreflang) and Open Graph.
   - Today only FAQ translates its metadata.
   - Product pages should also emit `Product` JSON-LD.
4. **Data access:**
   - Server pages call `getPayload({ config })` and pass `locale`.
   - Wrap repeated lookups in `cache()`.
   - Prefer tag-based revalidation over `force-dynamic` once K-14 lands.
5. **No hard-coded copy.** Every visible string goes through `useTranslations`/`getTranslations`.
   Remaining offenders: "Click to expand", the construction banner, the audio caption, and the
   contact pre-fill text.
6. **Images:**
   - Use `next/image` with an explicit `sizes`.
   - Products are `aspect-[3/4]` with `object-contain`.
   - Product media URLs come from `getMediaUrl()`/`getMediaSrc()` in `@/lib/media-utils`.
7. **Forms:**
   - Use shadcn `Input`/`Label`/`Select`/`Textarea`.
   - Show errors inline, not with `alert()`. The contact page currently uses `alert`.
8. **Accessibility:** clickable non-buttons (gallery tiles, lightbox backdrops) need a `role`,
   `tabIndex` and keyboard handlers, or should become `<button>`s.

## Known traps

- `gallery-client.tsx` maps capitalised filter params (`Violin`) to stored values (`violin`). The
  home category cards depend on those capitalised params.
- The cart lives in React state. Navigate client-side (`Link`/`router.push`) between product, cart
  and checkout, or the cart is lost.
- Never send identity (`userId`, roles) from the client as a source of truth. The server derives it
  from `auth()`.
- The middleware 301s any non-canonical host to production, so preview deployments can't render
  these pages yet (K-27).
