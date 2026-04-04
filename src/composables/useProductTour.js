import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export function useProductTour(router) {
  const TOUR_KEY = "qulox_tour_done";

  function hasSeenTour() {
    return localStorage.getItem(TOUR_KEY) === "true";
  }

  function markTourDone() {
    localStorage.setItem(TOUR_KEY, "true");
  }

  function startTour() {
    const driverObj = driver({
      showProgress: true,
      progressText: "{{current}} / {{total}}",
      nextBtnText: "下一步 →",
      prevBtnText: "← 上一步",
      doneBtnText: "開始使用 🎉",
      overlayColor: "#000",
      overlayOpacity: 0.6,
      smoothScroll: true,
      allowClose: true,
      onDestroyStarted: () => {
        markTourDone();
        driverObj.destroy();
      },
      steps: [
        // ── 歡迎 ──────────────────────────────────
        {
          popover: {
            title: "👋 歡迎使用 Qulox",
            description:
              "Qulox 幫你追蹤客戶真實的 PDF 閱讀行為。讓我帶你快速認識每個功能，只需 1 分鐘。",
            side: "over",
            align: "center",
          },
        },
        // ── Sidebar 導覽 ─────────────────────────
        {
          element: "nav",
          popover: {
            title: "📍 左側導覽列",
            description:
              "這裡是所有功能的入口：<br><br>📄 <b>文件管理</b> — 上傳 PDF、產生追蹤連結<br>👥 <b>客戶管理</b> — 查看各客戶的閱讀記錄<br>📋 <b>閱讀紀錄</b> — 所有 session 的整體列表",
            side: "right",
            align: "start",
          },
        },
        // ── 文件管理說明 ─────────────────────────
        {
          element: "[data-tour='upload-btn']",
          popover: {
            title: "📤 上傳你的第一份 PDF",
            description:
              "點擊「上傳 PDF」將你的簡報、報價單或提案上傳到 Qulox。上傳後可以為每位客戶產生專屬的追蹤連結。",
            side: "bottom",
            align: "start",
          },
        },
        // ── Intent Score 說明 ────────────────────
        {
          element: "[data-tour='stats-overview']",
          popover: {
            title: "📊 整體數據一覽",
            description:
              "這裡顯示所有文件的整體統計：總閱覽次數、閱讀時間，以及 HOT 和 WARM 客戶數量。",
            side: "bottom",
            align: "start",
          },
        },
        // ── Intent Score 解說 ────────────────────
        {
          popover: {
            title: "🔥 什麼是 Intent Score？",
            description:
              "Qulox 根據客戶的閱讀行為自動計算意圖分數：<br><br>🔥 <b>HOT (>80)</b> — 極高意圖，立即跟進！<br>🟠 <b>WARM (>50)</b> — 積極閱讀，值得聯繫<br>🟡 <b>INTERESTED (>20)</b> — 有興趣但不急<br>🔵 <b>COLD (≤20)</b> — 低意圖<br><br>影響分數的行為：停留時間、複製文字、列印意圖。",
            side: "over",
            align: "center",
          },
        },
        // ── 完成 ─────────────────────────────────
        {
          popover: {
            title: "🎉 準備好了！",
            description:
              "現在就上傳你的第一份 PDF，為客戶產生追蹤連結，開始看到真實的閱讀數據吧！",
            side: "over",
            align: "center",
          },
        },
      ],
    });

    driverObj.drive();
  }

  function startTourIfNew() {
    if (!hasSeenTour()) {
      // 稍微延遲等待 DOM ready
      setTimeout(() => startTour(), 800);
    }
  }

  function resetTour() {
    localStorage.removeItem(TOUR_KEY);
  }

  return { startTour, startTourIfNew, resetTour, hasSeenTour };
}
