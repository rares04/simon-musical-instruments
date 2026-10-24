# messages: UI translations (next-intl)

There's one file per locale: `en.json` (source of truth), plus `ro`, `de`, `fr`, `nl`, `ja`, `ko`
and `el`. They're loaded by `src/i18n/request.ts`. Product content (instrument title and notes) is
**not** here; it lives in Payload localized fields.

## Rules

1. **Key parity.** Every key in `en.json` must exist in all 8 files.
   - Today all files have 513 shared keys, with orphan extras in `fr.json`
     (`faq.questions.packaging.*`) and `ko.json` (`checkoutSuccess.reservation.reservationStep1-3`).
     Remove them, or add them to every locale.
   - Check parity with the script below before committing.
2. **Namespaces** follow features: `navigation`, `hero`, `instruments`, `product`, `gallery`, `cart`,
   `checkout`, `checkoutSuccess`, `account`, `auth`, `profile`, `reservations`, `faq`, `contact`,
   `footer`, `photos`, `testimonials`, `story`, `instrumentCategories`, `common`. Put new keys in the
   matching namespace, and use nested objects rather than long flat keys.
3. **ICU syntax** for variables and plurals: `"crafted": "Crafted in {year}"`,
   `{count, plural, one {# item} other {# items}}`. Never concatenate translated fragments in code.
4. **Romanian is first-class.** It's the home market, and Paul reads Romanian. Use correct
   diacritics: **ș ț** with a comma below (U+0219/U+021B), not ş ţ with a cedilla.
5. **Terminology** (English):
   - "Double Bass", not "Contrabass", in customer copy (changed 2026-05-21). The stored enum value
     stays `contrabass`.
   - "Reserve"/"reservation", not "buy"/"order", while online payment is off.
   - "Price on Request".
6. **Policy facts** (shipping, returns, hours, payment) must agree across `faq`, `checkout`,
   `product` and `contact`. Several contradict each other today; see
   `docs/domain-and-business-logic.md` §9. Paul confirms the facts before anyone edits them.
7. **Machine translation** is acceptable for a first pass. Any marketing copy needs a native review,
   especially RO, DE and FR.

## Parity check

```bash
node -e '
const fs=require("fs");const f=o=>Object.entries(o).flatMap(([k,v])=>v&&typeof v==="object"?f(v).map(x=>k+"."+x):[k]);
const en=new Set(f(JSON.parse(fs.readFileSync("messages/en.json"))));
for (const l of ["ro","de","fr","nl","ja","ko","el"]) { const s=new Set(f(JSON.parse(fs.readFileSync(`messages/${l}.json`))));
  const miss=[...en].filter(k=>!s.has(k)), extra=[...s].filter(k=>!en.has(k));
  console.log(l, "missing:", miss.length, "extra:", extra.length, extra.slice(0,3)); }'
```
