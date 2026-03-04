# IdeaForge — PROJECT.md
> Single source of truth. Read at the start of every Cowork task. Dense only — no prose.

---

## 🤖 Claude: Read this first before doing anything else

Before starting any work, ask the user exactly this:

> **"Do you want me to auto-continue this project when your session resets?
> If yes, send me a screenshot of your usage limits so I can see the reset time — I'll schedule the next pickup automatically with a 3-minute buffer and confirm the exact time with you before activating."**

Wait for their answer before proceeding. If yes:
1. Read their reset time from the screenshot
2. Add 3 minutes to get the pickup time
3. Confirm back: *"Your session resets at [X]. I'll schedule the next pickup at [X+3]. Current time is [Y]. Is that correct?"*
4. Wait for confirmation, then create the scheduled task and continue building.

If no: skip auto-continuation and start from Next Action in Current State.

---

## App
- **Name:** IdeaForge
- **One-liner:** Type one line about an app idea → get a full Cowork-ready blueprint + one-command setup script that creates the GitHub repo, installs dependencies, and scaffolds the project automatically.
- **Platform:** Web → iOS
- **Status:** Phase 6 / Step 6.1 — in progress

---

## Tech Stack
- **Backend:** Python 3.11, FastAPI
- **Database:** SQLite (via Python stdlib sqlite3 — no ORM)
- **Frontend:** HTML5 / Vanilla JS / CSS (no frameworks)
- **Future iOS:** Swift + URLSession calling same hosted FastAPI backend
- **Package manager:** pip3
- **Repo:** https://github.com/slurpe-code/ideaforge

---

## File Structure
```
ideaforge/
├── PROJECT.md
├── main.py              ← FastAPI app, all routes
├── database.py          ← SQLite init, all queries
├── static/
│   ├── index.html       ← single-page UI
│   ├── style.css        ← dark theme
│   └── app.js           ← save idea, expand prompt, download setup.sh
├── requirements.txt
└── .gitignore
```

---

## Phases

### Phase 0: Setup & Scaffold ✅ — 8 messages | 10 min
| Step | Description | Status |
|------|-------------|--------|
| 0.1 | GitHub repo created (slurpe-code/ideaforge) | ✅ |
| 0.2 | All files scaffolded | ✅ |
| 0.3 | FastAPI + SQLite verified clean | ✅ |
| 0.4 | Committed + pushed to GitHub | ✅ |

### Phase 1: Idea Capture UI ✅ — built during Phase 0
| Step | Description | Status |
|------|-------------|--------|
| 1.1 | Input + Save button + dark CSS | ✅ |
| 1.2 | POST /idea saves to SQLite | ✅ |
| 1.3 | JS fetch on submit, shows confirmation | ✅ |
| 1.4 | GET /ideas loads cards on page load | ✅ |

### Phase 2: Cowork Expansion Bridge ✅ — built during Phase 0
| Step | Description | Status |
|------|-------------|--------|
| 2.1 | "Expand in Cowork" button on each card | ✅ |
| 2.2 | Copies formatted Cowork prompt to clipboard | ✅ |
| 2.3 | Toast confirmation shown | ✅ |

### Phase 6: Auto Setup Script Generator 🔄 — Est. 8 messages | 10 min
| Step | Description | Parts | Status |
|------|-------------|-------|--------|
| 6.1 | buildSetupScript() in app.js | a. slugify idea to project name b. generate full bash script c. venv + pip + gh repo create + git push | ✅ |
| 6.2 | Download button on each card | a. "↓ setup.sh" button b. triggers file download c. filename = setup-[project-name].sh | ✅ |
| 6.3 | Style + test | a. button styled in CSS b. reload app c. save idea + verify both buttons appear + download works | ⬜ |
| 6.4 | Commit Phase 6 | a. git add . b. commit "Phase 6 - Auto Setup Script Generator ✓" c. push | ⬜ |

_Status legend: ⬜ pending | 🔄 in-progress | ✅ done | ⚠️ blocked_

---

## Current State
- **Last completed:** Phase 6, Step 6.2 — download button + script generator built
- **What works:** App runs, ideas save, Expand in Cowork copies prompt, ↓ setup.sh downloads script
- **Next action:** Phase 6, Step 6.3 — reload app, save a test idea, verify both buttons work + setup.sh downloads correctly
- **GitHub last commit:** "Phase 0 - Auto scaffold ✓"

---

## Coding Conventions
- FastAPI: async routes, Pydantic models for all request/response bodies
- SQLite: all queries in database.py, no raw SQL in routes
- JS: vanilla fetch(), async/await, no jQuery or frameworks
- CSS: dark mode, --var custom properties, mobile-first
- Error handling: try/except on all DB + API calls, HTTP 500 with message on failure
- No external API keys — AI expansion handled by Cowork, not the app
- Comments: only on non-obvious logic

---

## Auto-Continuation
- **Enabled:** not set yet
- **Rule:** Never stop mid-step. Reach working state, commit, update Current State, then stop.
- **On startup:** Read this file → check GitHub last commit → match phase table → continue from Next Action.

---

## Done Criteria — Phase 6
- [ ] App runs without crashing
- [ ] Both buttons visible on idea cards (Expand in Cowork + ↓ setup.sh)
- [ ] setup.sh downloads with correct project name
- [ ] Running setup.sh creates folder, venv, installs deps, creates GitHub repo, pushes
- [ ] Committed: "Phase 6 - Auto Setup Script Generator ✓"
- [ ] PROJECT.md Current State updated

---

## Known Issues / Do Not Touch
- `uvicorn` not on PATH on Mac — always run as: `python3 -m uvicorn main:app --reload`
- SQLite .db file writes to same directory as database.py (uses os.path.abspath)
