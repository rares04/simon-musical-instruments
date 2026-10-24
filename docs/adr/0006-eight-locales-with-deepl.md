# 0006. Eight locales with next-intl and DeepL auto-translation

- **Status**: Accepted
- **Date**: 2025-12-29 (retroactive record; commits `4f2c2b7`, `d4fd5c2`)

## Context

Buyers come from Romania, Western Europe and East Asia (Japan, Korea, Taiwan are mentioned on the
site). Paul writes instrument descriptions in English.

## Decision

- **UI**: next-intl with `en ro de fr nl ja ko el`.
  - The locale is always in the URL.
  - Accept-Language detection.
  - Messages live in `messages/*.json`.
- **Content**: Payload localization on `instruments.title` and `instruments.luthierNotes`, with
  `fallback: true`.
  - An `afterChange` hook translates new instruments from English through **DeepL**.
  - It runs on create only, so price and status edits don't re-translate.

## Consequences

- Broad reach at almost no translation cost.
- The fallback hides missing translations. Production instruments currently have **none** (see
  known-issues K-4), and nothing alerts on it.
- Machine translation of marketing copy has no human review.
- Only the OTP email is localized.
- CJK fonts are not set up correctly.
- 8 locales × 513 keys must be kept in sync by hand.
