# Search strategy: SEO, AEO, GEO

Status: **Phase A strategy, 2026-10-24**. Owner: the seo session.

## Contents

| Doc | What's in it |
|---|---|
| This file | The strategy and the plan |
| [`technical-spec.md`](technical-spec.md) | The Phase B build: URLs, canonicals, sitemap, robots, JSON-LD, CMS fields, PRs |
| [`ai-visibility-prompts.md`](ai-visibility-prompts.md) | The fixed questions we ask AI assistants every month |
| [`translation-glossary.md`](translation-glossary.md) | Luthier terms in RO/DE/FR/NL for DeepL and translation review |
| [`research/keywords-en-ro.md`](research/keywords-en-ro.md) | English and Romanian search behaviour |
| [`research/keywords-de-fr-nl.md`](research/keywords-de-fr-nl.md) | German, French and Dutch |
| [`research/keywords-ja-ko-el.md`](research/keywords-ja-ko-el.md) | Japanese, Korean and Greek |
| [`research/competitors-summary.md`](research/competitors-summary.md) | Competitors worth learning from and directories that list Reghin makers. The full teardown and outreach plan are private (`.private/seo/`) |
| [`research/ai-baseline-2026-10-24.md`](research/ai-baseline-2026-10-24.md) | What ChatGPT, Perplexity, Gemini and Google said on day 0 |

None of the research uses paid tools. Search volumes are unknown: evidence comes from Google
autocomplete, Wikipedia pageviews, Search Console and reading competitor pages. Search Console's
query data will replace guesses from about November 2026.

## 1. The short version

1. **Google already knows the site, but files it badly.** It drops every `/en/…` page as a duplicate
   and keeps redirecting, language-less URLs instead. Canonical tags fix this. They are build
   item B1.
2. **Google's AI confuses who we are, and few other sites talk about us.** Asked about "Simon
   Musical Instruments", Google's AI Overview describes a different Reghin workshop whose owner is
   also named Simon. Beyond that, we found few third-party mentions: a press piece, a forum thread
   and directory listings under mixed names. The AALR luthiers' association links to
   `www.simoninstruments.com`, which doesn't resolve. For AI answers, fixing who we are matters
   more than any tag on our own pages.
3. **Each language needs its own words, not translations.** Romanians search "maestru", "Reghin"
   and "preț", never "lucrat manual". Germans search "Meistercello" and "vom Geigenbauer". The French
   say "de luthier". Only the Dutch say "handgemaakt".
4. **Price is the question everyone asks**, in all eight languages ("cât costă un violoncel bun",
   "was kostet ein Cello vom Geigenbauer"). We publish real prices; independent makers almost never
   do. That is our best chance to become the quoted answer.
5. **We can win a niche, not "violin".** The winnable searches are the workshop's name, "lutier
   Reghin", handmade cellos and double basses with prices, and named models (Davidov, Goffriller,
   gamba-shape bass, 5-string bass). Everything below is aimed at those.

## 2. How search works for this site

These are four names for overlapping work. About 80% of it is shared.

| Term | What it means here | What moves it |
|---|---|---|
| **SEO** (search engine optimisation) | Google and Bing crawl, index and rank our pages | Clean URLs, canonicals, hreflang, sitemap, speed, useful pages, links from other sites |
| **AEO** (answer engine optimisation) | Our sentence becomes the answer: a featured snippet, "People also ask", a voice answer | Pages built around one question each, with a direct 40–60 word answer at the top, real numbers, and a table where it helps |
| **GEO / LLMO / AIO** (generative engine optimisation) | ChatGPT, Perplexity, Gemini and Google AI Overviews name us and link to us | Being indexed (ChatGPT search leans on Bing, Gemini and AI Overviews on Google), being an unambiguous entity, being mentioned on sites those engines trust, and having quotable facts on our pages |
| **Local SEO** | We show on Google Maps and in the "map pack" for "lutier Reghin" | Google Business Profile, matching name/address/phone everywhere, reviews |

An **entity** is a thing search engines and AI models recognise as one real-world object: "Simon
Musical Instruments, a luthier workshop at Strada 1 Decembrie 1918 nr. 8, Reghin, run by Paul-Răzvan
and Ecaterina Simon". Today that entity is blurry. It goes by at least five names ("Simon Musical
Instruments" on the site, "Paul Simon - Musical Instruments" on Google and Bing Maps and in Romanian
directories, "Simon Paul Razvan I.I." in the legal and luthier directories, "Simon Violins" on
Facebook, and "Simon Instruments" in the domain). It also competes with
Simon József (Jonaco Violins, another Reghin maker), Paul Simon the singer, and a 19th-century
Paris bow maker called Simon.

## 3. Where we stand (day 0, 2026-10-24)

**Indexing** (Search Console URL Inspection):

- Indexed: `/`, `/ro`, `/de`, `/gallery/<slug>` (the language-less URL) and `/ro/gallery/<slug>`
  (English text in a Romanian page).
- Dropped as duplicates: `/en`, `/en/gallery`, `/en/gallery/<slug>`.
- Read and rejected: `/ja/gallery`.
- Causes are in `technical-spec.md` §1.

**Technical**:

- No sitemap, robots.txt, canonical tags, Open Graph or structured data.
- hreflang exists only as an HTTP header from next-intl, and its x-default points at a redirecting
  URL.
- Every instrument is reachable at two URLs (slug and numeric id).
- Product pages took 1.3–1.5 s before the first byte. After the app moved to an EU region the same
  day, they take about 0.2 s from Romania.

**Content**:

- Product titles are generic: 10 cellos are all "Cello 4/4".
- 7 of 8 languages show English product text (K-4).
- No about page, no guides, no category pages, no "how we build" page.

**Off-site**:

- Two mentions: the AALR member list (dead link) and a 2023 ProTV news piece quoting Paul (no link).
- One 2021 forum thread links our old site.
- The old site's URLs (`/en/home.html` …) 404 today, so whatever links they earned are lost.
- Not listed on: allviolinshops, dbstrings, Homo Faber, Visit Mureș, Wikidata, Wikipedia.
- **Bing's view** (brand search, 2026-10-24) is richer:
  - Bing has the site indexed (`/en`, `/en/photos`), though its `site:` operator returned nothing.
  - Its AI summary describes the workshop correctly from our own home page text.
  - It shows a Bing Places listing ("Paul Simon - Musical Instruments", with hours).
  - It shows directory listings: Cylex, CityMaps.ro (13–16 reviews, 5/5, likely copied from Google),
    Violin Network, Top 100 of Romania, Deschis.ro.
  - It shows the Facebook page "Simon Violins" and the Instagram account.
  - These directories are "citations" (name, address and phone on other sites). They help local
    rankings only if the name and details match, which they currently don't.

**AI answers** (`research/ai-baseline-2026-10-24.md`):

- ChatGPT names us in 4 of 20 unbranded answers, Gemini in 0 of 9, and Google's AI Overview in 5 of
  9. But **Google's Overview merges us with another Reghin workshop whose owner is also named Simon**,
  and gives that workshop's founder and address as ours.
- Specific pages work: both ChatGPT and Google put us first for the Davidov-model cello question.
- No engine names us for double basses, or in German, French, Dutch, Korean or Greek.

**Competitors worth copying**:

- **Mare Vasile**, a Reghin family workshop: numbered, model-named instrument pages, "lutier Reghin"
  titles, LocalBusiness markup, a press page.
- **Gliga**: answer-shaped product pages with FAQ, price and shipping markup in 15 languages.
- **Corilon** (Munich dealer): multilingual product pages with sound clips.

## 4. Markets and languages

Paul decides which languages to keep (P-9). This is what the search evidence says.

| Tier | Languages | Evidence | Investment |
|---|---|---|---|
| 1 | **ro, en, de, fr** | RO is home: "lutier reghin" is Google's first "lutier" suggestion, and RO Wikipedia reads "Reghin" more than any other language. EN has explicit UK/Ireland buying queries plus "upright bass" in North America. DE has the richest maker vocabulary and the largest Wikipedia audience. FR is the second-largest audience, and France and Belgium are named buyer countries | Full: translated product text, category pages, guides, model pages |
| 2 | **ja, nl** | JA is the only Asian market searching "Romanian violin reputation / workshop", "Goffriller cello price" and "personal import". NL has the plainest handmade-double-bass demand, but some Dutch searchers use English | Category pages + one guide each. Product text via DeepL with a native check on titles |
| 3 | **ko, el** | KO: almost no Romania signal. EL: no Romania queries at all, and buyers compare on Skroutz | Keep the translated UI. Product pages canonicalise to English until translated. No dedicated content |

## 5. Brand and entity plan

1. **Pick one public name (P-20).**
   - Recommendation: **Simon Musical Instruments**. It's the name on the site, and Google already
     suggests it for "simon instruments".
   - Use the people's names next to it, every time: "Paul-Răzvan and Ecaterina Simon, luthiers in
     Reghin".
   - The Google Business Profile name must match the real-world name on the workshop sign. Google's
     rules forbid adding keywords. So the sign decides: ask Paul what it says.
2. **Write one standard bio** (about 80 words, EN and RO) and use it word for word on the site, Google
   Business Profile, AALR, directories, dealer pages and press kits.
   - Include: founded February 2014, Paul preparing tonewood since 2001, Reghin, what they build,
     exports to Japan and Taiwan, Cremona Musica 2023.
   - Consistency is how engines merge three names into one entity.
3. **Name, address, phone identical everywhere**: Strada 1 Decembrie 1918 nr. 8, 545300 Reghin,
   Mureș; +40 744 960 722. Fix the Google and Bing Maps names, the directories (§10 #2b) and the
   Facebook page name to match.
4. **Disambiguate in plain text**:
   - The about page says the full name "Paul-Răzvan Simon".
   - Person markup links Paul to the workshop, which separates him from the singer.
   - Confirm with Paul before writing any copy that mentions other makers named Simon.
5. **Structured data** ties it together: `Organization` + `MusicStore` with `legalName`, `founder`,
   `sameAs` (Instagram, Maps, other socials), and `Person` for both makers. See
   `technical-spec.md` §5.
6. **Wikidata**:
   - Now: add the neutral "City of Violins / Orașul Viorilor" nickname to Reghin (Q572478), with a
     source.
   - Later, once two or three independent articles exist: a minimal, sourced item for the workshop.
   - Never edit Wikipedia about ourselves. It's a conflict of interest and gets reverted.

## 6. Site structure

Category and section paths use each language's own word. Instrument slugs stay language-neutral.
Full rules are in `technical-spec.md` §2.

| Page | en | ro | de | fr | nl | ja, ko, el |
|---|---|---|---|---|---|---|
| All instruments | `/instruments` | `/instrumente` | `/instrumente` | `/instruments` | `/instrumenten` | `/instruments` |
| Cellos | `/cellos` | `/violoncele` | `/celli` | `/violoncelles` | `/cellos` | `/cellos` |
| Double basses | `/double-basses` | `/contrabasi` | `/kontrabaesse` | `/contrebasses` | `/contrabassen` | `/double-basses` |
| Violins | `/violins` | `/viori` | `/geigen` | `/violons` | `/violen` | `/violins` |
| Violas | `/violas` | `/viole` | `/bratschen` | `/altos` | `/altviolen` | `/violas` |
| About the makers | `/about` | `/despre-noi` | `/ueber-uns` | `/a-propos` | `/over-ons` | `/about` |
| How we build | `/how-we-build` | `/cum-construim` | `/wie-wir-bauen` | `/notre-methode` | `/hoe-wij-bouwen` | `/how-we-build` |
| Guides | `/guides/{slug}` | `/ghiduri/{slug}` | `/ratgeber/{slug}` | `/guides/{slug}` | `/gidsen/{slug}` | `/guides/{slug}` |

- Non-Latin locales keep English slugs, because encoded Japanese, Korean or Greek in a URL is
  unreadable when shared.
- A native speaker checks the de/fr/nl slugs before launch.
- **Instrument slugs**: `{type}-{model}-{year}-{distinguisher}`, for example
  `cello-stradivari-davidov-2025-flamed-alder`. If Paul numbers his instruments, the number becomes
  the distinguisher (P-21).
- **Spelling**: write "Davidov" (with "Davidoff" in the text). That's the Wikipedia title and what
  people search. "Davidoff" alone pulls in the cello concertos and the cigarette brand.

## 7. Titles, headings, descriptions

Titles and H1s are **generated from fields with a per-language template**, so they're localized on
day one, before DeepL translates the notes. Paul can override them through the SEO plugin.

| Lang | Instrument title pattern (example: cello id 21) |
|---|---|
| en | `Handmade cello, Stradivari Davidov model, 2025 · €6,500` |
| ro | `Violoncel de maestru 4/4, model Stradivari Davidov, 2025 · Reghin` (pending check, see below) |
| de | `Cello 4/4 vom Geigenbauer, nach Stradivari „Davidov“, 2025` (or `Meistercello …`, pending check) |
| fr | `Violoncelle de luthier 4/4, modèle Stradivari Davidov, 2025` |
| nl | `Handgemaakte cello 4/4, Stradivari Davidov-model, 2025` |
| ja | `ストラディバリ「ダヴィドフ」モデル チェロ 4/4 手工品・ルーマニア製 2025` (native check) |
| ko | `수제 첼로 4/4 스트라디바리 다비도프 모델 2025` (native check) |
| el | `Χειροποίητο βιολοντσέλο 4/4, μοντέλο Stradivari Davidov, 2025` (native check) |

- **"Meister" and "de maestru" are pending a check with Paul and the legal session.** Buyers type
  them, but in Germany "Meister" can imply a formal craft qualification (Geigenbauermeister). Use
  them only if that's accurate. Until then, German titles use "vom Geigenbauer" and Romanian titles
  use "lucrat în atelier, Reghin" or "de lutier".
- The site name is appended by the layout template (` | Simon Musical Instruments`). Drop it on
  titles longer than about 60 characters; Google truncates there.
- **Double basses** name both terms in English ("double bass / upright bass"). In German, add the
  shape: "Kontrabass 3/4 in Gambenform".
- **Meta descriptions** (about 150 characters) carry the three facts buyers want: price or "price on
  request", maker + Reghin, and how to reserve or visit.
- **Image alt text** describes the instrument: "Back of a 2025 Davidov-model cello, one-piece flamed
  alder". Not "Front".

## 8. Content plan

Every page leads with a direct answer (40–60 words) that an engine can lift whole. Then come
details, a facts table, photos, and a short FAQ. Languages follow the tiers in §4.

| # | Page | Answers | Langs | Needs from Paul |
|---|---|---|---|---|
| 1 | **How we build an instrument** | "Who makes these instruments, and how?", "how is a cello made", "tonewood", "spirit varnish". Shows every stage from raw wood | ro, en, de, fr | Photos or short clips of each stage: tonewood stock, carving, plates, the instrument "in the white", varnishing, set-up. Dates and who does what |
| 2 | **About Paul and Ecaterina** | Who they are, since when, Reghin, Cremona, exports | all 8 | The standard bio, portraits, the Cremona story |
| 3 | **Category pages** ×4 | "violoncel de vânzare / preț", "meistercello kaufen", "3/4 double bass for sale", "upright bass" | tiers 1–2 | Nothing new |
| 4 | **Price guide**: "How much does a handmade cello or double bass cost, and why?" | The #1 question in every language. Factory vs workshop vs master, what drives price, our real range | ro, en, de, fr, nl, ja | A sentence on how he prices |
| 5 | **Double bass buying guide**: 3/4 vs 4/4, gamba vs violin shape, 5-string, transport | Asked in de/fr/nl/en | en, de, fr, nl, ro | His view on shapes and sizes |
| 6 | **Model pages**: Stradivari Davidov cello, Goffriller cello, gamba bass, Panormo bass, Stradivari Messiah violin, Amati violin | "goffriller cello price", "davidov stradivarius", "ゴフリラー チェロ 価格" | en, de, fr, ja, ro | What he keeps from each original |
| 7 | **Reghin, city of violins** | "reghin orașul viorilor", "Stadt der Geigen", "ルーマニア バイオリン 評判" | ro, en, de, ja | Nothing (desk research + his photos) |
| 8 | **Buying from abroad**: reservation, payment, insured shipping, trial, returns, customs (Japan) | The remote buyer's worries | all | Shipping and returns policy (P-3, P-5) |
| 9 | **Visit the workshop** | "atelier lutier Reghin", "can I visit a luthier in Reghin" | ro, en, de | Visiting hours or "by appointment" (P-4) |
| 10 | **Care guide**: humidity, strings, seasonal checks | Evergreen questions, a reason to link | en, ro, de, fr | His routine advice |

Pages 1–3 come first. They build trust (1, 2) and give Google something to rank (3). Page 4 is the
biggest answer-engine opportunity.

**How the writing works**:

- I draft from Paul's facts.
- A human checks RO and the EN tone.
- DeepL translates to the other locales.
- A native check covers titles in de/fr/ja.

No AI-generated filler: every page needs at least one fact only this workshop can give (a photo, a
measurement, a price, a date).

## 9. AEO and GEO specifics

1. **Answer first.** The first paragraph under each H2 answers the heading's question in one or two
   sentences with a number.
2. **Facts in tables.** Price range, sizes, woods, build time (3–6 months for commissions), shipping
   countries. Engines lift tables and lists more easily than prose.
3. **Sound.** Every instrument with audio gets `AudioObject` markup and a visible player. Later, a
   short YouTube clip titled like the product page.
4. **Let the AI crawlers in.** `robots.txt` allows GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot,
   Google-Extended. If DNS moves to Cloudflare, its "block AI bots" default must stay off.
5. **Bing matters for ChatGPT.** Verify Bing Webmaster Tools, submit the sitemap, and ping IndexNow
   on every instrument change, so new instruments reach Bing (and ChatGPT search) within hours.
6. **`llms.txt`**:
   - A short Markdown file at `/llms.txt`: who we are, what we build, price range, how to buy, and
     links to key pages. Generated from live data.
   - Evidence that engines use it is weak (Google says it doesn't). It costs an hour, so we do it,
     but don't count on it.
7. **Being cited needs other sites.** On-page work makes us quotable. Mentions (§10) make engines
   trust the quote.

What we won't do: keyword stuffing, mass AI-written pages, fake or incentivised reviews, posting
promotional copy in forums, or editing Wikipedia about ourselves.

## 10. Off-site plan (ranked)

| # | Action | Who | Effort |
|---|---|---|---|
| 1 | Revive the dead links: make `www.simoninstruments.com` resolve (Railway domain + DNS) and 301 the old `/{en,ro,de,fr,nl}/{home,about-us,galery,contact}.html` URLs to the new pages. Then ask AALR to update their link to `https://simoninstruments.com/ro` and add Ecaterina | infra-cost (www), seo (redirect map), Paul or Rares (AALR email) | Low |
| 2 | Google Business Profile: same name as the sign, website URL, categories, hours / "by appointment", work-in-progress photos | Paul (owner access), seo writes the texts | Low |
| 2a | Claim the free listings that AI engines cite: reghin.ro's workshop directory (we're listed as "Paul Simon - Musical Instruments", with no website or description), turismreghin.ro, firmadeaur.ro. Add the website, description and photos | seo drafts, Paul or Rares submits | Low |
| 2b | Citation clean-up: once the name is chosen (P-20), make name, address, phone, website and hours identical on Bing Places, Cylex, CityMaps.ro, Violin Network, Top 100 of Romania, Deschis.ro and the Facebook page | seo drafts the list, Paul or Rares edits (most need the owner's login or a claim) | Low |
| 3 | Reviews: after each delivery, Paul sends one short message with the review link. No incentives | Paul | Ongoing |
| 4 | Directory listings: allviolinshops (Romania), dbstrings, Homo Faber (apply), Visit Mureș (visitable workshop) | seo drafts, Paul or Rares submits | Low–Med |
| 5 | Press: link the 2023 ProTV piece from a Press section; suggest follow-up stories to Romanian media | Paul / Rares | Med |
| 6 | Luthier forums: once page 1 ("How we build") is live, Paul may answer questions about the workshop, signed and factual, linking that page where it helps | Paul | Low |
| 7 | Double-bass community: check the ISB luthier directory; answer TalkBass / r/doublebass questions as the maker, disclosed, only where helpful | Paul | Ongoing |
| 8 | Wikidata nickname edit for Reghin | seo | Low |
| 9 | Selling through dealers abroad: a business decision for Paul (details in the private plan) | Paul | High |

## 11. Measurement

| Source | What | When |
|---|---|---|
| Google Search Console (verified 2026-10-24, domain property) | Indexed pages, queries, clicks, positions, rich-result reports | Weekly glance, monthly note |
| Bing Webmaster Tools (verified 2026-10-24) | Same for Bing, which also feeds ChatGPT search. Its "AI Performance" report shows citations in Copilot answers | Monthly |
| `ai-visibility-prompts.md` | Mention and link rate across ChatGPT, Perplexity, Gemini and Google | Monthly, same prompts |
| Analytics (observability session) | Visits from search and from AI assistants (`chatgpt.com`, `perplexity.ai`, `gemini.google.com`) | Monthly |

**Targets.** These are goals, not promises; search moves slowly.

| By | Target |
|---|---|
| 30 days after B1 ships | ≥ 90% of sitemap URLs indexed. No `/en` pages flagged as duplicates. Bing verified, sitemap submitted |
| 3 months | #1 for the brand name in RO and EN. In the map pack for "lutier Reghin". AI answers about "Simon Musical Instruments" correct in at least 2 engines, with no singer or Jonaco mix-up |
| 6 months | Top 10 for at least 10 long-tail queries (e.g. "contrabas 3/4 preț", "goffriller model cello", "Meistercello kaufen"). Mentioned in ≥ 25% of the AI prompt runs |
| 12 months | Search becomes a measurable source of reservations and inquiries (needs analytics) |

## 12. Plan and owners

| When | What | Owner |
|---|---|---|
| Now (no code) | Search Console ✅, Bing ✅, research ✅, strategy and spec ✅, AI baseline ✅ | seo + Rares |
| Done 2026-10-24 | Legacy `.html` redirects live (PR #6). `www` pending (infra-cost, K-13) | seo + infra-cost |
| Now (Paul) | Questions P-11, P-13, P-14, P-18, P-20 and P-21–P-31 (below); Google Business Profile | Paul via Rares |
| After platform PR2 | Build B1 → B5 (`technical-spec.md` §10) | seo |
| In parallel | K-4 translations (infra-cost), caching and images (improvements), analytics (observability), legal texts (legal) | other sessions |
| Monthly | AI prompt run, Search Console review, one new content piece | seo |

### Questions for Paul

Tracked privately in `paul-followups.md` through the master. Those that block this plan: P-11
(Business Profile), P-13 (photos), P-14 (instrument titles), P-18 (channels), P-20 (brand name),
P-21 to P-31 (instrument numbers, the link to the other Simon workshop, build-stage photos, press and
events, workshop sign, visits, prices for "price on request" instruments, the Facebook page, dealer
listings, claiming the reghin.ro listing). P-22 (the other Simon workshop) is the most urgent,
because Google's AI Overview already mixes the two up.
