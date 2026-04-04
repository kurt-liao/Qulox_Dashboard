<template>
  <div
    class="min-h-screen flex bg-gray-50 dark:bg-gray-950 transition-colors duration-300"
  >
    <!-- Sidebar -->
    <aside
      class="w-64 bg-white dark:bg-gray-900/50 border-r border-gray-200 dark:border-gray-800/50 flex flex-col shrink-0 transition-colors duration-300"
    >
      <!-- Brand -->
      <div
        class="p-5 border-b border-gray-100 dark:border-gray-800/50 flex items-center justify-between"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-9 h-9 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center"
          >
            <svg
              class="w-5 h-5 text-brand-500 dark:text-brand-400"
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
            <h1 class="text-sm font-semibold text-gray-900 dark:text-white">
              Qulox
            </h1>
            <p class="text-xs text-gray-500">Dashboard</p>
          </div>
        </div>
        <ThemeToggle />
      </div>

      <!-- Nav -->
      <nav class="flex-1 p-3 space-y-1">
        <router-link
          to="/dashboard"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
          :class="
            $route.name === 'Dashboard'
              ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 whitespace-nowrap'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50'
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
              ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50'
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
        <router-link
          to="/dashboard/sessions"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
          :class="
            $route.name === 'Sessions'
              ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50'
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
              d="M3.75 4.5h16.5M3.75 9.75h16.5m-16.5 5.25h10.5"
            />
          </svg>
          閱讀紀錄
        </router-link>
      </nav>

      <!-- User section -->
      <div class="p-3 border-t border-gray-100 dark:border-gray-800/50">
        <div class="flex items-center gap-3 px-3 py-2">
          <div
            class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0"
          >
            <span
              class="text-xs font-medium text-gray-600 dark:text-gray-300"
              >{{ userInitial }}</span
            >
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm text-gray-600 dark:text-gray-300 truncate">
              {{ user?.email }}
            </p>
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
        class="sticky top-0 z-10 bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800/50 px-8 py-4 flex items-center justify-between transition-colors duration-300"
      >
        <div>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            文件管理
          </h2>
          <p class="text-sm text-gray-500">管理你的 PDF 文件與客戶追蹤連結</p>
        </div>
        <button
          @click="startTour"
          class="inline-flex items-center gap-2 px-3 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 mr-2"
          title="功能導覽"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
          </svg>
          功能導覽
        </button>
        <button
          data-tour="upload-btn"
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

        <template v-else-if="documents.length > 0">
          <!-- Stats Overview -->
          <div data-tour="stats-overview" class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div
              class="bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800/50 shadow-sm dark:shadow-none rounded-2xl p-5 transition-colors duration-300"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center"
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
                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p class="text-2xl font-bold text-gray-900 dark:text-white">
                    {{ stats.totalSessions }}
                  </p>
                  <p class="text-xs text-gray-500">閱覽次數</p>
                </div>
              </div>
            </div>
            <div
              class="bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800/50 shadow-sm dark:shadow-none rounded-2xl p-5 transition-colors duration-300"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center"
                >
                  <svg
                    class="w-5 h-5 text-purple-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="1.5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p class="text-2xl font-bold text-gray-900 dark:text-white">
                    {{ stats.totalDwellFormatted }}
                  </p>
                  <p class="text-xs text-gray-500">總閱讀時間</p>
                </div>
              </div>
            </div>
            <div
              class="bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800/50 shadow-sm dark:shadow-none rounded-2xl p-5 transition-colors duration-300"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center"
                >
                  <span class="text-base">🔥</span>
                </div>
                <div>
                  <p class="text-2xl font-bold text-gray-900 dark:text-white">
                    {{ stats.hotLeads }}
                  </p>
                  <p class="text-xs text-gray-500">HOT 客戶</p>
                </div>
              </div>
            </div>
            <div
              class="bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800/50 shadow-sm dark:shadow-none rounded-2xl p-5 transition-colors duration-300"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center"
                >
                  <span class="text-base">🟠</span>
                </div>
                <div>
                  <p class="text-2xl font-bold text-gray-900 dark:text-white">
                    {{ stats.warmLeads }}
                  </p>
                  <p class="text-xs text-gray-500">WARM 客戶</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Document grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <router-link
              v-for="doc in documents"
              :key="doc.id"
              :to="`/dashboard/documents/${doc.id}`"
              class="group bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800/50 shadow-sm dark:shadow-none rounded-2xl p-5 hover:border-brand-500/30 hover:bg-gray-50 dark:hover:bg-gray-900/60 transition-all duration-200"
            >
              <!-- Top row: PDF info + score -->
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
                    class="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors truncate"
                  >
                    {{ doc.name }}
                  </h3>
                  <p class="text-xs text-gray-500 mt-0.5 truncate">
                    {{ doc.fileName }}
                  </p>
                </div>
                <!-- Score Ring -->
                <ScoreRing
                  :score="getDocScore(doc.id)"
                  :size="44"
                  :stroke-width="3"
                />
              </div>

              <!-- Meta row -->
              <div class="mt-4 flex items-center justify-between">
                <div class="flex items-center gap-4 text-xs text-gray-500">
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
                        d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.686-3.898a4.5 4.5 0 00-1.242-7.244"
                      />
                    </svg>
                    {{ getDocLinks(doc.id).length }} 連結
                  </span>
                </div>
                <span
                  class="text-xs font-medium px-2 py-0.5 rounded-full"
                  :class="[
                    getScoreColor(getDocScore(doc.id)).bg,
                    getScoreColor(getDocScore(doc.id)).text,
                    getScoreColor(getDocScore(doc.id)).border,
                    'border',
                  ]"
                  >{{ getScoreLabel(getDocScore(doc.id)) }}</span
                >
              </div>
            </router-link>
          </div>
        </template>

        <!-- Onboarding Empty state -->
        <div v-else class="max-w-3xl mx-auto py-12">
          <!-- Welcome header -->
          <div class="text-center mb-10">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 mb-4">
              <svg class="w-8 h-8 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">歡迎使用 Qulox 👋</h2>
            <p class="text-sm text-gray-500">追蹤客戶真實的閱讀行為，讓你知道誰正在認真研究你的提案</p>
          </div>

          <!-- How it works: 3 steps -->
          <div class="mb-10">
            <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">開始使用</h3>
            <div class="space-y-3">
              <!-- Step 1 -->
              <div class="bg-white dark:bg-gray-900/40 border border-brand-500/30 rounded-2xl p-5 flex items-start gap-4 shadow-sm">
                <div class="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center shrink-0 mt-0.5">
                  <span class="text-xs font-bold text-white">1</span>
                </div>
                <div class="flex-1">
                  <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-1">上傳你的 PDF 文件</h4>
                  <p class="text-xs text-gray-500 mb-3">公司簡報、報價單、產品介紹都可以。上傳後即可產生追蹤連結。</p>
                  <button
                    @click="showUploadModal = true"
                    class="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-medium rounded-xl transition-all duration-200"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    上傳 PDF
                  </button>
                </div>
              </div>
              <!-- Step 2 -->
              <div class="bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800/50 rounded-2xl p-5 flex items-start gap-4 shadow-sm opacity-60">
                <div class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center shrink-0 mt-0.5">
                  <span class="text-xs font-bold text-gray-500 dark:text-gray-300">2</span>
                </div>
                <div class="flex-1">
                  <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-1">為客戶產生專屬追蹤連結</h4>
                  <p class="text-xs text-gray-500">點擊文件 → 「產生連結」，為每位客戶建立獨立連結，追蹤個別閱讀行為。</p>
                </div>
              </div>
              <!-- Step 3 -->
              <div class="bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800/50 rounded-2xl p-5 flex items-start gap-4 shadow-sm opacity-60">
                <div class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center shrink-0 mt-0.5">
                  <span class="text-xs font-bold text-gray-500 dark:text-gray-300">3</span>
                </div>
                <div class="flex-1">
                  <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-1">分享連結，即時看到閱讀數據</h4>
                  <p class="text-xs text-gray-500">客戶用連結開啟 PDF 後，閱讀行為即時記錄，你可以在「閱讀紀錄」看到每頁停留時間與 intent score。</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Feature overview -->
          <div>
            <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">平台功能介紹</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

              <!-- 文件管理 -->
              <div class="bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800/50 rounded-2xl p-5 shadow-sm">
                <div class="flex items-center gap-3 mb-3">
                  <div class="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                    <svg class="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </div>
                  <h4 class="text-sm font-semibold text-gray-900 dark:text-white">文件管理</h4>
                </div>
                <p class="text-xs text-gray-500">上傳 PDF、管理文件、為各文件產生客戶追蹤連結，並查看每份文件的整體 intent score。</p>
              </div>

              <!-- 客戶管理 -->
              <div class="bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800/50 rounded-2xl p-5 shadow-sm">
                <div class="flex items-center gap-3 mb-3">
                  <div class="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                    <svg class="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                    </svg>
                  </div>
                  <h4 class="text-sm font-semibold text-gray-900 dark:text-white">客戶管理</h4>
                </div>
                <p class="text-xs text-gray-500">集中管理所有客戶資料，查看每位客戶跨文件的閱讀行為與整體 intent score 趨勢。</p>
              </div>

              <!-- 閱讀紀錄 -->
              <div class="bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800/50 rounded-2xl p-5 shadow-sm">
                <div class="flex items-center gap-3 mb-3">
                  <div class="w-9 h-9 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                    <svg class="w-5 h-5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 4.5h16.5M3.75 9.75h16.5m-16.5 5.25h10.5" />
                    </svg>
                  </div>
                  <h4 class="text-sm font-semibold text-gray-900 dark:text-white">閱讀紀錄</h4>
                </div>
                <p class="text-xs text-gray-500">每次客戶開啟 PDF，系統自動記錄頁面停留時間、複製、列印等行為，計算 HOT / WARM / COLD intent score，幫你判斷誰最值得跟進。</p>
              </div>

              <!-- Intent Score -->
              <div class="bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800/50 rounded-2xl p-5 shadow-sm">
                <div class="flex items-center gap-3 mb-3">
                  <div class="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                    <span class="text-base">🔥</span>
                  </div>
                  <h4 class="text-sm font-semibold text-gray-900 dark:text-white">Intent Score</h4>
                </div>
                <ul class="text-xs text-gray-500 space-y-1">
                  <li>🔥 <span class="font-medium text-gray-700 dark:text-gray-300">HOT (>80)</span> — 極高意圖，立即跟進</li>
                  <li>🟠 <span class="font-medium text-gray-700 dark:text-gray-300">WARM (>50)</span> — 積極閱讀，值得跟進</li>
                  <li>🟡 <span class="font-medium text-gray-700 dark:text-gray-300">INTERESTED (>20)</span> — 有興趣但不急</li>
                  <li>🔵 <span class="font-medium text-gray-700 dark:text-gray-300">COLD (≤20)</span> — 低意圖</li>
                </ul>
              </div>
            </div>
          </div>
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
import { ref, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "../composables/useAuth.js";
import { useProductTour } from "../composables/useProductTour.js";
import { useDocuments } from "../composables/useDocuments.js";
import { useTrackingLinks } from "../composables/useTrackingLinks.js";
import { useTrackingSessions } from "../composables/useScores.js";
import UploadModal from "../components/UploadModal.vue";
import ScoreRing from "../components/ScoreRing.vue";
import ThemeToggle from "../components/ThemeToggle.vue";

const router = useRouter();
const { user, logout } = useAuth();
const { startTour, startTourIfNew } = useProductTour(router);
const { documents, isLoading, fetchDocuments } = useDocuments();
const { links: allLinks, fetchAllLinksForOwner } = useTrackingLinks();
const {
  fetchSessionsByOwner,
  getSessionsForDocument,
  getSessionsForLink,
  calculateDealScore,
  getScoreLabel,
  getScoreColor,
  getDashboardStats,
} = useTrackingSessions();

const showUploadModal = ref(false);

onMounted(() => {
  startTourIfNew();
});

const userInitial = computed(() => {
  if (!user.value?.email) return "?";
  return user.value.email.charAt(0).toUpperCase();
});

const stats = computed(() => getDashboardStats(allLinks.value));

const getDocLinks = (docId) => {
  return allLinks.value.filter((l) => l.documentId === docId);
};

const getDocScore = (docId) => {
  // Aggregate: best score among all links for this doc
  const docLinks = getDocLinks(docId);
  if (docLinks.length === 0) return 0;
  const scores = docLinks.map((link) => {
    const linkSessions = getSessionsForLink(link.id);
    return calculateDealScore(linkSessions);
  });
  return Math.max(...scores);
};

const getDocSessions = (docId) => {
  return getSessionsForDocument(docId);
};

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
      fetchAllLinksForOwner(newUser.uid);
      fetchSessionsByOwner(newUser.uid);
    }
  },
  { immediate: true },
);
</script>
