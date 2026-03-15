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
        class="relative w-full max-w-lg bg-gray-900 border border-gray-800/60 rounded-2xl shadow-2xl shadow-black/30"
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between px-6 py-4 border-b border-gray-800/50"
        >
          <h3 class="text-base font-semibold text-white">上傳 PDF</h3>
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
        <div class="p-6 space-y-5">
          <!-- Drop zone -->
          <div
            @dragover.prevent="isDragging = true"
            @dragleave="isDragging = false"
            @drop.prevent="handleDrop"
            @click="openFileDialog"
            class="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200"
            :class="
              isDragging
                ? 'border-brand-500/50 bg-brand-500/5'
                : selectedFile
                  ? 'border-emerald-500/30 bg-emerald-500/5'
                  : 'border-gray-700/50 hover:border-gray-600/50 hover:bg-gray-800/20'
            "
          >
            <input
              ref="fileInput"
              type="file"
              accept=".pdf"
              class="hidden"
              @change="handleFileSelect"
            />

            <template v-if="!selectedFile">
              <div
                class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gray-800/50 border border-gray-700/50 mb-3"
              >
                <svg
                  class="w-6 h-6 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1.5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                  />
                </svg>
              </div>
              <p class="text-sm text-gray-400 mb-1">
                拖曳 PDF 檔案至此或點擊選取
              </p>
              <p class="text-xs text-gray-600">僅支援 .pdf 格式</p>
            </template>

            <template v-else>
              <div
                class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-3"
              >
                <svg
                  class="w-6 h-6 text-emerald-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1.5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              </div>
              <p class="text-sm text-emerald-300 font-medium">
                {{ selectedFile.name }}
              </p>
              <p class="text-xs text-gray-500 mt-0.5">
                {{ formatSize(selectedFile.size) }}
              </p>
            </template>
          </div>

          <!-- Name input -->
          <div>
            <label
              for="docName"
              class="block text-sm font-medium text-gray-400 mb-1.5"
              >文件名稱</label
            >
            <input
              id="docName"
              v-model="docName"
              type="text"
              required
              placeholder="例如：Q1 產品報告"
              class="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/50 transition-all duration-200"
            />
          </div>

          <!-- Upload progress -->
          <div v-if="isUploading" class="space-y-2">
            <div
              class="flex items-center justify-between text-xs text-gray-400"
            >
              <span>上傳中…</span>
            </div>
            <div class="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div
                class="h-full bg-brand-500 rounded-full transition-all duration-500 animate-pulse"
                style="width: 60%"
              ></div>
            </div>
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
        </div>

        <!-- Footer -->
        <div
          class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-800/50"
        >
          <button
            @click="$emit('close')"
            class="px-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-300 rounded-xl hover:bg-gray-800/50 transition-colors"
          >
            取消
          </button>
          <button
            @click="handleUpload"
            :disabled="!selectedFile || !docName.trim() || isUploading"
            class="px-4 py-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-all duration-200 flex items-center gap-2"
          >
            <svg
              v-if="isUploading"
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
            {{ isUploading ? "上傳中…" : "上傳" }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from "vue";
import { useAuth } from "../composables/useAuth.js";
import { useDocuments } from "../composables/useDocuments.js";

const emit = defineEmits(["close", "uploaded"]);

const { user } = useAuth();
const { uploadDocument } = useDocuments();

const fileInput = ref(null);
const selectedFile = ref(null);
const docName = ref("");
const isDragging = ref(false);
const isUploading = ref(false);
const errorMsg = ref("");

const openFileDialog = () => {
  fileInput.value?.click();
};

const handleFileSelect = (e) => {
  const file = e.target.files?.[0];
  if (file && file.type === "application/pdf") {
    selectedFile.value = file;
    if (!docName.value) {
      docName.value = file.name.replace(/\.pdf$/i, "");
    }
  }
};

const handleDrop = (e) => {
  isDragging.value = false;
  const file = e.dataTransfer.files?.[0];
  if (file && file.type === "application/pdf") {
    selectedFile.value = file;
    if (!docName.value) {
      docName.value = file.name.replace(/\.pdf$/i, "");
    }
  }
};

const formatSize = (bytes) => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

const handleUpload = async () => {
  if (!selectedFile.value || !docName.value.trim() || !user.value) return;

  errorMsg.value = "";
  isUploading.value = true;

  try {
    await uploadDocument(
      selectedFile.value,
      docName.value.trim(),
      user.value.uid,
    );
    emit("uploaded");
  } catch (err) {
    errorMsg.value = err.message;
  } finally {
    isUploading.value = false;
  }
};
</script>
