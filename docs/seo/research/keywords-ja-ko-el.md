# Keyword and search-intent research: Japanese, Korean, Greek

Research date: 2026-10-24. Scope: Japanese (hl=ja, gl=jp), Korean (hl=ko, gl=kr), Greek (hl=el, gl=gr, plus a gl=cy check).

**How to read the tags.** Every claim carries one source tag:

- `[autocomplete]`: Google's search suggestions, which show real queries people type, with no volumes.
- `[wikipedia-pageviews]`: monthly Wikipedia article views, a rough proxy for how much interest a topic gets in each language.
- `[websearch]`: a non-Google, US-centric search tool, used only to read pages.
- `[competitor-page]`: a page read directly.
- `[repo]`: this repository.
- `[estimate: …]`: my reasoning, with the reasoning given.

No search volumes appear anywhere in this file, because no source here provides them.

**How priority is set (H/M/L).** There are no volumes, so priority combines three things:

1. **Fit with what Simon sells.** New, handmade, model copies, cellos and basses first, priced at €1,700–7,500.
2. **Depth of the autocomplete pool.** A seed (the starting phrase typed into autocomplete) that returns 5–10 related suggestions shows many people search around that phrase. A seed that returns only itself, or nothing, shows a thin pool.
3. **How crowded the topic probably is.** Generic queries like "cello price" in Japanese are dominated by big domestic retailers `[estimate: big domestic retailers already appear in Japanese buying suggestions, e.g. クロサワ バイオリン 通販 and 下倉 バイオリン 通販 (violin mail-order)]`.

---

## 1. Summary

- **Japan has real demand for the Romanian origin and for model copies; Korea and Greece mostly do not.**
  - Japanese autocomplete returns ルーマニア バイオリン 評判 / 特徴 / 工房 (Romanian violin reputation / characteristics / workshop), ルーマニア チェロ メーカー (Romanian cello maker), グリガ チェロ 評判 (Gliga cello reputation) and ゴフリラー チェロ 価格 (Goffriller cello price) `[autocomplete]`.
  - Korean autocomplete only knows a bare 루마니아 바이올린 (Romanian violin) and 글리가 바이올린 (Gliga violin), with nothing after them.
  - Greek autocomplete returns nothing at all for Romanian violins `[autocomplete]`.
  - Japan is also the only one of the three markets named as a buyer country on the site.
- **The Japanese name for Reghin is not settled. Both forms are in use.**
  - レギン is used by the site (9 times in `messages/ja.json` `[repo]`), by Japanese Wikipedia's disambiguation page, and by retailer Shimamura's Gliga page ("「楽器の街」ルーマニアのレギン" `[competitor-page]`).
  - AFP's Japanese edition writes "レジン（Reghin）" `[competitor-page]`. Japanese autocomplete has レジン バイオリン ルーマニア and バイオリン レジン 評判, and a bare レギン completes to レギンス (leggings) `[autocomplete]`.
  - レジン also means craft "resin", so it only works next to ルーマニア or バイオリン. The best option is to keep レギン and add レジン once, as in レギン（レジン／Reghin）. A native speaker should review this.
- **Japanese buyers already have the right words for what Simon sells**:
  - 手工品 ("handmade instrument"): バイオリン 手工品 おすすめ, 手工品見分け方 (how to tell if it's handmade).
  - 新作 ("newly made", as opposed to オールド "old"): 新作 バイオリン 選び方 (how to choose a new violin), バイオリン 新作 鳴らない (new violins "don't resonate").
  - 個人輸入 ("personal import"): バイオリン 個人 輸入 `[autocomplete]`.
  - A buying guide built around these terms fits a buyer who purchases remotely from Romania.
- **Name collisions are common. Latin-script and Greek maker names, and several bare instrument words, pull in unrelated results.**
  - **Latin script.** Typing "stradivari" or "stradivarius" fills with the Inditex fashion brand in all three markets: stradivarius 服 (clothes), stradivarius korea/seoul, stradivarius φορέματα (dresses) `[autocomplete]`.
  - **Greek script** has the same problem: στραντιβάριους φορέματα / παπούτσια (dresses / shoes) `[autocomplete]`.
  - **Japanese katakana and Korean hangul are mostly about the instrument.** ストラディバリウス completes to 値段 (price), なぜ高い (why so expensive), 所有者 (owner) and メシア (Messiah), with only 服 and 馬 mixed in. 스트라디바리우스 completes to 바이올린 가격 (violin price), 첼로 (cello) and 메시아, with only 옷 (clothes) `[autocomplete]`. So Japanese and Korean pages should use the native-script names, not Latin.
  - Viola collides with the flower in every language, plus ヴィオラドーロ (Viola d'Oro bags) and Βιολάντα (a biscuit brand).
  - チェロ collides with チェロキー (Cherokee). 첼로 collides with a bicycle brand, limoncello and a Maserati. 콘트라베이스 collides with a coffee drink, and 더블베이스 with the drum technique. τσέλο collides with a surname `[autocomplete]`.
  - The rule for pages: never target a bare Latin-script maker name or a bare Greek one, and always pair the instrument word with a qualifier, for example ストラディバリモデル チェロ, 고프릴러 첼로, βιολί Στραντιβάριους.
- **Interest is very uneven, and two blockers come first.**
  - Average monthly views of the violin article (Oct 2025–Sep 2026): ja ヴァイオリン 5,491, ko 바이올린 1,206, el Βιολί 500 `[wikipedia-pageviews]`.
  - In Japan, ストラディバリウス gets more views than the violin article (7,248/month), driven by TV-style spikes. On 1 Jan 2026 alone it had 5,460 views, against roughly 150 on a normal day `[wikipedia-pageviews daily]`.
  - In Japan, コントラバス (double bass) gets more views than チェロ (4,051 vs 2,977/month). Autocomplete links basses to school wind bands (コントラバス 値段 吹奏楽, 高校生) `[autocomplete]`.
  - Blocker 1: product pages in ja/ko/el currently show English product text (`CLAUDE.md` §9 `[repo]`), so no native product or model keyword can rank until that is fixed.
  - Blocker 2: product titles are generic ("Cello 4/4") `[repo]`.

---

## 2. Terminology

The romanisations are standard (Hepburn for Japanese, Revised Romanisation for Korean, ELOT-style for Greek). Translations in the "Gloss" columns are mine.

### 2a. Japanese

| Concept | What people type | Romanisation | Gloss / notes | Evidence |
|---|---|---|---|---|
| Violin | **バイオリン** | baiorin | Everyday/shop spelling. Both spellings autocomplete with 値段 (price) and 初心者 (beginner). Retailer queries use it: クロサワ バイオリン 通販, 下倉 バイオリン 通販 | `[autocomplete]` |
| Violin | **ヴァイオリン** | vaiorin | Wikipedia article title. Appears in craft/maker contexts: ヴァイオリン製作者 (violin maker), ヴァイオリン製作学校, and neutral seeds completing to アマティ ヴァイオリン and ゴフリラー ヴァイオリン. But アマティ バイオリン 特徴 also appears | `[autocomplete]` `[wikipedia]` |
| Viola | ビオラ / ヴィオラ | biora / viora | Both collide: ビオラ is mostly the flower (種まき, 花言葉), ヴィオラ is fashion and bags. Instrument queries need 楽器: ビオラ 楽器, ビオラ 値段 楽器. Wikipedia title: ヴィオラ | `[autocomplete]` |
| Cello | **チェロ** | chero | The only spelling. A bare query collides with チェロキー (Jeep Cherokee) | `[autocomplete]` |
| Double bass | **コントラバス** | kontorabasu | Main term and Wikipedia title. Rich buying pool: 値段 (price), 購入 (purchase), メーカー (maker), 工房 (workshop), 5弦 (5-string) | `[autocomplete]` |
| Double bass | ウッドベース | uddo bēsu ("wood bass") | Jazz/pop usage (ウッドベース ジャズ, ピックアップ). The question ウッドベース コントラバス 違い ("what's the difference?") is common | `[autocomplete]` |
| Double bass | ダブルベース | daburu bēsu | Avoid. Collides with baseball and gunpowder ("double base") | `[autocomplete]` |
| Handmade | **手工品** / 手工 | tekōhin / tekō | "Handmade (instrument)". バイオリン 手工品 おすすめ, 手工品見分け方, 中国 手工 品 (Chinese handmade), チェロ 手工 品 | `[autocomplete]` |
| Newly made | **新作** vs オールド | shinsaku vs ōrudo | "New-made" vs "old". 新作 バイオリン 選び方, バイオリン 新作 オールド, オールドバイオリン 値段 | `[autocomplete]` |
| Maker | 製作者 / 製作家 / 職人 / 工房 | seisakusha / seisakuka / shokunin / kōbō | Maker / maker / craftsman / workshop. Wikipedia's luthier article is titled ヴァイオリン製作家. 工房 queries are mostly local (東京, 大阪) | `[autocomplete]` `[wikipedia]` |
| Sizes | 分数 / 分数楽器, 4/4 | bunsū ("fraction") | Fractional sizes: バイオリン 分数 身長 (size by height), 4/4とは (what is 4/4), チェロ 分数楽器 | `[autocomplete]` |
| Price | 値段 / 価格 / 相場 / いくら | nedan / kakaku / sōba / ikura | Price / price / market rate / how much. 値段 相場, チェロ いくらする | `[autocomplete]` |
| Buying abroad | 個人輸入 / 海外 購入 / ヨーロッパ製 | kojin yunyū / kaigai kōnyū / Yōroppa-sei | Personal import / buying abroad / European-made | `[autocomplete]` |
| Makers (models) | ストラディバリ(ウス), ストラディヴァリ(ウス), アマティ, ゴフリラー | sutoradibari(usu), sutoradivari(usu), amati, gofurirā | Katakana is the working form. Latin "stradivari/stradivarius" with gl=jp returns the fashion brand (服, 店舗, 日本 撤退) plus a few stradivari violin/cello results | `[autocomplete]` |
| Romania / Reghin | ルーマニア製, レギン, レジン, グリガ | Rūmania-sei, Regin, Rejin, Guriga | Both forms are in use. レギン: Shimamura's Gliga page, the Wikipedia disambiguation page, the site. レジン: the AFP Japanese edition, and autocomplete (レジン バイオリン ルーマニア). A bare レギン query completes to レギンス (leggings). グリガ = Gliga | `[autocomplete]` `[competitor-page]` `[repo]` |

### 2b. Korean

| Concept | What people type | Romanisation | Gloss / notes | Evidence |
|---|---|---|---|---|
| Violin | **바이올린** | baiollin | Only spelling | `[autocomplete]` |
| Viola | **비올라** | biolla | Collides with the flower, Viola Davis and Pokémon. 비올라 바이올린 차이 ("difference from violin") is common | `[autocomplete]` |
| Cello | **첼로** | chello | Collides with 첼로 자전거 (Cello bicycles), 리몬첼로 (limoncello) and Maserati MC20 첼로 | `[autocomplete]` |
| Double bass | **콘트라베이스** | konteurabeiseu | Wikipedia title. Collides with a coffee drink (콘트라베이스 커피, 라떼) | `[autocomplete]` `[wikipedia]` |
| Double bass | 더블베이스 | deobeul beiseu | Also used (더블베이스 가격 exists). Collides with the double-bass drum technique. On Wikipedia it is a redirect | `[autocomplete]` |
| Handmade | **수제** | suje | "Handmade". Strong pool: 수제 바이올린 가격 / 추천 / 브랜드 / 중고, 독일 수제 바이올린, 수제 첼로 가격 | `[autocomplete]` |
| Handmade (loanword) | 핸드메이드, 공방악기 | haendeumeideu, gongbang-akgi | Returned **no** suggestions | `[autocomplete]` |
| Maker | 제작자 / 장인 / 공방 / 현악기 공방 / 루시어 | jejakja / jangin / gongbang / hyeonakgi gongbang / rusieo | Maker / master craftsman / workshop / string-instrument workshop / "luthier" (the Wikipedia title, only 41 views/month). 바이올린 제작자 등급 ("maker grade") appears | `[autocomplete]` `[wikipedia-pageviews]` |
| Player level | 입문용 / 중급자 / 전공자 / 취미 | ipmunyong / junggeupja / jeongongja / chwimi | Entry-level / intermediate / music-major / hobby. 전공자 첼로 가격 = "cello price for music majors" | `[autocomplete]` |
| Sizes | 사이즈, 4/4, 키 | saijeu, ki | Size, 4/4, height. 바이올린 사이즈 키 / 표 / 확인법, 첼로 사이즈 재는 법 | `[autocomplete]` |
| Price | 가격 / 가격대 / 얼마 | gagyeok / gagyeokdae / eolma | Price / price band / how much | `[autocomplete]` |
| Old vs new | 올드 바이올린 | oldeu baiollin | "Old violin". 올드 바이올린 구입 방법, 가격 | `[autocomplete]` |
| Overseas | 해외배송 | haeoe baesong | "Overseas shipping" (바이올린 해외배송). 직구 ("direct overseas purchase") returned nothing for violin or cello | `[autocomplete]` |
| Makers (models) | 스트라디바리우스, 아마티, 고프릴러 | seuteuradibariuseu, amati, gopeurilleo | 스트라디바리우스 첼로 / 메시아 (Messiah) / 가격, 고프릴러 첼로, 마테오 고프릴러. Latin "stradivari" returns stradivarius korea/seoul (fashion) | `[autocomplete]` |
| Romania / Reghin | 루마니아 바이올린, 글리가 바이올린 | Rumania baiollin, Geulliga | Both exist as queries with nothing after them. No evidence for any Korean spelling of Reghin: 레진 바이올린 gives "바이올린 레진" (resin), 레긴 바이올린 gives nothing, and the ko Wikipedia article 레긴 is the Norse figure Regin | `[autocomplete]` `[wikipedia]` |
| Community | … 디시 | dissi | Many buying queries end with 디시 (DC Inside, a big Korean forum), e.g. 바이올린 추천 디시. People want peer opinions | `[autocomplete]` |

### 2c. Greek

Note: Google returns Greek suggestions lowercased, often without accents, and with final ς turned into σ (e.g. τιμεσ). Below, every keyword is written in correct Greek (τιμές). The unaccented forms in the raw data show that many people **type** without accents `[autocomplete]`. Google matches both forms `[estimate: the accented and unaccented seeds returned near-identical suggestion lists]`.

| Concept | What people type | Romanisation | Gloss / notes | Evidence |
|---|---|---|---|---|
| Violin | **βιολί** | violí | Also the folk fiddle: Cretan music, wedding musicians (βιολί για γάμο) and the singer Mazonakis fill many suggestions | `[autocomplete]` |
| Viola | βιόλα | vióla | Collides with the flower, Βιολάντα biscuits, Cretan folk music. βιόλα τι σημαίνει ("what does viola mean") | `[autocomplete]` |
| Cello | **βιολοντσέλο** | violontsélo | Wikipedia title. Completions: τιμή (price), μεταχειρισμένο (used), παιδικό (children's) | `[autocomplete]` `[wikipedia]` |
| Cello | **τσέλο** | tsélo | Short form, also widely typed: τσέλο τιμή, τσέλο μεταχειρισμένο. Collides with the surname Τσέλος. People also ask whether the two words mean the same thing (βιολοντσέλο και τσέλο) | `[autocomplete]` |
| Double bass | **κοντραμπάσο** | kontrabáso | One σ. The double-σ form κοντραμπάσσο returned nothing | `[autocomplete]` |
| Handmade | χειροποίητο βιολί | cheiropoíito violí | Exists as a query but returns only itself, so the pool is thin | `[autocomplete]` |
| Maker | οργανοποιείο / οργανοποιός / κατασκευαστής βιολιών | organopoiío / organopoiós / kataskevastís violión | Instrument workshop / instrument maker / violin maker. οργανοποιείο completes to local folk workshops (Heraklion, bouzouki makers). οργανοποιός returned nothing. κατασκευαστής βιολιών completes to quiz-style Stradivari clues | `[autocomplete]` |
| Price | τιμή / τιμές / κόστος / πόσο κοστίζει | timí / timés / kóstos / póso kostízei | βιολί τιμές Skroutz (Greece's price-comparison site), βιολί τιμές Νάκας (Nakas, a large Greek music retailer) | `[autocomplete]` |
| Used | μεταχειρισμένο | metacheirisméno | Appears for every instrument, which points to a strong used market | `[autocomplete]` |
| Level | επαγγελματικό / για αρχάριους | epangelmatikó / gia archários | Professional / for beginners | `[autocomplete]` |
| Sizes | 4/4, 3/4 (typed "3 4") | — | μεγέθη ("sizes") returned nothing. βιολί 4/4 completes to **English** queries (violin 4 4 for sale / price) | `[autocomplete]` |
| Makers (models) | βιολί Στραντιβάριους, βιολί Αμάτι | Stradivárious, Amáti | Bare στραντιβάριους or stradivarius returns the fashion brand. Only βιολί + name gives instrument results | `[autocomplete]` |
| Romania | βιολί Ρουμανίας, ρουμάνικο βιολί | violí Roumanías, roumániko violí | **No suggestions at all**. Latin "gliga" completes to Pokémon (Gligar) plus one "gliga violin" | `[autocomplete]` |
| Cyprus | (same terms) | — | All 6 seeds run with gl=cy returned the same suggestions as gl=gr (one extra: βιολί ψάρι, a fish). There is no separate Cyprus signal | `[autocomplete]` |

---

## 3. Keyword map

Search intent (what the searcher wants to do) is labelled as one of four kinds:

- **info**: wants to learn something.
- **comparison**: is comparing before buying.
- **transactional**: is ready to buy.
- **local**: wants a shop nearby.

Unless a row says otherwise, the evidence tag is `[autocomplete]` (gl=jp / kr / gr).

**Pages that don't exist yet.** These page types are proposed, not built:

- **model page**: one page per historical model, e.g. "Goffriller model cello".
- **buying guide**
- **care guide**
- **Reghin heritage page**

**Rows that target a product page or model page depend on one fix.** Product text must be translated first. See §6.

### 3a. Japanese (ja-JP)

| Keyword (native) | English gloss | Intent | Evidence | Priority + why | Best target page |
|---|---|---|---|---|---|
| ルーマニア バイオリン 評判 | Romanian violin reputation | comparison | `[autocomplete]` | **H**: exact match to Simon's origin, little competition expected | Reghin heritage page |
| ルーマニア バイオリン 特徴 | characteristics of Romanian violins | info | `[autocomplete]` | **H**: same pool; a good question for an AI answer engine to quote | Reghin heritage page |
| ルーマニア バイオリン 工房 | Romanian violin workshop | comparison | `[autocomplete]` | **H**: literally describes Simon | home / Reghin heritage page |
| ルーマニア チェロ メーカー | Romanian cello maker | comparison | `[autocomplete]` | **H**: cellos are Simon's main stock (11 listed) | category page (cellos) |
| バイオリン ルーマニア製 / チェロ ルーマニア 製 | Romanian-made violin / cello | comparison | `[autocomplete]` | **H**: origin-qualified buying query | category page |
| レジン バイオリン ルーマニア / バイオリン レジン 評判 | Reghin violin / reputation | comparison | `[autocomplete]` + AFP JP "レジン（Reghin）" `[competitor-page]` | **H**: the town under the name AFP Japan uses (Shimamura uses レギン) | Reghin heritage page |
| グリガ チェロ 評判 / グリガ バイオリン 評判 | Gliga cello/violin reputation | comparison | `[autocomplete]`; Gliga ASV1 set sold by Shimamura at ¥174,900 incl. tax, page dated 2020-10-22 `[competitor-page]` | **M**: these buyers already know Reghin through Gliga. A fair "Reghin makers" explainer can serve them, without using Gliga's brand to mislead | Reghin heritage page |
| ゴフリラー チェロ 価格 | Goffriller cello price | transactional | `[autocomplete]` | **H**: exact match to inventory, niche | model page (Goffriller) |
| ゴフリラー チェロ | Goffriller cello | comparison | `[autocomplete]`; ja article マッテオ・ゴフリラー 164 views/mo `[wikipedia-pageviews]` | **H**: same | model page (Goffriller) |
| ストラディバリモデル / ストラディバリウス コピー モデル | Stradivari model / copy model | comparison | `[autocomplete]` | **H**: the exact concept of Simon's instruments | model page (Stradivari) |
| ダヴィドフ チェロ ストラディバリウス / ストラディバリウス ダビドフ | Davidoff Strad cello | info | `[autocomplete]` | **M**: info intent, but Simon builds Davidoff copies | model page (Davidoff) |
| ストラディバリウス メシア | Messiah Strad | info | `[autocomplete]` | **M**: info intent; Simon has a Messiah-model violin | model page (Messiah) |
| アマティ ヴァイオリン 値段 / アマティ バイオリン 特徴 | Amati violin price / traits | info | `[autocomplete]` | **M**: most want prices of originals; the page can explain copy vs original | model page (Amati) |
| ストラディバリウス なぜ高い / なぜ作れない | why a Strad is expensive / can't be reproduced | info | `[autocomplete]`; ストラディバリウス 7,248 views/mo `[wikipedia-pageviews]` | **M**: very high interest, weak buying intent; good AI-answer material that links to model pages | model page (FAQ block) |
| バイオリン 手工品 おすすめ | recommended handmade violins | transactional | `[autocomplete]` | **H**: 手工品 is the category term for Simon's work | category page |
| バイオリン 手工品見分け方 | how to tell a handmade violin | info | `[autocomplete]` | **H**: trust content; Simon can show the workshop process | buying guide |
| 新作 バイオリン 選び方 | how to choose a newly made violin | info | `[autocomplete]` | **H**: Simon sells 新作 | buying guide |
| バイオリン 新作 オールド / 新作 鳴らない | new vs old / "new ones don't resonate" | info | `[autocomplete]` | **M**: an objection to answer honestly | FAQ / buying guide |
| バイオリン 個人 輸入 / バイオリン 海外 購入 | personal import / buying abroad | transactional | `[autocomplete]` | **H**: exactly Simon's remote-reservation model (shipping, duties, payment) | FAQ (buying from abroad) |
| バイオリン ヨーロッパ製 | European-made violin | comparison | `[autocomplete]` | **M**: origin interest, thin pool (3 suggestions) | category page |
| チェロ 値段 相場 | cello price, market rate | comparison | `[autocomplete]` | **M**: core query, crowded with Japanese retailers | buying guide (price) |
| チェロ 値段 プロ / チェロ 値段 高級 | pro / high-end cello price | transactional | `[autocomplete]` | **H**: Simon's price band suits advancing players and pros | category page (cellos) |
| チェロ 30万 | cello ¥300,000 | transactional | `[autocomplete]`; Shimamura feature "30万円前後で選ぶ、チェロ特集" `[websearch]` | **M**: a common price anchor. `[estimate: Simon's cheapest cellos may sit near or above this band once converted to yen; check against the current rate]` | category page |
| チェロ 購入 注意点 / バイオリン 買う時の注意点 | what to watch for when buying | info | `[autocomplete]` | **M**: generic but question-shaped | buying guide |
| チェロ 初心者 予算 | beginner cello budget | info | `[autocomplete]` | **L**: beginners are likely below Simon's price band `[estimate]` | buying guide |
| コントラバス 5弦 値段 | 5-string double bass price | transactional | `[autocomplete]` | **H**: Simon lists a 5-string bass | product page |
| コントラバス 値段 相場 / 平均 / 最高級 | double bass price (market / average / top) | comparison | `[autocomplete]` | **M**: real pool; school wind-band buyers (吹奏楽) are mixed in | category page (basses) |
| コントラバス 工房 / コントラバス メーカー | double bass workshop / maker | comparison | `[autocomplete]` | **M**: mostly Japanese shops (角本, 東京), but "maker" intent fits | category page (basses) |
| ウッドベース 値段 / ウッドベース コントラバス 違い | "wood bass" price / difference | info | `[autocomplete]` | **M**: jazz players use ウッドベース; one line of copy covers both words | category page / FAQ |
| バイオリン 分数 身長 / チェロ 分数 / バイオリン 4/4とは | size by height / fractional cello / what is 4/4 | info | `[autocomplete]` | **M**: needed for parents; Simon lists mostly 4/4 `[repo: titles like "Cello 4/4"]` | buying guide (size) |
| ヴァイオリン製作者 / バイオリン 製作者 現代 | violin maker / contemporary makers | info | `[autocomplete]` | **M**: supports a "who makes your instrument" page | home / Reghin heritage page |
| チェロ 湿度 管理 / チェロ 手入れ方法 / バイオリン 手入れ方法 | humidity / care | info | `[autocomplete]` | **L**: builds trust, low buying intent | care guide |
| バイオリン 工房 東京 / チェロ 工房 東京 | workshop in Tokyo | local | `[autocomplete]` | **L**: local intent Simon cannot serve | — |
| バイオリン 中古 / チェロ 中古 | used violin / cello | transactional | `[autocomplete]` | **L**: used-market intent (メルカリ, ハードオフ) | — |

### 3b. Korean (ko-KR)

| Keyword (native) | English gloss | Intent | Evidence | Priority + why | Best target page |
|---|---|---|---|---|---|
| 수제 바이올린 가격 | handmade violin price | transactional | `[autocomplete]` | **H**: the core Korean term for Simon's offer; deep pool | category page |
| 수제 바이올린 추천 | recommended handmade violins | comparison | `[autocomplete]` | **H**: same | category page |
| 수제 첼로 / 수제 첼로 가격 | handmade cello (price) | transactional | `[autocomplete]` | **H**: main product, thin but direct | category page (cellos) |
| 수제 바이올린 브랜드 | handmade violin brands | comparison | `[autocomplete]` | **M**: brand comparison; Simon would need to be known as a name | home |
| 독일 수제 바이올린 / 중국 수제 바이올린 | German / Chinese handmade violin | comparison | `[autocomplete]` | **M**: Koreans compare by country of origin, which gives a "Romanian handmade" angle | buying guide (origins compared) |
| 전공자 첼로 가격 / 전공자 바이올린 가격 | price for music majors | transactional | `[autocomplete]` | **H**: Simon's band fits students and pros | category page / buying guide |
| 취미 첼로 가격 | hobby cello price | comparison | `[autocomplete]` | **M**: adult hobbyists, mixed fit | buying guide |
| 바이올린 가격대별 / 첼로 가격대 | violin / cello by price band | comparison | `[autocomplete]` | **M**: price-guide format | buying guide (price) |
| 바이올린 고르는법 / 좋은 바이올린 고르는 법 | how to choose a (good) violin | info | `[autocomplete]` | **H**: question-shaped, good for AI answers, low competition expected | buying guide |
| 바이올린 구매 요령 / 바이올린 구매 팁 | tips for buying a violin | info | `[autocomplete]` | **M**: same guide | buying guide |
| 바이올린 구매처 / 바이올린 구매 사이트 | where to buy / buying website | transactional | `[autocomplete]` | **M**: "where to buy" intent | home |
| 바이올린 제작자 등급 / 등급별 바이올린 제작자 | violin maker grades / makers by grade | info | `[autocomplete]` | **M**: Koreans rank makers; explaining where a workshop maker sits builds trust. Meaning needs native review | buying guide |
| 올드 바이올린 구입 방법 / 올드 바이올린 가격 | how to buy an old violin / price | info | `[autocomplete]` | **L**: Simon sells new; serves a "new vs old" explainer | FAQ |
| 루마니아 바이올린 | Romanian violin | comparison | `[autocomplete]`: exists, no further suggestions | **M**: thin, but almost no competition | Reghin heritage page |
| 글리가 바이올린 | Gliga violin | comparison | `[autocomplete]`: exists, thin | **L**: shows Gliga is known by name | Reghin heritage page |
| 고프릴러 첼로 / 마테오 고프릴러 | Goffriller cello / Matteo Goffriller | comparison | `[autocomplete]` | **H**: exact match to inventory, niche | model page (Goffriller) |
| 스트라디바리우스 메시아 | Messiah Strad | info | `[autocomplete]` | **M**: Simon has a Messiah copy | model page (Messiah) |
| 스트라디바리우스 첼로 / 스트라디바리우스 첼로 가격 | Strad cello / price | info | `[autocomplete]` | **M**: info-heavy; links to the Davidoff model | model page (Davidoff) |
| 아마티 바이올린 / 아마티 바이올린 가격 | Amati violin / price | info | `[autocomplete]` | **M** | model page (Amati) |
| 바이올린 4/4 가격 | 4/4 violin price | transactional | `[autocomplete]` | **M** | category page |
| 콘트라베이스 가격 / 더블베이스 가격 | double bass price | transactional | `[autocomplete]` | **M**: real but mixed with coffee results; use both words | category page (basses) |
| 콘트라베이스 더블베이스 차이 / 콘트라베이스 첼로 차이 | double bass vs "double bass" / vs cello | info | `[autocomplete]` | **L** | FAQ |
| 바이올린 사이즈 키 / 바이올린 사이즈 표 / 첼로 사이즈 재는 법 | size by height / size chart / how to measure a cello | info | `[autocomplete]` | **M**: parents of students | buying guide (size) |
| 바이올린 습도 관리 / 첼로 관리법 | humidity care / cello care | info | `[autocomplete]` | **L** | care guide |
| 바이올린 해외배송 | violin overseas shipping | transactional | `[autocomplete]` | **M**: thin, but it is the remote-purchase question | FAQ (shipping) |
| 바이올린 제작 공방 / 현악기 공방 | violin-making / string-instrument workshop | local | `[autocomplete]` | **L**: local Korean shops (분당, 하겐) | home |
| 바이올린 추천 디시 / 첼로 가격 디시 | … on DC Inside | community | `[autocomplete]` | **L** as a page target; signals that forum opinion matters | off-site |

### 3c. Greek (el-GR; same suggestions for el-CY)

| Keyword (native, correct spelling) | English gloss | Intent | Evidence | Priority + why | Best target page |
|---|---|---|---|---|---|
| βιολοντσέλο τιμή / βιολοντσέλο τιμές | cello price(s) | transactional | `[autocomplete]` | **H** (for Greek): main product, Wikipedia-title spelling | category page (cellos) |
| τσέλο τιμή / τσέλο αγορά | cello price / buy cello | transactional | `[autocomplete]` | **H**: same intent, short spelling; use both words on the page | category page (cellos) |
| πόσο κοστίζει ένα τσέλο | how much does a cello cost | info | `[autocomplete]` | **H**: question-shaped, thin pool, no clear owner | buying guide / FAQ |
| κοντραμπάσο τιμή / κοντραμπάσο τιμές | double bass price(s) | transactional | `[autocomplete]` | **H**: Simon has 6 basses | category page (basses) |
| κοντραμπάσο αγορά | buy a double bass | transactional | `[autocomplete]`: returns only itself | **M**: thin | category page (basses) |
| κοντραμπάσο 3/4 | 3/4 double bass | transactional | `[autocomplete]` | **M**: common bass size; check which sizes Simon builds | product page |
| βιολί επαγγελματικό | professional violin | transactional | `[autocomplete]`: returns only itself | **H**: right level for Simon, though thin | category page (violins) |
| βιολί τιμή / βιολί τιμές | violin price(s) | transactional | `[autocomplete]` | **M**: deep pool but mostly beginner, children's and folk; only 3 violins listed | category page (violins) |
| πόσο κοστίζει ένα βιολί / βιολί κόστος | how much does a violin cost | info | `[autocomplete]` | **M** | buying guide |
| βιολί Στραντιβάριους τιμή / αγορά | Stradivarius violin price / buy | info | `[autocomplete]` | **M**: most want the price of the original; explain copies | model page (Messiah) |
| βιολί Αμάτι | Amati violin | info | `[autocomplete]` | **L**: one suggestion only | model page (Amati) |
| χειροποίητο βιολί | handmade violin | transactional | `[autocomplete]`: returns only itself | **M**: thin, but it's the exact description and the site already uses χειροποίητο `[repo]` | category page / home |
| βιολί 4/4 / βιολί 3/4 τιμές | 4/4 violin / 3/4 violin prices | transactional | `[autocomplete]` | **M** | buying guide (size) |
| βιολοντσέλο 4/4 / τσέλο 4/4 | 4/4 cello | transactional | `[autocomplete]` | **M** | product page |
| violin 4 4 for sale / violin 4 4 price (English, gl=gr) | — | transactional | `[autocomplete]` | **M**: Greek users also type English, so the /en pages can catch these | category page (en) |
| τσέλο μεταχειρισμένο / βιολοντσέλο μεταχειρισμένο / κοντραμπάσο μεταχειρισμένο | used cello / used double bass | transactional | `[autocomplete]` | **L** to target, but useful: shows price sensitivity, worth a "new handmade vs used" FAQ | FAQ |
| βιολί για αρχάριους | violin for beginners | info | `[autocomplete]` | **L**: below Simon's band | — |
| βιολί τιμές Skroutz / βιολί τιμές Νάκας | violin prices on Skroutz / at Nakas | navigational | `[autocomplete]` | **L** as a page; shows where Greeks compare prices (the owner decides whether to list there) | off-site |
| βιολοντσέλο και τσέλο | cello and "tselo" (same thing?) | info | `[autocomplete]` | **L**: one line of copy | category page copy |
| κοντραμπάσο vs τσέλο | double bass vs cello | info | `[autocomplete]` | **L** | FAQ |
| οργανοποιείο | instrument workshop | local | `[autocomplete]` | **L**: results are local folk-instrument workshops | home (about) |
| κατασκευαστής βιολιών | violin maker | info | `[autocomplete]` | **L**: completions are quiz clues about Stradivari | home / Reghin heritage page |
| συντήρηση βιολιού | violin maintenance | info | `[autocomplete]`: returns only itself | **L** | care guide |

---

## 4. Questions people ask

These are question-style queries taken word for word from autocomplete `[autocomplete]`. Answer engines (AI search tools that write an answer and cite sources) tend to quote pages that answer questions like these directly.

### Japanese

| Query | English gloss |
|---|---|
| バイオリン 買うなら どこ | Where should I buy a violin? |
| バイオリン 買う時の注意点 | What should I watch for when buying a violin? |
| バイオリン 購入 失敗 | (Stories of) violin purchase mistakes |
| バイオリン いくらから | From what price do violins start? |
| チェロ いくらする / チェロ いくら くらい | How much does a cello cost? |
| チェロ 購入 注意点 | What should I watch for when buying a cello? |
| バイオリン 手工品見分け方 | How do I tell whether a violin is handmade? |
| バイオリン 新作 鳴らない | Is it true that new violins don't resonate? |
| オールドバイオリンとは | What is an "old" violin? |
| バイオリン 国産 ドイツ製 どちらがいい | Japanese-made or German-made violin: which is better? |
| ストラディバリウス なぜ高い | Why is a Stradivarius so expensive? |
| ストラディバリウス なぜ作れない | Why can't anyone make a Stradivarius today? |
| ウッドベース コントラバス 違い | What's the difference between "wood bass" and contrabass? |
| コントラバス チェロ 違い | What's the difference between a double bass and a cello? |
| コントラバス メーカー 見分け 方 | How do I identify a double bass's maker? |
| バイオリン 4/4とは / バイオリン 分数 身長 | What is a 4/4 violin? / Which fractional size for which height? |

### Korean

| Query | English gloss |
|---|---|
| 바이올린 고르는법 / 좋은 바이올린 고르는 법 | How to choose a (good) violin |
| 바이올린 구매 요령 / 바이올린 구매 팁 | Tips for buying a violin |
| 올드 바이올린 구입 방법 | How to buy an old violin |
| 바이올린 사이즈 확인법 | How to check a violin's size |
| 첼로 사이즈 재는 법 | How to measure cello size |
| 바이올린 4/4 뜻 | What does 4/4 mean for a violin? |
| 바이올린 브랜드 확인 | How to check a violin's brand |
| 비올라 바이올린 차이 | Difference between viola and violin |
| 콘트라베이스 더블베이스 차이 | Difference between "contrabass" and "double bass" |
| 콘트라베이스 첼로 차이 | Difference between double bass and cello |
| 바이올린 입문 난이도 | How hard is it to start the violin? |
| 바이올린 얼마나 배워야 | How long do you need to learn the violin? |
| 바이올린 만든 사람 | Who invented the violin? |

### Greek

Greek autocomplete has few question-form queries. These are all that appeared:

| Query (correct spelling) | English gloss |
|---|---|
| πόσο κοστίζει ένα βιολί | How much does a violin cost? |
| πόσο κοστίζει ένα τσέλο | How much does a cello cost? |
| βιολί από ποια ηλικία | From what age can a child start the violin? |
| κοντραμπάσο τι σημαίνει | What does "kontrabáso" mean? |
| βιόλα τι σημαίνει | What does "viola" mean? |
| κοντραμπάσο vs τσέλο | Double bass vs cello |
| βιολοντσέλο και τσέλο | Cello and "tselo": are they the same? |
| αγορά μεταχειρισμένου βιολιού | Buying a used violin |
| βιολί για αριστερόχειρες | Violin for left-handed players |
| βιολί στα αγγλικά | "Violin" in English |

---

## 5. Interest data (Wikipedia pageviews)

Source: Wikimedia REST API, `user` agent type, all access, monthly, Oct 2025–Sep 2026 `[wikipedia-pageviews]`.

**Checking the titles.** Every title was confirmed from the English article's interlanguage links, and from a direct check on each wiki:

- **Article** means a real article.
- **Redirect** rows count only visits to the redirect's own URL. They do **not** show which spelling people prefer.

**Excluded.** None of the three Wikipedias has an article on the town of Reghin:

- ja レギン is a disambiguation page that mixes the Norse figure Regin with the town.
- ko 레긴 is the Norse figure only.
- el has nothing.

Their numbers are left out because they say nothing about interest in Reghin.

**Missing articles.** The English articles Luthier, Amati and Matteo Goffriller link to no Greek article, and Matteo Goffriller links to no Korean one.

### Summary table

| Wiki | Exact title | Type | 12-month total | Avg / month | Low month | High month |
|---|---|---|---|---|---|---|
| ja | ヴァイオリン | article | 65,888 | 5,491 | 4,234 (Apr 26) | 7,001 (Nov 25) |
| ja | チェロ | article | 35,728 | 2,977 | 2,278 (Feb 26) | 4,452 (Nov 25) |
| ja | ヴィオラ | article | 28,912 | 2,409 | 2,146 (Feb 26) | 2,799 (Nov 25) |
| ja | コントラバス | article | 48,614 | 4,051 | 3,258 (Feb 26) | 5,039 (Nov 25) |
| ja | ヴァイオリン製作家 (luthier) | article | 2,305 | 192 | 122 (Feb 26) | 290 (Sep 26) |
| ja | アントニオ・ストラディバリ | article | 17,129 | 1,427 | 912 (Aug 26) | 2,542 (Jan 26) |
| ja | ストラディバリウス | article | 86,980 | 7,248 | 4,569 (Aug 26) | 15,862 (Jan 26) |
| ja | アマティ | article | 2,943 | 245 | 184 (Feb 26) | 526 (May 26) |
| ja | マッテオ・ゴフリラー | article | 1,971 | 164 | 122 (Jun 26) | 250 (Oct 25) |
| ja | バイオリン | redirect → ヴァイオリン | 1,749 | 146 | 109 | 195 |
| ja | ビオラ | redirect → ヴィオラ | 772 | 64 | 46 | 95 |
| ja | ウッドベース | redirect → コントラバス | 1,084 | 90 | 64 | 119 |
| ko | 바이올린 | article | 14,468 | 1,206 | 544 (Feb 26) | 1,680 (Apr 26) |
| ko | 첼로 | article | 7,318 | 610 | 299 (Feb 26) | 1,043 (Oct 25) |
| ko | 비올라 | article | 8,009 | 667 | 380 (Feb 26) | 1,048 (Apr 26) |
| ko | 콘트라베이스 | article | 7,865 | 655 | 475 (Aug 26) | 956 (Dec 25) |
| ko | 루시어 (luthier) | article | 487 | 41 | 25 (Apr 26) | 67 (Aug 26) |
| ko | 안토니오 스트라디바리 | article | 1,530 | 128 | 101 (Feb 26) | 171 (Nov 25) |
| ko | 스트라디바리우스 | article | 1,821 | 152 | 57 (Jul 26) | 295 (Mar 26) |
| ko | 아마티 | article | 629 | 52 | 31 (Dec 25) | 76 (Nov 25) |
| ko | 더블베이스 | redirect → 콘트라베이스 | 215 | 18 | 2 | 32 |
| el | Βιολί | article | 6,004 | 500 | 194 (Jul 26) | 990 (Jan 26) |
| el | Βιολοντσέλο | article | 5,380 | 448 | 209 (Jul 26) | 787 (Dec 25) |
| el | Βιόλα | article | 3,298 | 275 | 134 (Jul 26) | 501 (Jan 26) |
| el | Κοντραμπάσο | article | 4,276 | 356 | 159 (Jul 26) | 701 (Dec 25) |
| el | Αντόνιο Στραντιβάρι | article | 762 | 64 | 37 (Aug 26) | 93 (Dec 25) |
| el | Στραντιβάριους | article | 2,738 | 228 | 146 (Jun 26) | 373 (Nov 25) |
| el | Τσέλο | redirect → Βιολοντσέλο | 79 | 7 | 1 | 13 |

### Monthly detail (core articles)

| Article | Oct 25 | Nov 25 | Dec 25 | Jan 26 | Feb 26 | Mar 26 | Apr 26 | May 26 | Jun 26 | Jul 26 | Aug 26 | Sep 26 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ja:ヴァイオリン | 6,095 | 7,001 | 5,532 | 5,939 | 5,371 | 4,957 | 4,234 | 5,820 | 5,118 | 4,890 | 5,418 | 5,513 |
| ja:チェロ | 3,793 | 4,452 | 2,920 | 2,591 | 2,278 | 2,715 | 3,003 | 2,880 | 2,967 | 2,497 | 2,746 | 2,886 |
| ja:ヴィオラ | 2,708 | 2,799 | 2,419 | 2,411 | 2,146 | 2,216 | 2,380 | 2,454 | 2,318 | 2,201 | 2,400 | 2,460 |
| ja:コントラバス | 4,810 | 5,039 | 4,097 | 3,789 | 3,258 | 3,892 | 4,021 | 4,648 | 4,069 | 3,767 | 3,502 | 3,722 |
| ja:ストラディバリウス | 6,243 | 5,737 | 6,755 | 15,862 | 8,619 | 5,516 | 5,175 | 7,048 | 5,386 | 5,027 | 4,569 | 11,043 |
| ko:바이올린 | 1,453 | 1,476 | 799 | 650 | 544 | 1,132 | 1,680 | 1,655 | 1,659 | 981 | 1,049 | 1,390 |
| ko:첼로 | 1,043 | 861 | 435 | 380 | 299 | 646 | 892 | 697 | 630 | 384 | 455 | 596 |
| ko:비올라 | 674 | 677 | 566 | 502 | 380 | 712 | 1,048 | 787 | 830 | 547 | 615 | 671 |
| ko:콘트라베이스 | 493 | 571 | 956 | 884 | 491 | 687 | 819 | 786 | 648 | 518 | 475 | 537 |
| el:Βιολί | 729 | 688 | 658 | 990 | 631 | 464 | 402 | 486 | 270 | 194 | 238 | 254 |
| el:Βιολοντσέλο | 666 | 477 | 787 | 729 | 626 | 395 | 366 | 369 | 260 | 209 | 210 | 286 |
| el:Βιόλα | 397 | 283 | 446 | 501 | 327 | 303 | 243 | 218 | 162 | 134 | 138 | 146 |
| el:Κοντραμπάσο | 627 | 376 | 701 | 594 | 392 | 311 | 297 | 247 | 209 | 159 | 174 | 189 |

### What the numbers suggest

- **Japan has by far the most interest of the three.** The violin article gets about 4.5× the Korean average and 11× the Greek average. Japanese readers look up the double bass more than the cello (4,051 vs 2,977/month).
- **Japanese Stradivarius interest comes in spikes.** Daily views for ストラディバリウス jumped from about 150–380 to **5,460 on 1 Jan 2026** (1,004 on 2 Jan) `[wikipedia-pageviews daily]`. A smaller spike reached 2,243 on 26 Sep 2026.
  - `[estimate: the 1 January date and the autocomplete query ストラディヴァリウス 格付け ("Stradivarius ranking check") point to the New Year TV blind-listening show; not confirmed]`.
  - For Simon, this is a recurring burst of curiosity: a model page that explains "Stradivari model" copies could pick up some of it.
- **Korean Wikipedia undercounts real interest.** `[estimate: Korea relies heavily on Namu Wiki rather than Wikipedia, so these numbers are a floor]`. The dips in Jan–Feb and Jul–Aug look like the school calendar `[estimate]`.
- **Greek interest is small and fell through 2026.** Βιολί went from 990 in Jan 2026 to 194–254 in Jul–Sep 2026. One year of data cannot separate season from trend.

---

## 6. Recommendations

### Before any of this: two blockers

1. **Product text is not translated in production** (`CLAUDE.md` §9 and `docs/known-issues.md` `[repo]`). Japanese, Korean and Greek product pages show English text, so every "product page" and "model page" row above cannot rank until this is fixed.
2. **Product titles are generic** ("Cello 4/4") `[repo]`. In Japanese, a title shaped like "ゴフリラーモデル チェロ 4/4 手工品・ルーマニア製" would carry three high-priority terms at once `[estimate: built from §3a terms]`. A native speaker should finalise it.

### Japanese: first 3 pages

1. **A Japanese Reghin heritage page.**
   - Working title: "ルーマニア・レギン（レジン）の弦楽器製作：ルーマニア製バイオリン・チェロの特徴と評判" (string-instrument making in Reghin, Romania: characteristics and reputation of Romanian violins and cellos).
   - Targets: ルーマニア バイオリン 評判 / 特徴 / 工房, ルーマニア チェロ メーカー, レジン バイオリン ルーマニア, グリガ 評判 (as context, with a fair comparison).
2. **Model pages** with the original's story, Simon's copy, and price in EUR with an approximate yen figure:
   - ゴフリラーモデル チェロ (Goffriller model cello)
   - ストラディバリ「ダヴィドフ」モデル チェロ (Stradivari "Davidoff" cello)
   - ストラディバリ「メシア」モデル バイオリン (Stradivari "Messiah" violin)
   - Targets: ゴフリラー チェロ 価格, ストラディバリモデル, ストラディバリウス コピー モデル, ストラディバリウス メシア, ダヴィドフ チェロ.
3. **A buying guide with an FAQ** on buying from Europe.
   - Topics: how to choose a handmade or new instrument, market prices, the personal-import process, what to watch for.
   - Targets: チェロ 値段 相場 / プロ, 手工品見分け方, 新作 バイオリン 選び方, バイオリン 個人 輸入 / 海外 購入, 購入 注意点.
   - Shipping, import tax and payment questions belong here. Japan is outside the EU, so import charges apply. Rates are not researched here.

**Evidence that Japan is worth keeping up:**

- It is the only market of the three with Romania-origin queries and model-copy queries `[autocomplete]`.
- It has the highest Wikipedia interest `[wikipedia-pageviews]`.
- Shimamura, a major Japanese instrument retail chain, sells a Gliga (Reghin) violin set `[competitor-page: Gliga ASV1, ¥174,900 incl. tax, page dated 2020-10-22]`.
- The site already names Japan as a buyer country.

### Korean: first 3 pages

1. **Handmade cello and violin category pages with prices.** Targets: 수제 바이올린 가격 / 추천, 수제 첼로 가격, 전공자 첼로 가격.
2. **A buying guide** on choosing a good violin or cello: size chart, buying tips, new vs old. Targets: 바이올린 고르는법, 좋은 바이올린 고르는 법, 구매 요령, 사이즈 키 / 표, 첼로 사이즈 재는 법, 올드 바이올린 구입 방법.
3. **A Goffriller-model cello page and a Messiah-model violin page**, plus an FAQ on overseas shipping. Targets: 고프릴러 첼로, 스트라디바리우스 메시아, 스트라디바리우스 첼로 가격, 바이올린 해외배송.

**Evidence on whether Korea is worth keeping up (mixed):**

- In favour: a real "handmade" (수제) buying pool, and comparison by country of origin (독일 / 중국 수제 바이올린) `[autocomplete]`.
- Against:
  - Almost no Romania signal: bare 루마니아 바이올린 and 글리가 바이올린 only.
  - No evidence for how to write Reghin in Korean.
  - Korea is not named as a buyer country.
  - Wikipedia interest is about a fifth of Japan's (1,206 vs 5,491 views/month for the violin article), though Wikipedia undercounts Korea.

### Greek: first 3 pages

1. **A cello category page** using both words.
   - Working title: "Χειροποίητο βιολοντσέλο (τσέλο): τιμές" (handmade cello: prices).
   - Targets: βιολοντσέλο τιμή / τιμές, τσέλο τιμή / αγορά, βιολοντσέλο 4/4.
2. **A buying guide and FAQ**: "Πόσο κοστίζει ένα τσέλο / ένα βιολί;" (how much does a cello / violin cost?).
   - Topics: sizes 4/4 and 3/4, new handmade vs used (μεταχειρισμένο), and delivery from Romania.
   - Romania, Greece and Cyprus are all EU members, so there are no customs checks on an intra-EU shipment. Confirm VAT handling with an accountant.
   - Targets: πόσο κοστίζει ένα τσέλο / βιολί, βιολί 3/4 τιμές, μεταχειρισμένο.
3. **A double bass category page**: "Κοντραμπάσο: τιμές" (double bass: prices). Targets: κοντραμπάσο τιμή / τιμές / αγορά, κοντραμπάσο 3/4.

**Evidence on whether Greece is worth keeping up (weakest of the three):**

- Many buying seeds return only themselves (thin pools): χειροποίητο βιολί, βιολί επαγγελματικό, κοντραμπάσο αγορά, τσέλο αγορά `[autocomplete]`.
- No Romania queries at all.
- βιολί is dominated by folk and wedding music.
- Greeks compare prices on Skroutz and Nakas.
- Wikipedia interest is the smallest of the three and fell through 2026.
- Cyprus adds no separate signal (identical suggestions).
- Point in favour: as an EU market, there is no customs friction.

### Needs a native-speaker review

- **Japanese:**
  - バイオリン vs ヴァイオリン in titles. The seeds were biased: all buying-intent seeds used バイオリン, so this research cannot say which spelling wins for buying queries. Using both (title in one, body and alt text in the other) is the safe choice.
  - レギン vs レジン for Reghin (the site uses レギン).
  - Whether 手工品 and 新作 read right for a premium workshop.
  - The register (politeness level) for the luxury-craft tone.
- **Korean:**
  - 수제 vs 핸드메이드.
  - 콘트라베이스 vs 더블베이스 among players.
  - What 제작자 등급 ("maker grade") means in the Korean market.
  - How to write Reghin. The site uses 레긴, which on ko Wikipedia is the Norse figure.
- **Greek:**
  - βιολοντσέλο vs τσέλο in page titles.
  - Whether οργανοποιός (used on the site `[repo]`) suggests folk instruments. Autocomplete links οργανοποιείο to bouzouki and Cretan workshops. κατασκευαστής βιολιών / εγχόρδων may fit better.
  - The Ρέγκιν spelling.

---

## Method notes

- **Autocomplete:** 261 calls in total, about 10 over the ~250 budget.
  - ja-JP 107, ko-KR 83, el-GR 65, el-CY 6.
  - Endpoint: `suggestqueries.google.com`, `client=firefox`, with 0.6 s between calls, on 2026-10-24.
  - Each call returns at most 10 suggestions. A missing suggestion does not mean nobody searches it; it means the query is not common enough to be suggested.
- **Seed bias:** the Japanese buying seeds used バイオリン; ヴァイオリン was tested only as a bare word.
- **Raw data and scripts** are in a local scratch folder (not committed):
  - `raw-ja-jp.jsonl`, `raw-ko-kr.jsonl`, `raw-el-gr.jsonl`, `raw-el-cy.jsonl`
  - `pageviews.json`, `pageviews-daily-strad-ja.txt`
  - `wiki-langlinks.json`, `wiki-check.txt`
- **Web sources read:**
  - AFP BB News (Japanese), "ルーマニアのバイオリンメーカー、後継者問題に直面", 2021-03-12: https://www.afpbb.com/articles/-/3333732
  - Shimamura Gliga ASV1 page (2020-10-22; read directly): https://www.shimamura.co.jp/update/?p=57917
  - Shimamura "30万円前後で選ぶ、チェロ特集": https://www.shimamura.co.jp/update/shops/repairviolin/strings/42875/
