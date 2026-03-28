<script setup>
import { computed } from "vue";

const props = defineProps({
  // Array of session objects
  sessions: {
    type: Array,
    default: () => [],
  },
  // Array of realtime ping documents
  realtimePings: {
    type: Array,
    default: () => [],
  },
});

// ── Velocity Calculations ───────────────────────────────────────
const velocityData = computed(() => {
  const allTimestamps = [];

  // Collect from session createdAt
  props.sessions.forEach((s) => {
    const t = s.createdAt?.toDate
      ? s.createdAt.toDate().getTime()
      : s.startedAt
        ? new Date(s.startedAt).getTime()
        : null;
    if (t) allTimestamps.push(t);
  });

  // Collect from velocityMetrics if available
  props.sessions.forEach((s) => {
    if (s.velocityMetrics?.frequency24h !== undefined) {
      // Already have this data in the session
    }
  });

  const now = Date.now();
  const oneHour = 60 * 60 * 1000;
  const oneDay = 24 * oneHour;

  const freq24h = allTimestamps.filter((t) => now - t < oneDay).length;
  const freq1h = allTimestamps.filter((t) => now - t < oneHour).length;

  // Revisit gap: time between last two sessions (ms)
  const sorted = [...allTimestamps].sort((a, b) => b - a);
  const revisitGapMs = sorted.length >= 2 ? sorted[0] - sorted[1] : null;

  // Velocity score 0–100: driven by frequency and recency
  let velocityScore = 0;
  velocityScore += Math.min(freq24h * 12, 48); // up to 48 pts
  velocityScore += Math.min(freq1h * 25, 50); // up to 50 pts if hot right now
  velocityScore = Math.min(velocityScore, 100);

  const isRedline = velocityScore >= 75;
  const label =
    velocityScore >= 75
      ? "REDLINE 🔴"
      : velocityScore >= 50
        ? "HOT ZONE 🟠"
        : velocityScore >= 25
          ? "WARMING UP 🟡"
          : "IDLE 🔵";

  let revisitGapFormatted = "—";
  if (revisitGapMs !== null) {
    const mins = Math.floor(revisitGapMs / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) revisitGapFormatted = `${days}d ${hours % 24}h`;
    else if (hours > 0) revisitGapFormatted = `${hours}h ${mins % 60}m`;
    else revisitGapFormatted = `${mins}m`;
  }

  return {
    velocityScore,
    freq24h,
    freq1h,
    isRedline,
    label,
    revisitGapFormatted,
    totalRevisits: allTimestamps.length,
  };
});

// ── Gauge Arc Math ───────────────────────────────────────────────
// SVG arc: semi-circle from -180° to 0° (bottom arc)
// We draw on a 200×110 viewBox
const RADIUS = 80;
const CX = 100;
const CY = 100;

function polarToXY(angleDeg) {
  const rad = ((angleDeg - 180) * Math.PI) / 180;
  return {
    x: CX + RADIUS * Math.cos(rad),
    y: CY + RADIUS * Math.sin(rad),
  };
}

const arcPath = computed(() => {
  // Full semicircle from 180° to 360° (left to right, bottom half)
  const start = polarToXY(0);
  const end = polarToXY(180);
  return `M ${start.x} ${start.y} A ${RADIUS} ${RADIUS} 0 0 1 ${end.x} ${end.y}`;
});

const needleAngle = computed(() => {
  // Map velocity 0–100 to 0°–180°
  return (velocityData.value.velocityScore / 100) * 180;
});

const needleEnd = computed(() => {
  return polarToXY(needleAngle.value);
});

const redlineStartAngle = 135; // 75% of 180°
const redlineStart = computed(() => polarToXY(redlineStartAngle));
const redlineEnd = computed(() => polarToXY(180));
</script>

<template>
  <div
    class="bg-gray-900/60 border rounded-2xl p-6 transition-all duration-500"
    :class="
      velocityData.isRedline
        ? 'border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.15)]'
        : 'border-gray-800/50'
    "
  >
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div>
        <h3 class="text-sm font-semibold text-white">Velocity Tachometer</h3>
        <p class="text-xs text-gray-500 mt-0.5">成交轉速表 · Open Frequency</p>
      </div>
      <span
        class="text-xs font-bold px-2.5 py-1 rounded-full"
        :class="
          velocityData.isRedline
            ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse'
            : velocityData.velocityScore >= 50
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              : velocityData.velocityScore >= 25
                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
        "
      >
        {{ velocityData.label }}
      </span>
    </div>

    <!-- SVG Gauge -->
    <div class="flex justify-center mb-4">
      <svg
        viewBox="0 0 200 110"
        class="w-full max-w-[220px]"
        overflow="visible"
      >
        <!-- Background arc track -->
        <path
          :d="arcPath"
          fill="none"
          stroke="#1f2937"
          stroke-width="16"
          stroke-linecap="round"
        />

        <!-- Colored score arc -->
        <path
          :d="arcPath"
          fill="none"
          :stroke="
            velocityData.velocityScore >= 75
              ? '#ef4444'
              : velocityData.velocityScore >= 50
                ? '#f97316'
                : velocityData.velocityScore >= 25
                  ? '#eab308'
                  : '#3b82f6'
          "
          stroke-width="16"
          stroke-linecap="round"
          stroke-dasharray="251.2"
          :stroke-dashoffset="
            251.2 - (velocityData.velocityScore / 100) * 251.2
          "
          style="
            transition:
              stroke-dashoffset 1s cubic-bezier(0.34, 1.56, 0.64, 1),
              stroke 0.5s;
          "
        />

        <!-- Redline zone overlay -->
        <path
          :d="`M ${redlineStart.x} ${redlineStart.y} A ${RADIUS} ${RADIUS} 0 0 1 ${redlineEnd.x} ${redlineEnd.y}`"
          fill="none"
          stroke="rgba(239,68,68,0.25)"
          stroke-width="16"
          stroke-linecap="round"
        />

        <!-- Tick marks -->
        <g v-for="tick in [0, 25, 50, 75, 100]" :key="tick">
          <line
            :x1="
              CX +
              (RADIUS - 10) *
                Math.cos((((tick / 100) * 180 - 180) * Math.PI) / 180)
            "
            :y1="
              CY +
              (RADIUS - 10) *
                Math.sin((((tick / 100) * 180 - 180) * Math.PI) / 180)
            "
            :x2="
              CX +
              (RADIUS + 4) *
                Math.cos((((tick / 100) * 180 - 180) * Math.PI) / 180)
            "
            :y2="
              CY +
              (RADIUS + 4) *
                Math.sin((((tick / 100) * 180 - 180) * Math.PI) / 180)
            "
            :stroke="
              tick >= 75 ? 'rgba(239,68,68,0.6)' : 'rgba(107,114,128,0.5)'
            "
            stroke-width="1.5"
          />
        </g>

        <!-- REDLINE text marker -->
        <text
          :x="redlineStart.x - 6"
          :y="redlineStart.y - 8"
          fill="rgba(239,68,68,0.7)"
          font-size="6"
          font-family="monospace"
          text-anchor="middle"
        >
          REDLINE
        </text>

        <!-- Needle -->
        <line
          :x1="CX"
          :y1="CY"
          :x2="needleEnd.x"
          :y2="needleEnd.y"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
          style="transition: all 1s cubic-bezier(0.34, 1.56, 0.64, 1)"
        />
        <!-- Needle base -->
        <circle :cx="CX" :cy="CY" r="5" fill="white" opacity="0.9" />

        <!-- Speed value -->
        <text
          :x="CX"
          y="78"
          text-anchor="middle"
          fill="white"
          font-size="22"
          font-weight="bold"
          font-family="monospace"
        >
          {{ velocityData.velocityScore }}
        </text>
        <text
          :x="CX"
          y="88"
          text-anchor="middle"
          fill="#6b7280"
          font-size="7"
          font-family="sans-serif"
        >
          VELOCITY SCORE
        </text>
      </svg>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-3 gap-3">
      <div class="bg-gray-800/40 rounded-xl p-3 text-center">
        <p class="text-lg font-bold text-white font-mono">
          {{ velocityData.freq24h }}
        </p>
        <p class="text-[10px] text-gray-500 leading-tight">Opens<br />24h</p>
      </div>
      <div class="bg-gray-800/40 rounded-xl p-3 text-center">
        <p class="text-lg font-bold text-white font-mono">
          {{ velocityData.totalRevisits }}
        </p>
        <p class="text-[10px] text-gray-500 leading-tight">
          Total<br />Revisits
        </p>
      </div>
      <div class="bg-gray-800/40 rounded-xl p-3 text-center">
        <p class="text-lg font-bold text-white font-mono">
          {{ velocityData.revisitGapFormatted }}
        </p>
        <p class="text-[10px] text-gray-500 leading-tight">Revisit<br />Gap</p>
      </div>
    </div>

    <!-- Redline alert banner -->
    <div
      v-if="velocityData.isRedline"
      class="mt-4 flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2"
    >
      <div class="w-2 h-2 rounded-full bg-red-400 animate-ping shrink-0"></div>
      <p class="text-xs text-red-400 font-medium">
        🚨 高頻閱讀偵測！客戶可能正在「決策關口」— 立即跟進！
      </p>
    </div>
  </div>
</template>
