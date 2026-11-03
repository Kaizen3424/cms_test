const STORAGE_KEY = 'meridian_saved_places_v2';

function read(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === 'string') : [];
  } catch {
    return [];
  }
}

function persist(ids: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    /* storage unavailable — keep the in-memory state */
  }
}

let saved = read();

function paint() {
  document.querySelectorAll<HTMLElement>('[data-save-place]').forEach((element) => {
    const id = element.dataset.savePlace;
    if (!id) return;
    const isSaved = saved.includes(id);
    element.setAttribute('aria-pressed', String(isSaved));
    element.setAttribute('aria-label', isSaved ? 'Remove from saved expeditions' : 'Save to your Atlas');
    element.setAttribute('title', isSaved ? 'Remove from saved expeditions' : 'Save to your Atlas');
    element.classList.toggle('is-saved', isSaved);
    const icon = element.querySelector('svg');
    if (icon) icon.setAttribute('fill', isSaved ? 'currentColor' : 'none');
  });
}

function toast(message: string) {
  let region = document.querySelector<HTMLElement>('[data-toast-region]');
  if (!region) {
    region = document.createElement('div');
    region.setAttribute('data-toast-region', '');
    region.className = 'fixed bottom-6 right-6 z-50 flex flex-col gap-2 items-end';
    document.body.appendChild(region);
  }

  const node = document.createElement('div');
  node.className =
    'flex items-center gap-2 bg-[#1a1a18] text-white px-4 py-2.5 rounded-full shadow-2xl text-xs font-medium border border-white/10';
  node.innerHTML = '<span class="w-2 h-2 rounded-full bg-[#e60023]"></span>';
  const label = document.createElement('span');
  label.textContent = message;
  node.appendChild(label);
  region.appendChild(node);

  window.setTimeout(() => node.remove(), 3200);
}

function toggle(id: string, name: string) {
  if (saved.includes(id)) {
    saved = saved.filter((value) => value !== id);
    toast('Removed from your saved expeditions');
  } else {
    saved = [...saved, id];
    toast(`Saved ${name} to your Atlas`);
  }
  persist(saved);
  paint();
}

function init() {
  paint();

  document.addEventListener('click', (event) => {
    const target = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-save-place]');
    if (!target) return;
    event.preventDefault();
    event.stopPropagation();
    const id = target.dataset.savePlace;
    if (!id) return;
    toggle(id, target.dataset.placeName ?? 'place');
  });

  window.addEventListener('storage', (event) => {
    if (event.key !== STORAGE_KEY) return;
    saved = read();
    paint();
  });

  // Islands and client re-renders replace DOM nodes; keep the visual state in sync.
  let scheduled = false;
  const observer = new MutationObserver(() => {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(() => {
      scheduled = false;
      paint();
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
