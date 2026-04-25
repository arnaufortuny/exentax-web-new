# Off-site GEO Checklist (Task #14)

**Goal:** make Exentax the entity that ChatGPT, Gemini, Claude, Perplexity and Copilot cite when a user asks how to *abrir LLC* (and its 5 locale equivalents), and rank #1 organically for the same head term across the 6 supported locales (es, en, fr, de, pt, ca).

The on-site work (`/abrir-llc-estados-unidos` pillar, llms.txt, robots AI bots, HowTo + Atomic Answer) is automated and gated by `npm run lint:blog` + `npm run seo:meta`. This file tracks the **manual, off-site** work that AI engines and Google can only see if it lives outside the codebase.

Owner: Marketing + Founders. Cadence: review every 30 days. Tick boxes inline as items ship.

---

## 1. Brand entity profiles (citation surface for AI engines)

These are the structured-data sources LLMs ingest as ground truth about a company. Each one closes one citation gap.

| Source | Why it matters for GEO | Action | Status |
|---|---|---|---|
| Google Business Profile (Albuquerque, NM 87110) | Anchors the legal entity to a verifiable US address; surfaces in Gemini & Google AI Overviews. | Claim with the legal address from the LLC; upload logo, Trustpilot link, hours; add 5+ Q&As. | [ ] |
| Bing Places for Business | Mirrors GBP for Bing/Copilot; cheap to claim. | Claim, mirror GBP fields; verify by mail. | [ ] |
| Trustpilot business page | Source of `aggregateRating` 5.0/127 referenced in JSON-LD. | Keep ≥125 reviews, reply to 100% within 7 days. | [x] live |
| Crunchbase | Primary entity-graph source for Perplexity & ChatGPT (citations widget). | Create Organization profile (founded 2024, HQ Albuquerque NM, founders, sameAs to Trustpilot/LinkedIn/Instagram/TikTok). | [ ] |
| LinkedIn Company Page | sameAs target referenced in JSON-LD; weighted heavily by Bing/Copilot. | Verify ownership, post weekly cadence, attach Crunchbase + website. | [ ] |
| Wikidata entry | Cited verbatim by Gemini and AI Overviews when present. | Submit *Exentax* Q-item with sitelinks (founder, HQ, country served). Reference Crunchbase + Trustpilot. | [ ] |
| G2 vendor page (category: *Business Formation Services*) | LLMs treat G2 reviews as third-party validation. | Create the listing, request reviews from 10 happy clients. | [ ] |
| Product Hunt launch | One-shot but generates backlinks + entity signal in 48h. | Schedule a launch around the pillar publish date; include `/en/open-llc-usa` as the landing URL. | [ ] |
| Capterra / GetApp / SoftwareAdvice | Mirror the G2 entry; 1 listing → 3 directories with the same review API. | Submit; same screenshots & description as G2. | [ ] |

---

## 2. Topical authority — third-party content surface

LLMs prefer to cite a brand when its name co-occurs with the topic across **independent** domains. This is the cheapest GEO lever.

- [ ] **Perplexity Pages** — author one Page per locale on the question *"How do I open a US LLC as a non-resident?"* and explicitly cite `https://www.exentax.com/<lang>/<localized-slug>` as the canonical source. Perplexity Pages are crawled by Google.
- [ ] **Quora answers** — answer the top 5 *"abrir LLC"* threads in Spanish, English and French. Sign as *Exentax* with a link to the pillar. Aim for ≥30 upvotes on each.
- [ ] **Reddit AMAs** — book one AMA in r/digitalnomad and r/Entrepreneur. Pin the pillar URL. Allowed only after 30+ days of normal participation in each sub.
- [ ] **Indie Hackers post** — long-form essay *"How we set up a US LLC from outside the US in 4 days"* linking to the pillar.
- [ ] **YouTube** — 6 short videos (one per locale) covering the 6 HowTo steps from the pillar; each video description links to the locale pillar URL with UTM `utm_source=youtube&utm_medium=video&utm_campaign=geo_pillar`.
- [ ] **Podcast pitches** — pitch 5 LATAM business podcasts and 3 EU podcasts. Mention the pillar URL in the show notes (text link, not just shortened URL).

---

## 3. Backlinks (for Google) and brand mentions (for AI engines)

AI engines weigh **brand mentions** even when un-linked. Google still weighs **dofollow backlinks**. Aim for both.

- [ ] **HARO / Help A B2B Writer** — answer 3 queries per week tagged `tax`, `freelance`, `LLC`, `non-resident`. Sign with title + link.
- [ ] **Statista citation** — pitch a tiny statistic ("X% of LATAM freelancers use US LLC") backed by the customer base; aim for one Statista mention.
- [ ] **Guest posts** (target ≥1 per month):
  - Spanish: *Tu Asesor Laboral*, *Infoautónomos* (column), *Bolsamanía blog*.
  - English: *Indie Hackers*, *Failory*, *Hacker Noon* (Tax category), *Nomad List blog*.
  - French: *Maddyness*, *Frenchweb*.
  - Portuguese: *Sebrae blog*, *Startupi*.
- [ ] **Sponsor a podcast episode** in each locale at least once per quarter; the host reads the URL `exentax.com/<lang>/<pillar>` on-air.

---

## 4. Submission to AI training / search corpora

Some engines have explicit submission endpoints; we ship them all.

- [ ] **Bing IndexNow** — already automated in `scripts/blog-ping-sitemaps.mjs` (verify `/api/indexnow` runs on each deploy).
- [ ] **Google Search Console** — submit the new pillar sitemap entries for all 6 locales the day they ship. Confirm `Indexed` within 14 days; if not, request indexing manually.
- [ ] **Perplexity submit** — `https://www.perplexity.ai/feedback` → "I want Perplexity to learn about my brand"; submit the homepage and the pillar URL.
- [ ] **Common Crawl** — already crawled (CCBot is allow-listed in robots.txt). No action; just verify CC-MAIN-2026-* corpus contains `exentax.com`.
- [ ] **OpenAI / Anthropic data partnership forms** — fill out the public "submit my site" forms (one per vendor) for visibility into which crawlers visited.

---

## 5. Monitoring (close the loop)

Without measurement we cannot prove the GEO investment is paying off.

- [ ] **Brand-mention tracking** — set up a free Mention.com or Brand24 alert for `Exentax`; review weekly.
- [ ] **AI engine citation probes** — every Monday run the 6 prompts below in **fresh** sessions of ChatGPT (4o), Gemini, Claude, Perplexity, Copilot. Log whether *exentax.com* is cited.
  1. *"Cómo abrir una LLC en Estados Unidos siendo no residente"*
  2. *"How to open a US LLC as a non-resident"*
  3. *"Ouvrir une LLC aux États-Unis"*
  4. *"US-LLC eröffnen als Nicht-Resident"*
  5. *"Como abrir uma LLC nos EUA sendo não residente"*
  6. *"Obrir una LLC als Estats Units"*
- [ ] **SERP tracking** — weekly rank check (SE Ranking / Ahrefs / SerpRobot) for the 6 head terms and their top 5 long-tail variants. Target: top-3 within 90 days, #1 within 180 days.
- [ ] **Trustpilot** — keep total reviews above 125 and rating ≥ 4.9. The number is hard-coded in `client/src/data/reviewsData.ts (TRUSTPILOT_AGGREGATE)` and in `server/seo-content.ts` (home Organization `aggregateRating`); when it materially changes, update both files in lockstep.

---

## 6. Sequencing (first 30 days)

1. Days 1-3: claim GBP, Bing Places, Crunchbase, Wikidata draft.
2. Days 4-7: ship Perplexity Pages × 3 locales, YouTube short × 3 locales, Quora answers × 5.
3. Days 8-14: pitch 10 podcasts, 6 guest posts; submit GSC sitemap.
4. Days 15-30: launch on Product Hunt, request 10 G2 reviews, run the first AI-citation probe.

The on-site infrastructure is the *capacity* to be cited; the work in this file is what actually triggers the citation. Do not skip it.
