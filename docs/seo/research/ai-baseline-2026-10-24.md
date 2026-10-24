# AI-answer baseline, 2026-10-24 (summary)

Day-0 measurement using [`../ai-visibility-prompts.md`](../ai-visibility-prompts.md). The full
run log (every answer, quotes, competitor counts) is kept private, because it reproduces
third-party personal details from the engines' answers.

## How it was run

- Desktop Chrome on a Romanian connection, so answers lean towards Romania and Reghin.
- **ChatGPT**: signed in (Free), Temporary Chat, web search on. Q01–Q18 once, plus a second run of
  Q01, Q02, Q05, Q07 and Q10 (23 runs). The account's "personalized" setting couldn't be switched
  off.
- **Gemini**: signed in, Temporary chat. Q01–Q11 (11 runs).
- **Google Search, AI Overview**: Q01–Q11 (11 queries). An Overview appeared on 9.
- **Perplexity**: not measured. A sign-in wall appeared after the first prompt.
- "Unbranded" leaves out Q07 and Q08, which contain our name, so a mention there is only an echo.

## Totals

| Engine | Mentioned | Linked | Unbranded mentioned | Unbranded linked |
|---|---|---|---|---|
| ChatGPT | 7/23 | 6/23 | 4/20 | 3/20 |
| Gemini | 2/11 | 2/11 | 0/9 | 0/9 |
| Google AI Overview | 6/11 (3 of them merge us with another workshop) | 6/11 | 5/9 (3/9 correct) | 5/9 |
| Perplexity | n/a | n/a | n/a | n/a |

No engine confused us with Paul Simon the singer.

## What we learned

1. **Identity is the urgent problem.** Asked directly about "Simon Musical Instruments", Google's AI
   Overview described a *different* Reghin workshop whose owner shares the Simon surname. It gave
   that workshop's founder, family and address as ours. Two more Overviews and one ChatGPT answer
   blurred the two. The fix is entity clarity (`README.md` §5):
   - one business name everywhere;
   - an about page naming Paul and Ecaterina Simon, founded 2014, and the address;
   - `Organization` and `Person` structured data;
   - matching Maps and directory listings.
2. **Specific pages get cited, generic ones don't.** ChatGPT and Google both named us first for the
   Davidov-model cello question, and ChatGPT quoted our real prices. For "best luthiers in Reghin" we
   were rarely named.
3. **Engines copy from makers' own sites plus a few directories.** The most-cited sources were other
   Reghin makers' websites. Beyond those: the reghin.ro workshop directory, a Romanian music
   retailer, Facebook groups, Reddit (r/violinmaking), Google Maps listings, a Romanian business
   directory and the local tourism site.
4. **Double basses and non-English buyers are open ground.** ChatGPT named us in none of the three
   double-bass prompts, and in none of the German, French, Dutch, Korean or Greek prompts. English-only
   product text in production (K-4) is probably part of it.
5. **Gemini barely knows us** (0 of 9 unbranded). ChatGPT with web search is our best AI channel
   today.

## Re-run

Monthly, same prompts. Add Perplexity when a logged-out session works, and also measure from a
non-Romanian location (VPN or a remote browser) for the export markets.
