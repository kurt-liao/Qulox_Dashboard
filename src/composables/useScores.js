import { ref } from "vue";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../services/firebase.js";

/**
 * Reads tracking_sessions from Firestore (written by the qulox viewer)
 * and provides scoring / analytics functions.
 *
 * Each tracking_session document contains:
 *   - linkId, documentId, ownerId, clientName
 *   - intentScore (0-100), intentLevel (HOT/WARM/INTERESTED/COLD)
 *   - totalDwellSecs, pageStats, events[]
 *   - startedAt, endedAt, createdAt
 */
export function useTrackingSessions() {
  const sessions = ref([]);
  const isLoading = ref(false);

  /**
   * Fetch all sessions for a given owner
   */
  const fetchSessionsByOwner = async (ownerId) => {
    isLoading.value = true;
    try {
      const q = query(
        collection(db, "tracking_sessions"),
        where("ownerId", "==", ownerId),
      );
      const snap = await getDocs(q);
      sessions.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (err) {
      console.error("fetchSessionsByOwner error:", err.message, err.code);
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Get all sessions for a specific tracking link
   */
  const getSessionsForLink = (linkId) => {
    return sessions.value.filter((s) => s.linkId === linkId);
  };

  /**
   * Get all sessions for a specific document
   */
  const getSessionsForDocument = (documentId) => {
    return sessions.value.filter((s) => s.documentId === documentId);
  };

  /**
   * Get all sessions for a specific client name
   */
  const getSessionsForClient = (clientName) => {
    return sessions.value.filter((s) => s.clientName === clientName);
  };

  // ────────────────────────────────────────────
  //   成交分數 (Deal Score) Calculator
  // ────────────────────────────────────────────
  //
  //   Based on the viewer's computeIntentAnalysis:
  //   - Dwell time score (0-50 from totalDwellSecs)
  //   - Event score (text_copy +25, print_intent +30, text_selection +length/10)
  //
  //   This composable aggregates ACROSS multiple sessions:
  //   - Multiple visits = stronger intent
  //   - High-value events (copy, print) = very strong signals
  //   - Recency matters

  /**
   * Calculate comprehensive deal score for a set of sessions
   * Returns 0-100
   */
  const calculateDealScore = (sessionList) => {
    if (!sessionList || sessionList.length === 0) return 0;

    // Use the max intentScore from individual sessions as base
    const maxScore = Math.max(...sessionList.map((s) => s.intentScore || 0));

    // Multi-session bonus: repeated visits are a strong signal
    const sessionCount = sessionList.length;
    let multiSessionBonus = 0;
    if (sessionCount >= 5) multiSessionBonus = 15;
    else if (sessionCount >= 3) multiSessionBonus = 10;
    else if (sessionCount >= 2) multiSessionBonus = 5;

    // High-value events across ALL sessions
    let hasTextCopy = false;
    let hasPrintIntent = false;
    let totalTextSelections = 0;

    sessionList.forEach((s) => {
      if (s.events && Array.isArray(s.events)) {
        s.events.forEach((e) => {
          if (e.type === "text_copy") hasTextCopy = true;
          if (e.type === "print_intent") hasPrintIntent = true;
          if (e.type === "text_selection") totalTextSelections++;
        });
      }
    });

    let eventBonus = 0;
    if (hasPrintIntent) eventBonus += 8; // was 10
    if (hasTextCopy) eventBonus += 5; // was 8
    if (totalTextSelections >= 5) eventBonus += 3;

    // Sharing Detection: Different viewer IDs for the same link session
    const uniqueViewerIds = new Set(
      sessionList.map((s) => s.viewerId).filter(Boolean),
    );
    if (uniqueViewerIds.size > 1) {
      eventBonus += 10; // Significant bonus for internal sharing
    }

    // Recency: most recent session within last 3 days = bonus
    let recencyBonus = 0;
    const sortedByTime = [...sessionList].sort((a, b) => {
      const aTime = a.createdAt?.toDate?.()
        ? a.createdAt.toDate()
        : new Date(a.endedAt || 0);
      const bTime = b.createdAt?.toDate?.()
        ? b.createdAt.toDate()
        : new Date(b.endedAt || 0);
      return bTime - aTime;
    });
    if (sortedByTime.length > 0) {
      const latest = sortedByTime[0];
      const latestTime = latest.createdAt?.toDate?.()
        ? latest.createdAt.toDate()
        : new Date(latest.endedAt || 0);
      const daysSince =
        (Date.now() - latestTime.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSince <= 1)
        recencyBonus = 5; // was 8
      else if (daysSince <= 3)
        recencyBonus = 3; // was 5
      else if (daysSince <= 7) recencyBonus = 1;
    }

    return Math.min(
      maxScore + multiSessionBonus + eventBonus + recencyBonus,
      100,
    );
  };

  /**
   * Get score label in Chinese
   */
  const getScoreLabel = (score) => {
    if (score > 80) return "🔥 HOT";
    if (score > 50) return "🟠 Warm";
    if (score > 20) return "🟡 Interested";
    if (score > 0) return "🔵 Cold";
    return "—";
  };

  /**
   * Get Tailwind color classes for score level
   */
  const getScoreColor = (score) => {
    if (score > 80)
      return {
        text: "text-rose-400",
        bg: "bg-rose-500/10",
        border: "border-rose-500/20",
        ring: "stroke-rose-400",
        gradient: "from-rose-500 to-orange-500",
      };
    if (score > 50)
      return {
        text: "text-amber-400",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20",
        ring: "stroke-amber-400",
        gradient: "from-amber-500 to-yellow-500",
      };
    if (score > 20)
      return {
        text: "text-sky-400",
        bg: "bg-sky-500/10",
        border: "border-sky-500/20",
        ring: "stroke-sky-400",
        gradient: "from-sky-500 to-cyan-500",
      };
    if (score > 0)
      return {
        text: "text-blue-400",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20",
        ring: "stroke-blue-400",
        gradient: "from-blue-500 to-indigo-500",
      };
    return {
      text: "text-gray-600",
      bg: "bg-gray-800/30",
      border: "border-gray-700/30",
      ring: "stroke-gray-700",
      gradient: "from-gray-600 to-gray-700",
    };
  };

  /**
   * Aggregate stats for a set of sessions
   */
  const getSessionStats = (sessionList) => {
    const totalSessions = sessionList.length;
    const totalDwellSecs = sessionList.reduce(
      (sum, s) => sum + (s.totalDwellSecs || 0),
      0,
    );
    const totalEvents = sessionList.reduce(
      (sum, s) => sum + (s.events?.length || 0),
      0,
    );
    const highValueEvents = sessionList.reduce((sum, s) => {
      if (!s.events) return sum;
      return (
        sum +
        s.events.filter(
          (e) => e.type === "text_copy" || e.type === "print_intent",
        ).length
      );
    }, 0);

    const uniquePages = new Set();
    sessionList.forEach((s) => {
      if (s.pageStats) {
        Object.keys(s.pageStats).forEach((p) => uniquePages.add(p));
      }
    });

    return {
      totalSessions,
      totalDwellSecs,
      totalDwellFormatted: formatDwell(totalDwellSecs),
      totalEvents,
      highValueEvents,
      uniquePagesViewed: uniquePages.size,
    };
  };

  /**
   * Calculate deal score for a CLIENT.
   * Accepts multiple name variants (e.g. client name + company name)
   * to match against session.clientName, since links may be created
   * using different labels.
   *
   * @param {string|string[]} nameOrNames - one or more names to match
   */
  const calculateClientDealScore = (nameOrNames) => {
    const names = Array.isArray(nameOrNames) ? nameOrNames : [nameOrNames];
    const validNames = names.filter(Boolean).map((n) => n.toLowerCase());
    if (validNames.length === 0) return 0;

    const clientSessions = sessions.value.filter(
      (s) => s.clientName && validNames.includes(s.clientName.toLowerCase()),
    );
    return calculateDealScore(clientSessions);
  };

  /**
   * Get all unique client names from sessions
   */
  const getUniqueClients = () => {
    const names = new Set();
    sessions.value.forEach((s) => {
      if (s.clientName) names.add(s.clientName);
    });
    return Array.from(names);
  };

  /**
   * Get overview stats for the entire dashboard.
   * Counts are CLIENT-level (unique clients), not link-level.
   */
  const getDashboardStats = (allLinks) => {
    const totalSessions = sessions.value.length;
    const totalDwellSecs = sessions.value.reduce(
      (sum, s) => sum + (s.totalDwellSecs || 0),
      0,
    );

    // Client-level scoring: group by clientName, score each client
    const clientNames = getUniqueClients();
    const clientScores = clientNames.map((name) =>
      calculateClientDealScore(name),
    );
    const hotLeads = clientScores.filter((s) => s > 80).length;
    const warmLeads = clientScores.filter((s) => s > 50 && s <= 80).length;

    return {
      totalSessions,
      totalDwellSecs,
      totalDwellFormatted: formatDwell(totalDwellSecs),
      hotLeads,
      warmLeads,
      activeLinks: allLinks.filter((l) => l.isActive).length,
    };
  };

  return {
    sessions,
    isLoading,
    fetchSessionsByOwner,
    getSessionsForLink,
    getSessionsForDocument,
    getSessionsForClient,
    getUniqueClients,
    calculateDealScore,
    calculateClientDealScore,
    getScoreLabel,
    getScoreColor,
    getSessionStats,
    getDashboardStats,
  };
}

// ── Helpers ──
function formatDwell(totalSecs) {
  if (totalSecs < 60) return `${totalSecs}s`;
  if (totalSecs < 3600)
    return `${Math.floor(totalSecs / 60)}m ${totalSecs % 60}s`;
  const hrs = Math.floor(totalSecs / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  return `${hrs}h ${mins}m`;
}
