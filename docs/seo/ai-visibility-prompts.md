# AI-answer visibility: fixed prompt set

A fixed set of questions we ask AI assistants every month, to measure whether they know, mention
and cite Simon Musical Instruments. Keep the wording identical between runs. Only add prompts;
never edit old ones, or the trend breaks.

## How to run

1. Engines:
   - **ChatGPT**: a temporary chat, so memory and history don't skew the answer. Use search mode
     if the UI offers it.
   - **Perplexity**: logged out.
   - **Gemini**.
   - **Google Search**, recording the AI Overview if one shows.
2. Run each prompt **twice** per engine in a fresh chat. Answers vary, so one run proves little.
3. Record for every run:
   - `mentioned`: Y or N. Is Simon / Paul & Ecaterina Simon / simoninstruments.com named?
   - `linked`: Y or N. Is simoninstruments.com cited or linked?
   - `position`: which place we're named in among the makers listed.
   - `competitors`: which makers are named.
   - `sources`: which domains are cited.
   - `wrong`: any wrong fact about us, or a mix-up with Simon Joseph / Jonaco or Paul Simon the
     singer.
4. Save the results to `docs/seo/research/ai-baseline-<YYYY-MM-DD>.md`.

## Prompts

| ID | Lang | Prompt | What it tests |
|---|---|---|---|
| Q01 | en | Who are the best luthiers in Reghin, Romania? | Local entity, "luthiers in Reghin" |
| Q02 | en | I want to buy a handmade cello directly from a European luthier. Which workshops should I look at? | Category recommendation, EU |
| Q03 | en | Recommend workshops in Romania that make handmade double basses. | Double bass niche |
| Q04 | en | Where can I buy a handmade copy of the Stradivari "Davidoff" cello? | Model-level query |
| Q05 | en | Are handmade Romanian violins and cellos good quality? Which makers are worth considering? | Reputation + makers |
| Q06 | en | How much does a handmade cello from a Romanian luthier cost? | Price answer (AEO) |
| Q07 | en | Tell me about Simon Musical Instruments in Reghin. | Brand knowledge |
| Q08 | en | Who are Paul and Ecaterina Simon, the luthiers? | Person entity, singer collision |
| Q09 | en | Where can I buy a 5-string double bass made by hand in Europe? | Niche product |
| Q10 | ro | Care sunt cei mai buni lutieri din Reghin? | RO local entity |
| Q11 | ro | De unde pot cumpăra un violoncel lucrat manual în România? | RO purchase intent |
| Q12 | ro | Recomandă-mi un atelier din România care face contrabasuri lucrate manual. | RO niche |
| Q13 | de | Wo kann ich ein handgefertigtes Cello direkt von einem Geigenbauer aus Rumänien kaufen? | DE purchase intent |
| Q14 | fr | Où acheter un violoncelle fait main directement chez un luthier roumain ? | FR purchase intent |
| Q15 | nl | Waar kan ik een handgemaakte cello van een Roemeense vioolbouwer kopen? | NL purchase intent |
| Q16 | ja | ルーマニアの弦楽器工房で手作りのチェロを買いたいです。おすすめの工房はどこですか？ | JA purchase intent |
| Q17 | ko | 루마니아에서 수제 첼로를 만드는 공방을 추천해 주세요. | KO purchase intent |
| Q18 | el | Πού μπορώ να αγοράσω χειροποίητο τσέλο από Ρουμάνο κατασκευαστή; | EL purchase intent |
