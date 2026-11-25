const STORAGE_KEY = 'ohmybias_sarawak_v1';

const DEFAULT_PROGRESS = {
  completedEpisodes: {},
  muted: false,
  seenIntro: false,
};

export function clampMeter(value) {
  const num = Number.isFinite(value) ? value : 50;
  return Math.max(0, Math.min(100, Math.round(num)));
}

export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROGRESS, completedEpisodes: {} };
    const parsed = JSON.parse(raw);
    return {
      completedEpisodes: parsed.completedEpisodes || {},
      muted: Boolean(parsed.muted),
      seenIntro: Boolean(parsed.seenIntro),
    };
  } catch {
    return { ...DEFAULT_PROGRESS, completedEpisodes: {} };
  }
}

export function saveProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Ignore storage quota or private-mode errors
  }
}

export function resetProgress() {
  const fresh = { ...DEFAULT_PROGRESS, completedEpisodes: {}, seenIntro: true };
  saveProgress(fresh);
  return fresh;
}

export function getFacilitatorRank(completedEpisodes) {
  const entries = Object.values(completedEpisodes || {});
  const count = entries.length;
  if (count === 0) {
    return { title: 'Apprentice Paddler', badge: '🚣', nextHint: 'Complete Episode 1 to earn your first rank.' };
  }
  const avg = entries.reduce((sum, e) => sum + (e.score || 0), 0) / count;
  if (count >= 5 && avg >= 75) {
    return { title: 'Grand Navigator of the Rajang', badge: '🦅', nextHint: 'Mastery achieved across all 5 Sarawak dilemmas!' };
  }
  if (count >= 3 && avg >= 65) {
    return { title: 'Kenyalang Strategist', badge: '🌿', nextHint: `${5 - count} more episodes to Grand Navigator.` };
  }
  return { title: 'Ruai Mediator', badge: '🥁', nextHint: 'Keep taming biases and aligning teams!' };
}
