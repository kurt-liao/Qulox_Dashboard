<template>
  <AppShell>
    <div class="p-8 max-w-5xl mx-auto">
      <div class="mb-6">
        <button
          type="button"
          @click="goBack"
          class="inline-flex items-center gap-1.5 mb-3 px-3 py-1.5 text-xs border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100/70 dark:hover:bg-gray-800/70 transition-colors"
        >
          <svg
            class="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          <span>回到 閱讀紀錄</span>
        </button>
        <div>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            閱讀細節
          </h2>
          <p class="text-sm text-gray-500">
            單次閱讀行為的細節：每頁停留時間與關鍵互動。
          </p>
        </div>
      </div>

      <div v-if="isLoading" class="flex items-center justify-center py-16">
        <svg
          class="w-6 h-6 animate-spin text-brand-500"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      </div>

      <div v-else-if="!session" class="text-sm text-gray-500">
        找不到這個 session。
      </div>

      <div v-else class="space-y-6">
        <!-- Overview card -->
        <div
          class="rounded-2xl border border-gray-200 dark:border-gray-800/60 bg-white dark:bg-gray-900/60 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div class="space-y-1">
            <p class="text-xs text-gray-500">Document</p>
            <p class="text-sm font-medium text-gray-900 dark:text-white">
              {{ session.documentId || '—' }}
            </p>
            <p class="text-xs text-gray-500">
              Link: {{ session.linkId || '—' }}
            </p>
            <p class="text-xs text-gray-500">
              Client: {{ session.clientName || '—' }}
            </p>
          </div>
          <div class="flex flex-wrap gap-4 items-center">
            <div>
              <p class="text-xs text-gray-500 mb-1">Intent</p>
              <span
                class="inline-flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-medium"
                :class="[
                  getScoreColor(session.intentScore || 0).bg,
                  getScoreColor(session.intentScore || 0).text,
                  getScoreColor(session.intentScore || 0).border,
                ]"
              >
                <span>{{ getScoreLabel(session.intentScore || 0) }}</span>
                <span>· {{ session.intentScore ?? 0 }}</span>
              </span>
            </div>
            <div>
              <p class="text-xs text-gray-500 mb-1">總閱讀時間</p>
              <p class="text-sm font-semibold text-gray-900 dark:text-white">
                {{ formatDwell(session.totalDwellSecs || 0) }}
              </p>
            </div>
            <div>
              <p class="text-xs text-gray-500 mb-1">時間</p>
              <p class="text-xs text-gray-500">
                {{ formatRange(session.startedAt, session.endedAt) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Per-page dwell chart -->
        <div
          class="rounded-2xl border border-gray-200 dark:border-gray-800/60 bg-white dark:bg-gray-900/60 p-5"
        >
          <div class="flex items-center justify-between mb-3">
            <p class="text-sm font-medium text-gray-900 dark:text-white">
              每頁停留時間
            </p>
            <p class="text-xs text-gray-500">
              橫條越長代表在該頁停留越久。
            </p>
          </div>
          <div v-if="pageEntries.length === 0" class="text-xs text-gray-500">
            沒有 pageStats 資料。
          </div>
          <div v-else class="space-y-2">
            <div
              v-for="p in pageEntries"
              :key="p.page"
              class="flex items-center gap-3"
            >
              <div class="w-10 text-xs text-gray-500 shrink-0">P{{ p.page }}</div>
              <div
                class="flex-1 h-4 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"
              >
                <div
                  class="h-full rounded-full bg-brand-500/80"
                  :style="{ width: p.normalizedWidth + '%' }"
                ></div>
              </div>
              <div class="w-20 text-xs text-gray-500 text-right shrink-0">
                {{ p.dwellLabel }}
              </div>
            </div>
          </div>
        </div>

        <!-- Key behaviors panel -->
        <div
          class="rounded-2xl border border-gray-200 dark:border-gray-800/60 bg-white dark:bg-gray-900/60 p-5"
        >
          <p class="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Key Behaviors
          </p>
          <div
            v-if="!session.events || session.events.length === 0"
            class="text-xs text-gray-500"
          >
            沒有記錄到任何互動事件。
          </div>
          <div v-else class="space-y-3">
            <div class="flex flex-wrap gap-2">
              <span
                v-if="hasPrintIntent"
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
              >
                🖨️ 有列印意圖
              </span>
              <span
                v-if="hasCopy"
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
              >
                📋 有複製文字
              </span>
              <span
                v-if="hasSelectionOnly"
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20"
              >
                ✏️ 有選取重點
              </span>
              <span
                v-if="hasLinkClick"
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
              >
                🔗 點擊文件中的連結
              </span>
              <span
                v-if="hasZoomScrutinize"
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20"
              >
                🔍 放大仔細查看內容
              </span>
            </div>

            <div
              class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-500"
            >
              <div v-if="copyPages.length">
                <p class="font-medium text-gray-700 dark:text-gray-200 mb-1">
                  複製文字的頁面
                </p>
                <p>頁碼：P{{ copyPages.join(', P') }}</p>
              </div>
              <div v-if="selectionPages.length">
                <p class="font-medium text-gray-700 dark:text-gray-200 mb-1">
                  有選取文字的頁面
                </p>
                <p>頁碼：P{{ selectionPages.join(', P') }}</p>
              </div>
              <div v-if="linkClickPages.length">
                <p class="font-medium text-gray-700 dark:text-gray-200 mb-1">
                  點擊連結的頁面
                </p>
                <p>頁碼：P{{ linkClickPages.join(', P') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppShell>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppShell from "../layouts/AppShell.vue";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase.js";
import { useTrackingSessions } from "../composables/useScores.js";

const route = useRoute();
const router = useRouter();
const session = ref(null);
const isLoading = ref(true);

const { getScoreLabel, getScoreColor } = useTrackingSessions();

const goBack = () => {
  router.push("/dashboard/sessions");
};

onMounted(async () => {
  const id = route.params.id;
  if (!id) {
    isLoading.value = false;
    return;
  }
  try {
    const snap = await getDoc(doc(db, "tracking_sessions", id));
    if (snap.exists()) {
      session.value = { id: snap.id, ...snap.data() };
    }
  } catch (e) {
    console.error("Failed to load session", e);
  } finally {
    isLoading.value = false;
  }
});

const pageEntries = computed(() => {
  if (!session.value?.pageStats) return [];
  const entries = Object.entries(session.value.pageStats).map(
    ([page, data]) => ({
      page: Number(page),
      dwellSecs: Math.round((data.totalDwellMs || 0) / 1000),
    }),
  );
  const maxDwell = entries.reduce(
    (max, p) => (p.dwellSecs > max ? p.dwellSecs : max),
    0,
  );
  return entries
    .sort((a, b) => a.page - b.page)
    .map((p) => ({
      ...p,
      normalizedWidth: maxDwell
        ? Math.max((p.dwellSecs / maxDwell) * 100, 4)
        : 0,
      dwellLabel:
        p.dwellSecs < 60
          ? `${p.dwellSecs}s`
          : `${Math.floor(p.dwellSecs / 60)}m ${p.dwellSecs % 60}s`,
    }));
});

const events = computed(() => session.value?.events || []);

const hasPrintIntent = computed(() =>
  events.value.some((e) => e.type === "print_intent"),
);
const hasCopy = computed(() =>
  events.value.some((e) => e.type === "text_copy"),
);
const hasSelectionOnly = computed(() =>
  !hasCopy.value && events.value.some((e) => e.type === "text_selection"),
);
const hasLinkClick = computed(() =>
  events.value.some((e) => e.type === "link_click"),
);
const hasZoomScrutinize = computed(() =>
  events.value.some((e) => e.type === "zoom_scrutinize"),
);

const copyPages = computed(() => {
  const set = new Set(
    events.value
      .filter((e) => e.type === "text_copy" && e.page)
      .map((e) => e.page),
  );
  return Array.from(set).sort((a, b) => a - b);
});

const selectionPages = computed(() => {
  const set = new Set(
    events.value
      .filter((e) => e.type === "text_selection" && e.page)
      .map((e) => e.page),
  );
  return Array.from(set).sort((a, b) => a - b);
});

const linkClickPages = computed(() => {
  const set = new Set(
    events.value
      .filter((e) => e.type === "link_click" && e.page)
      .map((e) => e.page),
  );
  return Array.from(set).sort((a, b) => a - b);
});

const formatDwell = (totalSecs) => {
  if (!totalSecs || totalSecs <= 0) return "0s";
  if (totalSecs < 60) return `${totalSecs}s`;
  if (totalSecs < 3600)
    return `${Math.floor(totalSecs / 60)}m ${totalSecs % 60}s`;
  const hrs = Math.floor(totalSecs / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  return `${hrs}h ${mins}m`;
};

const formatRange = (start, end) => {
  const s = start?.toDate?.() ? start.toDate() : null;
  const e = end?.toDate?.() ? end.toDate() : null;
  if (!s && !e) return "—";
  if (s && e) {
    return `${s.toLocaleTimeString("zh-TW", {
      hour: "2-digit",
      minute: "2-digit",
    })} - ${e.toLocaleTimeString("zh-TW", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }
  const ts = s || e;
  return ts.toLocaleString("zh-TW");
};
</script>
