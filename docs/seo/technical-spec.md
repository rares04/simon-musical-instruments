# SEO technical spec (Phase B build)

Status: **draft, 2026-10-24**. Builds after the platform upgrade (Payload 3.92 + Next 16) merges.
Owner: the seo session. The research and strategy behind it are in `docs/seo/README.md`.

Plain-language terms used below:

- **Indexed**: Google has stored the page and can show it in results.
- **Canonical**: the one URL we declare as the original when several URLs show the same content.
- **hreflang**: tags that say "this page also exists in Romanian, German, …", so each searcher gets
  their language.
- **x-default**: the hreflang entry for "no language matched".
- **JSON-LD**: a hidden block of structured facts (product, price, maker, address) that search
  engines and AI assistants read.
- **Sitemap**: a file listing every page we want indexed.

## 1. What Search Console shows today (2026-10-24)

Source: Search Console URL Inspection, run right after verification.

| URL | Google's verdict |
|---|---|
| `/` | Indexed. Google uses it for the English home page |
| `/en` | **Not indexed**: "Duplicate without user-selected canonical". Google chose `/` |
| `/ro`, `/de` | Indexed |
| `/en/gallery` | **Not indexed**: duplicate |
| `/en/gallery/Cello-4-4(10)` | **Not indexed**: duplicate. Google chose `/gallery/Cello-4-4(10)` |
| `/gallery/Cello-4-4(10)` (no locale) | Indexed |
| `/ro/gallery/Cello-4-4(10)` | Indexed, though its product text is English |
| `/ja/gallery` | **Not indexed**: "Crawled – currently not indexed" |

**Root causes:**

1. **No canonical tags.**
2. next-intl's automatic hreflang `Link` header sets **x-default to the unprefixed URL**
   (`/gallery/…`). That URL 307-redirects by `Accept-Language`, so Google treats it as the
   original, and the `/en/…` page as its copy.
3. **Seven locales serve English product text inside a translated menu.** Google indexes some of
   them (`/ro/…`) and rejects others (`/ja/gallery`). The cause is K-4: `DEEPL_API_KEY` isn't set
   in production.
4. **Every instrument has two URLs**, one by slug and one by numeric id (`/gallery/21`), and neither
   declares a canonical.

## 2. URL rules

Every rule below is enforced in code, not by hand.

1. **One URL per page per locale**, with the locale prefix always present: `/{locale}/…`.
2. **Self-referencing canonical** on every indexable page, for example
   `https://simoninstruments.com/en/…`. Always absolute, always on the canonical host, never with a
   query string.
3. **hreflang** comes from the Next Metadata API (`alternates.languages`) **and** the sitemap.
   - Turn off the next-intl header: set `alternateLinks: false` in `src/i18n/routing.ts`. One
     source of truth, so the two can't disagree.
4. **x-default**:
   - Home page: x-default is `https://simoninstruments.com/`. That's the language-detecting entry
     point, which is the case Google documents for x-default.
   - Every other page: x-default is the `/en/…` URL. It is never an unprefixed redirecting URL.
5. **Untranslated content isn't advertised.**
   - A product page in locale L counts as *translated* when its `luthierNotes` exist in L without
     fallback. Check with Payload `fallbackLocale: false`. Titles don't count: they come from a
     per-locale template (`README.md` §7), so they're always localized.
   - **Do K-4 before B1.** K-4 sets the DeepL key and backfills all instruments, about 2 h for
     infra-cost. Otherwise this rule canonicalises today's indexed `/ro/…` product pages to `/en`, a
     step backwards in our home market. With K-4 done, the rule only catches brand-new instruments
     during the minutes before DeepL runs.
   - **Untranslated**: canonical points to the `/en/…` URL, L is left out of hreflang, and L is
     left out of the sitemap. The page still renders for visitors.
   - **Translated**: self-canonical, listed in hreflang and the sitemap.
   - Static pages (home, FAQ, contact, photos) count as translated in all 8 locales once their
     titles and descriptions come from `messages/*.json` (§4).
6. **Old URLs return 308** (permanent) to the new URL. This covers numeric ids, hand-typed slugs,
   previous slugs and `?type=` filters. Never use 404 or 307 for them.
   - Ask platform: the middleware's host and trailing-slash 301s send
     `Cache-Control: public, max-age=31536000, immutable`. Browsers then cache a wrong redirect for
     a year. Use a short `max-age` (≤ 1 day) or none.
7. Lowercase, hyphenated, ASCII slugs. No parentheses, no underscores, no ids.

### 2.1 Proposed URL map

Category and section paths are **localized** for the Latin-script locales (ro, de, fr, nl), via
next-intl `pathnames`. ja, ko and el keep English segments. The per-language table is in
`README.md` §6. The keyword research showed each language searches with its own word ("violoncel",
"Kontrabass", "contrebasse"). Below, `en` paths stand for all locales.

| Page | URL | Replaces |
|---|---|---|
| Home | `/{l}` | same |
| All instruments | `/{l}/instruments` | `/{l}/gallery` (308) |
| Category | `/{l}/cellos`, `/{l}/double-basses`, `/{l}/violins`, `/{l}/violas` | `/{l}/gallery?type=Cello` … (308) |
| Instrument | `/{l}/instruments/{slug}` | `/{l}/gallery/{old-slug or id}` (308) |
| Model (later) | `/{l}/models/{model}`, e.g. `stradivari-davidov-cello` | new |
| About the makers | `/{l}/about` | new (today home sections only) |
| Workshop photos | `/{l}/workshop` | `/{l}/photos` (308) |
| FAQ, Contact | `/{l}/faq`, `/{l}/contact` | same |
| Guides / journal (later) | `/{l}/guides/{slug}` | new |

**Instrument slug convention**: `{type}-{model}-{year}-{distinguisher}`, for example
`cello-stradivari-davidov-2025-flamed-alder`.

- The distinguisher is Paul's instrument number if he uses one (P-14 follow-up: "do instruments
  carry an opus/label number?"). Otherwise it's the back wood.
- If the slug still collides, append `-2`, `-3`.
- The slug is generated once on create. It isn't regenerated when the title changes.

## 3. Crawl control

### `app/robots.ts`

```
User-agent: *
Allow: /
Allow: /api/media/file/
Disallow: /admin
Disallow: /api/
Sitemap: https://simoninstruments.com/sitemap.xml
```

- `/api/media/file/` must stay allowed, because product images are served from there (Google
  Images, OG previews).
- Auth, account and checkout pages are **not** disallowed. They get `robots: { index: false }`
  metadata instead. A disallowed page can't show Google its `noindex`, so its URL can still be
  indexed.
- **AI crawlers are allowed** (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot,
  Google-Extended, Applebot-Extended, …).
  - The goal is to be known and cited by AI assistants. The content isn't secret.
  - `User-agent: *` already allows them. Don't add per-bot blocks.
  - **Ask infra-cost**: if DNS/CDN moves to Cloudflare, turn **off** its "Block AI bots" /
    AI Crawl Control default.

### `app/sitemap.ts`

- **Entries**:
  - Static pages × the locales where they're translated.
  - Category pages.
  - Every instrument whose status isn't excluded.
  - Sold instruments stay listed. They're proof of work and earn links. Mark them `SoldOut`.
- Each entry has:
  - `url`: the canonical URL.
  - `lastModified`: the document's `updatedAt`.
  - `alternates.languages`: only translated locales, plus `x-default`.
  - `images`: the product's main image URL.
- Revalidate the sitemap with a cache tag invalidated by the instruments `afterChange` hook (K-14).
  Until K-14 lands it can be dynamic.
- Submit it in Search Console and Bing Webmaster Tools.

### IndexNow (Bing, Yandex; feeds ChatGPT search via Bing)

- A key file at `/{key}.txt`.
- An instruments `afterChange` hook (also on delete or status change) POSTs the changed URLs to
  `https://api.indexnow.org/indexnow`.
- Fire-and-forget, never blocks the save. Skip it when `context.skipAutoTranslate` marks a bulk
  backfill.
- Google doesn't support IndexNow. It relies on the sitemap.

## 4. Metadata (every page)

A shared helper, `src/lib/seo/metadata.ts`:

```ts
buildMetadata({
  locale, path,          // path without locale, e.g. '/instruments/cello-…'
  title, description,    // already translated
  image?,                // absolute URL, 1200×630 preferred
  translatedLocales?,    // default: all 8
  noindex?,
}): Metadata
// → title, description, alternates.canonical, alternates.languages (+x-default),
//   openGraph (type, locale, alternateLocale, siteName, images), twitter (summary_large_image),
//   robots
```

- `layout.tsx` sets only `metadataBase: new URL('https://simoninstruments.com')`, the title
  template `'%s | Simon Musical Instruments'` and the icons.
  - Keep layout edits minimal; it's a hot file. The order is bugs → observability → seo.
- Every `page.tsx` exports `generateMetadata` using `getTranslations`.
  - New keys go under `messages/*.json` → `seo.*`, add-only, in all 8 files.
- **Title length**: about 50–60 characters. **Description**: about 140–160 characters. Product
  descriptions are generated from fields when Paul leaves them empty (§6).
- `noindex` on: `login`, `register`, `verify-email`, `account/**`, `checkout/**`.
- Add a `/favicon.ico` (it currently returns 404) and a default branded OG image,
  `public/og-default.jpg`, 1200×630.

## 5. Structured data (JSON-LD)

A server component, `<JsonLd data={…} />`, renders
`<script type="application/ld+json">`. Every page gets **one `@graph`**, with entities linked by
`@id`.

| Entity | `@id` | Where | Key properties |
|---|---|---|---|
| `Organization` + `MusicStore` (a `LocalBusiness` subtype) | `https://simoninstruments.com/#business` | every page | `name` (the canonical brand, P-20), `legalName` + `vatID` (the registered sole-trader entity, read from the shared business config K-28, the same values the legal pages must display), `alternateName` ("Paul Simon - Musical Instruments", "Simon Instruments"), `url`, `logo`, `image`, `foundingDate: 2014-02`, `founder` → Persons, `address` (PostalAddress: Strada 1 Decembrie 1918 nr. 8, 545300 Reghin, Mureș, RO), `geo`, `telephone`, `email`, `openingHoursSpecification` (once P-4 is answered), `areaServed`, `knowsAbout` (violin making, cello, double bass, tonewood), `sameAs` (Instagram, Google Business Profile / Maps URL, Wikidata once created, other socials, P-18) |
| `Person` ×2 | `…/#paul-simon`, `…/#ecaterina-simon` | about page, plus a reference from the business | `name`, `jobTitle: "Luthier"`, `worksFor` → business, `knowsAbout`, `image`. Disambiguates from Paul Simon the singer |
| `WebSite` | `…/#website` | every page | `name`, `url`, `inLanguage` (the page locale), `publisher` → business |
| `Product` | `{canonical}#product` | instrument page | `name` (descriptive title), `description`, `image[]`, `sku` (id), `brand` → business, `manufacturer` → business, `category`, `model`, `material` (top/back woods), `productionDate` (year), `itemCondition: NewCondition`, `offers`, and `subjectOf` → `AudioObject` when an audio sample exists |
| `Offer` | (inside Product) | instrument with a price | `price`, `priceCurrency: EUR`, `availability` (map below), `url`, `seller` → business, `shippingDetails` + `hasMerchantReturnPolicy` once legal confirms (P-3, P-5) |
| `BreadcrumbList` | | every page except home | Home › Category › Instrument |
| `FAQPage` | | FAQ page | Google stopped showing FAQ rich results on 2026-05-07. Keep it anyway: it's cheap, and Bing and AI parsers can use it |
| `AudioObject` | | instrument with audio | `contentUrl`, `encodingFormat: audio/mpeg`, `name`. A real differentiator |

**Availability map.** Google accepts only 10 values, and `Reserved` / `MadeToOrder` aren't among
them.

| Our status | `availability` |
|---|---|
| `available` | `InStock` |
| `reserved` | `OutOfStock` |
| `in-build` | `PreOrder` |
| `sold` | `SoldOut` |

**"Price on request" instruments** (7 of 19):

- Omit `offers`. The Product is still valid structured data for entity and AI parsing.
- Google's product snippet needs `offers`, `review` or `aggregateRating`, so these get **no** rich
  result.
- That's a business argument for showing prices; raise it with Paul.

**Validation**:

- Rich Results Test and the Schema.org validator for every template.
- Search Console's "Merchant listings" / "Product snippets" reports after deploy.

## 6. CMS fields (needs the migration lock)

**`@payloadcms/plugin-seo`**, evaluated 2026-10-24. **Recommended**:

- What it adds: a `meta` group (`title`, `description`, `image`) per collection, an "auto-generate"
  button driven by our `generateTitle` / `generateDescription` / `generateImage` functions, a live
  Google-snippet preview, and character counters.
- That's good guard-rails for Paul, at near-zero code cost.
- **Configuration**:
  - `collections: ['instruments']`, later `pages` / `posts`.
  - `uploadsCollection: 'media'`.
  - `tabbedUI: true`.
  - A `fields` override that sets `localized: true` on title and description.
  - `generateURL` returns the canonical URL.
- The plugin version must match Payload exactly (3.92.x after the upgrade). That's a
  `package.json` change: claim it.
- Rendering rule: use `meta.title` / `meta.description` when set, otherwise the generated pattern.
  Paul never *has* to fill them in.

**Instrument fields to add or change:**

| Field | Why |
|---|---|
| `previousSlugs` (array of text, hidden, auto-filled in `beforeChange` when the slug changes) | Self-maintaining 308 redirects with no manual redirect table. Chosen over `@payloadcms/plugin-redirects`, which only stores redirects and still needs our code, plus Paul's upkeep |
| Slug generator: `beforeValidate` builds the §2.1 convention on create only, then makes it unique | Replaces hand-typed `Cello-4-4(10)` |
| `title`, descriptive (P-14) | Generated per locale from a template in `messages/*.json` (see `README.md` §7), e.g. "Handmade cello, Stradivari Davidov model, 2025". Paul can override it via plugin-seo |
| Required `alt` on `media`, localized | Image search and accessibility. Today it's "Front" |
| (Optional) `translationReviewed` per locale | Lets RO/DE get a human pass. Ties into K-4 |

**Migration**:

- Generate new slugs for all 19 instruments.
- Store the old slug in `previousSlugs`.
- Pass `context: { skipAutoTranslate: true }`.
- Run it as a one-off script, with a dry-run output first.

## 7. Pages to build (templates)

The content plan is in `README.md`. Technical needs:

- **Category pages** (`/{l}/cellos`, …): server-rendered.
  - An H1 and 150–300 words of localized intro (what we build, models, woods, price range, how
    buying works).
  - The instrument grid, a short FAQ block and an `ItemList` of products.
  - The gallery's client filters remain as an enhancement.
- **Instrument page**:
  - H1 = descriptive title.
  - The visible facts AI assistants quote: maker, place, year, model, woods, varnish, strings,
    dimensions, price/availability, and how reservation works.
  - Put them in a plain `<dl>` spec list, server-rendered, not behind tabs that need JS.
- **About page**: Paul and Ecaterina, workshop history since 2014, Reghin's violin-making
  heritage, process photos and Person JSON-LD. This is the E-E-A-T page.
- **Content collection** for guides and model pages:
  - A Payload `pages` (or `posts`) collection with localized Lexical rich text, plugin-seo and
    DeepL.
  - Separate PR, separate migration.

## 8. Performance requirements (owned by improvements / infra-cost)

| Metric | Today | Target |
|---|---|---|
| HTML TTFB, instrument / gallery | 1.3–1.5 s before the move to europe-west4; **0.18–0.23 s** after (curl from Romania, median of 3, 2026-10-24) | < 0.6 s from EU and US (cached/ISR keeps it there under load and for distant visitors) |
| LCP p75 mobile | not measured (no CrUX data at this traffic) | < 2.5 s; roadmap target < 2.0 s |
| Image delivery | proxied through the app, ~2 s | public bucket / CDN, responsive sizes (K-15) |

The seo session measures with Lighthouse locally and Search Console's Core Web Vitals report once
traffic exists.

## 9. Cross-session requests

| To | Request | Why |
|---|---|---|
| platform | Short `Cache-Control` on middleware 301s (not 1-year immutable). Keep `/` locale detection as a 307 | Wrong cached redirects; x-default handling |
| infra-cost | K-4 translations. Never block AI crawlers if Cloudflare is adopted. K-13 `www` CNAME | Duplicate locales; GEO; canonical host |
| improvements | K-14 caching + tag revalidation; K-15 images; K-19 server components | Speed is a ranking and crawl-budget factor |
| observability | Link GA4/Plausible with Search Console if possible; segment AI referrals (`chatgpt.com`, `perplexity.ai`, `gemini.google.com`, `utm_source=chatgpt.com`) | Measure GEO |
| legal | Return policy + shipping terms (feeds `MerchantReturnPolicy`, `OfferShippingDetails`); company identification for the Organization schema | Merchant listing eligibility |

## 10. PR plan (Phase B)

| PR | Contents | Schema change | Est. |
|---|---|---|---|
| B1 foundations | `metadata.ts` helper, translated `generateMetadata` on all pages, `robots.ts`, `sitemap.ts`, `alternateLinks: false`, noindex on private pages, favicon, default OG image, business/website/breadcrumb JSON-LD, Product JSON-LD from existing fields, the untranslated-locale canonical rule | no | 1.5 d |
| B2 instrument identity | plugin-seo, slug generator, `previousSlugs`, new URL map + 308s, alt-text requirement, slug backfill script | **yes** (migration lock) | 1.5 d |
| B3 category + about pages | `/cellos`, `/double-basses`, `/violins`, `/violas`, `/about`, with ItemList and Person JSON-LD | no (messages) | 1 d + content |
| B4 extras | `llms.txt` (generated from live data), product OG images (`opengraph-image.tsx`), AudioObject, IndexNow | no | 0.5 d |
| B5 content collection | `pages`/`posts` collection for guides and model pages | **yes** | 1 d + content |

**Validation for every PR**:

- `tsc`, lint and build pass.
- Rich Results Test on preview URLs.
- `curl` checks for canonical, hreflang and robots.
- After deploy: Search Console URL Inspection → "Test live URL".
