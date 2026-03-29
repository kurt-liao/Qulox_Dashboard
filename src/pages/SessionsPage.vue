<template>
  <AppShell>
    <template #user>
      <!-- 使用 DashboardPage 的 user 區塊邏輯會比較好，但目前先簡化為空 slot -->
    </template>
    <div class="p-8">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        閱讀紀錄
      </h2>
    <p class="text-sm text-gray-500 mb-6">
      最近的閱讀紀錄，含單次閱讀的 intent score。
    </p>

    <!-- Filter: document select -->
    <div
      v-if="documents.length > 0"
      class="mb-4 flex items-center justify-between gap-4"
    >
      <div class="text-xs text-gray-500">
        目前篩選：
        <span class="font-medium text-gray-700 dark:text-gray-200">
          {{ selectedDocumentId === 'all'
            ? '全部文件'
            : (documents.find((d) => d.id === selectedDocumentId)?.name || selectedDocumentId)
          }}
        </span>
      </div>
      <select
        v-model="selectedDocumentId"
        class="text-xs px-2 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200"
      >
        <option value="all">全部文件</option>
        <option v-for="doc in documents" :key="doc.id" :value="doc.id">
          {{ doc.name }}
        </option>
      </select>
    </div>

    <!-- Summary panel: Today HOT/WARM sessions -->
    <div
      v-if="!isLoading && filteredSessions.length > 0"
      class="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4"
    >
      <div
        class="rounded-2xl border border-gray-200 dark:border-gray-800/60 bg-white dark:bg-gray-900/60 px-4 py-3 flex items-center justify-between"
      >
        <div>
          <p class="text-xs text-gray-500">今天的 HOT sessions</p>
          <p class="text-2xl font-semibold text-gray-900 dark:text-white">
            {{ todayStats.hotCount }}
          </p>
        </div>
        <span class="text-xl">🔥</span>
      </div>
      <div
        class="rounded-2xl border border-gray-200 dark:border-gray-800/60 bg-white dark:bg-gray-900/60 px-4 py-3 flex items-center justify-between"
      >
        <div>
          <p class="text-xs text-gray-500">今天的 WARM sessions</p>
          <p class="text-2xl font-semibold text-gray-900 dark:text-white">
            {{ todayStats.warmCount }}
          </p>
        </div>
        <span class="text-xl">🟠</span>
      </div>
      <div
        class="rounded-2xl border border-gray-200 dark:border-gray-800/60 bg-white dark:bg-gray-900/60 px-4 py-3 flex flex-col justify-center"
      >
        <p class="text-xs text-gray-500 mb-1">今日總閱讀時間</p>
        <p class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ todayStats.totalDwellFormatted }}
        </p>
      </div>
    </div>

    <div v-if="isLoading" class="flex items-center justify-center py-12">
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

    <div v-else-if="sessions.length === 0" class="text-sm text-gray-500">
      目前尚無任何 session 紀錄。
    </div>

    <div v-else class="overflow-x-auto bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800/50 rounded-2xl shadow-sm dark:shadow-none">
      <!-- TODO: documentName / filters will be added here -->
      <table class="min-w-full text-left text-sm">
        <thead class="bg-gray-50 dark:bg-gray-900/60 border-b border-gray-200 dark:border-gray-800/70">
          <tr>
            <th class="px-4 py-2 font-medium text-gray-500">Document</th>
            <th class="px-4 py-2 font-medium text-gray-500">Client</th>
            <th class="px-4 py-2 font-medium text-gray-500">Intent</th>
            <th class="px-4 py-2 font-medium text-gray-500">Dwell</th>
            <th class="px-4 py-2 font-medium text-gray-500">Ended</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="s in sortedSessions"
            :key="s.id"
            class="border-b border-gray-100 dark:border-gray-800/70 hover:bg-gray-50/60 dark:hover:bg-gray-900/60 cursor-pointer"
            @click="goToDetail(s.id)"
          >
            <td class="px-4 py-2 text-gray-800 dark:text-gray-100">
              <div class="flex flex-col">
                <span class="font-medium">
                  {{
                    documents.find((d) => d.id === s.documentId)?.name ||
                    s.documentId ||
                    '—'
                  }}
                </span>
                <span class="text-xs text-gray-500">
                  {{ s.linkId || 'link?' }}
                </span>
              </div>
            </td>
            <td class="px-4 py-2 text-gray-800 dark:text-gray-100">
              {{ s.clientName || '—' }}
            </td>
            <td class="px-4 py-2">
              <span
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium"
                :class="[
                  getScoreColor(s.intentScore || 0).bg,
                  getScoreColor(s.intentScore || 0).text,
                  getScoreColor(s.intentScore || 0).border,
                ]"
              >
                <span>{{ getScoreLabel(s.intentScore || 0) }}</span>
                <span>· {{ s.intentScore ?? 0 }}</span>
              </span>
            </td>
            <td class="px-4 py-2 text-gray-800 dark:text-gray-100">
              {{ formatDwell(s.totalDwellSecs || 0) }}
            </td>
            <td class="px-4 py-2 text-gray-500">
              {{ formatEndedAt(s.endedAt, s.createdAt) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    </div>
  </AppShell>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import AppShell from "../layouts/AppShell.vue";
import { useAuth } from "../composables/useAuth.js";
import { useTrackingSessions } from "../composables/useScores.js";
import { useDocuments } from "../composables/useDocuments.js";

const router = useRouter();
const { user } = useAuth();
const { documents, fetchDocuments } = useDocuments();
const {
  sessions,
  isLoading,
  fetchSessionsByOwner,
  getScoreLabel,
  getScoreColor,
} = useTrackingSessions();

// 依 ownerId 讀取 documents + sessions
if (user.value?.uid) {
  fetchDocuments(user.value.uid);
  fetchSessionsByOwner(user.value.uid);
}

const selectedDocumentId = computed({
  get() {
    const id = router.currentRoute.value.query.documentId;
    return id || "all";
  },
  set(val) {
    const query = { ...router.currentRoute.value.query };
    if (val === "all") delete query.documentId;
    else query.documentId = val;
    router.replace({ query });
  },
});

const filteredSessions = computed(() => {
  if (selectedDocumentId.value === "all") return sessions.value;
  return sessions.value.filter((s) => s.documentId === selectedDocumentId.value);
});

const todayStats = computed(() => {
  const now = new Date();
  const startOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0,
  );
  const endOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
  );

  const todaySessions = filteredSessions.value.filter((s) => {
    const t = s.endedAt?.toDate?.()
      ? s.endedAt.toDate()
      : s.createdAt?.toDate?.()
        ? s.createdAt.toDate()
        : null;
    if (!t) return false;
    return t >= startOfDay && t <= endOfDay;
  });

  const hotCount = todaySessions.filter((s) => (s.intentScore || 0) > 80).length;
  const warmCount = todaySessions.filter(
    (s) => (s.intentScore || 0) > 50 && (s.intentScore || 0) <= 80,
  ).length;
  const totalDwellSecs = todaySessions.reduce(
    (sum, s) => sum + (s.totalDwellSecs || 0),
    0,
  );

  return {
    hotCount,
    warmCount,
    totalDwellSecs,
    totalDwellFormatted: formatDwell(totalDwellSecs),
  };
});

const sortedSessions = computed(() => {
  return [...filteredSessions.value].sort((a, b) => {
    const aTime = a.endedAt?.toDate?.()
      ? a.endedAt.toDate()
      : a.createdAt?.toDate?.()
        ? a.createdAt.toDate()
        : new Date(0);
    const bTime = b.endedAt?.toDate?.()
      ? b.endedAt.toDate()
      : b.createdAt?.toDate?.()
        ? b.createdAt.toDate()
        : new Date(0);
    return bTime - aTime;
  });
});

const goToDetail = (id) => {
  if (!id) return;
  router.push(`/dashboard/sessions/${id}`);
};

const formatDwell = (totalSecs) => {
  if (!totalSecs || totalSecs <= 0) return "0s";
  if (totalSecs < 60) return `${totalSecs}s`;
  if (totalSecs < 3600)
    return `${Math.floor(totalSecs / 60)}m ${totalSecs % 60}s`;
  const hrs = Math.floor(totalSecs / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  return `${hrs}h ${mins}m`;
};

const formatEndedAt = (endedAt, createdAt) => {
  const ts = endedAt?.toDate?.()
    ? endedAt.toDate()
    : createdAt?.toDate?.()
      ? createdAt.toDate()
      : null;
  if (!ts) return "—";
  return ts.toLocaleString("zh-TW", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>
