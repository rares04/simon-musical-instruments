# Keyword and search-intent research: English and Romanian

Research date: 2026-10-24. Scope: English (Google `gl=us`, `gl=gb`, `gl=ie`) and Romanian (`hl=ro`, `gl=ro`), including local searches.

## How this was done (read once)

- **Google autocomplete** shows queries that real people type often enough for Google to suggest them. It gives **no volumes**. A suggestion means "people search this"; it does not say how many.
  - 266 saved calls, plus 5 unsaved test calls at the start (about 271 in total). Raw files are kept in the research session's scratch folder (not committed):
    - 109 EN seeds with `gl=us`, 9 with `gl=gb`, 3 with `gl=ie`.
    - 104 RO seeds, plus `lutier a` … `lutier z` (26 calls) to see which cities people pair with "lutier".
    - 14 brand-name checks, plus one re-run of "vioară " to save the diacritics test.
- **Wikipedia pageviews** count real monthly reads of an article. They show topic interest, **not search volume**.
- **WebSearch** (not Google, US-centric) was used only to look at what kind of pages appear for a few queries.

**Evidence tags used below**

| Tag | Meaning |
|---|---|
| `[autocomplete us]`, `[autocomplete us,gb,ie]`, `[autocomplete ro]` | Seen as a Google suggestion for that country setting |
| `[autocomplete ro: echo only]` | Google returned only the typed phrase itself. It is a known query, but it has few longer variants (a small, narrow query) |
| `[autocomplete ro: no suggestions]` | Google returned nothing. The phrase is below Google's suggestion threshold. **This is not proof of zero searches** |
| `[wikipedia-pageviews]` | From the Wikimedia API, Oct 2025 to Sep 2026, human readers only |
| `[websearch, unverified snippet]` | A summary from the WebSearch tool. Not checked on the page itself |
| `[site gallery]` | simoninstruments.com/en/gallery, fetched 2026-10-24: 10 cellos (all 4/4: 7 Stradivari "Davidoff", 3 Goffriller), 6 double basses (all 3/4: 3 Gamba Vivala, 1 French Gamba, 1 Panormo, 1 Ceruti; one is 5-string), 3 violins (all 4/4: 2 Stradivari "Messiah", 1 Amati), 0 violas |
| `[estimate: …]` | My judgment, with the reasoning |

**Two limits to keep in mind**

1. **All calls came from a Romanian IP address.** Google partly personalises suggestions by location, and `gl=us` results are visibly affected: `reghin` suggested the Romanian word "reghin populatie". This applies to **every Romania-flavoured English suggestion**, not only Reghin:
   - "romanian cello / violin / double bass makers", "are romanian violins good", "transylvania violin"
   - the "reghin …", "gliga …" and "hora …" rows
   - Read these as **plausible but unconfirmed** for buyers outside Romania. Re-check them from a non-Romanian location (a VPN, or a contact in the UK or US) before treating them as High priority.
2. **The `gl=gb` and `gl=ie` lists mostly repeat the US lists.** I only claim a regional difference where one shows up explicitly, such as "ireland", "dublin", "uk" or "london" appearing in the suggestions.

---

## 1. Summary

- **Romanian buyers don't type "handmade".** "violoncel handmade", "violoncel lucrat manual", "vioara lucrata manual", "vioara artizanala", "vioara facuta manual" and "viori lucrate manual" all returned nothing `[autocomplete ro: no suggestions]`.
  - They signal quality with three other words instead:
    - **maestru**: "vioara maestru de vanzare", "vioara gliga maestru"
    - **profesională**: "vioara profesionala pret", "vioara profesionala 4 4"
    - **Reghin**, used as a quality label inside buying queries: "pret vioara reghin", "violoncel reghin pret", "vioara reghin 4 4 pret", "viori reghin pret", "contrabas reghin", "vioara de vanzare reghin" `[autocomplete ro]`
  - The Romanian pages should speak this language. "Instrument de maestru din Reghin" fits the business exactly.
- **Price questions lead in both languages, and the site has real prices.**
  - EN: "how much does a cello cost to buy / on average / uk", "how much does a good / professional double bass cost", "why are cellos so expensive", "handmade violin cost", "handmade cello price" `[autocomplete us,gb]`
  - RO: "cat costa o vioara buna / adevarata / pentru incepatori", plus "cat costa un violoncel" and "cat costa un contrabas" as echo-only queries `[autocomplete ro]`
  - A price explainer that cites the workshop's live €1,700–7,500 range is the kind of concrete answer that AI answer engines (ChatGPT, Perplexity, Google AI Overviews) quote `[estimate: answer engines prefer pages with specific, citable facts]`.
- **The double bass has three English names. The site must use two of them and avoid the third.**
  - **"Upright bass"** is the North American word. In `gl=gb`, "upright bass for sale" suggested Nashville, Los Angeles, Toronto and Seattle. It is also tied to genres: "best upright bass for jazz / bluegrass / rockabilly".
  - **"Double bass"** is the UK and Ireland word: "double bass for sale uk / ireland / london".
  - **"Contrabass"** in English means wind instruments: saxophone, flute, clarinet, tuba `[autocomplete us]`.
  - Narrow buying queries match current stock: "5 string double bass for sale" (also "… uk"), "3/4 double bass for sale", "gamba style double bass", "panormo double bass" `[autocomplete us]`. All 6 basses listed are 3/4, one is 5-string, and four are gamba models `[site gallery]`. Competition for these was not measured.
- **The historic model names are real search terms, but the spelling matters.**
  - People search **"davidov stradivarius cello"** and "1712 davidoff stradivarius cello". On its own, **"davidoff cello" means Karl Davidov's cello concertos** (sheet music, IMSLP) `[autocomplete us]`.
  - "goffriller cello" comes with price, model, value and dimensions suggestions `[autocomplete us]`.
  - Wikipedia reads per year: Davidov Stradivarius 22,799, Messiah Stradivarius 19,453, Matteo Goffriller 8,155 `[wikipedia-pageviews]`.
  - Model pages are cheap to write and suit answer engines. Sellers already use these names (eBay, Reverb and Fiddlershop listings for "Davidov" copies `[websearch, unverified snippet]`), so competition exists; it was not measured.
- **Name collisions affect page titles in both languages.**
  - **viola** (RO, no diacritic) = the flower, a perfume, a marble
  - **Stradivarius** (RO) = the Inditex fashion chain (jeans, dresses)
  - **cello** (EN) = an Indian pen, tape and bottle brand
  - **Paul Simon** = the singer ("paul simon luthier" returned only guitar and song suggestions)
  - **simon violin** = other people (Simon Fischer, a Wichita shop)
  - **"simon musical instruments"** does appear as a suggestion in both EN and RO. "simon reghin" and "paul simon reghin" returned nothing `[autocomplete us, ro]`.
  - Origin looks like a search criterion in English: "romanian cello makers", "romanian violin makers", "romanian double bass makers", "are romanian violins good" `[autocomplete us]`. These may be inflated by the Romanian IP (see limit 1), so confirm them from outside Romania.

---

## 2. Terminology: the words people actually type

### English

| Concept | What people type (evidence) | Use on the site |
|---|---|---|
| Cello | "cello". Sizes appear as "4/4 cello", "4 4 cello" and "full size" ("cello for sale full size", "cello for sale 4/4") `[autocomplete us,gb]` | "4/4 (full-size) cello" in titles |
| Violin | "violin". Also "handmade violin 4-4" `[autocomplete us]` | "4/4 violin" |
| Viola | "viola". "handmade viola for sale" exists `[autocomplete us]` | "viola" |
| Double bass | "double bass" and "upright bass" are both strong. "Stand up bass" also appears ("stand up bass vs double bass", "5 string stand up bass") `[autocomplete us]`. GB/IE results for "double bass for sale" list UK, Ireland and London. GB results for "upright bass for sale" list North American cities `[autocomplete gb,ie]` | Title pattern: "Double bass (upright bass)". Never use "contrabass" in English titles |
| Contrabass | Means wind instruments: "contrabass saxophone / flute / clarinet / trombone / tuba" `[autocomplete us]`. People ask "difference between contrabass and double bass" and "contrabass vs double bass vs upright bass" | Use only in an FAQ that explains the three names |
| Handmade | "handmade" (one word) is the main form: "handmade cello price", "handmade cellos for sale", "handmade violin cost", "handmade violin vs factory made violin". "hand made cello" leads to "hand crafted cello" `[autocomplete us,gb]` | "handmade" in titles, "hand-crafted" in body copy |
| Luthier | Known word, but its suggestions are mostly "luthier near me", "definition", "pronunciation", "school" and guitar topics. "luthier made" leads to guitars `[autocomplete us,gb]`. For origin, people type **"makers"**: "romanian cello makers", "european violin makers", "double bass makers uk", "cello makers list" `[autocomplete us]` | Say "luthiers (violin and cello makers)" once, then use "makers" for origin wording |
| Violin maker | Noisy: "violin maker of cremona crossword" `[autocomplete us,gb]` | Avoid as a main target |
| Custom / commission | "custom double bass", "custom upright bass", "custom cello" (mostly accessories). "commission a violin": no suggestions `[autocomplete us]` | Use "custom-made" plus "commission" in copy |
| Sizes | Typed with a slash ("3/4 double bass") and shown back with a space ("3 4 double bass"). "Full size" is how people describe 4/4. "3/4 upright bass vs full size" and "7/8 cello vs full size" show real confusion `[autocomplete us]` | Explain sizes in a guide. Use both "3/4" and "three-quarter" |
| Stradivari models | People type "**Stradivarius** copy" more than "Stradivari copy": "stradivarius copy cello / viola / violin" `[autocomplete us]`. Use **"Davidov"**: "davidoff cello" alone means the composer's concertos `[autocomplete us]`. Wikipedia titles are "Davidov Stradivarius" and "Messiah Stradivarius" `[wikipedia-pageviews]` | "Stradivari 'Davidov' 1712 model (also spelled Davidoff)" |
| Other models | "goffriller cello" is strong. "panormo double bass" leads to "hawkes panormo", "shen panormo" (other makers' Panormo models). "gamba double bass" leads to "gamba style", "gamba shape", "gamba vs violin" (body shape). "ceruti bass" leads to sea-bass noise `[autocomplete us]` | "Goffriller model cello", "Panormo model double bass", "gamba-shape double bass" |

**Noise families to filter out of the English data.** These are false positives, and they show why page titles need extra words that make the meaning clear:
- "cello" also matches an Indian brand: tape, pens, water bottles, customer care number.
- "double bass pedal" and "custom double bass drum set" are about drums.
- "amati model" matches model ship kits.
- "messiah violin 1 pdf" is Handel sheet music.
- "hora staccato" is sheet music.
- "tonewood amp" is a guitar gadget.
- "davidoff cello concerto" is the composer.
- "gliga" also matches Liga MX (football).
- "maple vs …" matches cutting boards and cabinets.
- "cello price in india / nigeria / kenya …" are price-sensitive markets outside the target.

### Romanian

| Concept | What people type (evidence) | Use on the site |
|---|---|---|
| Diacritics | Usually typed **without** diacritics. Typing "vioară preț", "violoncel preț" or "contrabas preț" returns suggestions without diacritics ("vioara pret", "violoncel pret", "contrabas pret"). Typing "vioară " does return diacritic forms ("vioară de vânzare", "vioară electrică") `[autocomplete ro]` | Write correct diacritics in visible copy. Plain forms should still match `[estimate: Google normally folds Romanian diacritics when matching; confirm in Google Search Console, Google's free report of which queries bring visitors]`. URL slugs (the readable part of the page address) without diacritics |
| Violin | "vioara" (singular), "**viori**" (plural, used with Reghin and "de vanzare"). "viori sau vioare" shows people unsure of the plural `[autocomplete ro]` | "Viori" for the category, "vioară" for products |
| Cello | "violoncel" only `[autocomplete ro]` | "Violoncel" |
| Viola | "**viola**" without diacritic means the flower ("viola floare", "viola odorata", "viola tricolor"), a perfume, a marble ("calacatta viola"), a song. People add "instrument": "violă instrument", "viola instrument muzical", "viola vs vioara" `[autocomplete ro]` | Always "violă (instrument muzical)" |
| Double bass | "contrabas" only: "contrabas vs violoncel", "contrabas in engleza" `[autocomplete ro]`. **Dutch also uses "contrabas"**: "contrabas 3 4 kopen" and "contrabas 3 4 of 4 4" appeared even with `hl=ro` `[autocomplete ro]` | "Contrabas". Tell the NL locale owner |
| Luthier | "lutier", mainly with a city ("lutier reghin", "lutier bucuresti", "lutier cluj") and "atelier lutier reghin", "mester lutier". "lutierie", "lutierie reghin", "atelier lutierie" and "meseria de lutier" returned nothing `[autocomplete ro: no suggestions]` | "Atelier de lutier" / "atelier de viori", not "lutierie", in titles |
| Handmade / quality | "handmade", "lucrat(ă) manual", "artizanal(ă)", "făcut(ă) manual": nothing or echo only `[autocomplete ro: no suggestions / echo only]`. Quality words that do appear: **"maestru"** ("vioara maestru de vanzare", "vioara gliga maestru", "arcus vioara maestru"), **"profesional(ă)"** ("vioara profesionala pret", "violoncel profesional"), **"Reghin"** (inside price and sale queries) `[autocomplete ro]` | Titles: "Violoncel de maestru, lucrat manual în Reghin". Use "lucrat manual" in copy because it is true, but don't make it the main target |
| Old vs new | "veche" (old) is a large modifier: "vioara veche de vanzare", "vioara reghin veche", "vioara reghin 1972", "evaluare vioara veche" `[autocomplete ro]` | The site sells new instruments. Say "nou, lucrat manual" so old-instrument searchers know what they've found |
| Sizes | Shown without the slash: "vioara 4 4", "violoncel 3 4", "contrabas 3 4". Children's sizes go by age: "vioara copii 6 ani" `[autocomplete ro]` | "4/4" in titles; the plain form matches anyway |
| Price | "pret" after the noun ("violoncel pret") or before it ("pret vioara reghin"). "cat costa o vioara …" `[autocomplete ro]` | Show "Preț" plainly on category and product pages |
| Marketplaces | "olx" and "emag" are common: "vioara olx", "contrabas olx", "vioara 4 4 emag" `[autocomplete ro]` | Not a page target. A possible listing channel |

**Noise families to filter out of the Romanian data:**
- "stradivarius" matches the fashion retailer: "stradivarius blugi / rochii / botine".
- "gliga" matches people with that surname, Gliga TV, and a restaurant and terrace in Reghin.
- "vioara zeta" (a brand of electric violin) and "vioara cu goarnă" (the Bihor horn-violin) are other products.
- "vioara despartit in silabe" is a spelling (syllables) query.
- "hora" is also the folk dance.
- The "lutier a–z" list pulls in Spanish and French queries ("luthier que es", "taller lutier").

---

## 3. Keyword map

**Priority rubric** (relative, not volume-based):
- **H**: buying or comparison intent that matches what the workshop sells (new handmade instruments, €1.7k–7.5k, mostly 4/4 cellos and double basses), or a brand or local query they should own. Not dominated by marketplaces.
- **M**: informational queries that feed a guide, FAQ or model page and build trust and answer-engine visibility, or buying queries for stock they barely have.
- **L**: marketplace, children, beginner, cheap, second-hand, old-instrument or noisy queries. Track them; don't build pages for them.

**Intent**, meaning what the searcher wants:
- **informational**: to learn
- **commercial investigation**: to compare before buying
- **transactional**: to buy now
- **local**: a place nearby
- **navigational**: a specific brand or site

### English keyword map

| Keyword (variants) | Intent | Evidence | Priority + why | Best target page |
|---|---|---|---|---|
| **Cellos: buying** | | | | |
| handmade cello for sale / handmade cellos for sale | transactional | [autocomplete us,gb] | H: exact match to the offer | category /cellos |
| handmade cello price | commercial investigation | [autocomplete us,gb] | H: they publish prices | category /cellos + buying guide |
| hand crafted cello | commercial investigation | [autocomplete us] | M: synonym; use in copy | category /cellos |
| cello for sale 4/4 / cello for sale full size / 4/4 cello for sale | transactional | [autocomplete us,gb] | H: all 10 cellos listed are 4/4 [site gallery] | category /cellos |
| cello for sale (+ near me / used) | transactional | [autocomplete us,gb,ie] | M: a broad, short query (a "head term"), but "near me" and used listings dominate | category /cellos |
| cello for sale uk / buy cello uk | transactional | [autocomplete us,gb] | M: clear UK buyer signal; needs shipping info | category /cellos + delivery FAQ |
| cello for sale ireland | transactional | [autocomplete gb,ie] | M: shown first in `gl=ie` | category /cellos + delivery FAQ |
| european cello for sale / european made cello | commercial investigation | [autocomplete us] | H: origin as a buying filter | category /cellos |
| romanian cello for sale / romanian cello | commercial investigation | [autocomplete us] (Romanian-IP caveat) | H if confirmed from outside Romania: origin search, matches exactly | category /cellos + Reghin page |
| romanian cello makers / cello makers list | commercial investigation | [autocomplete us] (Romanian-IP caveat) | H if confirmed: people looking for makers like Paul | about (makers) / Reghin page |
| professional cello for sale / professional cello price | commercial investigation | [autocomplete us] | H: fits the price band | category /cellos |
| best cello for advanced students / best cello brands for advanced students | commercial investigation | [autocomplete us] | H: core buyer group (advanced students, parents) | buying guide |
| best cello for intermediate player / intermediate cello for sale | commercial investigation | [autocomplete us] | M: lower end of their range | buying guide |
| best cello for professionals / best cello brands for professional | commercial investigation | [autocomplete us] | M: high competition from big dealers [estimate] | buying guide |
| buy cello online / buying a cello online / best place to buy cello online | commercial investigation | [autocomplete us] | H: the reserve-online model needs trust content | buying guide + FAQ ("how buying from us works") |
| 7/8 cello for sale / 7/8 cello vs full size | transactional | [autocomplete us] | L: only if they build 7/8 | category filter / FAQ |
| student cello for sale / student cello price | commercial investigation | [autocomplete us] | L: price-sensitive | buying guide (one section) |
| **Double basses: buying** | | | | |
| handmade double bass / handmade upright bass | commercial investigation | [autocomplete us] | H: exact offer; narrow query (competition not measured) | category /double-basses |
| double bass for sale (+ uk / ireland / london) | transactional | [autocomplete us,gb,ie] | H: UK/IE explicitly searched | category /double-basses + delivery FAQ |
| upright bass for sale | transactional | [autocomplete us,gb] | M: US term; US shipping cost is high [estimate] | category /double-basses (synonym in title) |
| 3/4 double bass for sale / 3/4 upright bass for sale | transactional | [autocomplete us] | H: all 6 basses listed are 3/4 [site gallery] | category /double-basses |
| 4/4 double bass for sale | transactional | [autocomplete us] | L: no 4/4 basses listed [site gallery] | category /double-basses (commission note) |
| 5 string double bass for sale / … uk / 5 string upright bass for sale | transactional | [autocomplete us] | H: one 5-string bass listed [site gallery]; narrow query | product page + category filter |
| romanian double bass / romanian double bass makers / romanian double bass for sale / romanian upright bass | commercial investigation | [autocomplete us] (Romanian-IP caveat) | H if confirmed: origin search, exact fit | category /double-basses + about |
| reghin romania double bass | commercial investigation | [autocomplete us] | M: Reghin as a label (Romanian IP may inflate it) | Reghin page |
| custom double bass / custom upright bass | commercial investigation | [autocomplete us] | M: commission intent, mixed with drum noise | commission page |
| double bass luthier (+ uk / london) / double bass makers uk | commercial investigation | [autocomplete us] | M: UK maker search | about (makers) |
| best double bass for jazz / best upright bass for jazz / bluegrass | commercial investigation | [autocomplete us] | M: genre buyers; an orchestral bass suits jazz too [estimate] | buying guide section |
| best double bass for beginners | commercial investigation | [autocomplete us] | L: not their tier | none |
| **Double basses: models and specs** | | | | |
| gamba double bass / gamba upright bass / gamba style double bass / double bass gamba vs violin / gamba shape | informational to commercial | [autocomplete us] | H: 4 of 6 basses listed are gamba models [site gallery]; narrow query | model page "Gamba-shape double bass" |
| panormo double bass / vincenzo panormo double bass / hawkes panormo / shen panormo bass | commercial investigation | [autocomplete us] | M: known model name sold by others | model page "Panormo model" |
| ceruti double bass | commercial investigation | [autocomplete us] (rest was sea-bass noise) | L: barely searched | product page only |
| 3/4 double bass dimensions / height / scale length / 4/4 double bass height | informational | [autocomplete us] | M: spec seekers; put specs on product pages | product page spec table + size guide |
| 5 string double bass tuning / range / low b / high c | informational | [autocomplete us] | M: supports the 5-string product page | product page FAQ |
| **Violins and violas** | | | | |
| handmade violin for sale / handmade violin 4-4 | transactional | [autocomplete us] | M: only 3 violins in stock | category /violins |
| handmade violin cost / handmade violin vs factory made violin | commercial investigation | [autocomplete us] | H: perfect explainer topic | buying guide |
| romanian violin makers / romanian violin brands / romanian violin for sale / romanian violin price | commercial investigation | [autocomplete us] (Romanian-IP caveat) | M: origin search, but only 3 violins listed | category /violins + Reghin page |
| are romanian violins good | commercial investigation | [autocomplete us] (Romanian-IP caveat) | H if confirmed: a question answer engines will field | FAQ + Reghin page |
| european violin makers / european violin for sale | commercial investigation | [autocomplete us] | M | category /violins |
| best violin for advanced students / good violin brands for advanced students | commercial investigation | [autocomplete us] | M | buying guide |
| handmade viola for sale / handmade viola | transactional | [autocomplete us] | L: none in stock; commission only | commission page |
| **Historic models** | | | | |
| davidov stradivarius cello / 1712 davidoff stradivarius cello / davidov stradivari cello | informational to commercial | [autocomplete us] [wikipedia-pageviews: 22,799/yr] | H: their main cello model; steady interest | model page "Stradivari 'Davidov' 1712 cello" |
| davidov stradivarius cello price / value / worth | informational | [autocomplete us] | M: curiosity about the original; hook for the page | model page FAQ |
| stradivarius copy cello / stradivarius copy viola | commercial investigation | [autocomplete us] | H: buyers use the word "copy" | model page |
| stradivari cello for sale / stradivari cello measurements | commercial investigation | [autocomplete us] | M | model page |
| goffriller cello / goffriller cello model / for sale / price / value / dimensions / casals | commercial investigation | [autocomplete us] [wikipedia-pageviews: 8,155/yr] | H: specific model with rich suggestions; 3 Goffriller cellos listed [site gallery] | model page "Goffriller model cello" |
| messiah stradivarius violin / 1716 / sound / measurements | informational | [autocomplete us] [wikipedia-pageviews: 19,453/yr] | M: their violin model; "messiah violin" alone means Handel | model page "Stradivari 'Messiah' violin" |
| stradivarius copy violin for sale / price | commercial investigation | [autocomplete us] | M | model page |
| stradivarius copy violin value / made in germany / czechoslovakia | informational | [autocomplete us] | L: owners of old factory copies, not buyers | optional FAQ |
| amati model violin / amati violin model / amati violin for sale | commercial investigation | [autocomplete us] | M: "amati model" alone means ship kits | model page "Amati model violin" |
| amati violin vs stradivarius | informational | [autocomplete us] | M: good comparison content | model page section |
| **Price and value** | | | | |
| how much does a cello cost (to buy / on average / uk) | commercial investigation | [autocomplete us,gb] | H: the top question; they have real prices | buying guide "How much does a handmade cello cost?" |
| cello price range / professional cello price | commercial investigation | [autocomplete us,gb] | H | buying guide |
| why are cellos so expensive | informational | [autocomplete us] | H: answer-engine favourite; a maker can explain the labour | buying guide / FAQ |
| how much does a good / professional double bass cost / double bass price range | commercial investigation | [autocomplete us,gb] | H | buying guide (double bass section) |
| how much is a cello worth | informational | [autocomplete us] | L: mostly valuation of existing instruments | FAQ |
| student cello vs professional cello | commercial investigation | [autocomplete us] | M | buying guide |
| **Sizing and choosing** | | | | |
| how to choose a good cello / how to buy a good cello / how to choose a cello | commercial investigation | [autocomplete us] | H: the guide a maker should own | buying guide |
| what size cello for adult / what size cello should i buy | informational | [autocomplete us] | M: most results are about children | buying guide (size section) |
| what size double bass should i get / double bass sizes explained / what size is a 3 4 double bass / 3/4 upright bass vs full size | informational | [autocomplete us] | H: real confusion; matches their bass sizes | double bass size guide / FAQ |
| is an upright bass the same as a double bass / why is an upright bass called a double bass / contrabass vs double bass vs upright bass | informational | [autocomplete us] | M: answer-engine target; links both names | FAQ |
| cello vs double bass / cello vs upright bass | informational | [autocomplete us] | L | FAQ |
| **Materials and craft** | | | | |
| what wood is cello made of / cello wood types / cello back wood | informational | [autocomplete us] | M: matches maple, alder and spruce story | craft and materials page |
| oil vs spirit varnish violin / spirit varnish vs oil varnish violin / spirit varnish for violin | informational | [autocomplete us] | M: they use spirit varnish, so they can answer first-hand | craft page / FAQ |
| carpathian spruce tonewood / carpathian spruce top | informational | [autocomplete us] | M: mostly guitar context, but "Carpathian" is a selling point | craft page |
| flamed maple cello / spruce top cello | commercial investigation | [autocomplete us: echo only] | L: rare; use as product-copy words | product page |
| **Care** | | | | |
| how to care for a cello / how to look after a cello | informational | [autocomplete us] | M: after-sale trust; answer engines | care guide |
| cello humidity level / ideal cello humidity / cello humidity control | informational | [autocomplete us] | M: specific, quotable answer | care guide |
| double bass care / upright bass care kit | informational | [autocomplete us] | L | care guide section |
| **Reghin, brand and competitors** | | | | |
| reghin romania cello / reghin romania cello review / reghin romania viola | commercial investigation | [autocomplete us] (Romanian-IP caveat) | M: Reghin known as a label for cellos too | Reghin heritage page + /cellos |
| reghin violin / reghin violin price / review / reghin romania violin value | informational | [autocomplete us] (Romanian-IP caveat) | M: mostly owners valuing factory violins (Hora, Gliga) | Reghin heritage page |
| gliga cello / gliga cello review / gliga violin price / gliga vs stentor | commercial investigation (competitor) | [autocomplete us] | M: comparison shoppers in Romanian-made instruments | buying guide ("factory vs workshop", no brand-bashing) |
| hora reghin violin / hora violin reviews | commercial investigation (competitor) | [autocomplete us] | L | Reghin heritage page (history only) |
| simon musical instruments | navigational | [autocomplete us, ro] | H: the brand exists as a suggestion | home |
| simon violin / simon cello / paul simon luthier / simon reghin | navigational | [autocomplete us] (others / singer / none) | L as targets: names collide | about (use "Paul & Ecaterina Simon, luthiers in Reghin") |

(75 rows)

### Romanian keyword map

| Keyword (variants; diacritic and plain forms merged) | Intent | Evidence | Priority + why | Best target page |
|---|---|---|---|---|
| **Violoncel** | | | | |
| violoncel pret / violoncel preț | commercial investigation | [autocomplete ro] | H: top suggestion for "violoncel" | category /violoncele |
| violoncel reghin pret / violoncel reghin | commercial investigation | [autocomplete ro] | H: Reghin plus price, exact fit | category /violoncele |
| violoncel de vanzare | transactional | [autocomplete ro] | H | category /violoncele |
| violoncel 4/4 (violoncel 4 4) | transactional | [autocomplete ro] | H: all 10 cellos listed are 4/4 [site gallery] | category /violoncele |
| violoncel profesional | commercial investigation | [autocomplete ro: echo only] | H: "profesional" is the quality word | category /violoncele |
| violoncel stradivarius | commercial investigation | [autocomplete ro: echo only] | M | model page "Stradivari Davidov" |
| violoncel hora reghin / violoncel gliga | commercial investigation (competitor) | [autocomplete ro] | M: comparison shoppers | buying guide |
| violoncel 3 4 / violoncel 1 2 | transactional | [autocomplete ro] | L: children's sizes | size guide |
| violoncel copii / violoncel pentru copii / violoncel incepatori | commercial investigation | [autocomplete ro] | L | none |
| violoncel olx / violoncel second hand / violoncel pret second hand / violoncel vechi de vanzare | transactional | [autocomplete ro] | L: marketplace / used | none |
| violoncel handmade / violoncel lucrat manual | n/a | [autocomplete ro: no suggestions] | L as a target; use in copy | category copy |
| violoncel vs contrabas / contrabas vs violoncel | informational | [autocomplete ro] | M: answer-engine FAQ | FAQ |
| **Vioară / viori** | | | | |
| vioara pret / vioară preț | commercial investigation | [autocomplete ro] | H: biggest Romanian buying pattern | category /viori |
| pret vioara reghin / vioara reghin pret / vioara reghin 4 4 pret | commercial investigation | [autocomplete ro] | H: Reghin as a quality label | category /viori + Reghin page |
| vioara de vanzare / vioara de vanzare reghin | transactional | [autocomplete ro] | H | category /viori |
| viori reghin / viori reghin pret / viori de vanzare reghin | commercial investigation | [autocomplete ro] | H: the plural form used with Reghin | category /viori |
| vioara maestru / vioara maestru de vanzare | commercial investigation | [autocomplete ro] | H: the Romanian word for a master-grade instrument | category /viori + "Ce este un instrument de maestru" |
| vioara profesionala / vioara profesionala pret / vioara profesionala 4 4 | commercial investigation | [autocomplete ro] | H | category /viori |
| vioara 4/4 (vioara 4 4) | transactional | [autocomplete ro] | M: fewer violins in stock | category /viori |
| vioara stradivarius copie / vioara stradivarius copie pret / copie stradivarius / vioara copie stradivarius | commercial investigation | [autocomplete ro] | H: their "Messiah" model | model page "Stradivari Messiah" |
| vioara amati de vanzare | transactional | [autocomplete ro] | M: their Amati model | model page "Amati" |
| vioara stradivarius pret / originala pret / cate sunt in lume / viori stradivarius in romania | informational | [autocomplete ro] | M: curiosity; linkable story content | model page section / blog |
| vioara gliga maestru / vioara gliga / vioara hora reghin (4 4) | commercial investigation (competitor) | [autocomplete ro] | M: shoppers comparing Reghin makers | buying guide ("fabrică vs atelier") |
| vioara handmade | commercial investigation | [autocomplete ro: echo only] | L: loanword, rare | copy only |
| vioara lucrata manual / vioara artizanala / vioara facuta manual / viori lucrate manual | n/a | [autocomplete ro: no suggestions] | L as targets | copy only |
| vioara 3 4 / 3 4 reghin / 3 4 pret / vioara 1 2 | transactional | [autocomplete ro] | L: children's sizes | size guide |
| vioara copii (3 / 5 / 6 / 7 / 10 ani) / vioara copii pret | commercial investigation | [autocomplete ro] | L: not their tier | size guide (one section) |
| vioara pentru incepatori / vioara incepatori pret / vioara adulti incepatori | commercial investigation | [autocomplete ro] | L | none |
| vioara veche / vioara veche de vanzare / vioara reghin veche / vioara reghin 1972 / evaluare vioara veche | informational / transactional | [autocomplete ro] | L: old factory instruments (a possible service only if they appraise) | FAQ (optional) |
| vioara olx / olx vioara 4 4 / vioara olx bucuresti / vioara emag / vioara 4 4 emag / vioara pret second hand | navigational (marketplace) | [autocomplete ro] | L: marketplace intent | none (possible listing channel) |
| **Violă** | | | | |
| violă instrument / viola instrument muzical | informational | [autocomplete ro] | M: must add "instrument" to avoid the flower | category /viole (when stock exists) |
| viola vs vioara / diferenta vioara viola | informational | [autocomplete ro] | M: FAQ | FAQ |
| viola de vanzare | transactional | [autocomplete ro: echo only] | L: no stock | commission page |
| viola pret | n/a | [autocomplete ro] (marble, perfume noise) | L: polluted query | none |
| **Contrabas** | | | | |
| contrabas pret / contrabas preț | commercial investigation | [autocomplete ro: echo only] | H: exact fit | category /contrabasi |
| contrabas de vanzare | transactional | [autocomplete ro] | H: suggested for "contrabas" itself | category /contrabasi |
| contrabas reghin | commercial investigation | [autocomplete ro] | H: suggested for "contrabas" itself | category /contrabasi |
| contrabas 3/4 / contrabas 4/4 | transactional | [autocomplete ro] | H for 3/4 (all 6 basses listed are 3/4 [site gallery]); L for 4/4 | category /contrabasi |
| contrabas 5 corzi | transactional | [autocomplete ro: echo only] | M: they have one | product page |
| contrabas olx / contrabas second hand / contrabas electric | transactional | [autocomplete ro] | L | none |
| contrabas in engleza | informational | [autocomplete ro] | L | FAQ line |
| contrabas gliga | n/a | [autocomplete ro: no suggestions] | L | none |
| **Lutier and atelier (local)** | | | | |
| lutier reghin / atelier lutier reghin | local | [autocomplete ro] | H: the first suggestion for "lutier" | contact/local + about |
| atelier viori reghin / magazin viori reghin | local | [autocomplete ro] | H: a visitable workshop-shop | contact/local |
| reparatii viori reghin | local | [autocomplete ro] | M: only if they offer repairs | contact/services |
| lutier targu mures / lutier mures | local | [autocomplete ro] | H: nearest county seat | contact/local |
| lutier romania | commercial investigation | [autocomplete ro] | H: national search | about (makers) |
| lutier cluj (napoca) | local | [autocomplete ro] | M: nearest big city [estimate: Cluj is the largest city within reach of Reghin] | contact/local ("from Cluj") |
| lutier bucuresti / lutier vioara bucuresti | local | [autocomplete ro] | M: largest buyer pool; needs delivery messaging | delivery FAQ |
| lutier craiova / constanta / iasi / oradea / arad / alba iulia / moldova / lutier vioara iasi | local | [autocomplete ro] | L: shows national spread | delivery FAQ |
| lutier ce inseamna / ce este lutier / lutier dex / lutier etimologie | informational | [autocomplete ro] | M: definition queries that answer engines field | about / FAQ |
| simon luthier | navigational | [autocomplete ro] (under "lutier s") | H: brand, but shared with Simon Joseph (Jonaco) | home / about |
| vasile mare lutier / alexandru ozon lutier / silvian rusu lutier / felix rotaru lutier / cornel ursu lutier / nicolae vadan lutier | navigational (other makers) | [autocomplete ro] | L to target: shows Romanians search luthiers by personal name | about (Paul and Ecaterina named clearly) |
| lutierie / lutierie reghin / atelier lutierie / meseria de lutier | n/a | [autocomplete ro: no suggestions] | L | copy only |
| **Music shops, Reghin and heritage** | | | | |
| instrumente muzicale reghin / magazin instrumente muzicale reghin | local | [autocomplete ro] | H: local purchase intent | contact/local |
| magazin instrumente muzicale tg mures / instrumente muzicale targu mures | local | [autocomplete ro] | M: first city suggested for "magazin instrumente muzicale"; mostly general music shops | contact/local |
| fabrica de viori reghin / fabrica viori reghin / fabrica de viori gliga reghin / fabrica instrumente muzicale reghin | navigational (competitor) | [autocomplete ro] | M: heritage page can rank on the history | Reghin heritage page |
| muzeu viori reghin | local / informational | [autocomplete ro] | M: visitor intent; link a workshop visit | Reghin heritage page |
| reghin orasul viorilor | informational | [autocomplete ro: echo only] | M: the city's own slogan | Reghin heritage page |
| gliga instrumente muzicale sa / gliga reghin viori / hora reghin magazin | navigational (competitor) | [autocomplete ro] | L | none |
| **Materials and craft** | | | | |
| lemn de rezonanta / molid de rezonanta / lemn pentru vioara | informational | [autocomplete ro: echo only] | M: Paul's tonewood work since 2001 is a rare authority signal | craft and materials page |
| lac pentru vioara / lac vioara | informational | [autocomplete ro: echo only] | L–M | craft page |
| **Price questions** | | | | |
| cat costa o vioara (buna / adevarata / pentru incepatori / pentru copii / veche) / cât costă o vioară | commercial investigation | [autocomplete ro] | H: the main Romanian question; they publish prices | buying guide "Cât costă o vioară / un violoncel bun?" |
| cat costa un violoncel | commercial investigation | [autocomplete ro: echo only] | H: direct price question; they publish prices | buying guide |
| cat costa un contrabas | commercial investigation | [autocomplete ro: echo only] | H | buying guide |

(65 rows)

---

## 4. Questions people ask

These are good targets for FAQ entries and answer-engine content (short, direct answers that AI tools and Google can quote). Each item is written as a question, and the **exact suggestion(s) Google returned** follow it in quotes.

### English (all [autocomplete us] unless marked)

1. How much does a cello cost to buy? (UK?) "how much does a cello cost to buy", "how much does a cello cost on average", "how much does a cello cost uk" [autocomplete us,gb]
2. How much does a good or professional double bass cost? "how much does a good double bass cost", "how much does a professional double bass cost"
3. How much does a student or used double bass cost? "how much does a student double bass cost", "how much does a used double bass cost"
4. Why are cellos so expensive? "why are cellos so expensive"
5. How much does a handmade violin cost? "handmade violin cost"
6. Handmade or factory-made violin? "handmade violin vs factory made violin"
7. Student or professional cello? "student cello vs professional cello"
8. How do you choose or buy a good cello? "how to choose a good cello", "how to buy a good cello"
9. Where is the best place to buy a cello online? "best place to buy cello online", "buying a cello online", "buying a cello reddit"
10. What size cello do I need as an adult? "what size cello do i need", "what size cello for adult", "what size cello should i buy"
11. What size double bass should I get? "what size double bass should i get", "what size is a 3 4 double bass", "double bass sizes explained"
12. Is a 3/4 bass or 7/8 cello different from full size? "3/4 upright bass vs full size", "7/8 cello vs full size"
13. Is an upright bass the same as a double bass? "is an upright bass the same as a double bass", "why is an upright bass called a double bass"
14. What is the difference between contrabass and double bass? "difference between contrabass and double bass", "contrabass vs double bass vs upright bass"
15. Are Romanian violins good? "are romanian violins good" (Romanian-IP caveat)
16. Which cello brand is best for advanced students? "best cello brands for advanced students", "best cello for advanced students", "which cello brand is best"
17. What wood is a cello made of? "what wood is cello made of", "cello wood types"
18. Oil or spirit varnish on a violin? "oil vs spirit varnish violin", "spirit varnish vs oil varnish violin"
19. What humidity does a cello need? "ideal cello humidity", "cello humidity level"
20. How do you care for a cello? "how to care for a cello", "how to look.after a cello" (typo as returned)
21. Gamba shape or violin shape double bass? "double bass gamba vs violin", "double bass gamba shape"
22. How much is the Davidov Stradivarius worth? "davidov stradivarius cello price", "davidov stradivarius cello value", "davidoff stradivarius worth"
23. What is the Goffriller cello model? "goffriller cello model", "goffriller cello dimensions"
24. Amati or Stradivarius violin? "amati violin vs stradivarius"
25. How is a 5-string double bass tuned? "5 string double bass tuning", "5 string double bass range", "5 string double bass low b", "5 string double bass high c"

### Romanian: question versions of real suggestions (all [autocomplete ro])

Romanian suggestions are almost never phrased as questions. Only the "cât costă" items below were typed as questions. The rest are question versions of noun queries, with the exact suggestion in quotes.

1. Cât costă o vioară bună / adevărată / pentru începători? "cat costa o vioara buna", "cât costă o vioară adevărată", "cat costa o vioara pentru incepatori", "cât costă o vioară pentru copii", "cat costa o vioara veche"
2. Cât costă un violoncel? "cat costa un violoncel" [echo only]
3. Cât costă un contrabas? "cat costa un contrabas" [echo only]
4. Cât costă o vioară Stradivarius și câte există? "cat costa o vioara stradivarius originala", "vioara stradivarius cate sunt in lume"
5. Există viori Stradivarius în România? "viori stradivarius in romania", "vioara stradivarius voicu", "vioara stradivarius tomescu"
6. Care e diferența dintre vioară și violă? "viola vs vioara", "diferenta vioara viola"
7. Violoncel sau contrabas: care e diferența? "violoncel vs contrabas", "contrabas vs violoncel"
8. Ce înseamnă lutier? "lutier ce inseamna", "ce este lutier", "lutier dex"
9. Cum se spune contrabas în engleză? "contrabas in engleza"
10. Viori sau vioare? "viori sau vioare"
11. Cum se evaluează o vioară veche? "evaluare vioara veche"
12. Ce vioară pentru un copil de 6, 7 sau 10 ani? "vioara copii 6 ani", "vioara copii 7 ani", "vioara copii 10 ani"

**Romanian "how" questions returned nothing:**
- "cum alegi o vioara", "cum aleg o vioara", "cum alegi un violoncel", "ce marime vioara", "ce marime violoncel", "ce vioara sa cumpar", "intretinere vioara" and "ingrijire vioara" all returned no suggestions `[autocomplete ro: no suggestions]`.
- Romanian searchers phrase needs as nouns plus a modifier ("vioara pret", "vioara copii 6 ani"), not as questions.

**Editorial FAQ ideas for Romanian** (not seen in autocomplete; tagged [estimate: these mirror the English questions and the RO noun queries above]):
- Ce înseamnă "instrument de maestru"? (links to "vioara maestru")
- Ce diferență e între o vioară de fabrică și una lucrată de lutier?
- Ce mărime de violoncel / contrabas pentru un adult?
- Cum aleg un violoncel bun?
- Cum se îngrijește un violoncel (umiditate, transport)?
- Pot vizita atelierul din Reghin și încerca instrumentul?
- Cum se face livrarea în București / Cluj / în străinătate?

---

## 5. Interest data (Wikipedia pageviews)

Source: Wikimedia REST API, `per-article/<lang>.wikipedia/all-access/user/<title>/monthly/20251001/20260930`, i.e. human readers only, October 2025 to September 2026, 12 months for every row `[wikipedia-pageviews]`. The raw file is kept in the research session's scratch folder (not committed).

**How to read it.**
- Pageviews measure interest in a topic, not search volume.
- Don't compare English and Romanian totals as market sizes. Many Romanians read English Wikipedia, so the gap mostly shows which Wikipedia people use.
- Title checks:
  - **"Davidoff Stradivarius" and "Gliga Musical Instruments" do not exist** on English Wikipedia.
  - **There is no Wikipedia article on Gliga the company** in either language. Romanian "Gliga" is a page listing people with that surname.
  - "Upright bass" (EN) and "Violin maker" (EN) are redirects to "Double bass" and "Luthier".

### English Wikipedia

| Article (exact title) | 12-month total | Monthly avg | Lowest month | Highest month |
|---|---|---|---|---|
| Double bass | 274,159 | 22,846 | 19,784 (Jul 26) | 26,579 (Oct 25) |
| Violin | 253,391 | 21,115 | 16,179 (Jul 26) | 30,742 (Nov 25) |
| Cello | 243,863 | 20,321 | 15,176 (Jul 26) | 31,711 (Nov 25) |
| Stradivarius | 237,730 | 19,810 | 13,721 (Aug 26) | 27,912 (Oct 25) |
| Viola | 160,168 | 13,347 | 10,636 (Jul 26) | 19,061 (Nov 25) |
| Luthier | 121,785 | 10,148 | 8,176 (Jul 26) | 13,249 (Aug 26) |
| Antonio Stradivari | 115,342 | 9,611 | 7,092 (Jul 26) | 11,650 (Oct 25) |
| Contrabass (the broad "very low-pitched instruments" article) | 22,831 | 1,902 | 1,639 | 2,268 |
| Davidov Stradivarius | 22,799 | 1,899 | 1,132 (Jul 26) | 3,272 (Jan 26) |
| Mureș County | 21,903 | 1,825 | 1,582 | 2,208 |
| Amati | 19,913 | 1,659 | 1,252 | 2,315 |
| Messiah Stradivarius | 19,453 | 1,621 | 1,170 | 3,366 (Jun 26) |
| Tonewood | 19,263 | 1,605 | 1,336 | 2,025 |
| Nicola Amati | 10,082 | 840 | 618 | 976 |
| Matteo Goffriller | 8,155 | 679 | 511 | 866 |
| Reghin | 6,786 | 565 | 489 | 641 |
| Violin making and maintenance | 2,986 | 248 | 206 | 361 |
| Panormo family | 1,308 | 109 | 84 | 156 |
| (Transylvania, for scale) | 580,218 | 48,351 | 39,232 | 87,139 (Oct 25) |

The "Upright bass" redirect had 8,950 hits in the same period. That counts only people who landed on the redirect URL, so it is not comparable with the rows above.

### Romanian Wikipedia

| Article (exact title) | 12-month total | Monthly avg | Lowest month | Highest month |
|---|---|---|---|---|
| Județul Mureș | 18,372 | 1,531 | 1,208 | 1,820 |
| **Reghin** | **13,317** | **1,109** | 973 | 1,339 (Aug 26) |
| Vioară | 7,808 | 650 | 195 (Aug 26) | 1,463 (Nov 25) |
| Stradivarius | 3,939 | 328 | 279 | 411 |
| Violă | 3,823 | 318 | 158 | 585 (Jan 26) |
| Violoncel | 2,983 | 248 | 115 (Sep 26) | 458 (Jan 26) |
| Instrument cu coarde | 2,883 | 240 | 127 | 416 |
| Contrabas | 2,715 | 226 | 115 (Jul 26) | 396 (Jan 26) |
| Antonio Stradivari | 2,708 | 225 | 102 | 316 |
| Lutier | 808 | 67 | 47 | 100 |
| Amati | 593 | 49 | 28 | 69 |
| Gliga (surname list, not the company) | 45 | 3 | 0 | 21 |

### Monthly shape of the Romanian instrument articles

| Article | Oct 25 | Nov 25 | Dec 25 | Jan 26 | Feb 26 | Mar 26 | Apr 26 | May 26 | Jun 26 | Jul 26 | Aug 26 | Sep 26 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Vioară | 1,192 | 1,463 | 663 | 1,006 | 684 | 647 | 455 | 630 | 402 | 202 | 195 | 269 |
| Violoncel | 331 | 395 | 237 | 458 | 276 | 285 | 220 | 274 | 141 | 123 | 128 | 115 |
| Violă | 495 | 392 | 370 | 585 | 361 | 298 | 273 | 332 | 201 | 158 | 165 | 193 |
| Contrabas | 298 | 327 | 290 | 396 | 223 | 234 | 210 | 208 | 155 | 115 | 140 | 119 |
| Reghin | 1,310 | 1,098 | 1,115 | 1,082 | 979 | 973 | 1,063 | 1,185 | 993 | 1,136 | 1,339 | 1,044 |

**What this suggests:**
- **Reghin is the only topic here where Romanian Wikipedia beats English** (13,317 vs 6,786). The town is mainly a Romanian-language interest. A Romanian Reghin heritage page has a natural audience.
- **The Romanian instrument articles follow the school year.** They peak in October–January and fall by about 70–87% by July–September (Vioară: 1,463 in November vs 195 in August; Violoncel: 458 in January vs 115 in September). The English articles dip in summer too, but less: Cello fell from 31,711 to 15,176. This points to publishing and promoting Romanian content before the autumn term `[estimate: the pattern looks student-driven]`.
- **Model articles have steady readership:** Davidov Stradivarius about 1,900/month, Messiah about 1,600/month, Goffriller about 680/month. A model page that explains the original instrument and offers a copy has a real, stable audience.

---

## 6. Recommendations

### First 5 pages for English

1. **"Handmade cellos for sale"** (category /en/cellos).
   - Targets: handmade cello for sale and price, 4/4 / full-size cello for sale, European / Romanian cello for sale, professional cello price.
   - Show the price on every card. Add a delivery block naming the UK, Ireland and the EU (see where buyers are, below).
2. **"Handmade double basses for sale (upright basses)"** (category /en/double-basses).
   - Both names go in the title and H1 (the page's main heading).
   - Add filters or sections for 3/4, 5-string, and gamba vs violin shape.
   - Targets: double bass for sale uk / ireland, upright bass for sale, 3/4 double bass for sale, 5 string double bass for sale, romanian double bass makers.
3. **Buying guide: "How much does a handmade cello (or double bass) cost, and why?"**
   - Answers: how much does a cello cost, why are cellos so expensive, handmade vs factory, student vs professional, how to choose a good cello, buying a cello online.
   - Explain the reservation flow, sizes, and how to try the instrument (visit or delivery).
   - This is the main answer-engine page. Use short, quotable answers with real euro figures.
4. **Model pages, starting with "Stradivari 'Davidov' 1712 model cello" and "Goffriller model cello"**, then "Gamba-shape double bass", "Panormo model double bass", "Stradivari 'Messiah' violin", "Amati model violin".
   - Each page explains the original instrument, what the copy keeps, and the instruments in stock.
   - Spell it "Davidov (also Davidoff)" and include "1712".
5. **"Romanian luthiers from Reghin: Paul & Ecaterina Simon"** (about plus Reghin heritage).
   - Answers: are Romanian violins good, romanian cello / violin / double bass makers, reghin romania cello. These origin queries carry the Romanian-IP caveat, but the page is needed anyway for the name problem below.
   - Make the name clear: not the singer, and a different workshop from Simon Joseph / Jonaco.
   - Use the exact brand string "Simon Musical Instruments", which already exists as a suggestion.

Next after these: an FAQ hub (double bass vs upright bass vs contrabass, sizes, humidity, varnish) and a care guide.

### First 5 pages for Romanian

1. **"Atelier de lutier în Reghin (Mureș)"** (contact/local page).
   - Address, hours, how to visit and try instruments, directions from Târgu Mureș and Cluj.
   - Targets: lutier reghin, atelier lutier reghin, atelier viori reghin, magazin viori reghin, instrumente muzicale reghin, lutier targu mures / mures.
   - Pair it with a Google Business Profile (the free business listing shown on Google Maps) that uses the same name as the site. The local "map pack" (the block of map listings Google shows for local searches) is built from those profiles `[estimate: standard local SEO]`.
2. **"Violoncele de maestru, lucrate manual în Reghin: preț"** (category /ro/violoncele).
   - Targets: violoncel pret, violoncel reghin pret, violoncel de vanzare, violoncel 4/4, violoncel profesional.
3. **"Contrabași lucrați manual: preț"** (category /ro/contrabasi).
   - Targets: contrabas pret, contrabas de vanzare, contrabas reghin, contrabas 3/4 and 4/4, contrabas 5 corzi.
4. **Buying guide: "Cât costă o vioară, un violoncel sau un contrabas bun? Ce înseamnă «de maestru»"**.
   - Targets: cat costa o vioara buna / adevarata, cat costa un violoncel / contrabas, vioara maestru, vioara profesionala, pret vioara reghin, plus the "fabrică vs atelier" comparison (Gliga, Hora) stated factually.
5. **"Viori de maestru din Reghin"** (category /ro/viori), even with only 3 violins, and with a commission offer.
   - Romanian violin demand is the broadest: "vioara" has the richest suggestion lists, and Vioară has the most Romanian Wikipedia reads of the four instruments (7,808 vs 2,983 for Violoncel).
   - Targets: vioara pret, vioara de vanzare (reghin), viori reghin pret, vioara maestru de vanzare, vioara stradivarius copie pret.

Next after these: a **"Reghin, orașul viorilor"** heritage page (fabrica de viori reghin, muzeu viori reghin, reghin orasul viorilor), and a materials page on **lemn de rezonanță** built around Paul's tonewood work since 2001.

### Where buyers are (evidence only)

- **UK and Ireland are explicit English markets:**
  - "double bass for sale uk / ireland / london"
  - "cello for sale uk / ireland"
  - "buy cello uk", "5 string double bass for sale uk", "7/8 cello for sale uk"
  - In `gl=ie`, "ireland" came first for cello, double bass and violin, plus "violin for sale dublin" `[autocomplete us,gb,ie]`.
- **North America uses "upright bass":**
  - City suggestions: Nashville, Los Angeles, Toronto, Seattle (upright bass); NYC and Vancouver (cello luthier) `[autocomplete us,gb]`.
  - Shipping a double bass across the Atlantic is costly and risky `[estimate]`, so these are better targets for cellos and violins than for basses.
- **Australia, New Zealand and South Africa** show up for both cello and double bass ("melbourne", "sydney", "nz", "south africa", "cape town") `[autocomplete us,gb]`.
- **India, Nigeria, Kenya, the Philippines, Sri Lanka and Pakistan** appear only in "cello price in …" and "double bass price in …" queries `[autocomplete us,gb]`. Treat these as price-sensitive markets, not targets.
- **English buyers want to see or try before they buy.**
  - "near me", "nearby", "used", "facebook marketplace", "craigslist" and "ebay" fill the "for sale" suggestions `[autocomplete us,gb,ie]`.
  - The site should answer the remote-buyer worries up front: how to try, delivery insurance, returns, visiting the atelier.
- **Romanian luthier searches cover the whole country:**
  - Cities paired with "lutier": București, Cluj(-Napoca), Craiova, Constanța, Iași, Oradea, Arad, Alba Iulia, Târgu Mureș, Moldova.
  - Cities paired with "magazin instrumente muzicale": **Tg Mureș first**, then București, Cluj, Suceava, Timișoara, Brașov, Sfântu Gheorghe, Iași, Sibiu, Ploiești.
  - Also "vioara de vanzare oradea" and "vioara olx bucuresti" `[autocomplete ro]`.
- **The Republic of Moldova** appears in Romanian price queries: "vioara pret md", "vioara pret moldova", "lutier moldova" `[autocomplete ro]`. It is a possible Romanian-language market.
- **Dutch** queries for "contrabas 3 4 kopen" appeared even with Romanian settings `[autocomplete ro]`. This is a hint for the NL locale, outside this file's scope.
- **Romanian-made cellos already sell abroad through dealers**: Gliga through Australian shops, Calin Wultur (a Reghin workshop) through Evergreen Violin, Luthier Vidal's own shop, and Alexandru Ozon through Fiddlershop `[websearch, unverified snippet]`. "Romanian-made" is an established category for foreign buyers.
