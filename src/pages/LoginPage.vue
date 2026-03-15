<template>
  <div class="min-h-screen flex items-center justify-center px-4">
    <!-- Ambient background glow -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl"
      ></div>
      <div
        class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"
      ></div>
    </div>

    <!-- Login Card -->
    <div class="relative w-full max-w-md">
      <!-- Logo / Brand -->
      <div class="text-center mb-8">
        <div
          class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/20 mb-4"
        >
          <svg
            class="w-7 h-7 text-brand-400"
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
        <h1 class="text-2xl font-semibold text-white">Intent Pulse</h1>
        <p class="text-sm text-gray-500 mt-1">Dashboard 管理後台</p>
      </div>

      <!-- Card -->
      <div
        class="bg-gray-900/60 backdrop-blur-xl border border-gray-800/60 rounded-2xl p-8 shadow-2xl shadow-black/20"
      >
        <form @submit.prevent="handleLogin" class="space-y-5">
          <!-- Email -->
          <div>
            <label
              for="email"
              class="block text-sm font-medium text-gray-400 mb-1.5"
              >帳號</label
            >
            <input
              id="email"
              v-model="email"
              type="email"
              required
              autocomplete="email"
              placeholder="your@email.com"
              class="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/50 transition-all duration-200"
            />
          </div>

          <!-- Password -->
          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-400 mb-1.5"
              >密碼</label
            >
            <input
              id="password"
              v-model="password"
              type="password"
              required
              autocomplete="current-password"
              placeholder="••••••••"
              class="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/50 transition-all duration-200"
            />
          </div>

          <!-- Error message -->
          <div
            v-if="errorMsg"
            class="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl"
          >
            <svg
              class="w-5 h-5 text-red-400 shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
            <span class="text-sm text-red-300">{{ errorMsg }}</span>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg
              v-if="isSubmitting"
              class="w-4 h-4 animate-spin"
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
            <span>{{ isSubmitting ? "登入中…" : "登入" }}</span>
          </button>
        </form>
      </div>

      <p class="text-center text-xs text-gray-600 mt-6">
        Intent Pulse Platform &copy; 2026
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "../composables/useAuth.js";

const router = useRouter();
const { login } = useAuth();

const email = ref("");
const password = ref("");
const errorMsg = ref("");
const isSubmitting = ref(false);

const handleLogin = async () => {
  errorMsg.value = "";
  isSubmitting.value = true;

  try {
    await login(email.value, password.value);
    router.push("/dashboard");
  } catch (err) {
    const code = err.code;
    if (
      code === "auth/user-not-found" ||
      code === "auth/wrong-password" ||
      code === "auth/invalid-credential"
    ) {
      errorMsg.value = "帳號或密碼錯誤";
    } else if (code === "auth/too-many-requests") {
      errorMsg.value = "登入嘗試過多，請稍後再試";
    } else {
      errorMsg.value = err.message;
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>
