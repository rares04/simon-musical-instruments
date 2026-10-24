# SEO milestones and monthly workflow

Status: 2026-10-24. Owner: the seo session. Read by Rares and Paul.

The goal: someone looking for a handmade cello, double bass or a luthier in Romania finds Paul and
Ecaterina first, on Google, on Bing and in AI answers (ChatGPT, Gemini, Google's AI Overview).
Realistically we can win the niche: our name, "luthier Reghin", specific models and prices, and
non-English buyers looking for handmade instruments. Generic words like "violin" belong to big
shops and Wikipedia.

Each milestone has exit criteria you can check yourself in Google Search Console (GSC), Bing
Webmaster Tools or the monthly AI prompt run ([`ai-visibility-prompts.md`](ai-visibility-prompts.md)).
Dates are targets. Search engines take weeks to react to any change.

## The five milestones

| | Milestone | Target | Status |
|---|---|---|---|
| M1 | Foundations live | built by 2026-11-01, checked 2026-12-01 | Built (B1, B3), waiting in the deploy queue |
| M2 | Identity fixed | 2026-12-15 | Waiting on Paul's answers |
| M3 | Core content | 2027-02-28 | First pages built (cellos, double basses) |
| M4 | Authority and citations | 2027-04-30 | Not started |
| M5 | Ads-ready | 2027-01-31 (parallel to M3) | Not started |

### M1. Foundations live

Search engines can read every page correctly, in every language.

**Ships:** B1 (canonical tags, hreflang, sitemap, robots.txt, structured data, share images,
noindex on private pages), B3 (cello and double-bass category pages in 8 languages) and B4
(`llms.txt`, product share images, IndexNow).

**Exit criteria:**

1. GSC → Sitemaps shows "Success". Bing → Sitemaps shows the sitemap as processed.
2. GSC → Pages: at least 90% of sitemap URLs are "Indexed".
3. GSC → Pages: no `/en/…` URL left under "Duplicate without user-selected canonical" (there are
   several today).
4. GSC → Shopping or Product snippets: the count of valid items equals the number of instruments
   with a listed price, with 0 errors.
5. Lighthouse SEO score is 100 on the home, gallery, product and category pages.

**Owner:** seo. **Needs from Paul:** nothing. **Needs from Rares:** the "go" for each merge, through
the master session.

### M2. Identity fixed

Every engine knows who Paul and Ecaterina are and never mixes them up with another maker.

**Ships:**

- an About page;
- Person and Organization structured data;
- one business name everywhere;
- a verified Google Business Profile;
- the same name, address and phone on the directory listings;
- clean instrument URLs (B2), with old URLs redirected.

**Exit criteria:**

1. Our site is #1 on Google and Bing for "Simon Musical Instruments" and for "Paul Simon lutier
   Reghin" (GSC → Performance: average position ≤ 1.5 for brand queries).
2. We appear in the top 3 of the map results for "lutier Reghin".
3. AI prompts Q07 and Q08 (brand questions): ChatGPT, Gemini and Google's AI Overview all describe us
   correctly, 3 out of 3, with no mix-up with another maker. The day-0 Overview gave another
   workshop's founder and address as ours.
4. Name, address and phone match on the Google profile and on every directory listed in
   `README.md` §10 (row 2b).

**Owner:** seo (pages, schema, texts); Paul or Rares (profile and listings, which need the owner's
login).

**Needs from Paul:**

- P-20: the one business name to use everywhere;
- P-11: access to the Google Business Profile;
- P-23: 5–10 workshop photos of instruments being built;
- P-25: the name on the workshop sign;
- P-21: does he number his instruments? This decides the URL format;
- a 10-minute fact check of the About text.

### M3. Core content

Pages that answer what buyers search for, in their language.

**Ships:**

- cello and double-bass pages (built);
- a "How we build" page;
- a price guide ("How much does a handmade cello cost?");
- violin and viola pages, once at least 4 of each are in stock;
- a native-speaker review of the German and French copy.

**Exit criteria:**

1. GSC: at least 1,000 impressions a month on queries without our name.
2. GSC: at least 5 queries without our name rank in the top 10, e.g. "violoncel preț",
   "contrabas 3/4 preț", "goffriller cello".
3. AI prompts, unbranded: ChatGPT ≥ 6/20 (day 0: 4/20), Gemini ≥ 2/9 (day 0: 0/9), and named in at
   least 1 of the 3 double-bass prompts (day 0: 0/3).

**Owner:** seo writes; Paul checks facts.

**Needs from Paul:**

- the build steps and hours for "How we build";
- two sentences on how the Davidov and Goffriller models differ;
- how he sets up a 5-string bass;
- shipping and return facts (P-3, P-5) for the price guide.

### M4. Authority and citations

Other sites mention us, so search engines and AI trust what our pages say.

**Ships:** claimed and updated listings (reghin.ro, allviolinshops, dbstrings, Visit Mureș, AALR), a
press section, a review request after every delivery, a sourced Wikidata entry.

**Exit criteria:**

1. GSC → Links: at least 8 other sites link to us.
2. At least 10 Google reviews.
3. AI prompts: named correctly in at least 25% of unbranded runs across ChatGPT, Gemini and Google
   (day 0: 7 of 38, 18%).
4. Bing → AI Performance shows citations of our pages every month.

**Owner:** seo drafts every text; Paul or Rares submit (most listings need the owner).

**Needs from Paul:**

- one short review request after each delivery (template ready);
- send the AALR update email (drafted);
- the press follow-up (P-24);
- claim the reghin.ro listing (P-31).

### M5. Ads-ready

Everything paid ads need, so the first euro spent is measurable. It runs in parallel with M3.

**Exit criteria:**

1. Return policy, shipping terms and company details are published (the legal session). Google
   Shopping requires them.
2. Reservations and inquiries are counted in analytics and imported into Google Ads as conversions.
3. A Google Merchant Center product feed is approved with 0 rejected items. "Price on request"
   instruments stay out of it.
4. Keyword Planner search volumes are pulled for RO, DE, FR, NL and JA. This needs the free Google
   Ads account (no campaign).
5. A brief with budget, markets and landing pages is handed to the ads session, and Rares agrees the
   budget.

**Owner:** seo and ads. **Needs from Paul:** shipping and return facts. **Needs from Rares:** the
Google Ads account and the budget decision.

## Monthly workflow

First Monday of each month. It takes about 3 hours of seo-session time, 20 minutes from Paul and 5
minutes for Rares to read the report. To start it, open the seo session and say "run the monthly
SEO check".

- [ ] **Google Search Console** (30 min)
  - Performance, last 28 days vs the previous 28: clicks, impressions, top queries by country.
    Split brand and non-brand.
  - Pages: new "not indexed" reasons. Check every instrument added this month is indexed.
  - Shopping / Product snippets: errors and warnings.
  - Links: new referring sites.
- [ ] **Bing Webmaster Tools** (15 min)
  - Search performance, crawl errors, IndexNow submissions.
  - AI Performance: which pages Copilot cited.
- [ ] **AI prompt run** (45 min)
  - The 18 prompts in `ai-visibility-prompts.md` on ChatGPT, Gemini and Google.
  - Log mentions, links and mix-ups, and compare with last month.
  - Fix anything wrong at the source: our page, our listing or our structured data.
- [ ] **Site health** (15 min)
  - Lighthouse on home, gallery, one product and one category page.
  - `bash scripts/seo/check-legacy-redirects.sh`.
  - The sitemap lists every public instrument, and new instruments have their translations.
- [ ] **One content piece** (2 hours, plus a 15-minute fact check by Paul)
  - The next item in `README.md` §8, or the question the AI run showed we can't answer.
- [ ] **Reviews and listings** (Paul, 15 min)
  - Send the review link to everyone who received an instrument this month.
  - Answer new reviews.
  - Update any listing whose details changed.
- [ ] **Report to Rares and Paul** (15 min). Use the template below.

### Report template

```text
SEO report, <month>

Numbers (vs last month)
- Search clicks: <n> (without our name: <n>)
- Search impressions: <n>
- Indexed pages: <n> of <n> in the sitemap
- AI mentions, unbranded: ChatGPT <n>/20, Gemini <n>/9, Google <n>/9
- Google reviews: <n> (average <n>)
- Reservations and inquiries from search or AI: <n>

Wins
- <one to three lines>

Next month
- <the content piece, plus any fix>

For Paul
- <at most two asks>
```

## When Paul adds an instrument

These details decide how well a new instrument page ranks. It takes 2 extra minutes in `/admin`.

1. Fill in **model**, **year** and **back wood** (`bodyWood`). They feed the page title, the
   category page facts and the structured data.
2. Set a **price** if possible. Only priced instruments can appear in Google's product results.
3. Make the **main image** the full front view, in good light. It becomes the share image.
4. Write the notes in English. Translation into the other 7 languages happens automatically.
