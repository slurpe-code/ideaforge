const ideaInput = document.getElementById('ideaInput');
const saveBtn = document.getElementById('saveBtn');
const ideasList = document.getElementById('ideasList');
const toast = document.getElementById('toast');

function showToast(msg, duration = 2500) {
  toast.textContent = msg;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), duration);
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function buildCoworkPrompt(ideaText) {
  return `You are helping expand an app idea into a full buildable blueprint for a Cowork task.

IDEA: "${ideaText}"

Please expand this into a structured breakdown with the following sections:

1. ASSUMPTIONS — what you're assuming about the app based on the one-liner
2. CORE FEATURES — the minimum features needed for v1
3. CLARIFYING QUESTIONS — 3-5 questions that would help refine the idea
4. UI OPTIONS — describe 3 different UI layout approaches (name, description, ascii mockup)
5. COMPLEXITY — estimate: Simple / Medium / Complex and why
6. SUGGESTED TECH STACK — recommended platform, language, database

After the breakdown, generate a filled PROJECT.md using this template structure:
- App name, one-liner, platform, status
- Tech stack
- File structure
- Phases with steps and parts
- Coding conventions

Keep it dense and ready to paste into a new Cowork task to start building immediately.`;
}

async function loadIdeas() {
  try {
    const res = await fetch('/ideas');
    const ideas = await res.json();
    ideasList.innerHTML = '';
    if (ideas.length === 0) {
      ideasList.innerHTML = '<p style="color:var(--muted);font-size:0.9rem;">No ideas yet. Type one above.</p>';
      return;
    }
    ideas.forEach(idea => {
      const card = document.createElement('div');
      card.className = 'idea-card';
      card.innerHTML = `
        <div class="idea-text">${idea.text}</div>
        <div class="idea-meta">${formatDate(idea.created_at)}</div>
        <button class="expand-btn" data-id="${idea.id}" data-text="${encodeURIComponent(idea.text)}">
          Expand in Cowork
        </button>
      `;
      ideasList.appendChild(card);
    });

    document.querySelectorAll('.expand-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = decodeURIComponent(btn.dataset.text);
        const prompt = buildCoworkPrompt(text);
        navigator.clipboard.writeText(prompt).then(() => {
          btn.textContent = 'Copied!';
          showToast('Prompt copied — paste into a new Cowork task');
          setTimeout(() => { btn.textContent = 'Expand in Cowork'; }, 3000);
        });
      });
    });
  } catch (err) {
    console.error('Failed to load ideas:', err);
  }
}

saveBtn.addEventListener('click', async () => {
  const text = ideaInput.value.trim();
  if (!text) return;
  saveBtn.disabled = true;
  try {
    const res = await fetch('/idea', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    if (!res.ok) throw new Error('Save failed');
    ideaInput.value = '';
    showToast('Idea saved ✓');
    await loadIdeas();
  } catch (err) {
    showToast('Error saving idea');
    console.error(err);
  } finally {
    saveBtn.disabled = false;
  }
});

ideaInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') saveBtn.click();
});

// Load on start
loadIdeas();
