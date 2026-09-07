# Predictly

Ask about any future event. Predictly researches the latest information and
turns it into a probability-based forecast.

The whole product is one action — **event → research → evidence → forecast →
probability**. It is not a chatbot, not a betting platform, and it takes no bets.

## Running it

```bash
npm install
cp .env.example .env.local   # every key is optional; see below
npm run dev
```

Open <http://localhost:3000>. With no keys set the app runs end to end on
clearly-labelled development fallbacks — the pipeline, the UI and the share
links all work, but no web research happens and every forecast says so.

```bash
npm run build      # production build
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
```

## Environment

| Variable | Required | Purpose |
| --- | --- | --- |
| `TAVILY_API_KEY` | for real research | Web search + extraction. Preferred provider. |
| `BRAVE_SEARCH_API_KEY` | alternative | Search only; pages are fetched and extracted locally. |
| `RESEARCH_PROVIDER` | no | Force `tavily`, `brave` or `dev-fallback`. |
| `ANTHROPIC_API_KEY` | for real forecasts | Powers the three reasoning steps. |
| `ANTHROPIC_MODEL` | no | Defaults to `claude-opus-5`. |
| `NEXT_PUBLIC_SUPABASE_URL` | for accounts | Postgres + auth. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | for accounts | Browser client. |
| `SUPABASE_SERVICE_ROLE_KEY` | no | Server-only. Never exposed to the browser. |
| `ADMIN_RESOLUTION_SECRET` | no | Enables the manual resolution endpoint. Unset ⇒ endpoint returns 404. |
| `NEXT_PUBLIC_SITE_URL` | for production | Canonical and share URLs. |

Apply `supabase/schema.sql` to create the tables and row-level security
policies. Predictions are world-readable (share links are a product feature)
and writable only by their owner.

## How a forecast is produced

The probability is **not** a number a language model was asked to pick. The
model interprets the question and judges each source; the arithmetic happens in
plain TypeScript so it is reproducible and inspectable.

```
ResearchProvider              ForecastEngine
  ├── search()                  ├── understandEvent()      → outcomes + base rates   (model)
  ├── fetch()                   ├── gatherEvidence()       → search, dedupe, rank    (research)
  └── extract()                 ├── evaluateEvidence()     → per-source judgement    (model)
                                ├── calculateProbability() → aggregation             (no model)
                                └── generateForecast()     → explanation             (model)
```

`calculateProbability` (`src/lib/forecast/probability.ts`) works in log-odds
space: it starts from the structural base rate, weights each source by
`strength × reliability × relevance × recency`, scores each outcome against its
strongest rival, and damps the total shift with `tanh` so a pile of weak,
correlated sources cannot manufacture a 99% forecast. Results are clamped away
from 0 and 1 — nothing here is certain.

**Confidence is not probability.** Probability is about the event; confidence is
about how much usable, recent, agreeing evidence the forecast rests on. A
well-supported 50/50 is a high-confidence forecast; an 80% call built on two
stale posts is not.

## Layout

```
src/
  app/                    routes: / · /predict · /predict/[id] · /history · /login
    api/forecast/         NDJSON stream of real pipeline stages
    api/predictions/[id]/claim     attach an anonymous forecast to an account
    api/admin/.../resolve          manual resolution (secret-gated)
  components/             Navbar · Hero · TrendingRail · PredictionInput ·
                          PredictionLoading · PredictionResult · ProbabilityDisplay ·
                          EvidenceList · ForecastFactors · ConfidenceBadge · ShareCard
  lib/
    research/             ResearchProvider: tavily · brave · dev-fallback
    llm/                  ReasoningProvider: anthropic · dev-fallback
    forecast/             engine · probability · prompts · schemas
    store/                PredictionStore: supabase · memory
    data/                 trending seed set · landing example
```

Providers are resolved in one place each (`research/index.ts`, `llm/index.ts`),
so swapping one is a single edit and nothing above that layer changes.

## Development fallbacks

Missing credentials degrade rather than break, and never pretend:

- **No research key** → synthetic fixtures. Source links point at `/dev-research`,
  publishers read "Development fixture", and the forecast carries a banner
  saying no research was performed.
- **No Anthropic key** → deterministic local heuristics, flagged the same way.
- **No Supabase** → forecasts live in memory for the life of the process;
  sign-in is disabled with an explanatory message.

Mocked evidence is never presented as real research.

## Product decisions

- **Free until 22 September 2026.** `FREE_MODE` in `src/lib/config.ts` is the
  single switch a future billing layer would read. No Stripe, no tiers, no
  pricing UI.
- **The landing rails are a curated seed set**, labelled "Worth predicting"
  rather than "Trending", because nothing is fetched live yet.
  `getTrendingEvents()` is the seam for a real pipeline.
- **The landing example forecast is hand-written**, labelled as an example, and
  cites real articles with their real URLs and dates.
- **Resolution architecture exists; automation does not.** The schema and a
  secret-gated endpoint are in place; automatic resolution is deliberately out
  of scope for the MVP.

## Safety

Predictly reports probabilities, never certainties, and gives no financial,
legal, medical or betting advice. Server-side URL fetching is guarded against
SSRF (`src/lib/research/safe-fetch.ts`), input is validated server-side, and
forecast generation is rate-limited per client.
