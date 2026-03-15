<template>
  <div class="min-h-screen flex">
    <!-- Sidebar -->
    <aside
      class="w-64 bg-gray-900/50 border-r border-gray-800/50 flex flex-col shrink-0"
    >
      <!-- Brand -->
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

      <!-- Nav -->
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

      <!-- User section -->
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
      <!-- Top bar -->
      <header
        class="sticky top-0 z-10 bg-gray-950/80 backdrop-blur-lg border-b border-gray-800/50 px-8 py-4 flex items-center justify-between"
      >
        <div>
          <h2 class="text-lg font-semibold text-white">文件管理</h2>
          <p class="text-sm text-gray-500">管理你的 PDF 文件與客戶追蹤連結</p>
        </div>
        <button
          @click="showUploadModal = true"
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
          上傳 PDF
        </button>
      </header>

      <!-- Content -->
      <div class="p-8">
        <!-- Loading state -->
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

        <!-- Empty state -->
        <div v-else-if="documents.length === 0" class="text-center py-20">
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
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-300 mb-1">尚無文件</h3>
          <p class="text-sm text-gray-500 mb-6">
            上傳你的第一份 PDF 文件開始使用
          </p>
          <button
            @click="showUploadModal = true"
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
            上傳 PDF
          </button>
        </div>

        <!-- Document grid -->
        <div
          v-else
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <router-link
            v-for="doc in documents"
            :key="doc.id"
            :to="`/dashboard/documents/${doc.id}`"
            class="group bg-gray-900/40 border border-gray-800/50 rounded-2xl p-5 hover:border-brand-500/30 hover:bg-gray-900/60 transition-all duration-200"
          >
            <!-- PDF icon + info -->
            <div class="flex items-start gap-4">
              <div
                class="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0"
              >
                <svg
                  class="w-6 h-6 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1.5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                  />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <h3
                  class="text-sm font-semibold text-white group-hover:text-brand-400 transition-colors truncate"
                >
                  {{ doc.name }}
                </h3>
                <p class="text-xs text-gray-500 mt-0.5 truncate">
                  {{ doc.fileName }}
                </p>
              </div>
            </div>

            <!-- Meta -->
            <div class="mt-4 flex items-center gap-4 text-xs text-gray-500">
              <span class="flex items-center gap-1">
                <svg
                  class="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1.5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                  />
                </svg>
                {{ formatDate(doc.createdAt) }}
              </span>
            </div>
          </router-link>
        </div>
      </div>
    </main>

    <!-- Upload Modal -->
    <UploadModal
      v-if="showUploadModal"
      @close="showUploadModal = false"
      @uploaded="onUploaded"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "../composables/useAuth.js";
import { useDocuments } from "../composables/useDocuments.js";
import UploadModal from "../components/UploadModal.vue";

const router = useRouter();
const { user, logout } = useAuth();
const { documents, isLoading, fetchDocuments } = useDocuments();

const showUploadModal = ref(false);

const userInitial = computed(() => {
  if (!user.value?.email) return "?";
  return user.value.email.charAt(0).toUpperCase();
});

const formatDate = (timestamp) => {
  if (!timestamp?.toDate) return "—";
  return timestamp.toDate().toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const handleLogout = async () => {
  await logout();
  router.push("/login");
};

const onUploaded = () => {
  showUploadModal.value = false;
  if (user.value) {
    fetchDocuments(user.value.uid);
  }
};

// Watch for user to become available (Firebase Auth is async)
watch(
  user,
  (newUser) => {
    if (newUser) {
      fetchDocuments(newUser.uid);
    }
  },
  { immediate: true },
);
</script>
