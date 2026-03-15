<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      @click.self="$emit('close')"
    >
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      <!-- Modal -->
      <div
        class="relative w-full max-w-md bg-gray-900 border border-gray-800/60 rounded-2xl shadow-2xl shadow-black/30"
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between px-6 py-4 border-b border-gray-800/50"
        >
          <h3 class="text-base font-semibold text-white">產生客戶連結</h3>
          <button
            @click="$emit('close')"
            class="p-1 text-gray-500 hover:text-gray-300 rounded-lg hover:bg-gray-800/50 transition-colors"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Body -->
        <form @submit.prevent="handleCreate" class="p-6 space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1.5"
              >選擇客戶</label
            >

            <!-- Loading -->
            <div
              v-if="clientsLoading"
              class="flex items-center gap-2 py-3 text-sm text-gray-500"
            >
              <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
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
              載入客戶清單…
            </div>

            <template v-else>
              <!-- Custom Dropdown -->
              <div class="relative" ref="dropdownRef">
                <!-- Trigger -->
                <button
                  type="button"
                  @click="toggleDropdown"
                  class="w-full flex items-center justify-between px-4 py-2.5 bg-gray-800/50 border rounded-xl text-sm transition-all duration-200"
                  :class="
                    isOpen
                      ? 'border-brand-500/50 ring-2 ring-brand-500/20'
                      : 'border-gray-700/50 hover:border-gray-600/50'
                  "
                >
                  <!-- Selected display -->
                  <div class="flex items-center gap-2.5 min-w-0">
                    <template v-if="selectedClient">
                      <div
                        class="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0"
                      >
                        <span class="text-xs font-medium text-purple-400">{{
                          selectedClient.name.charAt(0).toUpperCase()
                        }}</span>
                      </div>
                      <div class="min-w-0">
                        <span class="text-white truncate block">{{
                          selectedClient.name
                        }}</span>
                      </div>
                    </template>
                    <span v-else class="text-gray-500"
                      >選擇客戶或輸入名稱…</span
                    >
                  </div>
                  <!-- Arrow -->
                  <svg
                    class="w-4 h-4 text-gray-500 shrink-0 transition-transform duration-200"
                    :class="{ 'rotate-180': isOpen }"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </button>

                <!-- Dropdown panel -->
                <Transition
                  enter-active-class="transition duration-150 ease-out"
                  enter-from-class="opacity-0 -translate-y-1 scale-[0.98]"
                  enter-to-class="opacity-100 translate-y-0 scale-100"
                  leave-active-class="transition duration-100 ease-in"
                  leave-from-class="opacity-100 translate-y-0 scale-100"
                  leave-to-class="opacity-0 -translate-y-1 scale-[0.98]"
                >
                  <div
                    v-if="isOpen"
                    class="absolute z-20 left-0 right-0 mt-1.5 bg-gray-850 border border-gray-700/60 rounded-xl shadow-xl shadow-black/30 overflow-hidden"
                    style="background: #1a1d24"
                  >
                    <!-- Search input -->
                    <div class="px-3 pt-3 pb-2">
                      <div class="relative">
                        <svg
                          class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
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
                          ref="searchInput"
                          v-model="searchQuery"
                          type="text"
                          placeholder="搜尋客戶…"
                          class="w-full pl-9 pr-3 py-2 bg-gray-800/60 border border-gray-700/40 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-brand-500/30 focus:border-brand-500/40 transition-all"
                          @keydown.esc="closeDropdown"
                        />
                      </div>
                    </div>

                    <!-- Options list -->
                    <div
                      class="max-h-48 overflow-y-auto px-1.5 pb-1.5 scrollbar-thin"
                    >
                      <!-- Filtered clients -->
                      <template v-if="filteredClients.length > 0">
                        <button
                          v-for="client in filteredClients"
                          :key="client.id"
                          type="button"
                          @click="selectClient(client)"
                          class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all duration-100"
                          :class="
                            selectedClient?.id === client.id
                              ? 'bg-brand-500/10 text-brand-400'
                              : 'text-gray-300 hover:bg-gray-800/60 hover:text-white'
                          "
                        >
                          <div
                            class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors"
                            :class="
                              selectedClient?.id === client.id
                                ? 'bg-brand-500/15 border border-brand-500/25'
                                : 'bg-purple-500/10 border border-purple-500/20'
                            "
                          >
                            <span
                              class="text-xs font-medium"
                              :class="
                                selectedClient?.id === client.id
                                  ? 'text-brand-400'
                                  : 'text-purple-400'
                              "
                            >
                              {{ client.name.charAt(0).toUpperCase() }}
                            </span>
                          </div>
                          <div class="min-w-0 flex-1">
                            <p class="text-sm font-medium truncate">
                              {{ client.name }}
                            </p>
                            <p
                              v-if="client.company"
                              class="text-xs text-gray-500 truncate"
                            >
                              {{ client.company }}
                            </p>
                          </div>
                          <!-- Check icon -->
                          <svg
                            v-if="selectedClient?.id === client.id"
                            class="w-4 h-4 text-brand-400 shrink-0"
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
                      </template>

                      <!-- No results -->
                      <div
                        v-else-if="searchQuery && filteredClients.length === 0"
                        class="px-3 py-4 text-center"
                      >
                        <p class="text-xs text-gray-500">
                          找不到「{{ searchQuery }}」
                        </p>
                      </div>

                      <!-- No clients at all -->
                      <div
                        v-else-if="availableClients.length === 0"
                        class="px-3 py-4 text-center"
                      >
                        <p class="text-xs text-gray-500">
                          尚無客戶，請先到客戶管理新增
                        </p>
                      </div>
                    </div>

                    <!-- Divider + manual input option -->
                    <div
                      class="border-t border-gray-700/40 px-1.5 pb-1.5 pt-1.5"
                    >
                      <button
                        type="button"
                        @click="switchToManual"
                        class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left text-gray-400 hover:bg-gray-800/60 hover:text-white transition-all duration-100"
                      >
                        <div
                          class="w-8 h-8 rounded-lg bg-gray-800/80 border border-gray-700/40 flex items-center justify-center shrink-0"
                        >
                          <svg
                            class="w-4 h-4 text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="1.5"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M12 4.5v15m7.5-7.5h-15"
                            />
                          </svg>
                        </div>
                        <span class="text-sm">手動輸入客戶名稱</span>
                      </button>
                    </div>
                  </div>
                </Transition>
              </div>

              <!-- Manual input mode -->
              <div v-if="manualMode" class="mt-3">
                <div class="flex items-center gap-2">
                  <input
                    ref="manualInput"
                    v-model="manualClientName"
                    type="text"
                    placeholder="輸入客戶名稱"
                    class="flex-1 px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/50 transition-all duration-200 text-sm"
                  />
                  <button
                    type="button"
                    @click="cancelManual"
                    class="p-2 text-gray-500 hover:text-gray-300 rounded-lg hover:bg-gray-800/50 transition-colors shrink-0"
                    title="取消手動輸入"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </template>

            <p class="text-xs text-gray-600 mt-1.5">
              此名稱用於標記此連結的目標客戶
            </p>
          </div>

          <!-- Error -->
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

          <!-- Footer -->
          <div class="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-300 rounded-xl hover:bg-gray-800/50 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              :disabled="!canSubmit || isCreating"
              class="px-4 py-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-all duration-200 flex items-center gap-2"
            >
              <svg
                v-if="isCreating"
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
              {{ isCreating ? "產生中…" : "產生連結" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
import { useAuth } from "../composables/useAuth.js";
import { useTrackingLinks } from "../composables/useTrackingLinks.js";
import { useClients } from "../composables/useClients.js";

const props = defineProps({
  documentId: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["close", "created"]);

const { user } = useAuth();
const { createLink } = useTrackingLinks();
const {
  clients: availableClients,
  isLoading: clientsLoading,
  fetchClients,
} = useClients();

const dropdownRef = ref(null);
const searchInput = ref(null);
const manualInput = ref(null);
const isOpen = ref(false);
const searchQuery = ref("");
const selectedClient = ref(null);
const manualMode = ref(false);
const manualClientName = ref("");
const isCreating = ref(false);
const errorMsg = ref("");

const filteredClients = computed(() => {
  if (!searchQuery.value.trim()) return availableClients.value;
  const q = searchQuery.value.toLowerCase();
  return availableClients.value.filter(
    (c) =>
      c.name?.toLowerCase().includes(q) || c.company?.toLowerCase().includes(q),
  );
});

const resolvedClientName = computed(() => {
  if (manualMode.value) return manualClientName.value.trim();
  return selectedClient.value?.name || "";
});

const canSubmit = computed(() => resolvedClientName.value.length > 0);

const toggleDropdown = async () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    manualMode.value = false;
    await nextTick();
    searchInput.value?.focus();
  }
};

const closeDropdown = () => {
  isOpen.value = false;
  searchQuery.value = "";
};

const selectClient = (client) => {
  selectedClient.value = client;
  manualMode.value = false;
  closeDropdown();
};

const switchToManual = async () => {
  selectedClient.value = null;
  manualMode.value = true;
  closeDropdown();
  await nextTick();
  manualInput.value?.focus();
};

const cancelManual = () => {
  manualMode.value = false;
  manualClientName.value = "";
};

// Close dropdown on outside click
const handleClickOutside = (e) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    closeDropdown();
  }
};

const handleCreate = async () => {
  if (!canSubmit.value || !user.value) return;

  errorMsg.value = "";
  isCreating.value = true;

  try {
    await createLink(
      props.documentId,
      user.value.uid,
      resolvedClientName.value,
    );
    emit("created");
  } catch (err) {
    errorMsg.value = err.message;
  } finally {
    isCreating.value = false;
  }
};

onMounted(async () => {
  document.addEventListener("mousedown", handleClickOutside);
  if (user.value) {
    await fetchClients(user.value.uid);
  }
});

onUnmounted(() => {
  document.removeEventListener("mousedown", handleClickOutside);
});
</script>
