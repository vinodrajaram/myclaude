# TODOS

## Banker Notes App

### TODO: Cross-call "Open Action Items" view
**What:** A dashboard page showing all incomplete action items across all calls for the banker.
**Why:** Bankers manage multiple deals simultaneously. After a week of calls they need a single view of everything they've committed to — not just per-call.
**Pros:** High value, low effort (one SQL query + one UI screen). The action_items table schema is already designed for this.
**Cons:** None significant. Minor UI work.
**Context:** We chose a separate action_items table (vs JSONB) specifically because of this use case. The query is: `SELECT * FROM action_items WHERE user_id = ? AND completed = false ORDER BY due_date`. Build after V1 ships and adoption is confirmed.
**Depends on:** V1 shipped, action_items table populated with real data.

---
