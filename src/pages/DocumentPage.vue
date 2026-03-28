<template>
  <div class="min-h-screen flex">
    <!-- Sidebar (same as Dashboard) -->
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
            <h1 class="text-sm font-semibold text-white">Qulox</h1>
            <p class="text-xs text-gray-500">Dashboard</p>
          </div>
        </div>
      </div>
      <nav class="flex-1 p-3 space-y-1">
        <router-link
          to="/dashboard"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all duration-150"
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
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all duration-150"
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
      <!-- Loading -->
      <div v-if="loadingDoc" class="flex items-center justify-center h-full">
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

      <!-- Not Found -->
      <div
        v-else-if="!currentDoc"
        class="flex items-center justify-center h-full"
      >
        <div class="text-center">
          <h2 class="text-lg font-semibold text-gray-300 mb-2">文件不存在</h2>
          <router-link
            to="/dashboard"
            class="text-sm text-brand-400 hover:text-brand-300 transition-colors"
          >
            ← 返回文件列表
          </router-link>
        </div>
      </div>

      <!-- Document Detail -->
      <template v-else>
        <!-- Top bar -->
        <header
          class="sticky top-0 z-10 bg-gray-950/80 backdrop-blur-lg border-b border-gray-800/50 px-8 py-4"
        >
          <div class="flex items-center gap-3 mb-1">
            <router-link
              to="/dashboard"
              class="text-gray-500 hover:text-gray-300 transition-colors"
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
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
            </router-link>
            <div>
              <h2 class="text-lg font-semibold text-white">
                {{ currentDoc.name }}
              </h2>
              <p class="text-sm text-gray-500">{{ currentDoc.fileName }}</p>
            </div>
          </div>
        </header>

        <div class="p-8 space-y-8">
          <!-- Document Info Card -->
          <div class="bg-gray-900/40 border border-gray-800/50 rounded-2xl p-6">
            <div class="flex items-start gap-5">
              <div
                class="w-14 h-14 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0"
              >
                <svg
                  class="w-7 h-7 text-red-400"
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
              <div class="flex-1">
                <h3 class="text-base font-semibold text-white">
                  {{ currentDoc.name }}
                </h3>
                <p class="text-sm text-gray-500 mt-0.5">
                  {{ currentDoc.fileName }}
                </p>
                <div class="flex items-center gap-4 mt-3 text-xs text-gray-500">
                  <span>上傳時間：{{ formatDate(currentDoc.createdAt) }}</span>
                </div>
              </div>
              <div class="flex gap-2">
                <a
                  :href="currentDoc.storageUrl"
                  target="_blank"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-300 bg-gray-800/50 border border-gray-700/50 rounded-lg hover:bg-gray-700/50 transition-colors"
                >
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
                      d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                    />
                  </svg>
                  開啟 PDF
                </a>
                <button
                  @click="handleDelete"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors"
                >
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
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                  刪除
                </button>
              </div>
            </div>
          </div>

          <!-- Tracking Links Section -->
          <div>
            <div class="flex items-center justify-between mb-4">
              <div>
                <h3 class="text-base font-semibold text-white">客戶追蹤連結</h3>
                <p class="text-sm text-gray-500">
                  為不同客戶產生專屬的 PDF 瀏覽連結
                </p>
              </div>
              <button
                @click="showCreateLinkModal = true"
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
                產生連結
              </button>
            </div>

            <!-- Links loading -->
            <div
              v-if="linksLoading"
              class="flex items-center justify-center py-12"
            >
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

            <!-- Links empty -->
            <div
              v-else-if="links.length === 0"
              class="bg-gray-900/30 border border-gray-800/40 border-dashed rounded-2xl p-8 text-center"
            >
              <div
                class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gray-800/50 border border-gray-700/50 mb-3"
              >
                <svg
                  class="w-6 h-6 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1.5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.686-3.898a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L4.34 8.687"
                  />
                </svg>
              </div>
              <h4 class="text-sm font-medium text-gray-400 mb-1">
                尚無追蹤連結
              </h4>
              <p class="text-xs text-gray-500">
                為客戶產生專屬連結以追蹤 PDF 閱覽行為
              </p>
            </div>

            <!-- Links table -->
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
                      客戶名稱
                    </th>
                    <th
                      class="text-center text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3"
                    >
                      Intent Score
                    </th>
                    <th
                      class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3"
                    >
                      連結
                    </th>
                    <th
                      class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3"
                    >
                      狀態
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
                    v-for="link in links"
                    :key="link.id"
                    class="hover:bg-gray-800/20 transition-colors"
                  >
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-2">
                        <div
                          class="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center"
                        >
                          <span class="text-xs font-medium text-purple-400">{{
                            link.clientName?.charAt(0)?.toUpperCase() || "?"
                          }}</span>
                        </div>
                        <span class="text-sm text-gray-200 font-medium">{{
                          link.clientName
                        }}</span>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-center">
                      <div class="flex items-center justify-center gap-2">
                        <ScoreRing
                          :score="getLinkScore(link)"
                          :size="36"
                          :stroke-width="2.5"
                        />
                        <span
                          class="text-xs font-medium px-1.5 py-0.5 rounded-full"
                          :class="[
                            getScoreColor(getLinkScore(link)).bg,
                            getScoreColor(getLinkScore(link)).text,
                            getScoreColor(getLinkScore(link)).border,
                            'border',
                          ]"
                          >{{ getScoreLabel(getLinkScore(link)) }}</span
                        >
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-2">
                        <code
                          class="text-xs text-gray-400 font-mono bg-gray-800/50 px-2 py-1 rounded-md max-w-xs truncate block"
                        >
                          {{ getViewerUrl(link.shortCode) }}
                        </code>
                        <button
                          @click="copyLink(link.shortCode)"
                          class="p-1 text-gray-500 hover:text-brand-400 transition-colors shrink-0"
                          :title="
                            copiedId === link.id ? '已複製！' : '複製連結'
                          "
                        >
                          <svg
                            v-if="copiedId !== link.id"
                            class="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="1.5"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                            />
                          </svg>
                          <svg
                            v-else
                            class="w-4 h-4 text-green-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M4.5 12.75l6 6 9-13.5"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <span
                        class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                        :class="
                          link.isActive
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-gray-700/50 text-gray-500 border border-gray-600/30'
                        "
                      >
                        <span
                          class="w-1.5 h-1.5 rounded-full"
                          :class="
                            link.isActive ? 'bg-emerald-400' : 'bg-gray-600'
                          "
                        ></span>
                        {{ link.isActive ? "啟用" : "停用" }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <button
                        @click="handleDeleteLink(link.id)"
                        class="p-1.5 text-gray-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-all"
                        title="刪除連結"
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
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ═══════════════════════════════════════════════════
               CLOSING ENGINE ANALYTICS
          ════════════════════════════════════════════════════ -->
        <div v-if="allDocSessions.length > 0" class="pb-12">
          <!-- Section header -->
          <div class="flex items-center gap-3 mb-8">
            <div
              class="flex-1 h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent"
            ></div>
            <div
              class="flex items-center gap-3 px-4 py-2 bg-gray-900/60 border border-gray-800/50 rounded-full"
            >
              <div
                class="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse"
              ></div>
              <span
                class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]"
                >Target Decoding Interface</span
              >
            </div>
            <div
              class="flex-1 h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent"
            ></div>
          </div>

          <!-- Enhanced Search & Filter Dashboard -->
          <div
            class="mx-8 mb-8 p-6 bg-gray-900/30 border border-gray-800/40 rounded-3xl backdrop-blur-sm"
          >
            <div
              class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6"
            >
              <div>
                <h3 class="text-sm font-semibold text-white">意圖解碼焦點</h3>
                <p class="text-xs text-gray-500 mt-1">
                  {{
                    selectedLinkId === "all"
                      ? "正在分析所有客戶的行為軌跡"
                      : `正在專注分析：${selectedClientName}`
                  }}
                </p>
              </div>

              <!-- Search box -->
              <div class="relative group">
                <input
                  v-model="clientSearchQuery"
                  type="text"
                  placeholder="搜尋客戶名稱..."
                  class="w-full md:w-64 bg-gray-950/50 border border-gray-800 rounded-xl px-4 py-2 text-xs text-gray-300 focus:outline-none focus:border-brand-500/50 transition-all"
                />
                <div class="absolute right-3 top-2.5 text-gray-600">
                  <svg
                    class="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Compact Client Grid -->
            <div
              class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2"
            >
              <button
                @click="selectedLinkId = 'all'"
                class="px-3 py-2 rounded-xl text-[11px] font-medium transition-all border text-center"
                :class="
                  selectedLinkId === 'all'
                    ? 'bg-brand-500/10 border-brand-500/30 text-brand-400'
                    : 'bg-gray-950/30 border-gray-800/50 text-gray-500 hover:text-gray-300'
                "
              >
                All Sources
              </button>
              <button
                v-for="link in filteredLinks"
                :key="link.id"
                @click="selectedLinkId = link.id"
                class="group px-3 py-2 rounded-xl text-[11px] font-medium transition-all border text-left flex items-center gap-2 overflow-hidden"
                :class="
                  selectedLinkId === link.id
                    ? 'bg-brand-500/10 border-brand-500/30 text-brand-400 shadow-[0_0_15px_rgba(139,92,246,0.1)]'
                    : 'bg-gray-950/30 border-gray-800/50 text-gray-500 hover:border-gray-700'
                "
              >
                <span
                  class="w-1.5 h-1.5 rounded-full shrink-0"
                  :class="
                    getLiveForLink(link.id)
                      ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]'
                      : 'bg-gray-800'
                  "
                ></span>
                <span class="truncate">{{ link.clientName }}</span>

                <!-- Context mini-score (optional hint) -->
                <span
                  v-if="getLinkScore(link) > 50"
                  class="ml-auto text-[9px] text-orange-400/70"
                  >🔥</span
                >
              </button>
            </div>

            <!-- Empty search state -->
            <div
              v-if="filteredLinks.length === 0 && clientSearchQuery"
              class="py-6 text-center"
            >
              <p class="text-xs text-gray-600 italic">
                找不到符合 「{{ clientSearchQuery }}」 的客戶
              </p>
            </div>
          </div>

          <!-- Live presence badge -->
          <div
            v-if="filteredLiveViewers.length > 0"
            class="mx-8 mb-8 flex items-center gap-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl px-5 py-4"
          >
            <div class="relative">
              <div
                class="w-3.5 h-3.5 rounded-full bg-emerald-400 animate-ping"
              ></div>
              <div
                class="absolute inset-0 w-3.5 h-3.5 rounded-full bg-emerald-400"
              ></div>
            </div>
            <div class="flex-1">
              <p
                class="text-sm font-bold text-emerald-400 tracking-wide uppercase text-[11px]"
              >
                🔴 Live Intercept Active
              </p>
              <p class="text-xs text-emerald-600/80 mt-1">
                正在偵測 {{ filteredLiveViewers.length }} 個信號 —
                <span
                  v-for="v in filteredLiveViewers"
                  :key="v.viewerId"
                  class="inline-flex items-center gap-1.5 mr-4 font-medium"
                >
                  <span class="text-emerald-400"
                    >[{{ v.clientName || "Unknown Site" }}]</span
                  >
                  <span>定位：Page {{ v.currentPage }}</span>
                </span>
              </p>
            </div>
          </div>

          <!-- The 3 Widget Grid -->
          <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 px-8">
            <VelocityTachometer :sessions="closingEngineSessions" />
            <DecisionPathMap :sessions="closingEngineSessions" />
            <ContentFuelGauge :sessions="closingEngineSessions" />
          </div>
        </div>
      </template>
    </main>

    <!-- Create Link Modal -->
    <CreateLinkModal
      v-if="showCreateLinkModal"
      :documentId="docId"
      @close="showCreateLinkModal = false"
      @created="onLinkCreated"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuth } from "../composables/useAuth.js";
import { useDocuments } from "../composables/useDocuments.js";
import { useTrackingLinks } from "../composables/useTrackingLinks.js";
import { useTrackingSessions } from "../composables/useScores.js";
import CreateLinkModal from "../components/CreateLinkModal.vue";
import ScoreRing from "../components/ScoreRing.vue";
import VelocityTachometer from "../components/VelocityTachometer.vue";
import DecisionPathMap from "../components/DecisionPathMap.vue";
import ContentFuelGauge from "../components/ContentFuelGauge.vue";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase.js";

const route = useRoute();
const router = useRouter();
const { user, logout } = useAuth();
const { getDocument, deleteDocument } = useDocuments();
const {
  links,
  isLoading: linksLoading,
  fetchLinksForDocument,
  deleteLink,
  getViewerUrl,
} = useTrackingLinks();
const {
  fetchSessionsByOwner,
  getSessionsForLink,
  calculateDealScore,
  getScoreLabel,
  getScoreColor,
  sessions,
} = useTrackingSessions();

const getLinkScore = (link) => {
  const linkSessions = getSessionsForLink(link.id);
  return calculateDealScore(linkSessions);
};

const docId = computed(() => route.params.id);
const currentDoc = ref(null);
const loadingDoc = ref(true);
const showCreateLinkModal = ref(false);
const copiedId = ref(null);
const selectedLinkId = ref("all");
const clientSearchQuery = ref("");

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

const copyLink = async (shortCode) => {
  const url = getViewerUrl(shortCode);
  try {
    await navigator.clipboard.writeText(url);
    copiedId.value = shortCode;
    setTimeout(() => {
      copiedId.value = null;
    }, 2000);
  } catch {
    // Fallback
    const el = document.createElement("textarea");
    el.value = url;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    copiedId.value = shortCode;
    setTimeout(() => {
      copiedId.value = null;
    }, 2000);
  }
};

const handleDelete = async () => {
  if (!confirm("確定要刪除此文件嗎？此操作無法復原。")) return;
  await deleteDocument(docId.value);
  router.push("/dashboard");
};

const handleDeleteLink = async (linkId) => {
  if (!confirm("確定要刪除此追蹤連結嗎？")) return;
  await deleteLink(linkId);
};

const handleLogout = async () => {
  await logout();
  router.push("/login");
};

const onLinkCreated = () => {
  showCreateLinkModal.value = false;
  fetchLinksForDocument(docId.value);
};

// Filtered links based on search
const filteredLinks = computed(() => {
  if (!clientSearchQuery.value) return links.value;
  const q = clientSearchQuery.value.toLowerCase();
  return links.value.filter((link) =>
    link.clientName?.toLowerCase().includes(q),
  );
});

const selectedClientName = computed(() => {
  if (selectedLinkId.value === "all") return "所有來源";
  return (
    links.value.find((l) => l.id === selectedLinkId.value)?.clientName ||
    "Unknown"
  );
});

// ── Closing Engine Data Calculation ───────────────────────────

// All sessions for any link of this document
const allDocSessions = computed(() => {
  if (!links.value.length) return [];
  const linkIds = new Set(links.value.map((l) => l.id));
  return sessions.value.filter((s) => linkIds.has(s.linkId));
});

// Final sessions used by the widgets (filtered by selectedLinkId)
const closingEngineSessions = computed(() => {
  if (selectedLinkId.value === "all") {
    return allDocSessions.value;
  }
  return allDocSessions.value.filter((s) => s.linkId === selectedLinkId.value);
});

// Filtered live viewers
const filteredLiveViewers = computed(() => {
  if (selectedLinkId.value === "all") return liveViewers.value;
  return liveViewers.value.filter((v) => v.linkId === selectedLinkId.value);
});

// Utility for selector indicator
const getLiveForLink = (linkId) => {
  return liveViewers.value.some((v) => v.linkId === linkId);
};

// ── Live Presence via realtime_pings listener ────────────────────
const liveViewers = ref([]);
let unsubscribePings = null;

function subscribeToLivePings(linkIds) {
  if (!linkIds.length) return;
  // Listen to pings updated in last 2 minutes
  try {
    const q = query(
      collection(db, "realtime_pings"),
      where("linkId", "in", linkIds.slice(0, 10)), // Firestore "in" limit = 10
    );
    unsubscribePings = onSnapshot(q, (snap) => {
      const twoMinAgo = Date.now() - 2 * 60 * 1000;
      liveViewers.value = snap.docs
        .map((d) => d.data())
        .filter((d) => {
          const ts = d.updatedAt?.toDate ? d.updatedAt.toDate().getTime() : 0;
          return ts > twoMinAgo;
        });
    });
  } catch (_) {
    // Silently skip if index not ready
  }
}

onMounted(async () => {
  try {
    currentDoc.value = await getDocument(docId.value);
    if (currentDoc.value) {
      await fetchLinksForDocument(docId.value);
      if (user.value) {
        await fetchSessionsByOwner(user.value.uid);
      }
      // Start live presence listener
      const linkIds = links.value.map((l) => l.id);
      subscribeToLivePings(linkIds);
    }
  } finally {
    loadingDoc.value = false;
  }
});

onBeforeUnmount(() => {
  if (unsubscribePings) unsubscribePings();
});
</script>
