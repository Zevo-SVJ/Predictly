# Predictly

Ask about any future event. Predictly researches the latest information and
turns it into a probability.

Event → research → evidence → forecast → probability. It is not a chatbot, not a
betting platform, and it takes no bets.

## Running it

```bash
npm install
cp .env.example .env.local   # fill in the required keys — see below
npm run dev
```

```bash
npm run build      # production build
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
```

## Environment

Predictly performs real web research and real reasoning. **Without the provider
keys it returns a `not_configured` error rather than inventing a forecast.**
There is no offline fallback that produces fake evidence — by design.

| Variable | Required | Purpose |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | **yes** | Event understanding, per-source evidence assessment, written explanation. |
| `ANTHROPIC_MODEL` | no | Defaults to `claude-opus-5`. |
| `TAVILY_API_KEY` | **one of** | Web search + extraction. Preferred. |
| `BRAVE_SEARCH_API_KEY` | **one of** | Search only; pages fetched and extracted locally. |
| `RESEARCH_PROVIDER` | no | Force `tavily` or `brave`. |
| `NEXT_PUBLIC_SUPABASE_URL` | for persistence | Postgres + auth. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | for persistence | Browser client. `NEXT_PUBLIC_SUPABASE_ANON_KEY` also accepted. |
| `SUPABASE_SERVICE_ROLE_KEY` | no | Server-only. Never prefix with `NEXT_PUBLIC_`. |
| `ADMIN_RESOLUTION_SECRET` | no | Enables manual resolution. Unset ⇒ endpoint 404s. |
| `NEXT_PUBLIC_SITE_URL` | no | Canonical/share URLs. Falls back to the Vercel host, then localhost. |

Without Supabase the app still runs: forecasts are held in memory for the life
of the server process, so share links work in one instance but not across
deploys, and sign-in is disabled with an explanatory message.

Apply `supabase/schema.sql` (or `supabase/migrations/`) to create the tables and
row-level security policies. Predictions are world-readable — share links are a
product feature — and writable only by their owner.

## How a forecast is produced

The probability is **not** a number a model was asked to pick. The model
interprets the question and judges each source; the arithmetic happens in plain
TypeScript so it is reproducible and inspectable.

```
src/lib/research/            src/lib/forecast/
  provider.ts   contract       event.ts       outcomes + base rates   (model)
  tavily.ts     search/extract evidence.ts    gather → read → judge   (research + model)
  brave.ts      search only    probability.ts aggregation             (no model)
  normalize.ts  one shape      generate.ts    explanation             (model)
  dedupe.ts     collapse dupes engine.ts      orchestration
```

`calculateProbability` works in log-odds space: it starts from the structural
base rate, weights each source by `strength × reliability × relevance ×
recency`, scores each outcome against its strongest rival, and damps the total
shift with `tanh` so a pile of weak, correlated sources cannot manufacture a
99% forecast. Results are clamped away from 0 and 1.

Deduplication matters to that arithmetic: the same story syndicated by ten
outlets is one piece of evidence, not ten. `dedupe.ts` collapses by canonical
URL and by headline fingerprint before anything is weighed.

**Confidence is not probability.** Probability is about the event; confidence is
about how much usable, recent, agreeing evidence the forecast rests on. A
well-supported 50/50 is a high-confidence forecast; an 80% call built on two
stale posts is not. Confidence is capped at medium when the evidence is old.

## Routes

| Route | What it does |
| --- | --- |
| `/` | Landing page. |
| `/predict` | The forecasting surface. `?q=` starts a run immediately. |
| `/predict/[id]` | Public, shareable forecast with dynamic metadata. |
| `/history` | Saved forecasts for the signed-in user. |
| `/login` | Email magic link + Google. |
| `POST /api/predict` | Runs the pipeline, streams real stage events as NDJSON. |
| `POST /api/predictions/[id]/claim` | Attaches an anonymous forecast to an account. |
| `POST /api/admin/predictions/[id]/resolve` | Manual resolution, secret-gated. |

## The homepage

Six sections, each earning its place. The page is roughly half its previous
height because the redundant example sections are gone, not because content was
thinned.

| Section | What it is |
| --- | --- |
| Hero | Display headline, the real input, a 0–100 rule. One example at a time, cycling through the placeholder. |
| On the radar | One ticker, topic labels only. |
| What can you predict? | Breadth as a single composition — a constellation on desktop, a thumb-driven strip on mobile. |
| Ask. We'll investigate | The page's one product demonstration. Runs the real `POST /api/predict`. |
| Current information | The one explanatory section. |
| What happens next? | Closing CTA back to the input. |

**One example at a time** is enforced throughout: the hero cycles a single
placeholder, the radar shows topics rather than questions, the category field
reveals only the active subject's question, and the demo offers one question.

### Brand marks

`src/lib/categories/` models each subject with an optional `asset` field.
**No asset is currently set on any mark**, so every one renders as its name in
type via `BrandMark`. Two reasons: this environment has no access to the
official brand resources these would have to come from, and hand-drawing
substitutes would be both an approximation of a protected mark and a
fabrication. The typographic form is the permitted neutral representation, not
a placeholder.

To add a cleared mark: confirm the trademark owner's terms permit the use, put
the official file in `/public/brands/`, and set `asset` and `officialUrl` on
that entry. `BrandMark` picks it up with no component change. Bitcoin carries a
glyph because ₿ is a Unicode currency character (U+20BF) and free to use.

## Trending predictions

`src/lib/trending/` holds a `TrendingEventsProvider` behind a curated seed set.
Entries carry `topic`, `eventDate`, `publishedAt` and `expiresAt`, and expire on
their own so the list decays instead of going quietly stale. `priority` is an
editorial ordering weight and is never shown as a measured trend score. The UI
says "curated", never "live" — swapping in a news, fixtures or
most-asked-internally provider is one file.

## Product decisions

- **Free during launch.** `FREE_MODE` in `src/lib/config.ts` is the single flag a
  future billing layer would read. No Stripe, no tiers, no pricing UI.
- **No fake product imagery.** The landing page has no mock dashboard and no
  example forecast card. The hero's only graphic is a 0–100 probability rule.
- **No invented numbers anywhere.** The discovery feed shows a real forecast or
  says there isn't one; the interactive section describes kinds of evidence
  rather than inventing headlines, outlets, dates or URLs, and is labelled
  illustrative.
- **No fabricated evidence, ever.** Missing credentials produce a configuration
  error; failed research produces an honest failure state.

## Safety

Predictly reports probabilities, never certainties, and gives no financial,
legal, medical or betting advice. Server-side URL fetching is guarded against
SSRF (`src/lib/research/safe-fetch.ts`), input is validated server-side, and
forecast generation is rate-limited per client.
