<template>
  <div class="min-h-screen flex">
    <!-- Sidebar -->
    <aside
      class="w-64 bg-gray-900/50 border-r border-gray-800/50 flex flex-col shrink-0"
    >
      <div class="p-5 border-b border-gray-800/50">
        <div class="flex items-center gap-3">
          <div
            class="w-9 h-9 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center"
          >
            <svg
              class="w-5 h-5 text-brand-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z"
              />
            </svg>
          </div>
          <div>
            <h1 class="text-sm font-semibold text-white">Intent Pulse</h1>
            <p class="text-xs text-gray-500">Dashboard</p>
          </div>
        </div>
      </div>
      <nav class="flex-1 p-3 space-y-1">
        <router-link
          to="/dashboard"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
          :class="
            $route.name === 'Dashboard'
              ? 'bg-brand-500/10 text-brand-400'
              : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
          "
        >
          <svg
            class="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>
          文件管理
        </router-link>
        <router-link
          to="/dashboard/clients"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
          :class="
            $route.name === 'Clients'
              ? 'bg-brand-500/10 text-brand-400'
              : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
          "
        >
          <svg
            class="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
            />
          </svg>
          客戶管理
        </router-link>
      </nav>
      <div class="p-3 border-t border-gray-800/50">
        <div class="flex items-center gap-3 px-3 py-2">
          <div
            class="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center"
          >
            <span class="text-xs font-medium text-gray-300">{{
              userInitial
            }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm text-gray-300 truncate">{{ user?.email }}</p>
          </div>
          <button
            @click="handleLogout"
            class="p-1.5 text-gray-500 hover:text-red-400 rounded-lg hover:bg-gray-800/50 transition-colors"
            title="登出"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
              />
            </svg>
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 overflow-auto">
      <header
        class="sticky top-0 z-10 bg-gray-950/80 backdrop-blur-lg border-b border-gray-800/50 px-8 py-4 flex items-center justify-between"
      >
        <div>
          <h2 class="text-lg font-semibold text-white">客戶管理</h2>
          <p class="text-sm text-gray-500">管理你的客戶資訊</p>
        </div>
        <button
          @click="openCreate"
          class="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium rounded-xl transition-all duration-200"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          新增客戶
        </button>
      </header>

      <div class="p-8">
        <!-- Search -->
        <div class="mb-6">
          <div class="relative max-w-md">
            <svg
              class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜尋客戶名稱、公司、Email…"
              class="w-full pl-10 pr-4 py-2.5 bg-gray-900/40 border border-gray-800/50 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/50 transition-all duration-200 text-sm"
            />
          </div>
        </div>

        <!-- Loading -->
        <div v-if="isLoading" class="flex items-center justify-center py-20">
          <svg
            class="w-8 h-8 animate-spin text-brand-500"
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

        <!-- Empty -->
        <div
          v-else-if="filteredClients.length === 0 && !searchQuery"
          class="text-center py-20"
        >
          <div
            class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-800/50 border border-gray-700/50 mb-4"
          >
            <svg
              class="w-8 h-8 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
              />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-300 mb-1">尚無客戶</h3>
          <p class="text-sm text-gray-500 mb-6">新增你的第一位客戶開始管理</p>
          <button
            @click="openCreate"
            class="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium rounded-xl transition-all duration-200"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            新增客戶
          </button>
        </div>

        <!-- No search results -->
        <div
          v-else-if="filteredClients.length === 0 && searchQuery"
          class="text-center py-20"
        >
          <p class="text-sm text-gray-500">
            找不到符合「{{ searchQuery }}」的客戶
          </p>
        </div>

        <!-- Client table -->
        <div
          v-else
          class="bg-gray-900/40 border border-gray-800/50 rounded-2xl overflow-hidden"
        >
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-800/50">
                <th
                  class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3"
                >
                  客戶
                </th>
                <th
                  class="text-center text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3"
                >
                  成交分數
                </th>
                <th
                  class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3"
                >
                  公司
                </th>
                <th
                  class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3"
                >
                  聯絡方式
                </th>
                <th
                  class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3"
                >
                  備註
                </th>
                <th
                  class="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3"
                >
                  操作
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-800/40">
              <tr
                v-for="client in filteredClients"
                :key="client.id"
                class="hover:bg-gray-800/20 transition-colors"
              >
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0"
                    >
                      <span class="text-sm font-medium text-purple-400">{{
                        client.name?.charAt(0)?.toUpperCase() || "?"
                      }}</span>
                    </div>
                    <span class="text-sm text-white font-medium">{{
                      client.name
                    }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 text-center">
                  <div class="flex items-center justify-center gap-2">
                    <ScoreRing
                      :score="getClientScore(client)"
                      :size="36"
                      :stroke-width="2.5"
                    />
                    <span
                      class="text-xs font-medium px-1.5 py-0.5 rounded-full"
                      :class="[
                        getScoreColor(getClientScore(client)).bg,
                        getScoreColor(getClientScore(client)).text,
                        getScoreColor(getClientScore(client)).border,
                        'border',
                      ]"
                      >{{ getScoreLabel(getClientScore(client)) }}</span
                    >
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span class="text-sm text-gray-400">{{
                    client.company || "—"
                  }}</span>
                </td>
                <td class="px-6 py-4">
                  <div class="space-y-0.5">
                    <p v-if="client.email" class="text-sm text-gray-400">
                      {{ client.email }}
                    </p>
                    <p v-if="client.phone" class="text-xs text-gray-500">
                      {{ client.phone }}
                    </p>
                    <p
                      v-if="!client.email && !client.phone"
                      class="text-sm text-gray-600"
                    >
                      —
                    </p>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <p class="text-sm text-gray-500 max-w-xs truncate">
                    {{ client.notes || "—" }}
                  </p>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-1">
                    <button
                      @click="openEdit(client)"
                      class="p-1.5 text-gray-500 hover:text-brand-400 rounded-lg hover:bg-brand-500/10 transition-all"
                      title="編輯"
                    >
                      <svg
                        class="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="1.5"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                        />
                      </svg>
                    </button>
                    <button
                      @click="handleDelete(client)"
                      class="p-1.5 text-gray-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-all"
                      title="刪除"
                    >
                      <svg
                        class="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="1.5"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <!-- Client Modal -->
    <ClientModal
      v-if="showModal"
      :client="editingClient"
      @close="closeModal"
      @saved="handleSave"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "../composables/useAuth.js";
import { useClients } from "../composables/useClients.js";
import { useTrackingSessions } from "../composables/useScores.js";
import ClientModal from "../components/ClientModal.vue";
import ScoreRing from "../components/ScoreRing.vue";

const router = useRouter();
const { user, logout } = useAuth();
const {
  clients,
  isLoading,
  fetchClients,
  createClient,
  updateClient,
  deleteClient,
} = useClients();
const {
  fetchSessionsByOwner,
  calculateClientDealScore,
  getScoreLabel,
  getScoreColor,
} = useTrackingSessions();

const showModal = ref(false);
const editingClient = ref(null);
const searchQuery = ref("");

const userInitial = computed(() => {
  if (!user.value?.email) return "?";
  return user.value.email.charAt(0).toUpperCase();
});

const getClientScore = (client) => {
  return calculateClientDealScore([client.name, client.company]);
};

const filteredClients = computed(() => {
  if (!searchQuery.value.trim()) return clients.value;
  const q = searchQuery.value.toLowerCase();
  return clients.value.filter(
    (c) =>
      c.name?.toLowerCase().includes(q) ||
      c.company?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.phone?.includes(q),
  );
});

const openCreate = () => {
  editingClient.value = null;
  showModal.value = true;
};

const openEdit = (client) => {
  editingClient.value = client;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  editingClient.value = null;
};

const handleSave = async (data) => {
  try {
    if (editingClient.value) {
      await updateClient(editingClient.value.id, data);
    } else {
      await createClient(data, user.value.uid);
    }
    closeModal();
  } catch (err) {
    console.error("Save client error:", err);
  }
};

const handleDelete = async (client) => {
  if (!confirm(`確定要刪除客戶「${client.name}」嗎？`)) return;
  await deleteClient(client.id);
};

const handleLogout = async () => {
  await logout();
  router.push("/login");
};

watch(
  user,
  (newUser) => {
    if (newUser) {
      fetchClients(newUser.uid);
      fetchSessionsByOwner(newUser.uid);
    }
  },
  { immediate: true },
);
</script>
