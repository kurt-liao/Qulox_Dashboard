<template>
  <div
    class="relative inline-flex items-center justify-center"
    :style="{ width: size + 'px', height: size + 'px' }"
  >
    <svg :width="size" :height="size" class="transform -rotate-90">
      <!-- Background circle -->
      <circle
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        fill="none"
        stroke="currentColor"
        class="text-gray-800/40"
        :stroke-width="strokeWidth"
      />
      <!-- Progress circle -->
      <circle
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        fill="none"
        :class="colorClasses.ring"
        :stroke-width="strokeWidth"
        stroke-linecap="round"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
        class="transition-all duration-700 ease-out"
      />
    </svg>
    <!-- Score text -->
    <div class="absolute inset-0 flex items-center justify-center">
      <span class="font-semibold" :class="[colorClasses.text, fontSizeClass]">
        {{ score > 0 ? score : "—" }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useTrackingSessions } from "../composables/useScores.js";

const props = defineProps({
  score: {
    type: Number,
    default: 0,
  },
  size: {
    type: Number,
    default: 48,
  },
  strokeWidth: {
    type: Number,
    default: 3,
  },
});

const { getScoreColor } = useTrackingSessions();

const radius = computed(() => (props.size - props.strokeWidth * 2) / 2);
const circumference = computed(() => 2 * Math.PI * radius.value);
const dashOffset = computed(() => {
  const progress = props.score / 100;
  return circumference.value * (1 - progress);
});
const colorClasses = computed(() => getScoreColor(props.score));
const fontSizeClass = computed(() => {
  if (props.size >= 64) return "text-base";
  if (props.size >= 48) return "text-xs";
  return "text-[10px]";
});
</script>
