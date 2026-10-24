# Luthier glossary for machine translation

DeepL translates instrument text (titles, luthier's notes, specs) into 7 languages. Without help it
picks everyday words: "top" becomes a garment, "bridge" a river crossing, "scroll" a document. This
table holds the terms a luthier would use. Load it as a DeepL glossary if the plan supports
glossaries, and use it as the checklist when reviewing translations.

Entries marked `?` need a native luthier's check (Paul for RO). Draft: 2026-10-24.

## Never translate

Model and maker names (Stradivari, Stradivarius, Goffriller, Amati, Panormo, Ceruti, Davidov /
Davidoff, Messiah, Gamba Vivala), brand names (Thomastik, Pirastro, Versum, Bender, Akusticus),
sizes (4/4, 3/4, 7/8), measurements and prices.

## Terms

| English | Romanian | German | French | Dutch |
|---|---|---|---|---|
| violin | vioară | Violine / Geige | violon | viool |
| viola | violă | Bratsche | alto | altviool |
| cello | violoncel | Violoncello / Cello | violoncelle | cello |
| double bass | contrabas | Kontrabass | contrebasse | contrabas |
| luthier | lutier | Geigenbauer | luthier | vioolbouwer |
| workshop | atelier | Werkstatt | atelier | werkplaats |
| tonewood | lemn de rezonanță | Tonholz | bois de lutherie | klankhout |
| spruce | molid | Fichte | épicéa | sparrenhout |
| maple | paltin | Ahorn | érable | esdoorn |
| flamed maple | paltin flamat `?` | geflammter Ahorn | érable ondé | gevlamd esdoorn |
| flamed alder | arin flamat `?` | geflammte Erle | aulne ondé | gevlamd elzenhout |
| rosewood | palisandru | Palisander | palissandre | palissander |
| set-up (fittings) | accesorii | Garnitur | garniture | garnituur |
| alder | arin `?` | Erle | aulne | elzenhout |
| ebony | abanos | Ebenholz | ébène | ebbenhout |
| top (plate) | față / capac `?` | Decke | table | bovenblad |
| back | spate / fund `?` | Boden | fond | achterblad |
| ribs | eclise | Zargen | éclisses | zijkanten |
| scroll | melc | Schnecke | volute | krul |
| neck | gât | Hals | manche | hals |
| fingerboard | tastieră | Griffbrett | touche | toets |
| pegs | chei `?` | Wirbel | chevilles | stemsleutels `?` |
| bridge | căluș | Steg | chevalet | kam |
| sound post | suflet | Stimmstock | âme | stapel |
| tailpiece | cordar | Saitenhalter | cordier | staartstuk |
| fine tuners | microacordoare `?` | Feinstimmer | tendeurs | fijnstemmers |
| endpin | picior `?` | Stachel | pique | pin `?` |
| strings | corzi | Saiten | cordes | snaren |
| varnish | lac | Lack | vernis | lak |
| spirit varnish | lac pe bază de alcool | Spirituslack | vernis à l'alcool | spirituslak |
| oil varnish | lac pe bază de ulei | Öllack | vernis à l'huile | olielak |
| in the white (unvarnished) | în alb `?` | im Weiß | en blanc | in het wit |
| gamba-shaped (bass) | formă de gambă | Gambenform | forme gambe | gambavorm |
| violin-shaped (bass) | formă de vioară | Violinform | forme violon | vioolvorm |
| model (after Stradivari) | model Stradivari | nach Stradivari | modèle Stradivarius | Stradivarius-model |
| price on request | preț la cerere | Preis auf Anfrage | prix sur demande | prijs op aanvraag |
| reservation | rezervare | Reservierung | réservation | reservering |

## Lessons from the first run (2026-10-24)

- DeepL glossaries insert the target form verbatim. For Romanian this breaks article and gender
  agreement ("o lungimea", "o spate"). So multi-word phrases with articles stay out of the RO
  glossary. Reviewers check them instead: "spatele dintr-o singură bucată", "o lungime a corpului
  de 757 mm".
- "Amber varnish" is a colour. It isn't "alcool de chihlimbar", "auf Bernsteinbasis" or "alcool
  ambré". Say "de culoare chihlimbar", "bernsteinfarben", "de teinte ambrée".
- "Flamed" is never "flambat" (flambéed).

## Review checklist (per instrument, per language)

1. Instrument and part names match the table, with no everyday-word mistranslations.
2. Model, maker and brand names are untouched.
3. Numbers, sizes, years and prices are identical to the English.
4. Formal address: "dumneavoastră" (RO), "Sie" (DE), "vous" (FR), "u" (NL). Set DeepL `formality:
   prefer_more` where the language supports it.
5. The sentence reads like a luthier wrote it, not like a manual. RO gets a human read before
   publishing; other languages get a spot check.
