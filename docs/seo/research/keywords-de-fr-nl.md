# Keyword and search-intent research: German, French, Dutch

Research date: 2026-10-24. Scope: German for Germany, Austria and Switzerland; French for France,
Belgium and Switzerland; Dutch for the Netherlands and Belgium.

## How to read this file

No paid SEO tool was used, so this file has no search volumes. The evidence comes from two free
sources.

- **Google autocomplete.** These are the suggestions Google shows while someone types. Google only
  suggests a phrase that enough people type, so a suggestion proves real demand. It does not say how
  much. I made 247 calls, each with a language setting `hl` and a country setting `gl`.
- **Wikipedia pageviews.** These are real monthly human views of an article, from October 2025 to
  September 2026. They show how much a topic interests each language community. They are not search
  volumes.

Evidence tags used in the tables:

| Tag | Meaning |
|---|---|
| `[autocomplete de/de: seed, +9]` | I typed this phrase with hl=de, gl=de. Google returned it plus 9 longer variants. Many variants means many people type phrases that start this way |
| `[autocomplete de/de: echo]` | Google returned only the phrase itself. It is a real query, but too rare to have variants. Treat it as a small, very specific query |
| `[autocomplete de/de: empty]` | Google returned nothing. Too rare to suggest, or not a phrase people use |
| `[autocomplete de/de: via "X"]` | The keyword appeared as a suggestion while I typed X |
| `[autocomplete de/de, at, ch: ...]` | Same result in all the listed country settings |
| `[wikipedia-pageviews]` | Wikimedia pageview API, user traffic only |
| `[site-facts]` | From the shared business context file or the repo's `CLAUDE.md`, not from search data |
| `[estimate: reason]` | My judgement, with the reason given |

Two warnings about autocomplete.

1. The order of suggestions is not a volume ranking. Google mixes in freshness and personalisation.
2. The country setting changed very little. The at, ch and be lists were near-copies of the de, fr
   and nl lists. The nl/be list for `contrabas kopen` even suggested the Dutch cities Almere and
   Amsterdam. Only the items that differ are quoted below as country evidence.

SEO terms used here:

- **Search intent** is what the searcher wants to do: learn, compare, buy, find a shop nearby, or
  reach a specific site.
- **Long-tail** queries are longer and more specific. Each one gets few searches, but the searcher
  knows what they want.
- A **category page** lists every instrument of one type, such as all cellos.
- **Answer engines** are AI search tools like ChatGPT, Perplexity and Google's AI Overviews. They
  answer the question directly and cite a few source pages.

Raw data lives in a local scratch folder (not committed). `ac.jsonl`
holds the autocomplete results. `wiki-pageviews.json` in the same folder holds the pageviews.

## 1. Summary

- **People in all three languages ask what a maker-built instrument costs, and Simon publishes its
  prices.** German: `was kostet ein cello von geigenbauer`, `was kostet ein handgefertigter
  kontrabass`. French: `prix d'un violoncelle de luthier`, `prix contrebasse luthier`. Dutch: `wat
  kost een contrabas handgemaakt`. All are [autocomplete] suggestions Google offered on its own. The
  site's real range of EUR 1,700 to 7,500 [site-facts] answers them directly. A price guide per
  language, linked to the category pages, is the biggest single opportunity [estimate: answer
  engines tend to cite pages that state a number directly].
- **Each language says "handmade" differently. The obvious translation fails in two of them.**
  German uses `Meister-` and `vom Geigenbauer`: `meistercello kaufen` and `meistercello preis` expand
  in de, at and ch. `cello handgefertigt`, `cello handgemacht` and `handgemachtes cello` are all
  empty. French uses `de luthier`; `violoncelle fait main` is empty. Dutch does use `handgemaakt`:
  `handgemaakte cello`, `handgemaakte viool kopen`, `prijs contrabas handgemaakt`. Page titles must
  use these words, not a DeepL translation of "handmade".
- **The double bass is the clearest niche.** The question "3/4 or 4/4?" appears in all three
  languages: `kontrabass 3 4 oder 4 4`, `contrebasse 3/4 ou 4/4`, `contrabas 3 4 of 4 4`. German
  also has `kontrabass gambenform` and `kontrabass violinform`, the two body shapes, and `kontrabass
  5 saiter`. Dutch has `contrabas kopen waar op letten`, which means "buying a double bass, what to
  look for". Simon has 6 basses including Gamba models and one 5-string [site-facts].
- **Romania, Reghin and Transylvania bring trust, not traffic.** Every buyer-intent Romania query is
  echo-only or empty: `rumänische geigenbauer`, `luthier roumain`, `violoncelle roumain`, `viool
  roemenië`. The few Romania queries that do expand drift away from buying. `rumänische geige` gives
  a female violinist and a composer, `violon roumain` gives folk fiddling, `roemeense viool` gives
  Bartók. Every Transylvania query I typed was empty. Model names are weak too. Goffriller is the
  only model with price queries in German and French. Stradivari, Amati and "Messiah" queries are
  mostly about the famous originals or the value of old violins. `panormo` alone returns beaches in
  Crete. A Reghin heritage page is still worth building for credibility and AI citations. German
  readers view de:Reghin 318 times in a median month, against 49 for French and 23 for Dutch
  [wikipedia-pageviews].
- **The three markets differ in size and in how qualified they look.** For cello and double bass,
  German Wikipedia gets about twice the French views and six times the Dutch. de:Violoncello has a
  5,274 median month, fr:Violoncelle 2,612 and nl:Cello 838 [wikipedia-pageviews]. Violin is close
  to even, de:Violine 5,428 against fr:Violon 4,765. French suggestions pull in Québec terms like
  `à vendre` with Montréal, `usagé` and `roulotte`, a camper trailer. They also pull in `prix
  tunisie`, `prix maroc` and `prix algérie`. Much of that audience is far from the buyer countries
  named on the site [estimate: from suggestion content], and whether they would buy is unknown. Some
  Dutch suggestions switch to English: `cello 4/4` returns "hard case", "for sale" and
  "dimensions", and `stradivarius cello` returns only English. Dutch buyers may already be using the
  English pages.

## 2. Terminology

### German

| Concept | What people type | Evidence | Trap or note |
|---|---|---|---|
| Cello | `cello` | [autocomplete de/de, at, ch: seed "cello ", +10] | Wikipedia's title is "Violoncello", but every suggestion I saw says "cello". `cello udo lindenberg` is a pop song. `cello stradivari premiere speakers` is a loudspeaker line |
| Violin | `geige` and `violine`, both common | [autocomplete de/de: "geige kaufen" +9, "violine kaufen" +9] | Geige is the everyday word and Violine the formal one. Use both on the violin page |
| Viola | `bratsche` | [autocomplete de/de, at, ch: "bratsche kaufen" +9] | `viola kaufen` returns violet plants, olive oil, cheese and Haribo. `bratsche rätsel` and `bratsche 5 buchstaben` are crossword lookups |
| Double bass | `kontrabass` | [autocomplete de/de: seed, +10] | It also brings up `kontrabass saxophon`, `kontrabass klarinette` and `kontrabass querflöte`, which are wind instruments |
| 5-string bass | `kontrabass 5 saiter` | [autocomplete de/de: seed, +2]; `5 saitiger kontrabass` echo; `fünfsaitiger kontrabass` empty | Write "5-Saiter" |
| Bass body shape | `gambenform`, `violinform` | [autocomplete de/de: seed, +1 each] | Gamba-shaped versus violin-shaped. Simon builds Gamba models [site-facts] |
| Master-made | `meister-` prefix: `meistercello`, `meistergeige`, `meisterbratsche` | [autocomplete de/de, at, ch: "meistercello" +3]; "meistergeige" +9; "meisterbratsche" +1 | `meisterkontrabass` is empty and `meister kontrabass` only gives a brand, Rubner. For basses use "vom Geigenbauer" or "handgefertigt" |
| From a maker | `vom geigenbauer`, `geigenbauer cello` | [autocomplete de/de: "geigenbauer cello" +3, "cello vom geigenbauer" +2] | Geigenbauer means violin maker but covers all bowed instruments |
| Handmade | `handgemacht` for violins only; `handgefertigt` for basses only | [autocomplete de/de: "handgemachte geige" +2; "was kostet ein handgefertigter kontrabass" via "was kostet ein kontrabass"] | Every "handmade cello" form is empty |
| Sizes | `4/4`, `7/8`, `3/4`, also typed as `4 4`, `3 4`; `größe`, `größentabelle`, `körpergröße` | [autocomplete de/de: "cello 4/4" +9, "cello größe" +9] | Use both spellings on pages, "4/4" and "4 4" |
| Price | `preis`, `was kostet`, `wie viel kostet` | [autocomplete de/de, at, ch: +9 each] | |
| Used, rent | `gebraucht`, `mieten`, `willhaben` in Austria | [autocomplete de/de, at] | Not Simon's offer |
| Materials | `tonholz`, `fichte`, `spirituslack`, `öllack` | [autocomplete de/de: "tonholz" +9, "spirituslack" +3, "öllack geige" echo] | Tonewood queries are mostly guitar builders |
| Reghin | `reghin`, `sächsisch regen` | [autocomplete de/de: "sächsisch-regen" returned 7 suggestions; 3 are about the town, the rest are Saxon-dialect jokes about rain]; German name confirmed in the de.wikipedia intro | Reghin's nickname "Stadt der Geigen", city of violins, is also typed: [autocomplete de/de: "stadt der geigen" +4] |

### French

| Concept | What people type | Evidence | Trap or note |
|---|---|---|---|
| Cello | `violoncelle` | [autocomplete fr/fr, be, ch: seed, +10] | `cello d occasion` also appears |
| Violin | `violon` | [autocomplete fr/fr, be, ch: seed, +10] | `violon d'ingres` is an idiom for "hobby". `violon simple 5 lettres` is a crossword lookup |
| Viola | `alto`, but usually paired: `alto violon`, `violon alto`, `alto instrument à cordes` | [autocomplete fr/fr: "alto violon" +9; "violon alto" via "violon " in fr, be, ch] | The biggest trap of the three languages. Searches starting with `alto` return saxophones, brass "alto cuivre", the Suzuki Alto car, Alto Adige and Québec `roulotte alto` trailers. Wikipedia's article is "Alto (instrument à cordes)"; "Alto (instrument)" does not exist |
| Double bass | `contrebasse` | [autocomplete fr/fr, be, ch: seed, +10] | `basse 5 cordes` is the electric bass guitar. `contrebasse électrique` and `contrebasse à vent` are other instruments |
| 5-string bass | `contrebasse 5 cordes` | [autocomplete fr/fr: seed, +9, half are electric bass] | `contrebasse 5 cordes accordage`, the tuning, is a useful FAQ |
| Maker-built | `de luthier`, `luthier` | [autocomplete fr/fr: "violoncelle de luthier" +3, "violon de luthier" +3, "prix contrebasse luthier" via "contrebasse prix"] | Bare `luthier` leans to guitars: `luthier guitare` |
| Handmade | `fait main` for violins only | [autocomplete fr/fr: "violon fait main" +1; "violoncelle fait main" empty] | Use "de luthier" for cellos and basses |
| The craft | `lutherie` | [wikipedia-pageviews: fr:Lutherie median 294] | Used for wood and varnish: `bois de lutherie`, `vernis alcool lutherie` |
| Sizes | `4/4`, `7/8`, `3/4`, `1/2`, `1/4`; `taille`, `en cm`, `adulte` | [autocomplete fr/fr: "taille violoncelle" +9] | |
| Level | `d'étude` for student, `professionnel`, `de concert` | [autocomplete fr/fr: "violoncelle d'étude" +4, "violoncelle professionnel" +2] | |
| New, used | `neuf`; `occasion`, `d'occasion`, `usagé` in Québec | [autocomplete fr/fr] | |
| For sale | `à vendre` | [autocomplete fr/fr: "violoncelle à vendre" +7, mostly Québec and Montréal] | Leans Canadian |

### Dutch

| Concept | What people type | Evidence | Trap or note |
|---|---|---|---|
| Cello | `cello` | [autocomplete nl/nl, be: seed, +10] | `cello zorg`, `cello vacatures` and `cello rosmalen` point to a Dutch care organisation called Cello [estimate: from those suggestions]. `cello biennale` is a festival |
| Violin | `viool` | [autocomplete nl/nl, be: seed, +10] | `viool bloem` is the flower |
| Viola | `altviool` | [autocomplete nl/nl, be: seed, +10] | Clean term, no ambiguity seen |
| Double bass | `contrabas`, one word, with a c | [autocomplete nl/nl, be: seed, +10] | `contrabas saxofoon`, `contrabas dwarsfluit` and `elektrische contrabas` are other instruments |
| 5-string bass | `5 snarige contrabas`, `contrabas 5 snaren` | [autocomplete nl/nl: echo for both] | Rare |
| Maker | `vioolbouwer` for all bowed instruments | [autocomplete nl/nl: "cellobouwer" and "vioolmaker" both turn into vioolbouwer suggestions] | Every `vioolbouwer` suggestion is a city or a crossword clue |
| Handmade | `handgemaakt`, `handgemaakte` | [autocomplete nl/nl: "handgemaakte cello" echo; "handgemaakte viool kopen"; "wat kost een contrabas handgemaakt"] | The only one of the three languages where the literal "handmade" works |
| Sizes | `4/4`, `4 4`, `3 4`, `maat` | [autocomplete nl/nl: "cello maat" +3, "welke cello" +8] | `cello 4/4` returns English suggestions |
| Price | `prijs`, `wat kost een`, `hoeveel kost een` | [autocomplete nl/nl: "wat kost een cello" +7] | |
| Used, rent, for sale | `tweedehands`, `2e hands`, `marktplaats`; `huren`; `te koop` | [autocomplete nl/nl, be] | |
| String instruments | `strijkinstrumenten` | [autocomplete nl/nl: seed, +7] | `strijkinstrumentenshop` is a competitor shop name |

## 3. Keyword map

Target page types follow the lead's list: home, category page, product page, model page, buying
guide, care guide, FAQ, Reghin heritage page, contact. "Buying guide on price" means a buying guide
about cost, and "buying guide, materials" one about wood and varnish.

Priority rules. **H** means a strong fit with Simon's stock, real demand with variants, and intent
close to buying. **M** means it fits, but the query is small, the stock is thin, or intent is mixed.
**L** means the intent does not match, for example renting, buying used, beginners, local shops or
marketplaces, or there is no evidence of demand. The L rows stay in the table so nobody spends time
on them later.

Intent labels:

- **Transactional** means ready to buy.
- **Commercial investigation** means comparing before buying.
- **Informational** means wants to learn.
- **Local** means wants a shop nearby.
- **Navigational** means looking for a specific brand or site.

### German

| Keyword | Intent | Evidence | Priority and why | Target page |
|---|---|---|---|---|
| **Cellos, buying** | | | | |
| `cello kaufen` · *buy a cello* | transactional | [autocomplete de/de, at, ch: seed, +9] | H. Core term; 11 cellos in stock [site-facts]; most variants are cities or "used" | category page /cellos |
| `cello kaufen 4/4`, `cello 4/4 kaufen` | transactional | [autocomplete de/de: via "cello kaufen" and "cello 4/4"] | H. Full size is what adults buy | category page /cellos |
| `meistercello kaufen` · *buy a master-made cello* | transactional | [autocomplete de/de, at, ch: via "meistercello"] | H. Exact German word for what Simon sells | category page /cellos, in the title |
| `meistercello preis` | commercial investigation | [autocomplete de/de, at, ch: via "meistercello"] | H. Simon shows real prices [site-facts] | category page + buying guide on price |
| `geigenbauer cello kaufen` · *buy a cello from a violin maker* | transactional | [autocomplete de/de: via "geigenbauer cello"] | H. Names the seller type | category page /cellos |
| `cello geigenbauer preis`, `preis cello geigenbauer` | commercial investigation | [autocomplete de/de: via "geigenbauer cello", "cello vom geigenbauer", "cello preis"] | H. Three different seeds led here | buying guide on price |
| `cello preis neu`, `wie viel kostet ein neues cello` · *new* | commercial investigation | [autocomplete de/de: via "cello preis", "wie viel kostet ein cello"] | H. Simon sells only new instruments | buying guide on price |
| `cello online kaufen`, `cello kaufen online` | transactional | [autocomplete de/de: via "cello online"; echo] | M. Small, but remote buying is how foreign customers buy | category page + FAQ on delivery |
| `cello für fortgeschrittene` · *for advanced players* | commercial investigation | [autocomplete de/de: seed, +1, about sheet music] | M. Right buyer, tiny query | category page copy |
| `cello handgefertigt`, `cello handgemacht`, `handgemachtes cello` | none | [autocomplete de/de: empty, all three] | L. Nobody types it; use Meister or Geigenbauer | body text only |
| **Cello price questions** | | | | |
| `was kostet ein cello`, `wie viel kostet ein cello` · *what does a cello cost* | informational | [autocomplete de/de, at, ch: seed, +9 each] | H. Largest question cluster in the German data | buying guide on price "Was kostet ein Cello?" |
| `was kostet ein cello von geigenbauer` | commercial investigation | [autocomplete de/de, at, ch: via "was kostet ein cello"] | H. Exact match for the workshop | buying guide on price, links to /cellos |
| `was kostet ein gutes cello`, `wie viel kostet ein gutes cello` · *a good cello* | commercial investigation | [autocomplete de/de: via both price seeds] | H. The "good cello" buyer is Simon's buyer | buying guide on price |
| `was kostet ein cello für erwachsene` · *for adults* | commercial investigation | [autocomplete de/de, at, ch: via "was kostet ein cello"] | M. Adult means 4/4 | buying guide on price |
| `cello preis durchschnitt`, `wie viel kostet ein cello im durchschnitt` · *on average* | informational | [autocomplete de/de: via price seeds] | M. Wants one number; answer engines like this format | buying guide on price |
| `was kostet ein cello von stradivari`, `stradivari cello preis` | informational | [autocomplete de/de, at, ch: via price seeds] | L. Curiosity about the originals | model page, one paragraph |
| `cello preis für anfänger`, `was kostet ein cello für kinder` | informational | [autocomplete de/de: via price seeds] | L. Beginners and children start cheaper [estimate: Simon's lowest price is EUR 1,700, site-facts] | none |
| **Double bass** | | | | |
| `kontrabass kaufen` | transactional | [autocomplete de/de, at, ch: seed, +9] | H. 6 basses in stock [site-facts] | category page /double-basses |
| `kontrabass kaufen neu` · *new* | transactional | [autocomplete de/de, at, ch: via "kontrabass kaufen"] | H. New is all Simon sells | category page |
| `kontrabass 3/4 kaufen`, `kontrabass 3 4 kaufen` | transactional | [autocomplete de/de: via "kontrabass 3/4"] | H. People type both spellings; 3/4 is the usual size for adult players [estimate: general knowledge] | category page, size filter |
| `kontrabass 4 4 kaufen` | transactional | [autocomplete de/de: via "kontrabass 4/4"] | M. Full size is less common than 3/4 [estimate: general knowledge]; check which sizes the 6 basses are | category page |
| `kontrabass 3 4 oder 4 4`, `kontrabass unterschied 3 4 4 4` · *difference* | informational | [autocomplete de/de: via "kontrabass 4/4"] | H. Same question in FR and NL | buying guide, bass sizes |
| `kontrabass 3 4 maße`, `kontrabass 3 4 gewicht`, `4 4 kontrabass mensur` · *dimensions, weight, string length* | informational | [autocomplete de/de: via size seeds] | M. Belongs in a spec table on every bass page | product page |
| `was kostet ein handgefertigter kontrabass` · *a handmade bass* | commercial investigation | [autocomplete de/de: via "was kostet ein kontrabass"] | H. Exact fit; the one German query that uses "handgefertigt" | buying guide on price, basses |
| `was kostet ein guter kontrabass`, `ein neuer`, `ein profi kontrabass` · *good, new, pro* | commercial investigation | [autocomplete de/de: via "was kostet ein kontrabass"] | H. Same cluster | buying guide on price, basses |
| `kontrabass preis durchschnitt`, `konzert kontrabass preis` | commercial investigation | [autocomplete de/de: via "kontrabass preis"] | M. | buying guide on price, basses |
| `pöllmann kontrabass preis`, `wilfer kontrabass preis`, `was kostet ein kontrabass aus markneukirchen` | commercial investigation | [autocomplete de/de: via "kontrabass preis", "was kostet ein kontrabass"] | M. Buyers compare named German makers and Markneukirchen, a German instrument-making town [estimate: general knowledge] | buying guide on price, a factual comparison |
| `kontrabass 5 saiter`, `kontrabass 5 saiter kaufen`, `kontrabass 5 saiter stimmung` · *tuning* | commercial investigation | [autocomplete de/de: seed, +2] | M. One 5-string in stock | product page + tuning FAQ |
| `kontrabass gambenform`, `kontrabass violinform` | informational | [autocomplete de/de: seed, +1 each] | M. Explains the Gamba models | model page or buying guide, basses |
| `kontrabass gebraucht kaufen worauf achten` · *used, what to look for* | informational | [autocomplete de/de: Google turned "kontrabass kaufen worauf achten" into this] | M. Checklist content also helps new-bass buyers | buying guide, basses |
| `panormo kontrabass` | none | [autocomplete de/de: empty]; bare `panormo` returns Crete | L. No demand for the model name | model page body text |
| **Viola** | | | | |
| `bratsche kaufen` · *buy a viola* | transactional | [autocomplete de/de, at, ch: seed, +9] | M. Real demand, but no violas listed [site-facts] | category page /violas, or contact for a commission |
| `meisterbratsche kaufen` | transactional | [autocomplete de/de: via "meisterbratsche"] | M. Same Meister pattern | category page /violas |
| `bratsche größe`, `bratsche größentabelle`, `bratsche welche größe` | informational | [autocomplete de/de: seed, +8] | M. Viola sizing confuses people | buying guide, sizes |
| `bratsche preis`, `gute bratsche preis` | commercial investigation | [autocomplete de/de: seed, +3] | M. | buying guide on price |
| `viola kaufen` | none | [autocomplete de/de: seed, +9, flowers, oil, cheese] | L. Wrong word in German | none |
| **Violin** | | | | |
| `geige kaufen`, `violine kaufen` | transactional | [autocomplete de/de, at, ch: seed, +9 each] | M. Large, but beginner and child heavy; only 3 violins in stock | category page /violins |
| `meistergeige kaufen`, `meistergeige preis` | transactional | [autocomplete de/de: via "meistergeige"] | M. Right buyer, small stock | category page /violins |
| `handgemachte geige kaufen`, `handgemachte geige preis` | transactional | [autocomplete de/de: seed, +2] | M. "Handgemacht" works for violins | category page /violins |
| `was kostet eine geige vom geigenbauer` | commercial investigation | [autocomplete de/de: via "was kostet eine geige"] | M. | buying guide on price |
| `meistergeige erkennen`, `amati geige wert`, `stradivari messias wert` · *recognise, value* | informational | [autocomplete de/de: via model seeds] | L. Owners valuing old violins, not buyers | none |
| **Models** | | | | |
| `goffriller cello`, `goffriller cello preis` | commercial investigation | [autocomplete de/de: via "goffriller", the top suggestion; also via "cello preis"] | H. Only model with price queries in DE and FR, though partly about the originals | model page "Cello nach Goffriller" |
| `cello stradivari`, `cello stradivari kaufen` | commercial investigation | [autocomplete de/de: seed, +9] | M. Half the suggestions are the loudspeakers | model page, Stradivari "Davidoff" |
| `davidoff stradivari cello` | informational | [autocomplete de/de: via "davidoff stradivari", mostly English] | M. Simon copies this model; people search it in English | model page |
| `stradivari kopie`, `stradivari geige kopie`, `amati geige kaufen` | mixed | [autocomplete de/de: "stradivari kopie" seed, +1; "amati geige kaufen" via "amati geige"] | L. Mostly owners of factory copies or interest in originals [estimate: same pattern as the French label queries] | model page body |
| **Origin and heritage** | | | | |
| `rumänische geigenbauer` · *Romanian violin makers* | commercial investigation | [autocomplete de/de: echo; also via "rumänische geige"] | M. Google offers it unprompted; tiny | Reghin heritage page |
| `geigenbauer rumänien`, `geigenbau rumänien`, `cello aus rumänien`, `geige rumänien` | commercial investigation | [autocomplete de/de: echo, all four] | M. Exact fit, very low volume | Reghin heritage page |
| `reghin geige`, `reghin geigenbau` | informational | [autocomplete de/de: seed, +1] | M. | Reghin heritage page |
| `stadt der geigen`, `stadt der geigenbauer` · *city of violins / violin makers* | informational | [autocomplete de/de: seed, +4, with Cremona, Italy, Germany] | M. Reghin is called "Stadt der Geigen" per de.wikipedia | Reghin heritage page title |
| `sächsisch regen` | informational | [autocomplete de/de: +2 town variants, "rumänien" and "siebenbürgen"] | L. German name of Reghin; mention once | Reghin heritage page |
| `geigenbauer cremona`, `geigenbauer mittenwald`, `geigenbauer italien` | navigational | [autocomplete de/de, at: via "geigenbauer "] | L. Shows Germans think in origin towns | Reghin heritage page, comparison paragraph |
| `gliga geige` | navigational | [autocomplete de/de: via "gliga", below Pokémon "gligar"] | L. Competitor brand from Reghin | none |
| `geigenbauer siebenbürgen`, `geige siebenbürgen` · *Transylvania* | none | [autocomplete de/de: empty] | L. Not a search term | body text |
| **Guides and materials** | | | | |
| `cello kaufen worauf achten` · *what to look for* | informational | [autocomplete de/de: echo] | H. Typical answer-engine question | buying guide |
| `wie erkenne ich ein gutes cello` · *how to recognise a good cello* | informational | [autocomplete de/de: echo] | H. Same | buying guide |
| `welches cello kaufen`, `welches cello für welche größe` | informational | [autocomplete de/de: via "welches cello"] | M. Other variants ask which cello famous players use | buying guide |
| `cello größe`, `cello größentabelle`, `cello größe körpergröße`, `cello 7 8 oder 4 4` | informational | [autocomplete de/de: seed, +9; via "cello 7/8"] | M. Size chart | buying guide, sizes |
| `cello holz`, `cello welches holz`, `cello holzarten` · *which wood* | informational | [autocomplete de/de: seed, +9] | M. Paul has prepared tonewood since 2001 [site-facts] | buying guide, materials |
| `tonholz`, `tonholz fichte`, `tonholz geige`, `spirituslack geige`, `öllack geige` · *tonewood, spruce, spirit varnish, oil varnish* | informational | [autocomplete de/de: "tonholz" seed, +9; "spirituslack geige" via "spirituslack"; "öllack geige" echo] | L. Tonewood is mostly guitar builders; varnish is small but fits the workshop story | buying guide, materials |
| **Local, rental, used, marketplaces** | | | | |
| `cello kaufen in der nähe`, `geigenbauer in der nähe`, `cello kaufen berlin`, `wien`, `salzburg`, `schweiz` · *near me* | local | [autocomplete de/de, at, ch] | L. Wants a shop nearby | contact, mention visits |
| `cello mieten`, `meistercello mieten`, `cello mieten kosten` · *rent* | transactional | [autocomplete de/de, at, ch] | L. No rental offer in the site facts | none |
| `cello gebraucht kaufen`, `kontrabass kaufen gebraucht`, `geige kaufen willhaben`, `kontrabass kaufen ebay kleinanzeigen`, `thomann kontrabass 3 4` | transactional, navigational | [autocomplete de/de, at] | L. Used market, marketplaces and retailers | none |

### French

| Keyword | Intent | Evidence | Priority and why | Target page |
|---|---|---|---|---|
| **Cellos, buying** | | | | |
| `acheter violoncelle`, `achat violoncelle` | transactional | [autocomplete fr/fr, be, ch: seed, +9] | H. Core term | category page /cellos |
| `achat violoncelle luthier` | transactional | [autocomplete fr/fr, be, ch: via "acheter violoncelle"] | H. Exact fit | category page /cellos |
| `violoncelle de luthier`, `violoncelle luthier prix`, `prix d'un violoncelle de luthier` | commercial investigation | [autocomplete fr/fr: seed, +3; via "prix d'un violoncelle"] | H. "De luthier" is the French word for maker-built | category page title + buying guide on price |
| `violoncelle 4/4`, `violoncelle 4 4 prix`, `violoncelle prix 4 4` | commercial investigation | [autocomplete fr/fr: seed, +9] | H. Full size | category page /cellos |
| `violoncelle prix`, `violoncelle prix neuf`, `violoncelle neuf prix` | commercial investigation | [autocomplete fr/fr, be, ch: seed, +9; "violoncelle neuf" +1] | H. Price for a new cello | category page + buying guide on price |
| `violoncelle professionnel prix`, `prix d'un violoncelle professionnel`, `prix d'un violoncelle de concert` | commercial investigation | [autocomplete fr/fr: seed, +2; via "prix d'un violoncelle"] | H. Professionals are a named buyer group [site-facts] | category page + buying guide on price |
| `violoncelle d'étude`, `violoncelle d étude 4 4`, `violoncelle d étude prix` · *student cello* | commercial investigation | [autocomplete fr/fr: seed, +4] | M. Students are a named audience, but "étude" may mean a cheaper tier [estimate] | category page copy |
| `violoncelle à vendre`, `violoncelle 4 4 à vendre` | transactional | [autocomplete fr/fr: seed, +7, led by Québec and Montréal] | M. Leans Canadian | category page copy |
| `violoncelle fait main` | none | [autocomplete fr/fr: empty] | L. Use "de luthier" | body text |
| **Price questions** | | | | |
| `combien coûte un violoncelle`, `combien coute un bon violoncelle` | informational | [autocomplete fr/fr: seed, +6] | H. | buying guide on price |
| `prix d'un violoncelle`, `prix d'un violoncelle neuf`, `prix d'un violoncelle adulte` | commercial investigation | [autocomplete fr/fr: seed, +9] | H. | buying guide on price |
| `violoncelle prix moyen` · *average price* | informational | [autocomplete fr/fr, be, ch: via "violoncelle prix"] | M. | buying guide on price |
| `prix d'un violoncelle goffriller`, `violoncelle goffriller prix`, `violoncelle matteo goffriller prix` | commercial investigation | [autocomplete fr/fr: via "prix d'un violoncelle"; "violoncelle goffriller" +6] | H. A model Simon builds, offered as a price query unprompted | model page "violoncelle modèle Goffriller" |
| `violoncelle stradivarius prix`, `combien coute un violoncelle stradivarius`, `quel est le violoncelle le plus cher du monde` | informational | [autocomplete fr/fr, be] | L. Curiosity about the originals | model page paragraph |
| `violoncelle prix tunisie`, `maroc`, `algerie` | commercial investigation | [autocomplete fr/fr, be, ch: via "violoncelle prix"] | L. North African searchers | none |
| **Double bass** | | | | |
| `contrebasse prix`, `contrebasse prix neuf` | commercial investigation | [autocomplete fr/fr, be, ch: seed, +9] | H. 6 basses [site-facts] | category page /double-basses |
| `prix contrebasse luthier`, `prix contrebasse professionnelle` | commercial investigation | [autocomplete fr/fr, be, ch: via "contrebasse prix"] | H. Maker plus professional | category page + buying guide on price |
| `contrebasse 3/4`, `contrebasse 3 4 prix`, `prix contrebasse 3 4` | commercial investigation | [autocomplete fr/fr: seed, +9] | H. | category page |
| `contrebasse 3/4 ou 4/4`, `contrebasse 3 4 taille`, `contrebasse 4 4 taille` · *which size* | informational | [autocomplete fr/fr: via "contrebasse 3/4", "contrebasse 4/4"] | H. Same question as DE and NL | buying guide, bass sizes |
| `combien coûte une contrebasse` | informational | [autocomplete fr/fr: echo] | M. | buying guide on price |
| `acheter une contrebasse`, `contrebasse à vendre` | transactional | [autocomplete fr/fr: echo; seed, +4 led by Montréal] | M. | category page |
| `contrebasse luthier`, `luthier contrebasse france` | commercial investigation, local | [autocomplete fr/fr: seed, +9, almost all cities] | M. Buyers want a bass maker, usually nearby | category page copy |
| `contrebasse 5 cordes`, `contrebasse 5 cordes accordage` · *tuning* | commercial investigation | [autocomplete fr/fr: seed, +9, half electric bass] | M. One 5-string in stock | product page + FAQ |
| `contrebasse roumaine` | commercial investigation | [autocomplete fr/fr: echo] | M. Tiny but exact | Reghin heritage page |
| `contrebasse forme gambe`, `contrebasse forme violon` | none | [autocomplete fr/fr: empty] | L. Explain shapes in body text only | model page |
| `contrebasse électrique`, `basse 5 cordes` | none | [autocomplete fr/fr: via "contrebasse ", "contrebasse 5 cordes"] | L. Electric instruments | none |
| **Viola** | | | | |
| `alto violon`, `alto violon prix`, `violon alto` | commercial investigation | [autocomplete fr/fr: seed, +9; "violon alto" via "violon " in fr, be, ch] | M. This pairing tells Google which alto is meant | category page /violas |
| `alto instrument`, `alto instrument prix`, `alto instrument à cordes` | informational | [autocomplete fr/fr: seed, +9, mixed with wind and brass] | M. | category page /violas |
| `alto luthier`, `alto luthier prix` | commercial investigation | [autocomplete fr/fr: seed, +3] | M. No violas listed yet [site-facts] | category page /violas, or contact for a commission |
| `acheter un alto`, `acheter un violon alto` | transactional | [autocomplete fr/fr: seed, +2; via "acheter un violon"] | M. "Acheter un alto" also returns saxophone | category page /violas |
| `alto prix`, `alto à vendre` | none | [autocomplete fr/fr: saxophones, Algerian ads, Québec trailers] | L. Too ambiguous | none |
| **Violin** | | | | |
| `violon de luthier prix`, `violon luthier prix` | commercial investigation | [autocomplete fr/fr: seed, +3; via "violon luthier"] | M. Only 3 violins | category page /violins |
| `violon fait main`, `prix violon fait main` | commercial investigation | [autocomplete fr/fr: seed, +1] | M. "Fait main" works for violins | category page /violins |
| `violon prix`, `violon prix neuf`, `acheter un violon neuf` | commercial investigation | [autocomplete fr/fr: seed, +9] | L. Mostly beginners and children | category page copy |
| **Models** | | | | |
| `violoncelle copie stradivarius`, `violoncelle stradivarius` | commercial investigation | [autocomplete fr/fr: via "violoncelle stradivarius"] | M. The exact "copy" phrase exists | model page, Stradivari "Davidoff" |
| `copie stradivarius`, `copie stradivarius prix`, `copie stradivarius 1721` | informational | [autocomplete fr/fr: seed, +9] | L. Label text found inside inherited factory violins [estimate: "cremonensis faciebat anno 1721" is a stock label] | none, or one FAQ answer |
| `violoncelle davidoff` | informational | [autocomplete fr/fr: echo] | L. Exists, tiny | model page |
| `violon amati`, `violon amati prix` | informational | [autocomplete fr/fr: seed, +6] | L. About originals | model page |
| `violon messie`, `violon le messie prix` | informational | [autocomplete fr/fr: seed, +2] | L. The original "Messiah" | model page paragraph |
| **Origin** | | | | |
| `luthier roumain`, `luthier roumanie` | commercial investigation | [autocomplete fr/fr: echo, both] | M. Exact fit, low volume | Reghin heritage page |
| `violoncelle roumain` | commercial investigation | [autocomplete fr/fr: echo] | M. | Reghin heritage page |
| `reghin roumanie`, `violon reghin`, `violon reghin romania` | informational | [autocomplete fr/fr: via "reghin", "reghin violon"] | M. The same seed returns Romanian-language queries such as `violoncel reghin pret` | Reghin heritage page |
| `violon roumain`, `violon roumanie` | informational | [autocomplete fr/fr: seed, +1, "paysan roumain violon"] | L. Leans to Romanian folk fiddling | none |
| `luthier de crémone`, `luthier italien` | navigational | [autocomplete fr/fr: via "luthier "] | L. Origin towns matter to French buyers too | Reghin heritage page, comparison paragraph |
| `luthier transylvanie`, `violon transylvanie` | none | [autocomplete fr/fr: empty] | L. | body text |
| **Guides and materials** | | | | |
| `comment choisir un violoncelle`, `quel violoncelle choisir` | informational | [autocomplete fr/fr: seed, +2; via "quel violoncelle"] | H. Typical answer-engine question | buying guide |
| `comment choisir un bon violon`, `comment acheter un violon` | informational | [autocomplete fr/fr: via "comment choisir un violon"] | M. | buying guide |
| `taille violoncelle`, `taille violoncelle en cm`, `taille violoncelle adulte`, `violoncelle 7 8 ou 4 4`, `comment choisir taille violoncelle` | informational | [autocomplete fr/fr: seed, +9; via "violoncelle 7/8"] | M. Size chart | buying guide, sizes |
| `violoncelle quel bois`, `violoncelle bois massif` · *which wood, solid wood* | informational | [autocomplete fr/fr: via "quel violoncelle", "violoncelle bois"] | M. | buying guide, materials |
| `vernis alcool lutherie`, `vernis violon`, `vernis violon huile de lin` | informational | [autocomplete fr/fr: via "vernis à l'alcool"; "vernis violon" +6] | L. Mostly makers and DIY | buying guide, materials |
| `bois de lutherie` | informational | [autocomplete fr/fr: seed, +7, guitar and wood shops] | L. Wood buyers | buying guide, materials |
| `alto violon différence`, `alto violoncelle différence` | informational | [autocomplete fr/fr: via "alto violon"] | L. | FAQ |
| **Local, rental, used** | | | | |
| `luthier autour de moi`, `luthier violoncelle paris`, `luthier bruxelles`, `luthier lausanne`, `luthier geneve` · *near me* | local | [autocomplete fr/fr, be, ch: via "luthier ", "violoncelle luthier"] | L. Wants a shop nearby | contact, for visitors |
| `location violoncelle` · *rental* | transactional | [autocomplete fr/fr: seed, +9] | L. No rental offer | none |
| `violoncelle occasion`, `violoncelle d'occasion`, `violoncelle usagé à vendre`, `contrebasse occasion belgique` | transactional | [autocomplete fr/fr, be] | L. Used market | none |

### Dutch

| Keyword | Intent | Evidence | Priority and why | Target page |
|---|---|---|---|---|
| **Cellos** | | | | |
| `cello kopen` · *buy a cello* | transactional | [autocomplete nl/nl, be: seed, +9] | H. Core term; suggestions mix Dutch and Belgian cities | category page /cellos |
| `cello kopen 4 4` | transactional | [autocomplete nl/nl, be: via "cello kopen"] | H. | category page /cellos |
| `cello prijs`, `prijs cello`, `prijs cello kopen` | commercial investigation | [autocomplete nl/nl, be: "cello prijs" +4; "prijs cello" +6] | H. | category page + buying guide on price |
| `wat kost een cello`, `hoeveel kost een cello` · *how much is a cello* | informational | [autocomplete nl/nl: seed, +7; seed, +1] | H. | buying guide on price "Wat kost een cello?" |
| `wat kost een goede cello`, `hoeveel kost een goede cello`, `prijs goede cello` · *a good cello* | commercial investigation | [autocomplete nl/nl: via three seeds] | H. Three seeds led here | buying guide on price |
| `wat kost een nieuwe cello`, `wat kost een professionele cello` | commercial investigation | [autocomplete nl/nl: via "wat kost een cello"] | H. New and professional | buying guide on price |
| `gemiddelde prijs cello` · *average price* | informational | [autocomplete nl/nl, be: via price seeds] | M. | buying guide on price |
| `handgemaakte cello` · *handmade cello* | commercial investigation | [autocomplete nl/nl: echo; `cello handgemaakt` is rewritten to it] | M. The literal word works in Dutch; low volume | category page title |
| `cello kopen waar op letten` · *what to look for* | informational | [autocomplete nl/nl: echo] | H. Buying-guide question | buying guide |
| `stradivarius cello`, `prijs stradivarius cello`, `wat kost een stradivarius cello` | informational | [autocomplete nl/nl: seed, +9, all English; via price seeds] | L. Curiosity, and in English | model page paragraph |
| **Double bass** | | | | |
| `contrabas kopen` | transactional | [autocomplete nl/nl, be: seed, +9] | H. 6 basses [site-facts] | category page /double-basses |
| `contrabas kopen waar op letten` · *what to look for* | informational | [autocomplete nl/nl, be: via "contrabas kopen", unprompted] | H. Google offers it before any city | buying guide, basses |
| `wat kost een contrabas`, `contrabas prijs` | commercial investigation | [autocomplete nl/nl: seed, +4; seed, +1] | H. | buying guide on price |
| `wat kost een contrabas handgemaakt`, `prijs contrabas handgemaakt` | commercial investigation | [autocomplete nl/nl: via "wat kost een contrabas" and "contrabas prijs"] | H. The clearest handmade signal in the Dutch data | buying guide on price + category page |
| `wat kost een goede contrabas`, `wat kost een professionele contrabas` | commercial investigation | [autocomplete nl/nl: via "wat kost een contrabas"] | H. | buying guide on price |
| `contrabas 3/4`, `contrabas 3 4 kopen` | transactional | [autocomplete nl/nl: seed, +3] | H. | category page |
| `contrabas 3 4 of 4 4` | informational | [autocomplete nl/nl: via "contrabas 4/4"] | H. Same question as DE and FR | buying guide, bass sizes |
| `contrabas te koop` · *for sale* | transactional | [autocomplete nl/be: via "contrabas "] | M. | category page copy |
| `5 snarige contrabas`, `contrabas 5 snaren` | commercial investigation | [autocomplete nl/nl: echo, both] | M. One 5-string in stock | product page |
| `contrabas vs cello`, `cello vs contrabas` | informational | [autocomplete nl/nl, be: via "contrabas ", "cello "] | L. | FAQ |
| `elektrische contrabas`, `contrabas saxofoon` | none | [autocomplete nl/nl: via "contrabas kopen"] | L. Other instruments | none |
| **Viola and violin** | | | | |
| `altviool kopen` · *buy a viola* | transactional | [autocomplete nl/nl, be: seed, +2] | M. No violas listed yet | category page /violas |
| `altviool prijs`, `wat kost een altviool` | commercial investigation | [autocomplete nl/nl: echo, both] | M. | buying guide on price |
| `altviool vs viool`, `altviool en viool verschil` · *difference* | informational | [autocomplete nl/nl, be: via "altviool "] | L. | FAQ |
| `viool kopen`, `viool kopen 4/4` | transactional | [autocomplete nl/nl, be: seed, +9] | M. Beginner heavy; only 3 violins | category page /violins |
| `handgemaakte viool`, `handgemaakte viool kopen` | transactional | [autocomplete nl/nl: seed, +1] | M. | category page /violins |
| `wat kost een goede viool`, `viool prijs` | commercial investigation | [autocomplete nl/nl: via "wat kost een viool"; seed, +9] | M. | buying guide on price |
| `viool kopen waar op letten` | informational | [autocomplete nl/nl: echo] | M. | buying guide |
| `amati viool prijs`, `stainer viool prijs`, `guarneri viool prijs`, `wat kost een viool van andré rieu` | informational | [autocomplete nl/nl: via "viool prijs", "wat kost een viool"] | L. Curiosity and valuation | none |
| **Maker and origin** | | | | |
| `vioolbouwer` · *violin maker* | local, navigational | [autocomplete nl/nl, be: seed, +9, all cities] | L as a target. It is still the right word for the about page | home, Reghin heritage page |
| `vioolbouwers nederland`, `vioolbouwer belgië` | navigational | [autocomplete nl/nl: via "vioolbouwer"; echo] | L. | none |
| `roemeense viool` | informational | [autocomplete nl/nl: seed, +1, Bartók's Romanian dances] | L. Means the music | none |
| `viool roemenië`, `vioolbouwer roemenië`, `vioolbouwer transsylvanië` | none | [autocomplete nl/nl: empty] | L. | Reghin heritage page body text |
| `reghin`, `reghin romania` | informational | [autocomplete nl/nl: seed, +1] | L. | Reghin heritage page |
| `stradivarius kopie` | mixed | [autocomplete nl/nl: echo] | L. | model page body |
| **Guides and sizes** | | | | |
| `welke maat cello heb ik nodig`, `maat cello bepalen`, `welke maat cello` · *which size do I need* | informational | [autocomplete nl/nl: via "welke cello", "cello maat"] | M. Size chart | buying guide, sizes |
| `welke soorten cello's zijn er` · *what kinds of cellos exist* | informational | [autocomplete nl/nl: via "welke cello"] | M. Natural lead-in to model pages | buying guide, model page |
| `strijkinstrumenten`, `strijkinstrumenten winkel` · *string instruments, shop* | commercial investigation | [autocomplete nl/nl: seed, +7] | L. Generic; `strijkinstrumentenshop` is a competitor name | home |
| **Local, rental, used** | | | | |
| `cello kopen antwerpen`, `gent`, `amsterdam`, `den haag`, `belgie` | local | [autocomplete nl/nl, be: via "cello kopen"] | L. Wants a shop nearby | none |
| `cello huren`, `wat kost een cello huren`, `contrabas huren` · *rent* | transactional | [autocomplete nl/nl, be] | L. No rental offer | none |
| `cello kopen tweedehands`, `cello kopen marktplaats`, `contrabas kopen 2e hands` · *used* | transactional, navigational | [autocomplete nl/nl, be] | L. Used market and Marktplaats | none |

## 4. Questions people ask

All of these are real autocomplete suggestions. Each is a candidate FAQ entry or guide heading.
Answer engines tend to quote pages that give a direct answer under a heading worded like the
question [estimate: common answer-engine behaviour, not measured here].

### German

1. Was kostet ein Cello? / Wie viel kostet ein Cello im Durchschnitt? · *what does a cello cost, on average*
2. Was kostet ein Cello vom Geigenbauer? · *from a violin maker*
3. Wie viel kostet ein gutes Cello?
4. Was kostet ein Cello für Erwachsene? · *for adults*
5. Wie viel kostet ein neues Cello?
6. Was kostet ein handgefertigter Kontrabass?
7. Was kostet ein guter, neuer oder Profi-Kontrabass?
8. Was kostet ein Kontrabass aus Markneukirchen?
9. Was kostet eine Geige vom Geigenbauer? Also "aus Cremona" and "aus Mittenwald"
10. Cello kaufen, worauf achten? · *what to look for*
11. Kontrabass gebraucht kaufen, worauf achten?
12. Wie erkenne ich ein gutes Cello? · *how to recognise a good cello*
13. Welches Cello kaufen? Welches Cello für welche Größe?
14. Kontrabass 3/4 oder 4/4? Unterschied 3/4 und 4/4?
15. Cello 7/8 oder 4/4?
16. Bratsche, welche Größe? Bratsche Größe bestimmen? · *how to find the right viola size*
17. Ist die Bratsche größer als das Cello? · *is the viola bigger than the cello*
18. Cello, welches Holz? · *which wood*
19. Welches Cello spielt Sol Gabetta / Yo-Yo Ma? · *which cello does X play*, a lead-in to model pages

Source: [autocomplete de/de; items 1 to 4 also appear with gl=at and gl=ch]

### French

1. Combien coûte un violoncelle ? Combien coûte un bon violoncelle ?
2. Combien coûte un violoncelle d'occasion ?
3. Prix d'un violoncelle de luthier, professionnel, de concert, neuf ?
4. Combien coûte une contrebasse ?
5. Comment choisir un violoncelle ? Quel violoncelle choisir ?
6. Comment choisir la taille d'un violoncelle ? Typed as `comment choisir taille violoncelle`
7. Comment choisir un bon violon ? Comment acheter un violon ?
8. Contrebasse 3/4 ou 4/4 ?
9. Violoncelle 7/8 ou 4/4 ?
10. Violoncelle, quel bois ?
11. Quel est le violoncelle le plus cher du monde ?
12. Alto et violon, quelle différence ? Typed as `alto violon différence`
13. Contrebasse 5 cordes, quel accordage ?
14. Quel violoncelle joue Gautier Capuçon ? Combien coûte le violoncelle de Gautier Capuçon ?
15. Combien coûte la location d'un violoncelle ? Rental, low priority

Source: [autocomplete fr/fr]

### Dutch

1. Wat kost een cello? Hoeveel kost een goede cello? · *how much is a cello, a good cello*
2. Wat kost een nieuwe cello? Wat kost een professionele cello?
3. Wat kost een contrabas? Wat kost een contrabas handgemaakt?
4. Wat kost een goede of professionele contrabas?
5. Contrabas kopen, waar op letten? · *what to look for*
6. Cello kopen, waar op letten?
7. Viool kopen, waar op letten?
8. Contrabas 3/4 of 4/4?
9. Welke maat cello heb ik nodig? Maat cello bepalen? · *which size do I need*
10. Welke soorten cello's zijn er? · *what kinds of cellos exist*
11. Wat kost een altviool?
12. Altviool vs viool, wat is het verschil?
13. Contrabas vs cello?
14. Wat kost een goede viool?
15. Wat kost een viool van André Rieu? Curiosity, low priority

Source: [autocomplete nl/nl; 5 and 12 also seen with gl=be]

## 5. Interest data

Source: [wikipedia-pageviews], user agents only, monthly, October 2025 to September 2026. I checked
every title through the Wikipedia API before pulling numbers. "Median month" is the middle value of
the 12 months, so one spike does not distort it.

| Language | Exact article title | 12-month total | Median month | Peak month | Low month |
|---|---|---:|---:|---|---|
| de | Violoncello | 64,767 | 5,274 | Dec 2025: 9,508 | Aug 2026: 3,542 |
| de | Violine | 63,068 | 5,428 | Jan 2026: 7,279 | Aug 2026: 3,460 |
| de | Bratsche | 55,663 | 4,420 | Jan 2026: 7,664 | Jul 2026: 3,355 |
| de | Kontrabass | 51,588 | 4,079 | Nov 2025: 7,484 | Aug 2026: 2,823 |
| de | Geigenbauer | 6,919 | 574 | Oct 2025: 673 | Sep 2026: 489 |
| de | Reghin | 3,790 | 318 | Aug 2026: 445 | Feb 2026: 222 |
| de | Antonio Stradivari | 53,468 | 4,416 | Feb 2026: 6,056 | Sep 2026: 2,916 |
| de | Cello, a redirect to Violoncello | 6,847 | 348 | Nov 2025: 2,879 | Jul 2026: 269 |
| de | Geige, a redirect to Violine | 3,558 | 296 | Jan 2026: 392 | Jul 2026: 218 |
| fr | Violoncelle | 31,630 | 2,612 | Jan 2026: 3,476 | Aug 2026: 1,702 |
| fr | Violon | 62,881 | 4,765 | Nov 2025: 12,314 | Jul 2026: 3,127 |
| fr | Alto (instrument à cordes) | 30,889 | 2,593 | Jan 2026: 3,641 | Jul 2026: 1,787 |
| fr | Contrebasse | 24,742 | 1,958 | Jan 2026: 2,930 | Aug 2026: 1,611 |
| fr | Luthier | 11,994 | 978 | Dec 2025: 1,612 | Jun 2026: 707 |
| fr | Lutherie | 3,862 | 294 | Jan 2026: 580 | Aug 2026: 205 |
| fr | Reghin | 591 | 49 | Mar 2026: 63 | Feb 2026: 32 |
| fr | Antonio Stradivari | 24,507 | 1,996 | Apr 2026: 2,770 | Sep 2026: 1,554 |
| nl | Cello | 12,772 | 838 | Nov 2025: 3,592 | Jul 2026: 528 |
| nl | Viool | 11,238 | 958 | Jan 2026: 1,288 | Jul 2026: 583 |
| nl | Altviool | 8,439 | 448 | Nov 2025: 3,274 | Jul 2026: 269 |
| nl | Contrabas | 8,024 | 647 | Jan 2026: 1,046 | Jul 2026: 391 |
| nl | Vioolbouwer | 627 | 48 | Nov 2025: 95 | Jun 2026: 33 |
| nl | Reghin | 274 | 23 | Apr 2026: 29 | Sep 2026: 17 |
| nl | Antonio Stradivari | 21,982 | 814 | May 2026: 12,063 | Nov 2025: 581 |
| en | Cello, for scale | 243,863 | 19,292 | Nov 2025: 31,711 | Jul 2026: 15,176 |
| en | Reghin, for scale | 6,786 | 570 | Apr 2026: 641 | Feb 2026: 489 |
| ro | Reghin, for scale | 13,317 | 1,090 | Aug 2026: 1,339 | Mar 2026: 973 |

Monthly detail:

| Article | Oct | Nov | Dec | Jan | Feb | Mar | Apr | May | Jun | Jul | Aug | Sep |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| de:Violoncello | 5,206 | 6,288 | 9,508 | 7,301 | 5,341 | 5,370 | 4,773 | 5,594 | 4,011 | 3,666 | 3,542 | 4,167 |
| de:Violine | 5,295 | 6,349 | 6,404 | 7,279 | 5,507 | 5,731 | 5,350 | 5,764 | 4,426 | 3,497 | 3,460 | 4,006 |
| de:Bratsche | 4,080 | 4,553 | 5,588 | 7,664 | 4,580 | 5,178 | 4,287 | 5,014 | 3,991 | 3,355 | 3,457 | 3,916 |
| de:Kontrabass | 4,168 | 7,484 | 5,017 | 5,453 | 4,090 | 4,519 | 4,068 | 3,922 | 3,231 | 3,589 | 2,823 | 3,224 |
| de:Geigenbauer | 673 | 586 | 574 | 627 | 551 | 519 | 616 | 575 | 635 | 531 | 543 | 489 |
| de:Reghin | 316 | 273 | 321 | 307 | 222 | 260 | 322 | 352 | 269 | 375 | 445 | 328 |
| de:Antonio Stradivari | 4,611 | 3,827 | 4,339 | 4,494 | 6,056 | 5,495 | 4,177 | 4,940 | 5,333 | 3,048 | 4,232 | 2,916 |
| de:Cello | 366 | 2,879 | 652 | 415 | 347 | 350 | 286 | 394 | 320 | 269 | 290 | 279 |
| de:Geige | 314 | 339 | 362 | 392 | 266 | 264 | 311 | 284 | 307 | 218 | 258 | 243 |
| fr:Violoncelle | 2,911 | 3,456 | 2,987 | 3,476 | 2,543 | 2,681 | 2,459 | 3,032 | 2,241 | 2,048 | 1,702 | 2,094 |
| fr:Violon | 5,590 | 12,314 | 5,691 | 6,930 | 4,738 | 4,792 | 4,436 | 5,018 | 3,767 | 3,127 | 3,160 | 3,318 |
| fr:Alto (instrument à cordes) | 2,901 | 3,149 | 2,717 | 3,641 | 2,454 | 2,646 | 2,174 | 2,540 | 2,190 | 1,787 | 1,829 | 2,861 |
| fr:Contrebasse | 1,850 | 1,992 | 1,833 | 2,930 | 2,154 | 2,348 | 2,074 | 2,364 | 1,924 | 1,758 | 1,611 | 1,904 |
| fr:Luthier | 1,094 | 1,269 | 1,612 | 1,140 | 955 | 1,001 | 870 | 1,002 | 707 | 768 | 707 | 869 |
| fr:Lutherie | 321 | 448 | 379 | 580 | 265 | 306 | 273 | 323 | 262 | 217 | 205 | 283 |
| fr:Reghin | 39 | 51 | 46 | 55 | 32 | 63 | 49 | 48 | 36 | 49 | 63 | 60 |
| fr:Antonio Stradivari | 2,348 | 1,856 | 1,780 | 2,077 | 2,036 | 1,772 | 2,770 | 2,189 | 1,823 | 1,956 | 2,346 | 1,554 |
| nl:Cello | 1,107 | 3,592 | 1,067 | 1,000 | 845 | 830 | 688 | 1,148 | 711 | 528 | 596 | 660 |
| nl:Viool | 1,112 | 1,212 | 1,013 | 1,288 | 960 | 1,006 | 957 | 951 | 820 | 583 | 589 | 747 |
| nl:Altviool | 508 | 3,274 | 736 | 659 | 519 | 457 | 415 | 414 | 376 | 269 | 372 | 440 |
| nl:Contrabas | 667 | 900 | 797 | 1,046 | 648 | 646 | 580 | 626 | 464 | 391 | 749 | 510 |
| nl:Vioolbouwer | 61 | 95 | 54 | 52 | 37 | 46 | 92 | 37 | 33 | 33 | 36 | 51 |
| nl:Reghin | 18 | 27 | 22 | 28 | 19 | 24 | 29 | 18 | 18 | 27 | 27 | 17 |
| nl:Antonio Stradivari | 652 | 581 | 615 | 1,229 | 878 | 784 | 792 | 12,063 | 1,591 | 753 | 1,208 | 836 |
| en:Cello | 22,352 | 31,711 | 25,615 | 21,293 | 21,763 | 19,038 | 16,962 | 17,374 | 15,519 | 15,176 | 17,513 | 19,547 |
| en:Reghin | 573 | 629 | 619 | 575 | 489 | 513 | 641 | 566 | 527 | 566 | 594 | 494 |
| ro:Reghin | 1,310 | 1,098 | 1,115 | 1,082 | 979 | 973 | 1,063 | 1,185 | 993 | 1,136 | 1,339 | 1,044 |

What the numbers show:

- **German readers are the largest audience for every instrument, but the gap varies.** Cello: de
  5,274, fr 2,612, nl 838 in a median month. Double bass: de 4,079, fr 1,958, nl 647. For these two,
  that is about 2 to 1 against French and 6 to 1 against Dutch. Violin is close to even, de 5,428
  against fr 4,765. Viola is 1.7 to 1, de 4,420 against fr 2,593, and the German figure is plausibly
  inflated, see below.
- **Every instrument article hits its yearly low in July or August.** Most peak between November and
  January. Guides should go live by September, so Google has indexed them, meaning added them to
  its search database, before the winter peak [estimate: indexing takes weeks].
- **Spikes flagged, not explained.** November 2025: de:Kontrabass 7,484, fr:Violon 12,314, nl:Cello
  3,592, nl:Altviool 3,274, de:Cello redirect 2,879 and en:Cello 31,711. May 2026: nl:Antonio
  Stradivari 12,063, about 15 times its median. I did not check what caused them.
- **de:Bratsche is plausibly inflated by crossword lookups.** Autocomplete for `bratsche ` suggests
  `bratsche rätsel` and `bratsche 5 buchstaben`. Do not read its 4,420 median as viola-buying
  interest.
- **Redirects count separately.** de:Cello and de:Geige count only visits that arrive through those
  redirect titles. They are part of the Violoncello and Violine audiences, not separate topics.
- **Reghin interest is mostly Romanian.** ro:Reghin median 1,090, en 570, de 318, fr 49, nl 23.
  German interest is six times French, possibly linked to the town's German Saxon history: its
  German name is Sächsisch-Regen [estimate: from the de.wikipedia intro]. de:Reghin and ro:Reghin
  both peak in August, which suggests travel interest [estimate].
- **Caveats.** Dutch speakers often read English Wikipedia, so the nl numbers probably understate
  Dutch interest [estimate]. French Wikipedia serves France, Belgium, Switzerland, Canada and
  francophone Africa, so fr numbers overstate the European buyer pool [estimate]. Pageviews measure
  curiosity, not buying.

## 6. Recommendations

### Do these before any language work

- Product text currently shows in English on the de, fr and nl product pages, because DeepL
  translation is not running in production [site-facts: CLAUDE.md section 9]. No German, French or
  Dutch keyword can rank on a product page until that is fixed.
- Product titles are generic, for example "Cello 4/4" [site-facts]. German titles should carry the
  words from the terminology table, such as "Meistercello 4/4 nach Goffriller".
- The site has no hreflang [site-facts: CLAUDE.md section 9]. Hreflang is a tag that tells Google
  which language version of a page to show to which searcher. Without it, the eight locales compete
  with each other.
- Today the site has one /gallery page with filters and no per-instrument category pages
  [site-facts]. Every plan below assumes /cellos, /double-basses and /violins pages per locale.
- Do not translate from English. Each language needs its own wording for "handmade": Meister and
  Geigenbauer in German, de luthier in French, handgemaakt in Dutch.

### German: first pages to build

1. **Cello category page** titled around `Meistercello kaufen` and `vom Geigenbauer`, with the price
   range, the sizes 4/4 and 7/8, and delivery to Germany, Austria and Switzerland. The covered
   queries expand in de, at and ch.
2. **Price guide "Was kostet ein Cello vom Geigenbauer?"** It answers the whole `was kostet` and `wie
   viel kostet` cluster with Simon's real numbers. Add FAQ sections for `worauf achten` and `wie
   erkenne ich ein gutes Cello`.
3. **Double bass category page plus a bass guide** covering `3/4 oder 4/4`, `Gambenform oder
   Violinform`, the `5-Saiter` and `was kostet ein handgefertigter Kontrabass`. The comparison with
   Markneukirchen and named German makers should state facts only.
4. **Model page "Cello nach Goffriller"**, the only model with price queries, then a Stradivari
   "Davidoff" page.
5. **Reghin heritage page "Reghin, die Stadt der Geigen"**. Mention Sächsisch-Regen and use the
   phrase "rumänische Geigenbauer". This page builds trust and gives answer engines something to
   cite. It will bring little search traffic.

Market evidence for German:

- Germany is named as a buyer country [site-facts].
- German has the largest Wikipedia audience for every instrument [wikipedia-pageviews].
- German has the richest maker vocabulary in autocomplete: Meister-, vom Geigenbauer, Gambenform.
- The at and ch suggestions add only local names such as willhaben, Salzburg, Graz, Schweiz and
  Luzern [autocomplete]. One German version can serve all three countries.

### French: first pages to build

1. **Cello category page "Violoncelles de luthier"**, with prices and the words `4/4`, `neuf` and
   `professionnel`.
2. **Price guide "Prix d'un violoncelle de luthier"**, covering `combien coûte un bon violoncelle`,
   new versus student versus professional, and `prix contrebasse luthier`.
3. **Buying guide "Comment choisir un violoncelle"**, covering `taille`, `7/8 ou 4/4` and `quel
   bois`.
4. **Double bass category page** with FAQ answers for `3/4 ou 4/4` and `5 cordes accordage`.
5. **Goffriller model page**. `prix d'un violoncelle goffriller` appeared unprompted.

Market evidence for French:

- France and Belgium are named as buyer countries [site-facts].
- French Wikipedia is the second-largest audience: Violon 4,765, Violoncelle 2,612, Alto 2,593,
  Contrebasse 1,958 median [wikipedia-pageviews].
- Suggestions pull in Québec and North African searchers [autocomplete], so expect French pages to
  draw visitors far from the buyer countries named on the site. Whether they convert is unknown.
- The Belgian and Swiss suggestions differ only in local items: Bruxelles, Liège, Lausanne, Genève,
  `contrebasse occasion belgique` [autocomplete].
- The viola needs extra care in French. Always write "alto" next to "violon" or "instrument à
  cordes".

### Dutch: first pages to build

1. **Double bass category page plus the guide "Contrabas kopen: waar op letten"**, including "Wat
   kost een handgemaakte contrabas?". This is the strongest Dutch cluster, and Google suggests it
   unprompted.
2. **Cello category page "Handgemaakte cello's"** with `prijs` and `4/4`.
3. **Price guide "Wat kost een goede cello?"**, covering `nieuwe` and `professionele`.
4. **Size FAQ**: `welke maat cello heb ik nodig` and `contrabas 3/4 of 4/4`.

Market evidence for Dutch:

- Belgium is named as a buyer country. The Netherlands is not [site-facts].
- Dutch has the smallest Wikipedia audience of the three, with nl:Cello at 838 median
  [wikipedia-pageviews].
- Several Dutch queries return English suggestions [autocomplete], so some Dutch buyers likely use
  the English site already.
- The gl=nl suggestions already include Antwerp, Ghent and "belgie" [autocomplete]. One Dutch
  version covers Flanders as well as the Netherlands.
- The Dutch data still has the plainest handmade-bass demand of all three languages.
- On this evidence, the case for a slimmer Dutch locale is stronger than for German or French: the
  bass and cello category pages plus one guide. The owner decides.
