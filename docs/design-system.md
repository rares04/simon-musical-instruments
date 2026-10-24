# Design system and brand

Sources: `src/app/(frontend)/globals.css`, `src/components/**`, `src/lib/emails/**`, `public/`, and
the live site (reviewed 2026-10-24, desktop and 400px mobile). The UI was scaffolded with v0 and
shadcn/ui ("new-york" style). This document records what exists, then the gaps.

## 1. Brand essence

| Aspect | Today |
|---|---|
| **Promise** | Handmade bowed-string instruments from a family workshop in Reghin, "The City of Violins". Naturally dried tonewood, hand-applied resin varnish |
| **Personality** | Warm, humble, artisanal, personal ("We are Paul and Ecaterina Simon and we are happy to welcome you") |
| **Metaphor** | "Our virtual workshop": the site as a visit to the atelier |
| **Name** | "Simon Musical Instruments" (wordmark in text). Instagram handle `simon_musicalinstruments`. Copy also says "Paul Simon - Musical Instruments" (Google Maps) and "Simon Instruments" (domain) |
| **Logo** | **None.** The header is plain text. The favicon (`public/icon*.svg`) is a generic serif "S" on a parchment square with light/dark variants |
| **Photography** | Two kinds. Strong, warm workshop photography (`public/gallery/*`: hands, varnish, wood stacks, scroll carving). Inconsistent product photos (WhatsApp phone shots, ~1200×1600, against wooden floors or white walls, variable light) |
| **Audio** | 7 of 19 instruments have a short MP3 demo. This is a real differentiator, but it's under-used |

## 2. Design tokens

Defined as CSS custom properties in OKLCH in `src/app/(frontend)/globals.css`, and exposed to
Tailwind v4 through `@theme inline`. Always use the semantic utilities (`bg-background`,
`text-accent`, …), never raw colors.

| Token | OKLCH | ≈ Hex | Role |
|---|---|---|---|
| `--background` | 0.96 0.015 75 | `#f8f1e7` | Page: aged parchment |
| `--foreground` | 0.22 0.03 45 | `#26160f` | Body text: dark walnut |
| `--card` | 0.97 0.012 70 | `#fbf4ed` | Cards, forms |
| `--primary` | 0.32 0.06 40 | `#4c271a` | Default buttons: violin-wood brown |
| `--secondary` | 0.88 0.02 65 | `#e1d5ca` | Secondary surfaces |
| `--muted` / `--muted-foreground` | 0.92 0.015 70 / 0.45 0.02 50 | `#ebe3da` / `#5f524c` | Subtle surfaces / secondary text |
| `--accent` | 0.55 0.14 55 | `#ad5600` | Amber varnish: CTAs, prices, badges, eyebrow labels |
| `--border` / `--input` | 0.85 0.02 68 | `#d7ccc0` | Hairlines |
| `--ring` | = accent | | Focus ring |
| `--destructive` | 0.577 0.245 27 | `#e7000b` | Errors |
| `--radius` | 0.25rem | | Small radii; `rounded-lg` = 4px |

**Contrast (WCAG 2.x)**:

- foreground on background: 15.6:1
- muted-foreground on background: 6.7:1
- **accent on background: 4.56:1**, which only just passes AA for body text. Don't lighten the
  accent, and don't use it for small text on `muted`.

**Dark mode**: a `.dark` block exists, but it's the untouched shadcn neutral palette, and nothing
toggles it. Treat the site as **light-only** until a designed dark theme exists.

**Ad-hoc colors in code**: `amber-50…950` in the construction banner, `green-600` for
"included"/success, `red-600`, `amber-600` for low stock. Replace them with semantic tokens: add
`--success` and `--warning`.

## 3. Typography

| Role | Intended | Actual today |
|---|---|---|
| Display / headings (`font-serif`) | **Playfair Display** | System UI sans-serif |
| Body / UI (`font-sans`) | **Inter** | System UI sans-serif |
| Japanese / Korean | Noto Sans JP / KR | OS fallback (fonts loaded with the `latin` subset only, and never referenced) |

**Bug (`known-issues.md` K-6):**

- `layout.tsx` registers the fonts as `--font-sans` and `--font-serif`.
- `globals.css` maps the Tailwind families to `var(--font-inter)` and `var(--font-playfair)`, which
  are never defined.
- Result: four font files (~140 KB) download on every page and are never used. The elegant
  serif/sans pairing the design depends on never appears.

**Type scale in use**:

- Headings: `font-serif` at `text-4xl → text-7xl` (hero), `text-3xl/5xl` (section),
  `text-2xl` (sub-section).
- Eyebrows: `text-xs/sm uppercase tracking-wider text-accent font-medium`.
- Body: `text-base/lg text-muted-foreground leading-relaxed`.
- `text-balance` / `text-pretty` are used on headings and paragraphs.

## 4. Layout and motion

- **Container**: `container mx-auto px-4 lg:px-8`. Reading width is `max-w-3xl`; grids go up to
  `max-w-7xl`.
- **Header**:
  - Fixed, `h-16 lg:h-20`, `bg-background/95 backdrop-blur-md`.
  - Content offset: `pt-20`/`pt-24` on each page.
  - An optional amber "Work in progress" banner sits above it.
- **Grids**: product grid `1 / 2 / 3 / 4` columns at `sm / lg / xl`. Product detail is two columns
  with a sticky gallery.
- **Image ratios**: products `aspect-[3/4]`, workshop photos `4/3`, hero `3/4 → 4/5`.
- **Motion**: subtle only. Hover scale 1.05 on images, `translate-x-1` arrows, `tw-animate-css`
  fade-ins. No scroll-driven animation, which is the right restraint for this brand.
- **Decoration**:
  - A faint 2% cross-hatch SVG pattern behind "Our Craft".
  - Offset accent frames behind hero and story photos.
  - Category cards use generic `lucide` music-note icons. These are weak; replace them with
    instrument photography or silhouettes.

## 5. Components

`src/components/ui/` holds the shadcn primitives (Radix-based):

- In use: accordion, badge, button, dropdown-menu, input, label, radio-group, select, separator,
  tabs, textarea.
- Custom: otp-input.
- Unused: card, checkbox.

**Button**:

- Variants: `default` (primary brown), `outline`, `secondary`, `ghost`, `link`, `destructive`.
- Sizes: `sm h-8`, `default h-9`, `lg h-10`, plus `icon` sizes.
- Main CTAs override the default with `bg-accent text-accent-foreground`. Add a dedicated
  `variant="accent"` instead of repeating the classes.

Domain components in `src/components/`:

| Component | Purpose |
|---|---|
| `header`, `footer`, `language-switcher` | Chrome. Header holds nav, locale menu, auth menu, order bell, reservation slots, cart |
| `hero`, `instrument-showcase`, `luthier-story`, `testimonials` | Home sections |
| `instrument-card-with-audio`, `instrument-filters`, `audio-player` | Gallery |
| `cart-drawer`, `cart-button`, `checkout-limit-reached`, `reservation-slot(s)-*` | Cart and reservation UX |
| `account/*` | Account area (sidebar, cards, forms, address manager, status badge) |
| `auth-buttons` | Google sign-in |
| `stripe-payment-form`, `instrument-card`, `session-provider` | **Dead code**; delete them |

## 6. Voice and copy

- First person plural ("we", "our workshop"), warm and modest. Talk about wood, varnish and time.
- Paul is named as the human contact ("Paul will contact you within 1–2 business days").
- The English copy reads as translated from Romanian in places ("our business", "ones of the best
  lacquers"). Get a native-level edit before any marketing push.
- Instrument names are generic ("Cello 4/4"). Better: give each instrument an identity, e.g.
  "Cello 4/4 — Stradivari 'Davidoff' model, 2025, flamed Romanian maple".

## 7. Email look

- Emails use inline styles, separate from the web tokens.
- Palette: `#faf9f7` background, `#3d3528` text, `#b87333` copper link, Georgia serif.
  `new-reservation-notification` (internal) uses a generic grey/yellow Bootstrap-like palette.
- There's no shared email layout component. Extract a `<BrandEmailLayout>` and token constants.

## 8. Gaps against a premium luthier brand (prioritised)

1. **Fix the fonts** (one-line fix; the biggest visual win).
2. **Logo and identity**: a proper wordmark/monogram (scroll or f-hole motif) and favicon set, plus
   an OG image.
3. **Product photography standard**:
   - Consistent backdrop and light.
   - Fixed shot list: front, back, side, scroll, label, details.
   - Upload originals at ≥2400px with Payload `imageSizes`, and add zoomable hi-res.
   - Write alt text that describes the instrument, not just "Front".
4. **Lead with sound**: give audio a prominent place on cards and pages. Add short video clips.
5. **Remove v0 leftovers**: the construction banner, "Click to expand" (hard-coded English), unused
   dark theme and placeholder assets (`public/placeholder*`).
6. **Accessibility**: focus-visible states on custom clickable `div`s (gallery tiles, lightbox), a
   keyboard-navigable lightbox, and `aria-label`s on icon buttons.
