# 🏎️ Qulox Intent Scoring Logic (The "HOT" Score)

This document details the algorithm used by the Qulox Closing Engine to determine buyer intent levels, specifically the logic behind the **HOT (80+)** classification.

---

## 🏗️ 1. Scoring Architecture

The final **Deal Score (0–100)** is calculated by aggregating data across all sessions for a specific client link. The formula is:

$$Total Score = \max(Session Score) + MultiSessionBonus + EventBonus + RecencyBonus$$

### A. Base Session Score (Max 50+)

The system identifies the "strongest" single session as the foundation. In the viewer, a single session's intent is computed as:

- **Effective Dwell Time**: Max **50 points**. Scaled based on total time spent actively viewing pages. **Goal: 180s (3 mins) for max points.**
- **High-Value Events**:
  - `text_copy`: **+10 points** per instance.
  - `print_intent`: **+15 points** per instance.
  - `link_click`: **+15 points** (Clicking outbound links in PDF).
  - `zoom_scrutinize`: **+5 points** (Pinch-to-zoom/Scale scrutiny).
  - `text_selection`: Bonus based on selection length.

### B. Multi-Session Bonus (Frequency)

Repeated visits are one of the strongest indicators of a "warm" lead.
| Session Count | Bonus Points |
| :--- | :--- |
| **5+ Visits** | **+15** |
| **3–4 Visits** | **+10** |
| **2 Visits** | **+5** |

### C. Cross-Session Event Bonus

The system scans for specific "buying signals" across _all_ sessions associated with that link.

- **🔴 Sharing Detected (NEW)**: **+10** (Detected when the same link is accessed by multiple unique browser/viewer IDs — a proxy for internal distribution).
- **Print Intent Detected**: **+8**.
- **Text Copying Detected**: **+5**.

### D. Recency Modifier (Last-Seen)

Interest fades over time. Qulox rewards leads that are currently active.
| Last Activity | Bonus Points |
| :--- | :--- |
| **Within 24 Hours** | **+5** |
| **Within 3 Days** | **+3** |
| **Within 7 Days** | **+1** |

---

## 🔥 2. What Makes a Lead "HOT"?

To cross the **80-point threshold**, a client typically needs to exhibit one of these profiles:

### Profile A: The Deep Research Team (The "Sharing" Path)

- **2+ People** reading the document (+10 pts sharing bonus).
- **3+ Minutes** of total dwell time (~50 pts base).
- Triggered **Print Intent** (+15 pts).
- Active **within 24 hours** (+5 pts).
- Total: **80 pts** (HOT).

### Profile B: The Loyal Evaluator

- **5+ Sessions** (+15 pts).
- Deep combined dwell time (~45 pts base).
- Multiple text selections (+3 pts).
- Active **within 24 hours** (+5 pts).
- Multi-session recency (+12 pts bonus spread).
- Total: **80 pts**.

---

## 📊 3. Intent Levels Reference

| Score        | Label             | Status            | Follow-up Priority                   |
| :----------- | :---------------- | :---------------- | :----------------------------------- |
| **81 – 100** | **🔥 HOT**        | Decision Imminent | **Immediate (Phone/Personal Email)** |
| **51 – 80**  | **🟠 Warm**       | Evaluating        | Within 24 Hours                      |
| **21 – 50**  | **🟡 Interested** | Initial Awareness | Standard Nurture                     |
| **0 – 20**   | **🔵 Cold**       | Browsing          | Automated Sequence                   |
