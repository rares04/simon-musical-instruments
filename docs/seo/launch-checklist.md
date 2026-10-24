# SEO launch checklist (B1 deploy day)

Run this after the B1 PR (canonical, hreflang, sitemap, robots, JSON-LD) is live. It takes about
30 minutes. Search Console and Bing Webmaster Tools are verified under the maintainer's Google
account (see `README.md` §11).

## Before merging

- [ ] **K-4 is applied in production.** Every instrument has its own `ro` notes, and ideally `de` and
      `fr`. Otherwise B1 canonicalises today's indexed Romanian product pages to English. Check:

      ```bash
      curl -s 'https://simoninstruments.com/api/instruments?limit=100&depth=0&locale=all&select[luthierNotes]=true' \
        | python3 -c "import json,sys; d=json.load(sys.stdin)['docs']; \
          print([(i['id'], [l for l,v in (i.get('luthierNotes') or {}).items() if v]) for i in d])"
      ```

- [ ] The master has said "go".

## Right after the deploy

1. **Spot-check the live HTML.** These tags must be inside `<head>`:

   ```bash
   for ua in "Googlebot/2.1" "GPTBot/1.1" "Mozilla/5.0"; do
     curl -s -A "$ua" https://simoninstruments.com/en | sed -n '1,/<\/head>/p' \
       | grep -cE 'rel="canonical"|hrefLang=|name="robots"'
   done
   ```

2. **robots and sitemap respond:** `https://simoninstruments.com/robots.txt` and `/sitemap.xml`
   (expect 40 static entries plus the instrument entries).
3. **Legacy redirects still work:** `bash scripts/seo/check-legacy-redirects.sh`.

## Submit the sitemap

1. **Google Search Console** → Indexing → Sitemaps → enter `sitemap.xml` → Submit. The status
   should read "Success" within minutes to a day.
2. **Bing Webmaster Tools** → Sitemaps → Submit sitemap →
   `https://simoninstruments.com/sitemap.xml`.
3. **URL Inspection** in Search Console, then "Request indexing", for:
   - `https://simoninstruments.com/en`
   - `https://simoninstruments.com/ro`
   - two product pages (one priced, one "price on request").

   Check "User-declared canonical" now shows the URL itself.
4. **Rich Results Test** (`search.google.com/test/rich-results`) on one priced product page.
   - Expect a valid Product / Merchant listing, with warnings about shipping and returns until
     the legal pages exist.
   - "Price on request" products show no product rich result. That's by design.

## Two weeks later

- Search Console → Pages: `/en/*` should move from "Duplicate without user-selected canonical" to
  "Indexed". If `/en` is still not chosen as canonical, switch `HOME_X_DEFAULT` to
  `'default-locale'` in `src/lib/seo/alternates.ts`.
- Search Console → Enhancements: the Product snippets / Merchant listings counts match the number
  of priced instruments.
- Bing → AI Performance: first citation data.
- Run the monthly AI-answer check (`ai-visibility-prompts.md`).
