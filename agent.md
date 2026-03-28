# Qulox Dashboard - Knowledge Base & Agent Context

## 📌 Project Overview

**Qulox Dashboard** is the owner-facing Sales Intelligence command centre for the Qulox system. It allows sales reps to upload PDF documents, generate unique tracking links per client, and monitor client reading behaviour in real time through the **Closing Engine** — a trio of analytics widgets that decode buyer intent.

This repo is the **Dashboard** side. The companion **Viewer** repo (`qulox`) is the silent tracker that runs on the client's browser.

## 🛠️ Tech Stack

- **Framework**: Vue 3 (Composition API, `<script setup>`)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (custom `brand` colour palette defined in `tailwind.config.js`)
- **Routing**: Vue Router (`vue-router`) — hash-less history mode
- **Backend / Database**: Firebase v9+ Modular SDK (Firestore + Auth + Storage)
- **UI Style**: Dark-mode HUD aesthetic (gray-900/gray-950 base, brand-500 accent)

## 📁 Project Structure (`/src`)

### Pages

- **`pages/LoginPage.vue`**: Firebase Auth login form.
- **`pages/DashboardPage.vue`**: Main document list. Shows stats overview (total sessions, dwell, HOT/WARM counts) and a grid of document cards with ScoreRing.
- **`pages/DocumentPage.vue`**: Document detail. Shows metadata, tracking links table, and the **Closing Engine** analytics section.
- **`pages/ClientsPage.vue`**: Client management view.

### Components

- **`components/UploadModal.vue`**: Handles PDF upload to Firebase Storage + creates a `documents` Firestore record.
- **`components/CreateLinkModal.vue`**: Generates a `tracking_links` record with a random `shortCode` for a given client.
- **`components/ClientModal.vue`**: Client creation/edit modal.
- **`components/ScoreRing.vue`**: Animated SVG ring that visualises the Intent Score (0–100).
- **`components/VelocityTachometer.vue`**: 🏎️ Closing Engine — SVG semi-circle gauge showing open frequency. Enters "Redline" mode (red, pulsing) when velocity ≥ 75.
- **`components/DecisionPathMap.vue`**: 🗺️ Closing Engine — Scrollable page journey node chain. Detects A↔B hesitation loops ("決策猶豫環") and highlights them.
- **`components/ContentFuelGauge.vue`**: ⛽ Closing Engine — Per-page dwell bar chart. Surfaces high-engagement pages and emits an AI insight callout.

### Composables

- **`composables/useAuth.js`**: Firebase Auth state (`user`, `logout`).
- **`composables/useDocuments.js`**: CRUD for `documents` Firestore collection.
- **`composables/useTrackingLinks.js`**: CRUD for `tracking_links` collection. Includes `getViewerUrl(shortCode)` to build the shareable viewer URL.
- **`composables/useScores.js`**: Reads `tracking_sessions` (written by the Viewer). Provides `calculateDealScore()`, `getScoreLabel()`, `getScoreColor()`, `getDashboardStats()`, and raw `sessions` ref.
- **`composables/useClients.js`**: CRUD for `clients` collection.

### Services

- **`services/firebase.js`**: Initialises Firebase app; exports `db`, `auth`, `storage`.

## 🧠 Core Concepts

### Firestore Collections

| Collection          | Owner                      | Purpose                                                                                                    |
| ------------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `documents`         | Dashboard                  | PDF metadata: `name`, `fileName`, `storageUrl`, `ownerId`, `createdAt`                                     |
| `tracking_links`    | Dashboard                  | Per-client links: `documentId`, `ownerId`, `clientName`, `shortCode`, `isActive`                           |
| `tracking_sessions` | Viewer → read by Dashboard | Full session report: `intentScore`, `pageStats`, `events`, `pathSequence`, `velocityMetrics`, `contentROI` |
| `realtime_pings`    | Viewer → read by Dashboard | Live presence: one document per `{linkId}_{viewerId}`, updated every 5s. Used for the 🔴 LIVE badge        |

### Intent Score System (`useScores.js`)

- `calculateDealScore(sessions[])` — aggregates `intentScore` across sessions, adds multi-session bonus, event bonus (copy/print), and recency bonus. Returns 0–100.
- Labels: `> 80` = 🔥 HOT, `> 50` = 🟠 Warm, `> 20` = 🟡 Interested, `> 0` = 🔵 Cold

### Closing Engine (3 Widgets in `DocumentPage.vue`)

Displayed below the tracking links table when `closingEngineSessions.length > 0`.

1. **VelocityTachometer** — velocity score from `openTimestamps`. Redline ≥ 75.
2. **DecisionPathMap** — `pathSequence` from the latest session. Detects loops (e.g. P2↔P5).
3. **ContentFuelGauge** — aggregated `pageStats.totalDwellMs` per page across all sessions.

Detailed implementation and scoring logic can be found in:

- [Closing Engine Spec](./docs/closing_engine_spec.md)
- [Intent Scoring Logic](./docs/intent_scoring_logic.md)

Live presence uses `onSnapshot` on `realtime_pings` filtered by the document's `linkIds`, showing viewers active in the last 2 minutes.

### Viewer URL Convention

```
Viewer base (dev):  http://localhost:5173
Viewer base (prod): configured in useTrackingLinks.js → getViewerUrl()
Viewer route:       /v/:shortCode
```

## 📝 Rules & Guidelines for AI Assistants

1. **Composition API**: Always use Vue 3 `<script setup>` syntax.
2. **Styling**: Tailwind CSS only. The custom `brand` colour (violet/purple) is defined in `tailwind.config.js` — use `brand-500`, `brand-400` etc. for primary accents.
3. **Firebase SDK**: Modular v9 SDK only (e.g. `import { doc, getDoc } from "firebase/firestore"`).
4. **Dark Theme**: All UI must follow the dark HUD aesthetic — `bg-gray-900/40`, `border-gray-800/50`, `text-gray-400` for secondary text, `text-white` for primary.
5. **Sidebar**: `DashboardPage` and `DocumentPage` share an identical sidebar. If you change navigation items, update both pages.
6. **Closing Engine widgets** receive a `sessions[]` prop (array of `tracking_session` documents). Do not pass raw Firestore refs — always resolve to plain objects first.
7. **No bloat**: Keep the product focused on behaviour metrics and scoring. Avoid adding generic CRM features.

## 🚀 Development Commands

- `npm install` — Install dependencies.
- `npm run dev` — Start local dev server (Vite, default port 5173 or next available).
- `npm run build` — Production build.
