# 🏎️ Qulox Closing Engine — Sprint 1 Implementation

## What Was Built

### Viewer (`/qulox`)

#### `usePulseTracker.js` (Major Upgrade)

| Feature              | Implementation                                                                                      |
| -------------------- | --------------------------------------------------------------------------------------------------- |
| **Path Sequence**    | `pathSequence[]` records every page transition (e.g. `[1,2,5,2,5]`)                                 |
| **Realtime Ping**    | `saveRealtimePing()` fires on every page change + every 5 seconds                                   |
| **Velocity Metrics** | `openTimestamps[]` tracks each session open; computes `frequency_24h`, `revisitGap`, `revisitCount` |
| **Content ROI**      | `computeContentROI()` identifies high-engagement pages (≥10s) and skipped pages                     |
| **setTotalPages()**  | Let viewer pass total page count for accurate skip detection                                        |

#### `services/firebase.js` (New: `saveRealtimePing`)

- Upserts to `realtime_pings/{linkId}_{viewerId}` — one stable document per viewer session
- Uses `setDoc(..., { merge: true })` — prevents write storms

#### `ViewerPage.vue`

- 深夜熱度 notification: appears when `revisit_count > 3`
- Disguised as a benign "Document shared" toast (invisible intent to viewer)
- Animated entrance via Tailwind-compatible CSS transition

---

### Dashboard (`/qulox-dashboard`)

#### `VelocityTachometer.vue`

- SVG semi-circle gauge (200×110 viewBox) with animated needle
- **Redline zone** at 75%+ — pulsing red alert banner activates
- Velocity score: `freq1h × 25 + freq24h × 12` (capped at 100)
- Stats: Opens/24h, Total Revisits, Revisit Gap

#### `DecisionPathMap.vue`

- Horizontal scrollable node chain showing page journey
- **Hesitation Detection**: highlights pages appearing ≥2x in a 6-move window
- **Loop Detection**: finds A↔B toggle patterns, labels them "決策猶豫環"
- Page frequency heatmap with relative bar widths

#### `ContentFuelGauge.vue`

- Per-page dwell bar chart with 🔥🟠🟡❄️ emoji intensity scale
- High Engagement (≥10s) vs Quick Scan (<5s) summary
- Mini circular ROI score ring
- **AI Insight callout**: names the highest-engagement page as a recommended follow-up angle

#### `DocumentPage.vue` (Integrated)

- Closing Engine section appears below tracking links table (only when sessions exist)
- **🔴 LIVE badge**: `onSnapshot` listener on `realtime_pings` collection — shows viewers currently active within last 2 minutes with their current page
- `subscribeToLivePings()` / `unsubscribePings` cleanup on `onBeforeUnmount`

---

## Firestore Collections (New)

| Collection                           | Purpose                                                                      |
| ------------------------------------ | ---------------------------------------------------------------------------- |
| `realtime_pings/{linkId}_{viewerId}` | Live viewer presence & current page                                          |
| `tracking_sessions` (upgraded)       | Now includes `pathSequence`, `pathAnalysis`, `velocityMetrics`, `contentROI` |

---

## Next Step Suggestions (AI Prediction Roadmap)

> [!TIP]
> **Sprint 2 — Predictive Scoring**
> Add a "Close Probability" model that weights: `velocity × 0.4 + engagementDepth × 0.3 + pathHesitation × 0.3`. Fire a push notification when probability crosses 80%.

> [!TIP]
> **Sprint 3 — Page Labeling**
> Let the owner label pages (e.g., "Pricing", "Case Study") to give the Decision Path Map semantic meaning. Then the AI can say "Client is hesitating between Pricing ↔ ROI pages".

> [!TIP]
> **Sprint 4 — Supabase Migration**
> The spec mentions Supabase as the target backend. The current Firebase implementation is architecturally identical — migration is a 1:1 swap of Firebase SDK calls for Supabase `realtime` subscriptions and `insert` calls.
