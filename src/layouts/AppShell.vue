<template>
  <div class="min-h-screen flex bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
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
      <slot name="user" />
    </aside>

    <!-- Main content -->
    <main class="flex-1 overflow-auto">
      <slot />
    </main>
  </div>
</template>

<script setup>
// 這個 layout 目前只用在 Sessions/SessionDetail 上，
// 所以先只負責 sidebar + main slots。
</script>
