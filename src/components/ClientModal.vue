<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      @click.self="$emit('close')"
    >
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      <div
        class="relative w-full max-w-md bg-gray-900 border border-gray-800/60 rounded-2xl shadow-2xl shadow-black/30"
      >
        <div
          class="flex items-center justify-between px-6 py-4 border-b border-gray-800/50"
        >
          <h3 class="text-base font-semibold text-white">
            {{ isEditing ? "編輯客戶" : "新增客戶" }}
          </h3>
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

        <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
          <div>
            <label
              for="clientName"
              class="block text-sm font-medium text-gray-400 mb-1.5"
              >客戶名稱 *</label
            >
            <input
              id="clientName"
              ref="nameInput"
              v-model="form.name"
              type="text"
              required
              placeholder="例如：ABC 科技有限公司"
              class="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/50 transition-all duration-200"
            />
          </div>

          <div>
            <label
              for="clientCompany"
              class="block text-sm font-medium text-gray-400 mb-1.5"
              >公司名稱</label
            >
            <input
              id="clientCompany"
              v-model="form.company"
              type="text"
              placeholder="公司全名"
              class="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/50 transition-all duration-200"
            />
          </div>

          <div>
            <label
              for="clientEmail"
              class="block text-sm font-medium text-gray-400 mb-1.5"
              >Email</label
            >
            <input
              id="clientEmail"
              v-model="form.email"
              type="email"
              placeholder="client@example.com"
              class="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/50 transition-all duration-200"
            />
          </div>

          <div>
            <label
              for="clientPhone"
              class="block text-sm font-medium text-gray-400 mb-1.5"
              >電話</label
            >
            <input
              id="clientPhone"
              v-model="form.phone"
              type="text"
              placeholder="0912-345-678"
              class="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/50 transition-all duration-200"
            />
          </div>

          <div>
            <label
              for="clientNotes"
              class="block text-sm font-medium text-gray-400 mb-1.5"
              >備註</label
            >
            <textarea
              id="clientNotes"
              v-model="form.notes"
              rows="3"
              placeholder="關於此客戶的備註…"
              class="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/50 transition-all duration-200 resize-none"
            ></textarea>
          </div>

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
              :disabled="!form.name.trim() || isSaving"
              class="px-4 py-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-all duration-200 flex items-center gap-2"
            >
              <svg
                v-if="isSaving"
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
              {{ isSaving ? "儲存中…" : isEditing ? "更新" : "新增" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from "vue";

const props = defineProps({
  client: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["close", "saved"]);

const isEditing = !!props.client;
const nameInput = ref(null);
const isSaving = ref(false);
const errorMsg = ref("");

const form = reactive({
  name: props.client?.name || "",
  company: props.client?.company || "",
  email: props.client?.email || "",
  phone: props.client?.phone || "",
  notes: props.client?.notes || "",
});

const handleSubmit = () => {
  if (!form.name.trim()) return;
  isSaving.value = true;
  errorMsg.value = "";

  const data = {
    name: form.name.trim(),
    company: form.company.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    notes: form.notes.trim(),
  };

  emit("saved", data);
};

onMounted(async () => {
  await nextTick();
  nameInput.value?.focus();
});
</script>
