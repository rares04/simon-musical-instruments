# Performance baseline, 2026-10-24

These are lab measurements of production, taken before the platform upgrade (#2) and B1 deploy.
Re-run the same command after both are live and compare.

## How it was measured

- **Tool:** Lighthouse 12.8.2 CLI, run locally with headless Chrome.
- **Device:** mobile emulation with simulated throttling (150 ms RTT, ~1.6 Mbps, 4× CPU slowdown).
- **Runs:** one per page. Expect ±5–10 points of variance between runs.
- **Why the CLI:** the keyless PageSpeed Insights API shares one daily quota and returns 429.
- **No field data:** Chrome UX Report has no real-user data for the site. Traffic is too low.

```bash
npx -y lighthouse@12 "https://simoninstruments.com/en" --form-factor=mobile \
  --only-categories=performance,seo,accessibility,best-practices \
  --output=json --output-path=en.json --chrome-flags="--headless=new" --quiet
```

## Results

| Page | Perf | SEO | A11y | Best practices | LCP | CLS | TBT | FCP | Weight |
|---|---|---|---|---|---|---|---|---|---|
| `/en` | 79 | 91 | 90 | 96 | 4.9 s | 0.006 | 0 ms | 2.5 s | 534 KiB |
| `/en/gallery` | 87 | 100 | 83 | 96 | 4.0 s | 0.006 | 0 ms | 1.5 s | 682 KiB |
| `/en/gallery/Double-Bass-3-4(5)` | 84 | 91 | 85 | 96 | 4.4 s | 0.006 | 10 ms | 1.5 s | 482 KiB |

Google's "good" thresholds are LCP ≤ 2.5 s, CLS ≤ 0.1 and INP ≤ 200 ms. Layout stability (CLS)
and blocking time are fine. The largest contentful paint (LCP) is 1.5–2.4 s over the threshold on
every page.

## Where the LCP time goes

| Page | LCP element | TTFB | Load delay | Load time | Render delay |
|---|---|---|---|---|---|
| `/en` | hero paragraph (text) | 655 ms | 0 | 0 | **4,263 ms** |
| `/en/gallery` | intro paragraph (text) | 655 ms | 0 | 0 | **3,314 ms** |
| product | main photo | 663 ms | **2,725 ms** | 426 ms | 575 ms |

- **Home and gallery:** the LCP element is text that is already in the server HTML, with no
  animation on it. Nearly all of the time is render delay, which points at the page's CSS, fonts
  or JavaScript holding back the first paint of that text. Owner: platform.
- **Product page:** the browser discovers the main photo late (2.7 s load delay). The fix is to
  give the first gallery image `priority` (preload, `fetchpriority="high"`, no lazy loading).
- **SEO audit failures:** the only one is the missing meta description on `/en` and on product
  pages. B1 adds it.
- **Image sizing:** savings are small (12–62 KiB per page).

## Targets after the upgrade

- LCP ≤ 2.5 s on all three pages (lab, mobile).
- Lighthouse SEO 100 on all three pages.
- Performance ≥ 90.
