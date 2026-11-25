(function () {
  "use strict";
  // === js/state.js ===
const STORAGE_KEY = 'ohmybias_sarawak_v1';

const DEFAULT_PROGRESS = {
  completedEpisodes: {},
  muted: false,
  seenIntro: false,
  theme: 'light',
};
function clampMeter(value) {
  const num = Number.isFinite(value) ? value : 50;
  return Math.max(0, Math.min(100, Math.round(num)));
}
function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROGRESS, completedEpisodes: {} };
    const parsed = JSON.parse(raw);
    return {
      completedEpisodes: parsed.completedEpisodes || {},
      muted: Boolean(parsed.muted),
      seenIntro: Boolean(parsed.seenIntro),
      theme: parsed.theme === 'dark' ? 'dark' : 'light',
    };
  } catch {
    return { ...DEFAULT_PROGRESS, completedEpisodes: {} };
  }
}
function saveProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Ignore storage quota or private-mode errors
  }
}
function resetProgress(current) {
  const base = current || loadProgress();
  const fresh = {
    ...DEFAULT_PROGRESS,
    completedEpisodes: {},
    seenIntro: true,
    muted: Boolean(base.muted),
    theme: base.theme === 'dark' ? 'dark' : 'light',
  };
  saveProgress(fresh);
  return fresh;
}
function getFacilitatorRank(completedEpisodes) {
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

  // === js/audio.js ===
let audioCtx = null;

function getContext() {
  if (typeof window === 'undefined') return null;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  if (!audioCtx) audioCtx = new Ctx();
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function playTone(freq, duration, type = 'triangle', gainPeak = 0.08, delay = 0) {
  const ctx = getContext();
  if (!ctx) return;
  const now = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(gainPeak, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + duration + 0.02);
}

/**
 * Play synthesized Sarawakian-inspired feedback cues (sape plucks & bamboo taps).
 */
function playSfx(kind, muted) {
  if (muted) return;
  if (kind === 'sape') {
    // Warm pentatonic sape-inspired arpeggio
    playTone(293.66, 0.24, 'triangle', 0.08, 0);
    playTone(349.23, 0.24, 'triangle', 0.08, 0.07);
    playTone(440.0, 0.34, 'triangle', 0.09, 0.14);
  } else if (kind === 'trap') {
    // Low bamboo knock for bias trap
    playTone(165, 0.16, 'sine', 0.1, 0);
    playTone(130, 0.2, 'sine', 0.09, 0.09);
  } else {
    // Soft tap
    playTone(392, 0.09, 'sine', 0.04, 0);
  }
}

  // === js/svg-art.js ===
/**
 * Studio-grade inline SVG generators for Oh My Bias! — Sarawak Edition.
 * Uses unique per-instance <defs> IDs to prevent Safari/WebKit gradient collisions.
 */

let _svgUid = 0;
function uid(prefix) {
  _svgUid += 1;
  return `${prefix}_${_svgUid}`;
}

/**
 * Unified 1.8px-stroke vector UI icon set (zero OS emoji inconsistency).
 */
function uiIconSvg(name, size = 18) {
  const paths = {
    help: `<circle cx="12" cy="12" r="9"/><path d="M9.5 9.4a2.6 2.6 0 0 1 5 .8c0 1.8-2.5 2.2-2.5 3.8"/><circle cx="12" cy="17.2" r="0.9" fill="currentColor" stroke="none"/>`,
    book: `<path d="M4.5 5.5A2.5 2.5 0 0 1 7 3h12.5v16.5H7A2.5 2.5 0 0 0 4.5 22z"/><path d="M4.5 5.5V19a2 2 0 0 1 2.5-2h12.5"/><path d="M9 7.5h6.5"/><path d="M9 11h5"/>`,
    volumeOn: `<path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.8a9 9 0 0 1 0 12.4"/>`,
    volumeOff: `<path d="M11 5 6 9H3v6h3l5 4z"/><path d="m16 9 5 6"/><path d="m21 9-5 6"/>`,
    moon: `<path d="M20.2 14.5A8.5 8.5 0 0 1 9.5 3.8a8.5 8.5 0 1 0 10.7 10.7z"/>`,
    sun: `<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2.5 12h2M19.5 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>`,
    close: `<path d="m6 6 12 12"/><path d="m18 6-12 12"/>`,
    align: `<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="3.5"/><path d="M22 21v-2a4 4 0 0 0-3-3.8"/><path d="M16.5 3.6a3.5 3.5 0 0 1 0 6.8"/>`,
    trust: `<path d="M12 21c-4.8-2.4-7.5-6.6-7.5-11.5C8 8.8 11.4 6 12 3c.6 3 4 5.8 7.5 6.5 0 4.9-2.7 9.1-7.5 11.5z"/><path d="M12 9v11"/>`,
    impact: `<path d="M13 2 4.5 13.5H11L10 22l9.5-11.5H13z"/>`,
    pin: `<path d="M12 21s-6-5.2-6-10.5a6 6 0 1 1 12 0C18 15.8 12 21 12 21z"/><circle cx="12" cy="10.5" r="2.2"/>`,
    radar: `<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.8"/><path d="M12 12 18.2 5.8"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/>`,
    toolkit: `<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.5-3.5a5 5 0 0 1-6.8 6.8l-6.6 6.6a1.8 1.8 0 0 1-2.6-2.6l6.6-6.6a5 5 0 0 1 6.8-6.8z"/>`,
    sparkle: `<path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 16v3M17.5 17.5h3"/>`,
    alert: `<path d="M12 3.5 2.8 19.5h18.4z"/><path d="M12 9.5v4.5"/><circle cx="12" cy="16.8" r="0.9" fill="currentColor" stroke="none"/>`,
    check: `<path d="m5 12.5 4.2 4.2L19 7"/>`,
    copy: `<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>`,
    play: `<polygon points="7 5 19 12 7 19 7 5" fill="currentColor" stroke="none"/>`,
    reset: `<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>`,
    target: `<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/>`,
    chevronLeft: `<path d="m15 6-6 6 6 6"/>`,
    chevronRight: `<path d="m9 6 6 6-6 6"/>`,
    compass: `<circle cx="12" cy="12" r="9"/><polygon points="15.5 8.5 13.5 13.5 8.5 15.5 10.5 10.5" fill="currentColor" stroke="none"/>`,
  };

  const inner = paths[name] || paths.sparkle;
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
}

/**
 * Expressive Bujang Kenyalang (Rhinoceros Hornbill) mascot with mood states.
 */
function hornbillSvg(size = 56, mood = 'neutral') {
  const bgId = uid('hbBg');
  const beakId = uid('hbBeak');
  const casqueId = uid('hbCasque');
  const ringColor = mood === 'celebrate' ? '#48B282' : mood === 'alert' ? '#E06045' : '#D9A441';
  const auraOpacity = mood === 'neutral' ? '0.28' : '0.45';

  const eyeAndBrow =
    mood === 'celebrate'
      ? `
        <path d="M33.2 25.5Q35.2 23.2 37.2 25.5" stroke="#121C33" stroke-width="2" stroke-linecap="round"/>
        <circle cx="48" cy="14" r="1.5" fill="#F5E2B3"/>
        <path d="M16 15L17 17.5L19.5 18.5L17 19.5L16 22L15 19.5L12.5 18.5L15 17.5Z" fill="#F5E2B3"/>`
      : mood === 'alert'
        ? `
          <circle cx="35.2" cy="25.2" r="2.3" fill="#121C33"/>
          <circle cx="35.9" cy="24.5" r="0.85" fill="#FFFFFF"/>
          <path d="M32 21.8L38.2 23" stroke="#121C33" stroke-width="1.6" stroke-linecap="round"/>`
        : `
          <circle cx="35.2" cy="25" r="2.3" fill="#121C33"/>
          <circle cx="35.9" cy="24.3" r="0.85" fill="#FFFFFF"/>
          <path d="M32.2 22.2Q35.2 20.8 38 22.3" stroke="#121C33" stroke-width="1.2" stroke-linecap="round"/>`;

  return `
  <svg width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" shape-rendering="geometricPrecision" aria-hidden="true">
    <defs>
      <radialGradient id="${bgId}" cx="35%" cy="28%" r="72%">
        <stop offset="0%" stop-color="#2E4A80"/>
        <stop offset="65%" stop-color="#172747"/>
        <stop offset="100%" stop-color="#0D162B"/>
      </radialGradient>
      <linearGradient id="${beakId}" x1="0%" y1="0%" x2="100%" y2="85%">
        <stop offset="0%" stop-color="#FFF5D6"/>
        <stop offset="45%" stop-color="#F2CC79"/>
        <stop offset="100%" stop-color="#C98A28"/>
      </linearGradient>
      <linearGradient id="${casqueId}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#E56447"/>
        <stop offset="100%" stop-color="#9E2D18"/>
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="30" fill="url(#${bgId})" stroke="${ringColor}" stroke-width="2.5"/>
    <circle cx="32" cy="32" r="26.5" stroke="#FAF3E0" stroke-width="0.7" stroke-opacity="${auraOpacity}"/>
    <!-- Tail Feather -->
    <path d="M21 46L13 54H26.5L28.5 46H21Z" fill="#FAF3E0"/>
    <path d="M15.5 51.4H26.2" stroke="#121C33" stroke-width="1.8" stroke-linecap="round"/>
    <!-- Body & Wing Plumage -->
    <path d="M20.5 47.5C20.5 33.5 25 23 35.2 20.5C40.5 19.3 44.5 22.8 44.5 28.5C44.5 37 37.5 44 35.5 49.5H20.5Z" fill="#0B1222"/>
    <path d="M23.5 44C24.5 36.5 28 32 34 31.5C32.5 37 29.5 41.5 26 45Z" fill="#1C2B4B" opacity="0.85"/>
    <!-- Cream Throat & Cheek -->
    <path d="M26 26.2C30 21 36.5 21.2 39.5 25.5L36.2 34.8C31.2 34.8 27 30.8 26 26.2Z" fill="#FAF3E0"/>
    <!-- Curved Casque & Beak -->
    <path d="M35.5 17.2C42.5 13.8 50.5 15.8 51.8 21.4C46.8 22.5 40.5 21.8 35.8 20.8Z" fill="url(#${casqueId})"/>
    <path d="M37.5 17.8C42.5 16 47.5 16.8 49.5 19" stroke="#FFD6BA" stroke-width="1" stroke-linecap="round" opacity="0.7"/>
    <path d="M38.2 21.2C47.5 21.4 55.8 25.2 57.5 31.2C49.5 31.4 43 28.4 38.2 26.2Z" fill="url(#${beakId})"/>
    <path d="M39.5 24.4C46.5 25 51.5 27.2 54.5 29.5" stroke="#9E6212" stroke-width="0.9" stroke-linecap="round" opacity="0.55"/>
    ${eyeAndBrow}
  </svg>`;
}

/**
 * Intricate Iban Pua Kumbu woven geometric divider.
 */
function puaDividerSvg() {
  const patId = uid('puaPattern');
  return `
  <svg class="pua-divider" viewBox="0 0 360 14" preserveAspectRatio="none" shape-rendering="geometricPrecision" aria-hidden="true">
    <defs>
      <pattern id="${patId}" width="36" height="14" patternUnits="userSpaceOnUse">
        <rect width="36" height="14" fill="transparent"/>
        <path d="M0 7 L9 1 L18 7 L9 13 Z" fill="#C84B31"/>
        <path d="M4.5 7 L9 3.8 L13.5 7 L9 10.2 Z" fill="#FAF3E0" opacity="0.9"/>
        <circle cx="9" cy="7" r="1.5" fill="#16233F"/>
        <path d="M18 7 L27 1 L36 7 L27 13 Z" fill="#D9A441"/>
        <path d="M22.5 7 L27 3.8 L31.5 7 L27 10.2 Z" fill="#16233F" opacity="0.9"/>
        <circle cx="27" cy="7" r="1.5" fill="#FAF3E0"/>
        <path d="M0 1H36M0 13H36" stroke="#D9A441" stroke-width="0.7" opacity="0.55"/>
      </pattern>
    </defs>
    <rect width="360" height="14" fill="url(#${patId})"/>
  </svg>`;
}

function classifyMood(mood = '') {
  const m = String(mood).toLowerCase();
  if (m.includes('rushing') || m.includes('urgent') || m.includes('tech-first')) return 'intense';
  if (m.includes('worried') || m.includes('struggling') || m.includes('alarmed') || m.includes('defensive')) return 'worried';
  if (m.includes('silenced') || m.includes('forgotten')) return 'quiet';
  if (m.includes('data') || m.includes('systems') || m.includes('practical') || m.includes('frontline')) return 'focused';
  return 'warm';
}

/**
 * Mood-expressive Sarawakian stakeholder portrait.
 */
function avatarSvg({ skin = '#D89B6C', hair = '#1E1B18', shirt = '#2D6A4F', hat = 'none' } = {}, mood = '') {
  const bgId = uid('avBg');
  const rimId = uid('avRim');
  const expr = classifyMood(mood);

  const brows =
    expr === 'intense'
      ? `<path d="M15.8 18.2L20.4 19.6" stroke="#1B2432" stroke-width="1.35" stroke-linecap="round"/>
         <path d="M28.2 18.2L23.6 19.6" stroke="#1B2432" stroke-width="1.35" stroke-linecap="round"/>`
      : expr === 'worried'
        ? `<path d="M15.8 19.5Q18 17.8 20.2 18.6" stroke="#1B2432" stroke-width="1.2" stroke-linecap="round"/>
           <path d="M28.2 19.5Q26 17.8 23.8 18.6" stroke="#1B2432" stroke-width="1.2" stroke-linecap="round"/>`
        : expr === 'quiet'
          ? `<path d="M16.2 18.9H20.2" stroke="#1B2432" stroke-width="1.15" stroke-linecap="round"/>
             <path d="M23.8 18.9H27.8" stroke="#1B2432" stroke-width="1.15" stroke-linecap="round"/>`
          : `<path d="M16.2 18.6Q18.2 17.3 20.2 18.6" stroke="#1B2432" stroke-width="1.2" stroke-linecap="round"/>
             <path d="M23.8 18.6Q25.8 17.3 27.8 18.6" stroke="#1B2432" stroke-width="1.2" stroke-linecap="round"/>`;

  const mouth =
    expr === 'intense'
      ? `<path d="M18.6 26.2Q22 25.1 25.4 26.2" stroke="#6B2D20" stroke-width="1.5" stroke-linecap="round"/>`
      : expr === 'worried'
        ? `<path d="M18.4 26.8Q20.2 25.1 22 26Q23.8 25.1 25.6 26.8" stroke="#6B2D20" stroke-width="1.45" stroke-linecap="round"/>`
        : expr === 'quiet'
          ? `<path d="M19.4 26.1H24.6" stroke="#6B2D20" stroke-width="1.45" stroke-linecap="round"/>`
          : expr === 'focused'
            ? `<path d="M18.6 25.4C20.3 27.4 23.7 27.4 25.4 25.4" stroke="#6B2D20" stroke-width="1.5" stroke-linecap="round"/>`
            : `<path d="M18.5 25.4C20.2 27.2 23.8 27.2 25.5 25.4" stroke="#6B2D20" stroke-width="1.5" stroke-linecap="round"/>`;

  const hatLayer =
    hat === 'songkok'
      ? `<path d="M12 18.4C12 10.2 32 10.2 32 18.4Z" fill="#121C33"/>
         <path d="M13 15.2C16 12.6 28 12.6 31 15.2" stroke="#2D4573" stroke-width="1" opacity="0.6"/>
         <path d="M12.2 17.5H31.8" stroke="#D9A441" stroke-width="1.35"/>`
      : hat === 'headband'
        ? `<rect x="11.2" y="14.2" width="21.6" height="4.4" rx="2.2" fill="#C84B31"/>
           <path d="M13.5 16.4L16.5 14.8L19.5 16.4L22.5 14.8L25.5 16.4L28.5 14.8L30.5 16.4" stroke="#F5E2B3" stroke-width="1.1"/>`
        : hat === 'tudung'
          ? `<path d="M9 28.5C9 11.4 35 11.4 35 28.5L37.5 44H6.5L9 28.5Z" fill="${shirt}"/>
             <path d="M11.8 24C11.8 13.8 32.2 13.8 32.2 24" stroke="#F5E2B3" stroke-width="1.2" opacity="0.65"/>
             <circle cx="22" cy="31.5" r="1.4" fill="#D9A441"/>`
          : '';

  return `
  <svg viewBox="0 0 44 44" fill="none" shape-rendering="geometricPrecision" aria-hidden="true">
    <defs>
      <radialGradient id="${bgId}" cx="50%" cy="32%" r="68%">
        <stop offset="0%" stop-color="#FFFDF7"/>
        <stop offset="100%" stop-color="#E7D8B4"/>
      </radialGradient>
      <linearGradient id="${rimId}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.45"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.16"/>
      </linearGradient>
    </defs>
    <rect width="44" height="44" fill="url(#${bgId})"/>
    <circle cx="22" cy="18" r="15" fill="#D9A441" opacity="0.12"/>
    <!-- Shoulders & Shirt -->
    <path d="M6.5 44C6.5 33.4 13.5 29.2 22 29.2C30.5 29.2 37.5 33.4 37.5 44H6.5Z" fill="${shirt}"/>
    <path d="M6.5 44C6.5 33.4 13.5 29.2 22 29.2C30.5 29.2 37.5 33.4 37.5 44H6.5Z" fill="url(#${rimId})"/>
    <path d="M17 29.8L22 34.8L27 29.8" stroke="#FAF3E0" stroke-width="1.4" stroke-linejoin="round" opacity="0.75"/>
    <!-- Neck -->
    <rect x="19" y="27" width="6" height="4.5" rx="2" fill="${skin}"/>
    ${hat === 'tudung' ? hatLayer : ''}
    <!-- Ears -->
    <circle cx="12" cy="21.5" r="2.2" fill="${skin}"/>
    <circle cx="32" cy="21.5" r="2.2" fill="${skin}"/>
    <!-- Head -->
    <circle cx="22" cy="21" r="9.6" fill="${skin}"/>
    <circle cx="22" cy="21" r="9.6" fill="url(#${rimId})" opacity="0.35"/>
    ${hat !== 'tudung' ? `<path d="M12 20C12 11.2 32 11.2 32 20C29 15.2 15 15.2 12 20Z" fill="${hair}"/>` : ''}
    ${hat !== 'tudung' ? hatLayer : ''}
    ${brows}
    <!-- Eyes -->
    <circle cx="18.2" cy="21.4" r="1.5" fill="#1B2432"/>
    <circle cx="25.8" cy="21.4" r="1.5" fill="#1B2432"/>
    <circle cx="18.7" cy="20.9" r="0.5" fill="#FFFFFF"/>
    <circle cx="26.3" cy="20.9" r="0.5" fill="#FFFFFF"/>
    ${mouth}
  </svg>`;
}

/**
 * Rich layered 420x176 Sarawakian SVG dioramas with ambient motion classes.
 */
function episodeSceneSvg(epId, resolved = false) {
  const skyId = uid(`sky_${epId}`);
  const waterId = uid(`water_${epId}`);
  const sunId = uid(`sun_${epId}`);

  const skyStop = resolved
    ? `<linearGradient id="${skyId}" x1="0" y1="0" x2="0" y2="1">
         <stop offset="0%" stop-color="#193361"/>
         <stop offset="52%" stop-color="#28688E"/>
         <stop offset="100%" stop-color="#E2AC49" stop-opacity="0.75"/>
       </linearGradient>`
    : `<linearGradient id="${skyId}" x1="0" y1="0" x2="0" y2="1">
         <stop offset="0%" stop-color="#0D1528"/>
         <stop offset="65%" stop-color="#1B2B4B"/>
         <stop offset="100%" stop-color="#293E69"/>
       </linearGradient>`;

  if (epId === 'ep1') {
    const waterY = resolved ? 148 : 124;
    return `
    <svg viewBox="0 0 420 176" fill="none" shape-rendering="geometricPrecision" aria-hidden="true">
      <defs>
        ${skyStop}
        <radialGradient id="${sunId}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#FFF2C7"/>
          <stop offset="50%" stop-color="#F5D076" stop-opacity="0.75"/>
          <stop offset="100%" stop-color="#F5D076" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="${waterId}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${resolved ? '#2D6A4F' : '#3E84A8'}"/>
          <stop offset="100%" stop-color="#13253D"/>
        </linearGradient>
      </defs>
      <rect width="420" height="176" fill="url(#${skyId})"/>
      ${resolved ? `<circle cx="356" cy="48" r="46" fill="url(#${sunId})"/><circle cx="356" cy="48" r="16" fill="#FAF0CA"/>` : ''}
      <!-- Distant Mount Santubong Mist Layers -->
      <path d="M0 132L64 84L114 106L176 62L248 112L322 92L420 104V140H0V132Z" fill="#13223D" opacity="0.75"/>
      <path d="M0 138Q110 122 220 134T420 128V142H0Z" fill="#1B3052" opacity="0.55"/>
      <!-- Kuching Heritage Shophouse 1 -->
      <rect x="18" y="54" width="78" height="82" rx="2" fill="#FAF3E0"/>
      <rect x="18" y="102" width="78" height="34" fill="#EFE4C8"/>
      <path d="M12 56L57 28L102 56H12Z" fill="#C84B31"/>
      <path d="M16 56H98" stroke="#D9A441" stroke-width="2"/>
      <rect x="28" y="66" width="18" height="24" rx="9" fill="#214E6E"/>
      <rect x="58" y="66" width="18" height="24" rx="9" fill="#214E6E"/>
      <path d="M37 66V90M67 66V90" stroke="#FAF3E0" stroke-width="1.2" opacity="0.6"/>
      <rect x="30" y="110" width="20" height="26" rx="10" fill="#16233F"/>
      <rect x="60" y="110" width="20" height="26" rx="10" fill="#16233F"/>
      <!-- Shophouse 2 -->
      <rect x="106" y="64" width="78" height="72" rx="2" fill="#F5E2B3"/>
      <path d="M100 66L145 40L190 66H100Z" fill="#2D6A4F"/>
      <rect x="118" y="76" width="16" height="20" rx="2" fill="#1B2A4A"/>
      <rect x="152" y="76" width="16" height="20" rx="2" fill="#1B2A4A"/>
      <rect x="118" y="106" width="50" height="30" rx="2" fill="#8C5A3C"/>
      <!-- Kopitiam & Laksa Stall -->
      <rect x="200" y="72" width="118" height="64" rx="4" fill="#D9A441"/>
      <path d="M194 74L204 58H314L324 74H194Z" fill="#C84B31"/>
      <path d="M214 58L210 74M236 58L234 74M259 58V74M282 58L284 74M304 58L308 74" stroke="#FAF3E0" stroke-width="3" opacity="0.85"/>
      <rect x="210" y="80" width="98" height="18" rx="3" fill="#16233F"/>
      <text x="259" y="92" text-anchor="middle" fill="#FAF3E0" font-size="9.5" font-weight="800" letter-spacing="0.8">LAKSA STALL</text>
      <rect x="214" y="104" width="26" height="28" rx="2" fill="#FFF7E2" opacity="0.88"/>
      <rect x="246" y="104" width="26" height="28" rx="2" fill="#FFF7E2" opacity="0.88"/>
      <rect x="278" y="104" width="26" height="28" rx="2" fill="#FFF7E2" opacity="0.88"/>
      <!-- Street & Drain -->
      <rect x="0" y="136" width="420" height="40" fill="#222938"/>
      <rect x="0" y="${waterY}" width="420" height="${176 - waterY}" fill="url(#${waterId})" opacity="0.92"/>
      <g class="anim-ripple">
        <line x1="28" y1="${waterY + 7}" x2="108" y2="${waterY + 7}" stroke="#FAF3E0" stroke-width="1.6" stroke-opacity="0.45" stroke-linecap="round"/>
        <line x1="210" y1="${waterY + 11}" x2="310" y2="${waterY + 11}" stroke="#FAF3E0" stroke-width="1.6" stroke-opacity="0.38" stroke-linecap="round"/>
      </g>
      ${resolved
        ? `<g class="anim-glow">
             <circle cx="216" cy="52" r="5.5" fill="#FDE68A"/><circle cx="259" cy="52" r="5.5" fill="#FDE68A"/><circle cx="302" cy="52" r="5.5" fill="#FDE68A"/>
           </g>`
        : `<g class="anim-drift">
             <path d="M322 30C334 16 362 16 372 30C384 30 390 42 380 48H316C306 42 312 30 322 30Z" fill="#8C9BB2"/>
           </g>
           <g class="anim-rain" stroke="#93C5FD" stroke-width="2" stroke-linecap="round">
             <line x1="322" y1="54" x2="316" y2="70"/><line x1="340" y1="56" x2="334" y2="72"/>
             <line x1="358" y1="54" x2="352" y2="70"/><line x1="374" y1="57" x2="368" y2="73"/>
           </g>`
      }
    </svg>`;
  }

  if (epId === 'ep2') {
    return `
    <svg viewBox="0 0 420 176" fill="none" shape-rendering="geometricPrecision" aria-hidden="true">
      <defs>
        ${skyStop}
        <linearGradient id="${waterId}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#2D7CA4"/>
          <stop offset="100%" stop-color="#17415C"/>
        </linearGradient>
      </defs>
      <rect width="420" height="176" fill="url(#${skyId})"/>
      <!-- Layered Borneo Rainforest Peaks & Mist -->
      <path d="M0 120C65 56 135 76 205 108C275 56 345 64 420 112V176H0V120Z" fill="#184232"/>
      <path d="M0 126Q105 106 210 120T420 114V130H0Z" fill="#FAF3E0" opacity="0.1"/>
      <path d="M0 132C82 92 175 106 258 128C324 92 374 102 420 124V176H0V132Z" fill="#275D45"/>
      <!-- Longhouse on Stilts -->
      <rect x="46" y="70" width="328" height="48" rx="3" fill="#8C5A3C"/>
      <rect x="46" y="98" width="328" height="20" fill="#A9714D"/>
      <path d="M34 72L210 26L386 72H34Z" fill="#C84B31"/>
      <path d="M46 72L210 31L374 72" stroke="#D9A441" stroke-width="2" fill="none"/>
      ${[68, 134, 206, 278, 344].map((x) => `<rect x="${x}" y="118" width="8" height="28" fill="#4B2C18"/>`).join('')}
      <!-- Ruai Gallery Lamps -->
      ${[92, 151, 210, 269, 328]
        .map((x) =>
          resolved
            ? `<g class="anim-glow"><circle cx="${x}" cy="87" r="11" fill="#FDE68A" opacity="0.26"/><circle cx="${x}" cy="87" r="5.5" fill="#F5E2B3"/></g>`
            : `<circle cx="${x}" cy="87" r="3.5" fill="#64748B"/>`
        )
        .join('')}
      <!-- Baram River & Perahu Boat -->
      <rect x="0" y="144" width="420" height="32" fill="url(#${waterId})"/>
      <path d="M276 154Q312 162 346 154L338 160H284Z" fill="#5C3A21"/>
      <g class="anim-ripple">
        <line x1="42" y1="156" x2="136" y2="156" stroke="#FAF3E0" stroke-width="1.5" stroke-opacity="0.38" stroke-linecap="round"/>
        <line x1="190" y1="164" x2="264" y2="164" stroke="#FAF3E0" stroke-width="1.4" stroke-opacity="0.3" stroke-linecap="round"/>
      </g>
      ${resolved
        ? `<path d="M324 38Q334 30 342 36Q350 30 360 38" stroke="#FAF3E0" stroke-width="2" stroke-linecap="round" fill="none"/>`
        : ''}
    </svg>`;
  }

  if (epId === 'ep3') {
    return `
    <svg viewBox="0 0 420 176" fill="none" shape-rendering="geometricPrecision" aria-hidden="true">
      <defs>${skyStop}</defs>
      <rect width="420" height="176" fill="url(#${skyId})"/>
      <path d="M0 132C105 74 220 104 420 60V176H0V132Z" fill="#1B4635"/>
      <path d="M0 146C145 106 286 122 420 98V176H0V146Z" fill="#2D6A4F"/>
      <!-- Serian Pepper Vines on Belian Posts -->
      ${[54, 108, 162]
        .map(
          (x) => `
        <rect x="${x}" y="70" width="7" height="74" rx="2" fill="#5C3A21"/>
        <circle cx="${x + 3.5}" cy="78" r="12" fill="#183F2E"/>
        <circle cx="${x - 3}" cy="96" r="10.5" fill="#3B8764"/>
        <circle cx="${x + 9}" cy="108" r="9.5" fill="#2A6E4E"/>
        <circle cx="${x + 1}" cy="84" r="2.1" fill="#C84B31"/>
        <circle cx="${x + 7}" cy="98" r="2.1" fill="#D9A441"/>`
        )
        .join('')}
      <!-- Framed Phone / Voice Note Terminal -->
      <rect x="266" y="42" width="52" height="88" rx="10" fill="#101A30" stroke="#D9A441" stroke-width="2.4"/>
      <rect x="272" y="52" width="40" height="66" rx="5" fill="#1A2B4C"/>
      <rect x="285" y="46" width="14" height="2.4" rx="1.2" fill="#4A5D82"/>
      ${resolved
        ? `<g class="anim-glow">
             <circle cx="292" cy="84" r="14" fill="#2D6A4F"/>
             <rect x="283" y="80" width="3" height="8" rx="1.5" fill="#FAF3E0"/>
             <rect x="288.5" y="75" width="3" height="18" rx="1.5" fill="#FAF3E0"/>
             <rect x="294" y="78" width="3" height="12" rx="1.5" fill="#FAF3E0"/>
             <rect x="299.5" y="81" width="3" height="6" rx="1.5" fill="#FAF3E0"/>
           </g>
           <g class="anim-pulse-ring">
             <path d="M332 70C342 77 342 93 332 100" stroke="#D9A441" stroke-width="3" stroke-linecap="round"/>
             <path d="M346 61C360 72 360 98 346 109" stroke="#F5E2B3" stroke-width="2.6" stroke-linecap="round"/>
           </g>`
        : `<line x1="281" y1="73" x2="303" y2="95" stroke="#E06045" stroke-width="3.4" stroke-linecap="round"/>
           <line x1="303" y1="73" x2="281" y2="95" stroke="#E06045" stroke-width="3.4" stroke-linecap="round"/>
           <text x="292" y="109" text-anchor="middle" fill="#94A3B8" font-size="7.5" font-weight="700">NO 3G</text>`
      }
    </svg>`;
  }

  if (epId === 'ep4') {
    return `
    <svg viewBox="0 0 420 176" fill="none" shape-rendering="geometricPrecision" aria-hidden="true">
      <defs>
        ${skyStop}
        <linearGradient id="${waterId}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#2D78A0"/>
          <stop offset="100%" stop-color="#143D58"/>
        </linearGradient>
      </defs>
      <rect width="420" height="176" fill="url(#${skyId})"/>
      <!-- Kapit Embankment & Landslide -->
      <path d="M0 44L118 132H0V44Z" fill="#684126"/>
      <path d="M0 78L76 132H0V78Z" fill="#2D6A4F" opacity="0.82"/>
      <!-- Rajang River -->
      <rect x="0" y="132" width="420" height="44" fill="url(#${waterId})"/>
      <g class="anim-ripple">
        <line x1="36" y1="150" x2="156" y2="150" stroke="#FAF3E0" stroke-width="1.6" stroke-opacity="0.4" stroke-linecap="round"/>
        <line x1="238" y1="160" x2="352" y2="160" stroke="#FAF3E0" stroke-width="1.5" stroke-opacity="0.35" stroke-linecap="round"/>
      </g>
      <!-- 3 Riverside Village Houses -->
      ${[194, 266, 338]
        .map(
          (x) => `
        <rect x="${x}" y="96" width="40" height="28" rx="1.5" fill="#FAF3E0"/>
        <rect x="${x + 13}" y="106" width="14" height="18" fill="#5C3A21"/>
        <path d="M${x - 5} 98L${x + 20} 78L${x + 45} 98H${x - 5}Z" fill="#C84B31"/>
        <rect x="${x + 4}" y="124" width="4" height="8" fill="#4B2C18"/>
        <rect x="${x + 32}" y="124" width="4" height="8" fill="#4B2C18"/>`
        )
        .join('')}
      <!-- Early-Warning Siren Mast -->
      <rect x="140" y="64" width="6" height="68" rx="2" fill="#D9A441"/>
      <circle cx="143" cy="61" r="7" fill="${resolved ? '#48B282' : '#E06045'}"/>
      ${resolved
        ? `<g class="anim-pulse-ring">
             <circle cx="143" cy="61" r="18" stroke="#D9A441" stroke-width="2" stroke-dasharray="5 3"/>
             <circle cx="143" cy="61" r="32" stroke="#F5E2B3" stroke-width="1.5" stroke-dasharray="5 4"/>
           </g>`
        : `<circle cx="143" cy="61" r="13" stroke="#E06045" stroke-width="1.8" opacity="0.6"/>`}
    </svg>`;
  }

  // ep5: Kuching - Miri Studio
  return `
  <svg viewBox="0 0 420 176" fill="none" shape-rendering="geometricPrecision" aria-hidden="true">
    <defs>${skyStop}</defs>
    <rect width="420" height="176" fill="url(#${skyId})"/>
    <!-- Kuching Skyline Left -->
    <rect x="26" y="54" width="32" height="88" rx="2" fill="#233761"/>
    <rect x="64" y="34" width="40" height="108" rx="2" fill="#2A6F97"/>
    <rect x="110" y="66" width="30" height="76" rx="2" fill="#182747"/>
    <rect x="72" y="46" width="9" height="12" rx="1" fill="#F5E2B3" opacity="0.8"/>
    <rect x="87" y="46" width="9" height="12" rx="1" fill="#F5E2B3" opacity="0.8"/>
    <rect x="72" y="66" width="9" height="12" rx="1" fill="#F5E2B3" opacity="0.55"/>
    <!-- Rural Miri Telecentre Right -->
    <rect x="284" y="76" width="94" height="66" rx="4" fill="#2D6A4F"/>
    <path d="M274 78L331 44L388 78H274Z" fill="#D9A441"/>
    <rect x="304" y="96" width="22" height="22" rx="2" fill="#FAF3E0" opacity="0.85"/>
    <rect x="336" y="96" width="22" height="46" rx="2" fill="#16233F"/>
    <!-- Network Link Arc -->
    <path class="${resolved ? 'anim-dash-flow' : ''}" d="M144 86Q212 32 280 86" stroke="${resolved ? '#48B282' : '#E06045'}" stroke-width="3.6" stroke-dasharray="${resolved ? '8 4' : '6 5'}" fill="none"/>
    <circle cx="212" cy="59" r="14" fill="${resolved ? '#D9A441' : '#E06045'}"/>
    <text x="212" y="62.5" text-anchor="middle" fill="#121C33" font-size="9.5" font-weight="800">${resolved ? 'LITE' : '3G'}</text>
    <rect x="0" y="142" width="420" height="34" fill="#14203B"/>
  </svg>`;
}

/**
 * Composite stakeholder tension / harmony triangle with mini-avatars.
 */
function tensionRingSvg(stakeholders, aligned = false) {
  const lineColor = aligned ? '#2D6A4F' : '#C84B31';
  const glowColor = aligned ? 'rgba(72, 178, 130, 0.32)' : 'rgba(200, 75, 49, 0.22)';
  const statusLabel = aligned ? 'ALIGNED' : 'TENSION';

  const coords = [
    { x: '50%', y: '18%' },
    { x: '19%', y: '79%' },
    { x: '81%', y: '79%' },
  ];

  return `
  <div class="tension-ring-box ${aligned ? 'is-aligned' : ''}">
    <div class="tension-canvas">
      <svg class="tension-svg" viewBox="0 0 320 156" fill="none" shape-rendering="geometricPrecision" aria-hidden="true">
        <circle cx="160" cy="86" r="56" stroke="${glowColor}" stroke-width="10" fill="none"/>
        <path class="${aligned ? '' : 'anim-dash-flow'}" d="M160 32 L62 124 L258 124 Z" stroke="${lineColor}" stroke-width="2.8" ${aligned ? '' : 'stroke-dasharray="6 5"'} stroke-linejoin="round"/>
      </svg>
      <span class="tension-center-pill ${aligned ? 'aligned' : 'tense'}">${statusLabel}</span>
      ${stakeholders
        .map(
          (st, idx) => `
        <div class="tension-node" style="left:${coords[idx].x}; top:${coords[idx].y};">
          <div class="tension-node-avatar">${avatarSvg(st.avatar, st.mood)}</div>
          <span class="tension-node-name">${st.name.split(' ')[0]}</span>
        </div>`
        )
        .join('')}
    </div>
  </div>`;
}

/**
 * Custom vector Dayak Terabai shield badges (zero OS emoji inside SVG).
 */
function biasBadgeSvg(epNumber, unlocked = true, size = 44) {
  const shieldId = uid('shBg');
  const goldId = uid('shGold');
  const sheenId = uid('shSheen');

  const emblem = !unlocked
    ? `<rect x="15.5" y="21" width="11" height="9" rx="2" fill="none" stroke="#8C8370" stroke-width="2"/>
       <path d="M17.5 21v-2.5a3.5 3.5 0 0 1 7 0V21" stroke="#8C8370" stroke-width="2" stroke-linecap="round"/>`
    : epNumber === 1
      ? `<circle cx="21" cy="17" r="2.2" stroke="#FAF3E0" stroke-width="1.8"/>
         <path d="M21 19.2V29.5M16 24.5a5 5 0 0 0 10 0M17.5 21.5h7" stroke="#FAF3E0" stroke-width="1.9" stroke-linecap="round"/>
         <path d="M15 29l12-11" stroke="#E06045" stroke-width="2" stroke-linecap="round"/>`
      : epNumber === 2
        ? `<circle cx="21" cy="24" r="2.4" fill="#FAF3E0"/>
           <path d="M15.8 19.2a7 7 0 0 0 0 9.6M26.2 19.2a7 7 0 0 1 0 9.6M13 16.5a11 11 0 0 0 0 15M29 16.5a11 11 0 0 1 0 15" stroke="#F5E2B3" stroke-width="1.8" stroke-linecap="round"/>`
        : epNumber === 3
          ? `<path d="M15 25a6 6 0 0 1 10.2-4.2L27 19v5.2h-5.2l1.8-1.8A3.8 3.8 0 0 0 17.2 25" stroke="#FAF3E0" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
             <path d="M27 25a6 6 0 0 1-10.2 4.2L15 31v-5.2h5.2l-1.8 1.8A3.8 3.8 0 0 0 24.8 25" stroke="#F5E2B3" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>`
          : epNumber === 4
            ? `<circle cx="21" cy="17" r="2.3" fill="#F5E2B3"/>
               <circle cx="15.5" cy="27.5" r="2.3" fill="#FAF3E0"/>
               <circle cx="26.5" cy="27.5" r="2.3" fill="#FAF3E0"/>
               <path d="M21 19.3L15.5 25.2M21 19.3L26.5 25.2M17.8 27.5h6.4" stroke="#F5E2B3" stroke-width="1.7" stroke-linecap="round"/>`
            : `<path d="m21 14 2.2 4.8 5.2.6-3.9 3.6 1 5.2L21 25.7l-4.5 2.5 1-5.2-3.9-3.6 5.2-.6z" fill="#F5E2B3" stroke="#FAF3E0" stroke-width="1.2" stroke-linejoin="round"/>`;

  const height = Math.round((size * 48) / 42);
  return `
  <svg width="${size}" height="${height}" viewBox="0 0 42 48" fill="none" shape-rendering="geometricPrecision" aria-hidden="true">
    <defs>
      <linearGradient id="${shieldId}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${unlocked ? '#243B6B' : '#E3DAC4'}"/>
        <stop offset="100%" stop-color="${unlocked ? '#101B33' : '#C9BFA6'}"/>
      </linearGradient>
      <linearGradient id="${goldId}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${unlocked ? '#FCE7A2' : '#C4BA9F'}"/>
        <stop offset="100%" stop-color="${unlocked ? '#C28A24' : '#9C927A'}"/>
      </linearGradient>
      <linearGradient id="${sheenId}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFFFFF" stop-opacity="${unlocked ? '0.22' : '0.1'}"/>
        <stop offset="50%" stop-color="#FFFFFF" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <path d="M21 2L38 9V25C38 35.2 29 43 21 46C13 43 4 35.2 4 25V9L21 2Z" fill="url(#${shieldId})" stroke="url(#${goldId})" stroke-width="2.4"/>
    <path d="M21 5.5L34.5 11.2V24.8C34.5 32.8 27.5 39.2 21 41.8C14.5 39.2 7.5 32.8 7.5 24.8V11.2L21 5.5Z" stroke="${unlocked ? '#D9A441' : '#A89E85'}" stroke-width="0.8" stroke-opacity="0.55"/>
    <path d="M21 2L38 9V20L4 28V9L21 2Z" fill="url(#${sheenId})"/>
    ${emblem}
  </svg>`;
}

/**
 * Animated radial SVG score ring for the Debrief screen.
 */
function scoreRingSvg(score) {
  const ringId = uid('scRing');
  const clamped = Math.max(0, Math.min(100, Math.round(score || 0)));
  const r = 38;
  const c = 2 * Math.PI * r;
  return `
  <div class="score-ring-wrap" data-score="${clamped}">
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="${ringId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#F5E2B3"/>
          <stop offset="50%" stop-color="#D9A441"/>
          <stop offset="100%" stop-color="#48B282"/>
        </linearGradient>
      </defs>
      <circle cx="48" cy="48" r="${r}" stroke="rgba(255,255,255,0.14)" stroke-width="8"/>
      <circle class="score-ring-arc" cx="48" cy="48" r="${r}" stroke="url(#${ringId})" stroke-width="8" stroke-linecap="round"
        stroke-dasharray="${c.toFixed(2)}" stroke-dashoffset="${c.toFixed(2)}"
        data-circumference="${c.toFixed(2)}" data-target-offset="${(c * (1 - clamped / 100)).toFixed(2)}"
        transform="rotate(-90 48 48)"/>
    </svg>
    <div class="score-ring-label tnum">
      <strong>${clamped}%</strong>
      <span>Score</span>
    </div>
  </div>`;
}

/**
 * Compact tactical Bias Radar banner for Phase 2.
 */
function biasRadarSvg(spotted = false) {
  return `
  <div class="bias-radar-banner ${spotted ? 'spotted' : ''}">
    <svg class="radar-dial" width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
      <circle cx="22" cy="22" r="19" stroke="${spotted ? '#48B282' : '#D9A441'}" stroke-width="1.5" stroke-opacity="0.45"/>
      <circle cx="22" cy="22" r="12.5" stroke="${spotted ? '#48B282' : '#D9A441'}" stroke-width="1.2" stroke-opacity="0.35" stroke-dasharray="3 3"/>
      <circle cx="22" cy="22" r="6" stroke="${spotted ? '#48B282' : '#D9A441'}" stroke-width="1.2" stroke-opacity="0.5"/>
      ${spotted
        ? `<path d="M16 22.5L20 26.5L28.5 17.5" stroke="#48B282" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`
        : `<g class="anim-radar-sweep"><line x1="22" y1="22" x2="22" y2="4" stroke="#E06045" stroke-width="2" stroke-linecap="round"/><circle cx="29" cy="14" r="2.2" fill="#E06045"/></g>`}
      <circle cx="22" cy="22" r="2.2" fill="${spotted ? '#48B282' : '#D9A441'}"/>
    </svg>
    <div class="radar-meta">
      <span class="radar-status">${spotted ? 'Signal Locked — Bias Identified' : 'Scanning Huddle Signals...'}</span>
      <span class="radar-sub">${spotted ? 'Proceed to the Wicked Toolkit to test a safe probe.' : 'Listen past loud claims to name the hidden cognitive trap.'}</span>
    </div>
  </div>`;
}

/**
 * Compact 40x40 rounded scenic emblem for Home Hub episode cards.
 */
function episodeEmblemSvg(epNumber) {
  const palettes = [
    ['#C84B31', '#D9A441', 'anchor'],
    ['#2D6A4F', '#D9A441', 'longhouse'],
    ['#2A6F97', '#48B282', 'pivot'],
    ['#1B3B6F', '#4DA3CC', 'waves'],
    ['#16233F', '#EAB955', 'star'],
  ];
  const [c1, c2, kind] = palettes[(epNumber - 1) % palettes.length];
  const bgId = uid('epEm');
  const glyph =
    kind === 'anchor'
      ? `<path d="M20 11v17M15 17h10M13 22a7 7 0 0 0 14 0" stroke="#FAF3E0" stroke-width="2" stroke-linecap="round"/>`
      : kind === 'longhouse'
        ? `<path d="M9 22L20 13L31 22" stroke="#FAF3E0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect x="13" y="22" width="14" height="7" rx="1" stroke="#FAF3E0" stroke-width="1.8"/>`
        : kind === 'pivot'
          ? `<path d="M13 18a7 7 0 0 1 12-3l2-2v5h-5l1.6-1.6" stroke="#FAF3E0" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/><path d="M27 22a7 7 0 0 1-12 3l-2 2v-5h5l-1.6 1.6" stroke="#FAF3E0" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>`
          : kind === 'waves'
            ? `<path d="M10 17q5-4 10 0t10 0M10 24q5-4 10 0t10 0" stroke="#FAF3E0" stroke-width="2" stroke-linecap="round"/>`
            : `<path d="m20 11 2.5 5.4 5.9.7-4.4 4.1 1.1 5.8-5.1-2.8-5.1 2.8 1.1-5.8-4.4-4.1 5.9-.7z" fill="#FAF3E0"/>`;

  return `
  <svg width="42" height="42" viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="${bgId}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${c1}"/>
        <stop offset="100%" stop-color="${c2}"/>
      </linearGradient>
    </defs>
    <rect width="40" height="40" rx="11" fill="url(#${bgId})"/>
    <rect x="1" y="1" width="38" height="38" rx="10" stroke="#FFFFFF" stroke-opacity="0.22"/>
    ${glyph}
  </svg>`;
}

  // === js/data/glossary.js ===
const GLOSSARY = {
  biases: [
    {
      term: 'Confirmation Bias',
      desc: 'Looking only for evidence that proves what we already believe, while ignoring facts that challenge our first hunch.',
    },
    {
      term: 'Anchoring Bias',
      desc: 'Relying too heavily on the first number, rumour, or proposal we hear—even when better context arrives later.',
    },
    {
      term: 'Groupthink & Authority Bias',
      desc: 'Agreeing with the loudest or highest-ranking person in the room to keep peace, silencing crucial dissenting perspectives.',
    },
    {
      term: 'Sunk Cost Fallacy',
      desc: 'Continuing to pour time or money into a failing plan just because we already spent so much on it.',
    },
    {
      term: 'Availability Heuristic',
      desc: 'Overestimating risks or causes that are dramatic, viral, or recent while overlooking slow-building systemic issues.',
    },
    {
      term: 'Status Quo Bias',
      desc: 'Preferring things to stay the same simply because change feels unfamiliar, even when current habits are failing.',
    },
  ],
  wicked: [
    {
      term: 'What is a Wicked Problem?',
      desc: 'Coined by Rittel & Webber: a complex social or team problem with no single right answer, conflicting stakeholder values, and shifting root causes.',
    },
    {
      term: 'Reframe the Question',
      desc: 'Instead of jumping to a fix, ask why the problem exists from multiple angles so you solve the root cause—not just the loudest symptom.',
    },
    {
      term: 'Map Missing Voices',
      desc: 'Wicked problems cross silos. Actively invite quiet or frontline stakeholders (hawkers, elders, youth, field staff) before deciding.',
    },
    {
      term: 'Safe-to-Fail Probes',
      desc: 'Rather than betting everything on one giant "silver bullet," run small, cheap, reversible experiments to learn what actually works.',
    },
    {
      term: 'Shared Understanding > Forced Consensus',
      desc: 'Align teams by surfacing trade-offs openly so everyone understands the "why," even when compromises are needed.',
    },
  ],
  sarawak: [
    {
      term: 'Ruai',
      desc: 'The long communal gallery in a Sarawakian longhouse where neighbours gather, share news, and resolve community matters together.',
    },
    {
      term: 'Tuai Rumah',
      desc: 'The elected headperson of a longhouse who guides community decisions and mediates disputes.',
    },
    {
      term: 'Kenyalang',
      desc: 'The Rhinoceros Hornbill, Sarawak’s iconic state bird—symbolising sharp vision, leadership, and community spirit.',
    },
    {
      term: 'Pua Kumbu',
      desc: 'Traditional handwoven Iban ceremonial textile with intricate geometric motifs passed down across generations.',
    },
    {
      term: 'Sik Hal / Aok',
      desc: 'Everyday Sarawakian Malay expressions: "Sik hal" means "no problem / all good"; "Aok" means "yes / agreed."',
    },
  ],
};

  // === js/data/episodes.js ===
const EPISODES = [
  {
    id: 'ep1',
    number: 1,
    location: 'Kuching Heritage Street',
    title: 'The Kopitiam & Plastic Flood',
    biasFocus: 'Confirmation Bias & Anchoring',
    wickedPrinciple: 'Reframe & Probe',
    badgeName: 'Anchor Breaker',
    briefing: {
      setup: 'Flash floods hit a Kuching night-market street. At the kopitiam, everyone has a fast blame.',
      stakeholders: [
        {
          name: 'Encik Haris',
          role: 'Council Planner',
          mood: '😤 Rushing',
          avatar: { skin: '#C68642', hair: '#2B2B2B', shirt: '#1B2A4A', hat: 'songkok' },
          quote: 'I saw 3 plastic bags by the drain. Ban hawker plastics tomorrow—settled!',
        },
        {
          name: 'Pakcik Salleh',
          role: 'Laksa Hawker',
          mood: '😟 Worried',
          avatar: { skin: '#B87A4B', hair: '#D9D9D9', shirt: '#2D6A4F', hat: 'none' },
          quote: 'Overnight bans double my costs! Tourists only want quick takeaway.',
        },
        {
          name: 'Mei Ling',
          role: 'Eco-Youth',
          mood: '💡 Data',
          avatar: { skin: '#F1C27D', hair: '#1E1B18', shirt: '#C84B31', hat: 'none' },
          quote: 'Our audit found old silt and grease—not just bags—clogged half the drains.',
        },
      ],
    },
    biasRadar: {
      prompt: 'Spot the bias driving Encik Haris’s instant plastic ban:',
      options: [
        {
          icon: '⚓',
          title: 'Confirmation Bias & Anchoring',
          sub: 'Fixated on 3 bags, ignoring silt & hawker costs.',
          isCorrect: true,
          feedback: 'Sharp eyes! One visible clue blinded him to grease traps and livelihoods.',
          delta: { alignment: 12, trust: 10, impact: 8 },
        },
        {
          icon: '💸',
          title: 'Sunk Cost Fallacy',
          sub: 'Defending money already spent.',
          isCorrect: false,
          feedback: 'No budget was spent yet—he anchored on the first clue he saw.',
          delta: { alignment: -4, trust: -2, impact: 0 },
        },
        {
          icon: '🤝',
          title: 'Over-Trusting Hawkers',
          sub: 'Relying too much on self-regulation.',
          isCorrect: false,
          feedback: 'Opposite! He blamed hawkers without checking the full drainage system.',
          delta: { alignment: -4, trust: -4, impact: 0 },
        },
      ],
    },
    wickedStep: {
      prompt: 'Floods, income, and habits collide. Pick your Wicked Toolkit move:',
      options: [
        {
          icon: '🧪',
          title: '2-Week Safe-to-Fail Probe',
          sub: 'Test tiffin deposits at 5 stalls + clear 1 grease block.',
          chips: ['🤝 +Trust', '🛡️ Low Risk', '⚡ Fast Learn'],
          isWicked: true,
          feedback: 'Smart! Small probes test real drain flow without risking livelihoods.',
          delta: { alignment: 14, trust: 16, impact: 18 },
        },
        {
          icon: '🚨',
          title: 'Immediate RM500 Fines',
          sub: 'Enforce strict bans from Monday.',
          chips: ['⚡ Fast', '⚠️ High Pushback'],
          isWicked: false,
          feedback: 'Fines spark resentment while silt still floods the street.',
          delta: { alignment: -12, trust: -15, impact: -5 },
        },
        {
          icon: '📑',
          title: '6-Month Study Committee',
          sub: 'Wait for a full consultant report.',
          chips: ['🐢 Slow', '🌧️ Flood Risk'],
          isWicked: false,
          feedback: 'Analysis paralysis! The next monsoon won’t wait.',
          delta: { alignment: -6, trust: -5, impact: -8 },
        },
      ],
    },
    alignmentStep: {
      prompt: 'Hawkers fear lost sales; youth want zero plastic. Align the team:',
      options: [
        {
          icon: '🤝',
          title: 'Shared Trade-off Charter',
          sub: 'Goal: dry streets + steady hawker income via deposit micro-fund.',
          isAligned: true,
          feedback: 'Aok! Aligning on shared outcomes makes everyone own the fix.',
          delta: { alignment: 18, trust: 15, impact: 14 },
        },
        {
          icon: '🗳️',
          title: '2-to-1 Majority Vote',
          sub: 'Outvote Pakcik Salleh to move on.',
          isAligned: false,
          feedback: 'Outvoting breeds quiet resistance when inspectors leave.',
          delta: { alignment: -10, trust: -12, impact: -4 },
        },
      ],
    },
    debrief: {
      biasSummary: 'Confirmation Bias turns the first visible clue into the whole story.',
      wickedTakeaway: 'Small, reversible probes beat silver-bullet bans.',
      teamTip: 'Ask: "What evidence would prove our favourite theory wrong?"',
    },
  },
  {
    id: 'ep2',
    number: 2,
    location: 'Ulu Baram Longhouse',
    title: 'The Ruai Eco-Tourism Crossroads',
    biasFocus: 'Groupthink & Authority Bias',
    wickedPrinciple: 'Map Missing Voices',
    badgeName: 'Voice Mapper',
    briefing: {
      setup: 'An investor pitches a 40-room resort on the ruai. Elders nod politely—youth stay silent.',
      stakeholders: [
        {
          name: 'Tuai Rumah',
          role: 'Headman',
          mood: '🙇 Polite',
          avatar: { skin: '#C68642', hair: '#E2E8F0', shirt: '#1B2A4A', hat: 'headband' },
          quote: 'Mr. Robert promises 30 jobs. Let’s not embarrass our guest with hard questions.',
        },
        {
          name: 'Robert Tan',
          role: 'Developer',
          mood: '💼 Urgent',
          avatar: { skin: '#F1C27D', hair: '#2D3748', shirt: '#4A5568', hat: 'none' },
          quote: 'Sign the land lease this week and we clear the site next month. Simple!',
        },
        {
          name: 'Dayang',
          role: 'Youth Boat Guide',
          mood: '🤫 Silenced',
          avatar: { skin: '#C68642', hair: '#1E1B18', shirt: '#2D6A4F', hat: 'none' },
          quote: '(Whispering) If they concrete the riverbank, our hornbills and kelah fish vanish.',
        },
      ],
    },
    biasRadar: {
      prompt: 'Why is the ruai rushing to agree? Spot the hidden trap:',
      options: [
        {
          icon: '🐑',
          title: 'Groupthink & Authority Bias',
          sub: 'Politeness and hierarchy are silencing youth & weavers.',
          isCorrect: true,
          feedback: 'Spot on! Surface harmony hides real river and heritage risks.',
          delta: { alignment: 10, trust: 14, impact: 10 },
        },
        {
          icon: '💸',
          title: 'Sunk Cost Fallacy',
          sub: 'Half the resort is already built.',
          isCorrect: false,
          feedback: 'Nothing is built yet—the trap is social pressure silencing dissent.',
          delta: { alignment: -4, trust: -4, impact: 0 },
        },
        {
          icon: '📺',
          title: 'Viral Panic',
          sub: 'Reacting to a recent news clip.',
          isCorrect: false,
          feedback: 'Not here—the pressure comes from status and politeness.',
          delta: { alignment: -3, trust: -4, impact: 0 },
        },
      ],
    },
    wickedStep: {
      prompt: 'Break Groupthink respectfully without shaming the Tuai Rumah:',
      options: [
        {
          icon: '🗣️',
          title: 'Map Missing Voices',
          sub: 'Hold youth & weaver circles; share anonymous cards on the ruai.',
          chips: ['🤝 ++Trust', '🌿 Inclusive', '🛡️ Safe'],
          isWicked: true,
          feedback: 'Masterful! Anonymous cards honour elders while surfacing quiet wisdom.',
          delta: { alignment: 16, trust: 18, impact: 16 },
        },
        {
          icon: '📢',
          title: 'Call Out the Headman',
          sub: 'Publicly accuse him of selling out.',
          chips: ['💥 Conflict', '💔 -Trust'],
          isWicked: false,
          feedback: 'Shaming elders fractures community harmony.',
          delta: { alignment: -16, trust: -18, impact: -6 },
        },
        {
          icon: '✍️',
          title: 'Sign With Verbal Eco-Promise',
          sub: 'Trust the developer to be green later.',
          chips: ['⚡ Fast', '⚠️ High Risk'],
          isWicked: false,
          feedback: 'Verbal promises vanish once bulldozers arrive.',
          delta: { alignment: -8, trust: -14, impact: -15 },
        },
      ],
    },
    alignmentStep: {
      prompt: 'Youth want eco-homestays, elders want clinics/roads, Robert wants returns. Align them:',
      options: [
        {
          icon: '🏡',
          title: 'Community-Owned Homestay Trial',
          sub: '6 upgraded longhouse homestays + river rules before any resort lease.',
          isAligned: true,
          feedback: 'Brilliant! Income stays local, hornbills stay safe, capital funds solar.',
          delta: { alignment: 16, trust: 16, impact: 18 },
        },
        {
          icon: '🚫',
          title: 'Ban All Outsiders',
          sub: 'Reject every external partnership.',
          isAligned: false,
          feedback: 'Protects the river, but youth still leave for city jobs.',
          delta: { alignment: -4, trust: 4, impact: -8 },
        },
      ],
    },
    debrief: {
      biasSummary: 'Groupthink thrives when hierarchy makes disagreement feel risky.',
      wickedTakeaway: 'Mapping missing voices turns silent blind spots into collective strength.',
      teamTip: 'Use silent anonymous cards before open debate so the loudest voice doesn’t anchor.',
    },
  },
  {
    id: 'ep3',
    number: 3,
    location: 'Serian Pepper Farms',
    title: 'The Pepper & Laksa Supply Crunch',
    biasFocus: 'Sunk Cost & Status Quo',
    wickedPrinciple: 'Kill Bad Bets & Pivot',
    badgeName: 'Pivot Navigator',
    briefing: {
      setup: 'Monsoons hit Serian pepper farms. A RM200k agri-app sits unused while laksa buyers lack harvest dates.',
      stakeholders: [
        {
          name: 'Jason',
          role: 'Tech Lead',
          mood: '😰 Defensive',
          avatar: { skin: '#F1C27D', hair: '#1E1B18', shirt: '#2A6F97', hat: 'none' },
          quote: 'We spent RM200k and 10 months on this app! Just force more training workshops.',
        },
        {
          name: 'Indai Rina',
          role: 'Pepper Farmer',
          mood: '📵 Struggling',
          avatar: { skin: '#C68642', hair: '#2D2420', shirt: '#C84B31', hat: 'none' },
          quote: 'Farm line is weak! I use WhatsApp voice notes, not 12-screen English forms.',
        },
        {
          name: 'Chef Azman',
          role: 'Laksa Spice Buyer',
          mood: '🍲 Practical',
          avatar: { skin: '#B87A4B', hair: '#1B2432', shirt: '#1B2A4A', hat: 'songkok' },
          quote: 'I just need harvest dates 2 weeks ahead so I don’t import spice.',
        },
      ],
    },
    biasRadar: {
      prompt: 'Jason keeps pushing an unused RM200k app. Name the trap:',
      options: [
        {
          icon: '💸',
          title: 'Sunk Cost Fallacy',
          sub: 'Clinging to past spending instead of future user value.',
          isCorrect: true,
          feedback: 'Bullseye! Past RM200k is gone—focus on what works for farmers next week.',
          delta: { alignment: 12, trust: 12, impact: 12 },
        },
        {
          icon: '✨',
          title: 'Halo Effect',
          sub: 'Assuming the app works because Chef Azman likes it.',
          isCorrect: false,
          feedback: 'Chef Azman doesn’t use it either! It’s Sunk Cost.',
          delta: { alignment: -4, trust: -4, impact: 0 },
        },
        {
          icon: '⏳',
          title: 'Scarcity Bias',
          sub: 'Thinking there are too few apps.',
          isCorrect: false,
          feedback: 'No—the trap is refusing to pivot away from a sunk RM200k build.',
          delta: { alignment: -4, trust: -2, impact: 0 },
        },
      ],
    },
    wickedStep: {
      prompt: 'Pick the Wicked Problem pivot for weak rural 3G:',
      options: [
        {
          icon: '🎙️',
          title: 'WhatsApp Voice-Note Check-In',
          sub: 'Retire heavy forms; test 1-tap voice harvest updates at 15 farms.',
          chips: ['📶 Low-Data', '🤝 ++Trust', '⚡ Practical'],
          isWicked: true,
          feedback: 'Humble and smart! Voice notes fit real farm life and warn buyers early.',
          delta: { alignment: 15, trust: 16, impact: 18 },
        },
        {
          icon: '🔒',
          title: 'Lock Subsidies Behind App Login',
          sub: 'Require 12 app screens for fertilizer aid.',
          chips: ['⚠️ Fake Data', '💔 -Trust'],
          isWicked: false,
          feedback: 'Coercion breeds fake numbers typed by relatives.',
          delta: { alignment: -12, trust: -16, impact: -10 },
        },
        {
          icon: '🧊',
          title: 'Keep Status Quo Unchanged',
          sub: 'Leave both systems as-is to avoid awkwardness.',
          chips: ['💸 Waste', '🐢 Stalled'],
          isWicked: false,
          feedback: 'Status Quo Bias drains budget and solves nothing.',
          delta: { alignment: -6, trust: -6, impact: -8 },
        },
      ],
    },
    alignmentStep: {
      prompt: 'Jason feels his 10-month build was wasted. Keep the team aligned:',
      options: [
        {
          icon: '♻️',
          title: 'Reuse Backend for Buyer Board',
          sub: 'Celebrate the app as a learning probe powering the new WhatsApp board.',
          isAligned: true,
          feedback: 'Great leadership! Separates ego from learning and keeps engineers proud.',
          delta: { alignment: 16, trust: 14, impact: 14 },
        },
        {
          icon: '👉',
          title: 'Blame Farmers’ Tech Literacy',
          sub: 'Write that users weren’t ready.',
          isAligned: false,
          feedback: 'Blaming users destroys trust and repeats the same failure.',
          delta: { alignment: -12, trust: -14, impact: -6 },
        },
      ],
    },
    debrief: {
      biasSummary: 'Sunk Cost Fallacy chains teams to yesterday’s spending.',
      wickedTakeaway: 'A failed prototype isn’t waste—it’s tuition to find what users need.',
      teamTip: 'Ask: "If we started fresh today with zero prior work, would we build this?"',
    },
  },
  {
    id: 'ep4',
    number: 4,
    location: 'Sibu – Kapit (Rajang)',
    title: 'Floods on the Rajang',
    biasFocus: 'Availability Heuristic',
    wickedPrinciple: 'Systems Mapping',
    badgeName: 'Systems Scout',
    briefing: {
      setup: 'A viral Kapit landslide clip hijacks WhatsApp. The committee wants 90% of funds on one wall.',
      stakeholders: [
        {
          name: 'Cikgu Faridah',
          role: 'Sibu Principal',
          mood: '📱 Alarmed',
          avatar: { skin: '#C68642', hair: '#1E1B18', shirt: '#2D6A4F', hat: 'tudung' },
          quote: 'Every parent saw that landslide video! Put all funds into concrete walls now!',
        },
        {
          name: 'Bala',
          role: 'Riverboat Skipper',
          mood: '🚤 Frontline',
          avatar: { skin: '#B87A4B', hair: '#1E1B18', shirt: '#2A6F97', hat: 'none' },
          quote: 'Downriver, silted tributaries and broken sirens hit 12 villages every king tide.',
        },
        {
          name: 'Dr. Nina',
          role: 'Hydrologist',
          mood: '🌊 Systems',
          avatar: { skin: '#F1C27D', hair: '#2D3748', shirt: '#1B2A4A', hat: 'none' },
          quote: 'Concrete in one spot speeds up erosion downstream unless we map the basin.',
        },
      ],
    },
    biasRadar: {
      prompt: 'Why is the viral video overshadowing 12 flood-prone villages?',
      options: [
        {
          icon: '📺',
          title: 'Availability Heuristic',
          sub: 'Dramatic viral images feel bigger than slow-building river data.',
          isCorrect: true,
          feedback: 'Exactly! Vivid clips hijack budgets away from wider systemic risks.',
          delta: { alignment: 12, trust: 12, impact: 14 },
        },
        {
          icon: '🧱',
          title: 'IKEA Effect',
          sub: 'They love walls because they built them.',
          isCorrect: false,
          feedback: 'Not quite—urgency comes from the vivid clip dominating memory.',
          delta: { alignment: -4, trust: -4, impact: 0 },
        },
        {
          icon: '🏷️',
          title: 'Anchoring on Low Cost',
          sub: 'Walls are the cheapest fix.',
          isCorrect: false,
          feedback: 'Walls are the priciest fix! The viral clip is distorting risk.',
          delta: { alignment: -4, trust: -2, impact: 0 },
        },
      ],
    },
    wickedStep: {
      prompt: 'Fixing one bank can flood another. Choose your Systems move:',
      options: [
        {
          icon: '🗺️',
          title: 'Upstream–Downstream Split Plan',
          sub: 'Stabilize the slip + clear tributary drains + fix 12 village sirens.',
          chips: ['🌊 Basin-Wide', '🤝 +Trust', '⚡ Balanced'],
          isWicked: true,
          feedback: 'Systems thinking! You calm parent fears while protecting all 12 villages.',
          delta: { alignment: 14, trust: 16, impact: 18 },
        },
        {
          icon: '🧱',
          title: 'Giant Concrete Wall Only',
          sub: 'Fund what the viral video demands.',
          chips: ['📸 Good PR', '⚠️ Floods Downriver'],
          isWicked: false,
          feedback: 'Good PR for a week—until king tides flood unwarned villages.',
          delta: { alignment: -8, trust: -14, impact: -16 },
        },
        {
          icon: '🙈',
          title: 'Dismiss Public Anxiety',
          sub: 'Tell parents the video is exaggerated.',
          chips: ['💔 -Trust', '🐢 Stalled'],
          isWicked: false,
          feedback: 'Dismissing real fear erodes community trust.',
          delta: { alignment: -10, trust: -14, impact: -4 },
        },
      ],
    },
    alignmentStep: {
      prompt: 'Schools and upriver villages distrust each other’s priorities. Align them:',
      options: [
        {
          icon: '📡',
          title: 'Shared Basin Alert Channel',
          sub: 'Skippers, teachers, and hydrologists share one transparent alert & budget board.',
          isAligned: true,
          feedback: 'Sik hal! Shared visibility turns competing silos into one Rajang network.',
          delta: { alignment: 16, trust: 16, impact: 14 },
        },
        {
          icon: '🔐',
          title: 'Keep Data Inside HQ',
          sub: 'Publish summaries only at year-end.',
          isAligned: false,
          feedback: 'Rumours fill the vacuum when communities lack real-time facts.',
          delta: { alignment: -8, trust: -12, impact: -6 },
        },
      ],
    },
    debrief: {
      biasSummary: 'Availability Heuristic lets dramatic clips hijack budgets from larger risks.',
      wickedTakeaway: 'Always ask: "What happens downstream if we pull this lever?"',
      teamTip: 'Pair vivid anecdotes with baseline numbers before allocating budget.',
    },
  },
  {
    id: 'ep5',
    number: 5,
    location: 'Kuching – Miri Studio',
    title: 'Borneo Digital Service Finale',
    biasFocus: 'Multi-Bias Boss Level',
    wickedPrinciple: 'Full Wicked Alignment',
    badgeName: 'Kenyalang Shield',
    briefing: {
      setup: '60 days to launch a statewide portal. Senior officers, Gen-Z devs, and rural reps are deadlocked.',
      stakeholders: [
        {
          name: 'Dato’ Rahman',
          role: 'Senior Director',
          mood: '🏛️ Traditional',
          avatar: { skin: '#C68642', hair: '#E2E8F0', shirt: '#1B2A4A', hat: 'songkok' },
          quote: 'We always launch with a 40-page PDF and VIP ceremony. Why change 2012 habits?',
        },
        {
          name: 'Siti',
          role: 'Lead Dev',
          mood: '⚡ Tech-First',
          avatar: { skin: '#C68642', hair: '#1E1B18', shirt: '#C84B31', hat: 'tudung' },
          quote: 'Our dark-mode AI chatbot is ready! Rural users will figure it out.',
        },
        {
          name: 'Uncle Jimmy',
          role: 'Miri Rural Rep',
          mood: '📶 Forgotten',
          avatar: { skin: '#B87A4B', hair: '#CBD5E1', shirt: '#2D6A4F', hat: 'none' },
          quote: 'My kampung still runs on 3G and Bahasa Sarawak. Nobody asked us before coding!',
        },
      ],
    },
    biasRadar: {
      prompt: 'Boss Level: Which bias combo is paralysing this launch?',
      options: [
        {
          icon: '🛡️',
          title: 'Status Quo + Confirmation + Blind-Spot',
          sub: '2012 habits, dev assumptions, and invisible rural 3G needs.',
          isCorrect: true,
          feedback: 'Master diagnosis! Naming all three biases without blame unlocks the room.',
          delta: { alignment: 14, trust: 14, impact: 14 },
        },
        {
          icon: '🖥️',
          title: 'Purely Slow Servers',
          sub: 'No human bias—just hardware.',
          isCorrect: false,
          feedback: 'Hardware isn’t the bottleneck—unexamined assumptions are!',
          delta: { alignment: -8, trust: -6, impact: -4 },
        },
        {
          icon: '💰',
          title: 'Budget Competition',
          sub: 'Devs and rural reps fight for one line item.',
          isCorrect: false,
          feedback: 'They share the same goal—just trapped in competing biases.',
          delta: { alignment: -6, trust: -4, impact: -2 },
        },
      ],
    },
    wickedStep: {
      prompt: '60 days left. Apply your full Wicked Toolkit:',
      options: [
        {
          icon: '🧭',
          title: 'Reframe + 48-Hour 3G Field Probe',
          sub: 'Measure "rural task <2 mins." Send 2 devs to Miri telecentres.',
          chips: ['📶 3G Reality', '🤝 ++Trust', '⚡ High Impact'],
          isWicked: true,
          feedback: 'Kenyalang vision! 48 hours on real 3G melts dev assumptions fast.',
          delta: { alignment: 16, trust: 18, impact: 18 },
        },
        {
          icon: '✂️',
          title: 'Split Into Two Portals',
          sub: 'AI for cities, PDF for rural areas.',
          chips: ['💸 2x Cost', '⚠️ Digital Divide'],
          isWicked: false,
          feedback: 'Doubles maintenance and creates second-class access.',
          delta: { alignment: -10, trust: -12, impact: -10 },
        },
        {
          icon: '🚀',
          title: 'Ship Heavy & Patch Later',
          sub: 'Fix 3G bugs next year.',
          chips: ['⚡ On Time', '💔 Rural Dropoff'],
          isWicked: false,
          feedback: 'First impressions stick—rural users abandon broken 3G pages.',
          delta: { alignment: -8, trust: -15, impact: -12 },
        },
      ],
    },
    alignmentStep: {
      prompt: 'Dignity for Dato’, craft for Siti, 3G access for Uncle Jimmy. Close the deal:',
      options: [
        {
          icon: '🌟',
          title: 'Lite-First, Dignity-Always Charter',
          sub: 'Fast mobile core with local tooltips + joint Kuching & Miri launch.',
          isAligned: true,
          feedback: 'Grand Navigator move! Every stakeholder sees their core value honoured.',
          delta: { alignment: 18, trust: 18, impact: 18 },
        },
        {
          icon: '🎀',
          title: 'Prioritize VIP Ceremony Date',
          sub: 'Cut rural testing to make the ribbon-cutting.',
          isAligned: false,
          feedback: 'A smooth ceremony followed by a broken service for half the state.',
          delta: { alignment: -12, trust: -16, impact: -14 },
        },
      ],
    },
    debrief: {
      biasSummary: 'Teams stall when Status Quo, Confirmation, and Silo Biases stack up.',
      wickedTakeaway: 'Replace "who is right?" with shared probes and explicit trade-offs.',
      teamTip: 'Run a 48-hour reality check with your hardest-to-reach user before launching.',
    },
  },
];

  // === js/main.js ===
const mainStage = document.getElementById('mainStage');
const topbarLogo = document.getElementById('topbarLogo');
const brandHome = document.getElementById('brandHome');
const btnTheme = document.getElementById('btnTheme');
const btnMute = document.getElementById('btnMute');
const btnHelp = document.getElementById('btnHelp');
const btnKamus = document.getElementById('btnKamus');
const btnCloseKamus = document.getElementById('btnCloseKamus');
const kamusTitle = document.getElementById('kamusTitle');
const kamusModal = document.getElementById('kamusModal');
const kamusTabs = document.getElementById('kamusTabs');
const kamusContent = document.getElementById('kamusContent');
const introModal = document.getElementById('introModal');
const introTitle = document.getElementById('introTitle');
const btnCloseIntro = document.getElementById('btnCloseIntro');
const btnStartFromIntro = document.getElementById('btnStartFromIntro');
const toastHost = document.getElementById('toastHost');
const metaThemeColor = document.getElementById('metaThemeColor');

let progress = loadProgress();
let activeKamusTab = 'biases';
let session = null;
let toastTimer = null;

function init() {
  topbarLogo.innerHTML = hornbillSvg(30, 'neutral');
  btnHelp.innerHTML = uiIconSvg('help', 18);
  btnKamus.innerHTML = `${uiIconSvg('book', 16)}<span>Kamus</span>`;
  btnCloseKamus.innerHTML = uiIconSvg('close', 18);
  btnCloseIntro.innerHTML = uiIconSvg('close', 18);
  kamusTitle.innerHTML = `${uiIconSvg('book', 20)}<span>Kamus Bias &amp; Sarawak</span>`;
  introTitle.innerHTML = `${hornbillSvg(28, 'celebrate')}<span>Selamat Datang!</span>`;

  applyTheme(progress.theme);
  syncMuteButton();

  brandHome.addEventListener('click', () => {
    playSfx('tap', progress.muted);
    session = null;
    renderHome();
    scrollStageTop();
  });

  brandHome.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      session = null;
      renderHome();
      scrollStageTop();
    }
  });

  btnTheme.addEventListener('click', () => {
    progress.theme = progress.theme === 'dark' ? 'light' : 'dark';
    saveProgress(progress);
    applyTheme(progress.theme);
    playSfx('tap', progress.muted);
    showToast(progress.theme === 'dark' ? 'Ruai Night theme enabled' : 'Pua Parchment theme enabled');
  });

  btnMute.addEventListener('click', () => {
    progress.muted = !progress.muted;
    saveProgress(progress);
    syncMuteButton();
    if (!progress.muted) playSfx('tap', false);
  });

  btnKamus.addEventListener('click', () => {
    playSfx('tap', progress.muted);
    openKamus();
  });

  btnHelp.addEventListener('click', () => {
    playSfx('tap', progress.muted);
    introModal.classList.remove('hidden');
  });

  const dismissIntro = () => {
    playSfx('tap', progress.muted);
    progress.seenIntro = true;
    saveProgress(progress);
    introModal.classList.add('hidden');
  };

  btnCloseIntro.addEventListener('click', dismissIntro);
  btnStartFromIntro.addEventListener('click', dismissIntro);
  introModal.addEventListener('click', (e) => {
    if (e.target === introModal) dismissIntro();
  });

  if (!progress.seenIntro) {
    introModal.classList.remove('hidden');
  }

  btnCloseKamus.addEventListener('click', () => {
    playSfx('tap', progress.muted);
    kamusModal.classList.add('hidden');
  });

  kamusModal.addEventListener('click', (e) => {
    if (e.target === kamusModal) kamusModal.classList.add('hidden');
  });

  kamusTabs.addEventListener('click', (e) => {
    const tabBtn = e.target.closest('[data-tab]');
    if (!tabBtn) return;
    playSfx('tap', progress.muted);
    activeKamusTab = tabBtn.dataset.tab;
    renderKamus();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!kamusModal.classList.contains('hidden')) {
      kamusModal.classList.add('hidden');
    } else if (!introModal.classList.contains('hidden')) {
      dismissIntro();
    }
  });

  renderHome();
}

function applyTheme(theme) {
  const mode = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.dataset.theme = mode;
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', mode === 'dark' ? '#0b1220' : '#16233f');
  }
  btnTheme.innerHTML = uiIconSvg(mode === 'dark' ? 'sun' : 'moon', 18);
  btnTheme.setAttribute('aria-label', mode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
}

function syncMuteButton() {
  btnMute.innerHTML = uiIconSvg(progress.muted ? 'volumeOff' : 'volumeOn', 18);
  btnMute.setAttribute('aria-label', progress.muted ? 'Unmute sound' : 'Mute sound');
}

function scrollStageTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showToast(message) {
  if (!toastHost) return;
  if (toastTimer) clearTimeout(toastTimer);
  toastHost.innerHTML = `<div class="toast">${uiIconSvg('check', 15)}<span>${message}</span></div>`;
  toastTimer = setTimeout(() => {
    toastHost.innerHTML = '';
  }, 2400);
}

function openKamus() {
  renderKamus();
  kamusModal.classList.remove('hidden');
}

function renderKamus() {
  kamusTabs.querySelectorAll('.kamus-tab').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.tab === activeKamusTab);
  });
  const items = GLOSSARY[activeKamusTab] || [];
  kamusContent.innerHTML = items
    .map(
      (item) => `
      <div class="kamus-entry">
        <h4>${item.term}</h4>
        <p>${item.desc}</p>
      </div>`
    )
    .join('');
}

function classifyChip(text = '') {
  const t = String(text);
  if (
    t.includes('+') ||
    t.includes('Low Risk') ||
    t.includes('Safe') ||
    t.includes('Balanced') ||
    t.includes('Fast Learn') ||
    t.includes('Inclusive') ||
    t.includes('Practical') ||
    t.includes('Basin-Wide') ||
    t.includes('3G Reality') ||
    t.includes('High Impact')
  ) {
    return 'chip-pos';
  }
  if (
    t.includes('⚠️') ||
    t.includes('💥') ||
    t.includes('💔') ||
    t.includes('-Trust') ||
    t.includes('High Risk') ||
    t.includes('Pushback') ||
    t.includes('Flood') ||
    t.includes('Waste') ||
    t.includes('Fake') ||
    t.includes('Divide') ||
    t.includes('Dropoff') ||
    t.includes('Stalled')
  ) {
    return 'chip-warn';
  }
  return '';
}

function renderHome() {
  const rank = getFacilitatorRank(progress.completedEpisodes);
  const completedCount = Object.keys(progress.completedEpisodes).length;
  const pct = Math.round((completedCount / EPISODES.length) * 100);
  const nextEp = EPISODES.find((ep) => !progress.completedEpisodes[ep.id]) || EPISODES[0];

  mainStage.innerHTML = `
    <section class="hero-card animate-in">
      <div class="hero-top">
        <div class="hero-mascot">${hornbillSvg(58, completedCount === EPISODES.length ? 'celebrate' : 'neutral')}</div>
        <div>
          <h1 class="hero-title">Oh My Bias!</h1>
          <p class="hero-subtitle">Sarawak Edition • Tame bias &amp; align teams.</p>
        </div>
      </div>
      <div class="hero-rank-row">
        <div class="rank-pill">${rank.badge} ${rank.title}</div>
        <div class="campaign-progress">
          <div class="campaign-track" aria-label="Campaign completion">
            <div class="campaign-fill" style="width:${pct}%"></div>
          </div>
          <span class="campaign-count tnum">${completedCount}/${EPISODES.length}</span>
        </div>
      </div>
    </section>

    <div class="badge-strip" aria-label="Collected Terabai Bias Badges">
      ${EPISODES.map((ep) => {
        const done = progress.completedEpisodes[ep.id];
        const unlocked = Boolean(done);
        return `
        <button class="badge-slot ${unlocked ? 'unlocked' : ''}" data-badge-ep="${ep.id}" type="button" aria-label="${ep.badgeName} badge">
          ${biasBadgeSvg(ep.number, unlocked, 40)}
          <span>Ep ${ep.number}</span>
        </button>`;
      }).join('')}
    </div>

    ${puaDividerSvg()}

    <button class="btn-primary" id="btnQuickPlay" type="button">
      ${uiIconSvg('play', 16)}
      <span>${completedCount === 0 ? 'Start Episode 1 (4 min)' : `Play Next: Ep ${nextEp.number} — ${nextEp.location}`}</span>
    </button>

    <div class="section-head-row">
      <span class="eyebrow">${uiIconSvg('compass', 14)} Sarawak Campaign</span>
      ${completedCount > 0 ? `<button class="icon-btn btn-reset-pill" id="btnReset" type="button">${uiIconSvg('reset', 14)}<span>Reset</span></button>` : ''}
    </div>

    <div class="episode-list">
      ${EPISODES.map((ep) => {
        const done = progress.completedEpisodes[ep.id];
        return `
        <button class="episode-card ${done ? 'completed' : ''}" data-ep="${ep.id}" type="button">
          <span class="episode-emblem">${episodeEmblemSvg(ep.number)}</span>
          <div class="episode-meta">
            <span class="episode-tag">Ep ${ep.number} • ${ep.location}</span>
            <span class="episode-name">${ep.title}</span>
            <span class="episode-bias">${uiIconSvg('target', 13)}<span>${ep.biasFocus}</span></span>
          </div>
          <span class="episode-badge tnum">${done ? `✓ ${done.score}%` : 'Play →'}</span>
        </button>`;
      }).join('')}
    </div>
  `;

  document.getElementById('btnQuickPlay').addEventListener('click', () => {
    playSfx('tap', progress.muted);
    startEpisode(nextEp.id);
  });

  const btnReset = document.getElementById('btnReset');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      progress = resetProgress(progress);
      playSfx('trap', progress.muted);
      showToast('Campaign progress reset');
      renderHome();
    });
  }

  mainStage.querySelectorAll('[data-badge-ep]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const ep = EPISODES.find((e) => e.id === btn.dataset.badgeEp);
      if (!ep) return;
      const done = progress.completedEpisodes[ep.id];
      playSfx('tap', progress.muted);
      showToast(done ? `${ep.badgeName} • Best score ${done.score}%` : `Complete Ep ${ep.number} to unlock "${ep.badgeName}"`);
    });
  });

  mainStage.querySelectorAll('[data-ep]').forEach((card) => {
    card.addEventListener('click', () => {
      playSfx('tap', progress.muted);
      startEpisode(card.dataset.ep);
    });
  });
}

function startEpisode(epId) {
  const episode = EPISODES.find((e) => e.id === epId);
  if (!episode) return;

  session = {
    episode,
    phase: 'briefing',
    speakerIdx: 0,
    visitedSpeakers: [0],
    meters: { alignment: 50, trust: 50, impact: 50 },
    prevMeters: { alignment: 50, trust: 50, impact: 50 },
    lastDelta: null,
    lastChoiceTitle: '',
    feedback: null,
    biasSpotted: false,
    sceneResolved: false,
    teamAligned: false,
  };
  renderEpisode();
  scrollStageTop();
}

function formatDeltaBadge(deltaVal) {
  if (!deltaVal) return '';
  const sign = deltaVal > 0 ? '+' : '';
  const cls = deltaVal > 0 ? 'delta-pos' : 'delta-neg';
  return `<span class="delta-pill ${cls} tnum">${sign}${deltaVal}</span>`;
}

function renderMetersHtml(meters, prevMeters, lastDelta) {
  const startMeters = lastDelta && prevMeters ? prevMeters : meters;
  const rows = [
    { key: 'alignment', label: 'Align', icon: 'align', cls: 'alignment' },
    { key: 'trust', label: 'Trust', icon: 'trust', cls: 'trust' },
    { key: 'impact', label: 'Impact', icon: 'impact', cls: 'impact' },
  ];

  return `
  <div class="meters-bar" aria-label="Team Compass Meters">
    ${rows
      .map(
        (r) => `
      <div class="meter-item">
        <div class="meter-label">
          <span class="meter-name">${uiIconSvg(r.icon, 13)}<span>${r.label}</span></span>
          <span class="meter-val-group tnum">
            ${lastDelta ? formatDeltaBadge(lastDelta[r.key] || 0) : ''}
            <span>${meters[r.key]}%</span>
          </span>
        </div>
        <div class="meter-track">
          <div class="meter-fill ${r.cls}" data-target-width="${meters[r.key]}" style="width:${startMeters[r.key]}%"></div>
        </div>
      </div>`
      )
      .join('')}
  </div>`;
}

function animateMeters() {
  const fills = mainStage.querySelectorAll('.meter-fill[data-target-width]');
  if (!fills.length) return;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      fills.forEach((el) => {
        el.style.width = `${el.dataset.targetWidth}%`;
      });
    });
  });
}

function animateScoreRing() {
  const arc = mainStage.querySelector('.score-ring-arc[data-target-offset]');
  if (!arc) return;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      arc.style.strokeDashoffset = arc.dataset.targetOffset;
    });
  });
}

function renderPhasePills(currentPhase) {
  const steps = [
    { key: 'briefing', label: '1. Huddle' },
    { key: 'biasRadar', label: '2. Bias' },
    { key: 'wickedStep', label: '3. Wicked' },
    { key: 'alignmentStep', label: '4. Align' },
  ];
  const order = steps.map((s) => s.key);
  const idx = order.indexOf(currentPhase);
  return `
  <div class="phase-pills">
    ${steps
      .map((s, i) => {
        const cls = currentPhase === 'debrief' || i < idx ? 'done' : i === idx ? 'active' : '';
        return `<span class="phase-pill ${cls}">${s.label}</span>`;
      })
      .join('')}
  </div>`;
}

function renderSceneStage(episode, resolved) {
  return `
  <div class="scene-stage">
    ${episodeSceneSvg(episode.id, resolved)}
    <div class="scene-caption">
      <span class="scene-caption-item">${uiIconSvg('pin', 14)}<span>${episode.location}</span></span>
      <span class="scene-status-pill ${resolved ? 'resolved' : 'tense'}">
        ${uiIconSvg(resolved ? 'sparkle' : 'alert', 13)}
        <span>${resolved ? 'Resolved' : 'Tension'}</span>
      </span>
    </div>
  </div>`;
}

function selectSpeaker(idx) {
  session.speakerIdx = idx;
  if (!session.visitedSpeakers.includes(idx)) {
    session.visitedSpeakers.push(idx);
  }
  renderEpisode();
}

function renderEpisode() {
  const { episode, phase, meters, prevMeters, lastDelta, feedback, speakerIdx, sceneResolved, teamAligned } = session;

  if (phase === 'briefing') {
    const speakers = episode.briefing.stakeholders;
    const sp = speakers[speakerIdx];
    const isLastSpeaker = speakerIdx === speakers.length - 1;
    const allHeard = session.visitedSpeakers.length >= speakers.length;

    mainStage.innerHTML = `
      ${renderPhasePills(phase)}
      ${renderSceneStage(episode, false)}

      <div class="story-card animate-in">
        <span class="eyebrow">Ep ${episode.number} • ${episode.title}</span>
        <p>${episode.briefing.setup}</p>
      </div>

      <div class="comic-bubble-card animate-in" id="huddleCard">
        <div class="cast-bar" role="tablist" aria-label="Huddle Stakeholders">
          ${speakers
            .map((member, idx) => {
              const active = idx === speakerIdx;
              const heard = session.visitedSpeakers.includes(idx);
              return `
              <button class="cast-pill ${active ? 'active' : ''} ${heard ? 'heard' : ''}" data-speaker-idx="${idx}" type="button" role="tab" aria-selected="${active}">
                ${heard ? `<span class="cast-heard-mark" aria-hidden="true">${uiIconSvg('check', 10)}</span>` : ''}
                <div class="stakeholder-avatar">${avatarSvg(member.avatar, member.mood)}</div>
                <span class="cast-pill-name">${member.name.split(' ')[0]}</span>
              </button>`;
            })
            .join('')}
        </div>

        <div class="speaker-header">
          <div class="speaker-id">
            <div class="stakeholder-avatar">${avatarSvg(sp.avatar, sp.mood)}</div>
            <div>
              <div class="speaker-name">${sp.name}</div>
              <div class="speaker-role">${sp.role}</div>
            </div>
          </div>
          <span class="mood-chip">${sp.mood}</span>
        </div>

        <div class="speech-bubble" data-tail="${speakerIdx}">“${sp.quote}”</div>

        <div class="speaker-nav">
          <button class="icon-btn icon-btn-surface" id="btnPrevSpeaker" type="button" ${speakerIdx === 0 ? 'disabled style="opacity:0.42;"' : ''}>
            ${uiIconSvg('chevronLeft', 15)}<span>Prev</span>
          </button>
          <div class="speaker-dots" aria-hidden="true">
            ${speakers.map((_, i) => `<span class="speaker-dot ${i === speakerIdx ? 'active' : ''}"></span>`).join('')}
          </div>
          <button class="icon-btn icon-btn-surface" id="btnNextSpeaker" type="button">
            <span>${isLastSpeaker ? `${speakerIdx + 1} / ${speakers.length}` : 'Next'}</span>${isLastSpeaker ? '' : uiIconSvg('chevronRight', 15)}
          </button>
        </div>
      </div>

      <div class="choices-stack">
        <button class="btn-primary" id="btnToBias" type="button">
          ${uiIconSvg(isLastSpeaker || allHeard ? 'radar' : 'chevronRight', 17)}
          <span>${isLastSpeaker || allHeard ? 'Activate Bias Radar →' : `Next Speaker (${speakerIdx + 1}/${speakers.length}) →`}</span>
        </button>
      </div>
    `;

    mainStage.querySelectorAll('[data-speaker-idx]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.dataset.speakerIdx);
        if (idx === session.speakerIdx) return;
        playSfx('tap', progress.muted);
        selectSpeaker(idx);
      });
    });

    document.getElementById('btnPrevSpeaker').addEventListener('click', () => {
      if (session.speakerIdx > 0) {
        playSfx('tap', progress.muted);
        selectSpeaker(session.speakerIdx - 1);
      }
    });

    document.getElementById('btnNextSpeaker').addEventListener('click', () => {
      playSfx('tap', progress.muted);
      if (session.speakerIdx < speakers.length - 1) {
        selectSpeaker(session.speakerIdx + 1);
      } else {
        session.phase = 'biasRadar';
        renderEpisode();
        scrollStageTop();
      }
    });

    document.getElementById('btnToBias').addEventListener('click', () => {
      playSfx('tap', progress.muted);
      if (!isLastSpeaker && !allHeard) {
        selectSpeaker(session.speakerIdx + 1);
      } else {
        session.phase = 'biasRadar';
        renderEpisode();
        scrollStageTop();
      }
    });

    // Touch swipe support between speakers on phones
    const huddleCard = document.getElementById('huddleCard');
    let touchStartX = 0;
    let touchStartY = 0;
    huddleCard.addEventListener(
      'touchstart',
      (e) => {
        if (!e.touches.length) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      },
      { passive: true }
    );
    huddleCard.addEventListener(
      'touchend',
      (e) => {
        if (!e.changedTouches.length) return;
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(dx) < 48 || Math.abs(dx) <= Math.abs(dy)) return;
        if (dx < 0 && session.speakerIdx < speakers.length - 1) {
          playSfx('tap', progress.muted);
          selectSpeaker(session.speakerIdx + 1);
        } else if (dx > 0 && session.speakerIdx > 0) {
          playSfx('tap', progress.muted);
          selectSpeaker(session.speakerIdx - 1);
        }
      },
      { passive: true }
    );
    return;
  }

  if (phase === 'debrief') {
    const score = Math.round((meters.alignment + meters.trust + meters.impact) / 3);
    progress.completedEpisodes[episode.id] = {
      score,
      alignment: meters.alignment,
      trust: meters.trust,
      impact: meters.impact,
      biasSpotted: session.biasSpotted,
    };
    saveProgress(progress);

    const nextEp = EPISODES.find((e) => e.number === episode.number + 1);
    mainStage.innerHTML = `
      ${renderSceneStage(episode, sceneResolved)}
      ${renderMetersHtml(meters, prevMeters, null)}

      <div class="debrief-box animate-in">
        <div class="debrief-hero-row">
          ${scoreRingSvg(score)}
          <div class="debrief-badge-meta">
            <div class="debrief-badge-chip">
              ${biasBadgeSvg(episode.number, true, 40)}
              <span class="debrief-badge-title">Badge: ${episode.badgeName}</span>
            </div>
            <h2 class="debrief-ep-title">${episode.title}</h2>
          </div>
        </div>
        <div class="debrief-takeaway">
          <strong>${episode.biasFocus}:</strong> ${episode.debrief.biasSummary}
        </div>
        <div class="debrief-takeaway">
          <strong>${episode.wickedPrinciple}:</strong> ${episode.debrief.wickedTakeaway}
        </div>
        <div class="debrief-takeaway golden">
          <strong>Golden Rule:</strong> ${episode.debrief.teamTip}
        </div>
      </div>

      <div class="choices-stack">
        <button class="btn-secondary" id="btnCopySummary" type="button">
          ${uiIconSvg('copy', 16)}<span>Copy Result Card</span>
        </button>
        ${nextEp ? `<button class="btn-primary" id="btnNextEp" type="button"><span>Next: Ep ${nextEp.number} — ${nextEp.location} →</span></button>` : ''}
        <button class="btn-secondary" id="btnBackHome" type="button">Return to Ruai Hub</button>
      </div>
    `;

    animateScoreRing();

    document.getElementById('btnCopySummary').addEventListener('click', async () => {
      const text = `Oh My Bias! Sarawak — Ep ${episode.number}: ${episode.title}\nBadge: ${episode.badgeName} | Score: ${score}%\nAlign ${meters.alignment}% • Trust ${meters.trust}% • Impact ${meters.impact}%`;
      try {
        await navigator.clipboard.writeText(text);
        showToast('Result card copied to clipboard!');
      } catch {
        showToast('Score saved locally!');
      }
      playSfx('sape', progress.muted);
    });

    const btnNextEp = document.getElementById('btnNextEp');
    if (btnNextEp) {
      btnNextEp.addEventListener('click', () => {
        playSfx('tap', progress.muted);
        startEpisode(nextEp.id);
      });
    }

    document.getElementById('btnBackHome').addEventListener('click', () => {
      playSfx('tap', progress.muted);
      session = null;
      renderHome();
      scrollStageTop();
    });
    return;
  }

  // Interactive decision phases: biasRadar | wickedStep | alignmentStep
  const stepData = episode[phase];
  const nextLabel =
    phase === 'biasRadar'
      ? 'Open Wicked Toolkit →'
      : phase === 'wickedStep'
        ? 'Move to Team Alignment →'
        : 'View Ruai Debrief →';

  const phaseEyebrow =
    phase === 'biasRadar'
      ? `${uiIconSvg('radar', 14)}<span>Bias Radar</span>`
      : phase === 'wickedStep'
        ? `${uiIconSvg('toolkit', 14)}<span>Wicked Toolkit</span>`
        : `${uiIconSvg('align', 14)}<span>Team Alignment</span>`;

  const topVisual =
    phase === 'biasRadar'
      ? `${biasRadarSvg(session.biasSpotted)}
         <div class="mini-speakers">
          ${episode.briefing.stakeholders
            .map(
              (st) => `
            <div class="mini-speaker">
              <div class="stakeholder-avatar">${avatarSvg(st.avatar, st.mood)}</div>
              <span class="mini-speaker-name">${st.name.split(' ')[0]}</span>
              <span class="mini-speaker-mood">${st.mood}</span>
            </div>`
            )
            .join('')}
        </div>`
      : phase === 'wickedStep'
        ? renderSceneStage(episode, sceneResolved)
        : tensionRingSvg(episode.briefing.stakeholders, teamAligned);

  mainStage.innerHTML = `
    ${renderPhasePills(phase)}
    ${renderMetersHtml(meters, prevMeters, lastDelta)}
    ${topVisual}

    <div class="story-card animate-in">
      <span class="eyebrow">${phaseEyebrow}</span>
      <p class="story-prompt">${stepData.prompt}</p>
    </div>

    ${
      feedback
        ? `
      <div class="hornbill-tip ${feedback.positive ? 'wicked-hit' : 'trap-hit'} animate-in">
        <div class="hornbill-tip-icon">${hornbillSvg(44, feedback.positive ? 'celebrate' : 'alert')}</div>
        <div class="hornbill-tip-content">
          <span class="outcome-pill ${feedback.positive ? 'pos' : 'neg'}">
            ${uiIconSvg(feedback.positive ? 'check' : 'alert', 12)}
            <span>${feedback.positive ? 'Breakthrough' : 'Bias Trap'}</span>
          </span>
          ${session.lastChoiceTitle ? `<div class="selected-recap">${session.lastChoiceTitle}</div>` : ''}
          <div class="hornbill-tip-body"><strong>Bujang:</strong> ${feedback.text}</div>
        </div>
      </div>
      <div class="choices-stack">
        <button class="btn-primary" id="btnNextPhase" type="button">${nextLabel}</button>
      </div>`
        : `
      <div class="choices-stack animate-in">
        ${stepData.options
          .map(
            (opt, idx) => `
          <button class="choice-btn" data-opt="${idx}" type="button">
            <div class="choice-head">
              <span class="choice-icon">${opt.icon || '✨'}</span>
              <span class="choice-title">${opt.title}</span>
            </div>
            <span class="choice-sub">${opt.sub}</span>
            ${
              opt.chips
                ? `<div class="chip-row">${opt.chips.map((c) => `<span class="tradeoff-chip ${classifyChip(c)}">${c}</span>`).join('')}</div>`
                : ''
            }
          </button>`
          )
          .join('')}
      </div>`
    }
  `;

  if (lastDelta) {
    animateMeters();
  }

  if (feedback) {
    document.getElementById('btnNextPhase').addEventListener('click', () => {
      playSfx('tap', progress.muted);
      session.feedback = null;
      session.lastDelta = null;
      session.lastChoiceTitle = '';
      session.prevMeters = { ...session.meters };
      session.phase =
        phase === 'biasRadar'
          ? 'wickedStep'
          : phase === 'wickedStep'
            ? 'alignmentStep'
            : 'debrief';
      renderEpisode();
      scrollStageTop();
    });
  } else {
    mainStage.querySelectorAll('[data-opt]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const opt = stepData.options[Number(btn.dataset.opt)];
        const positive = Boolean(opt.isCorrect || opt.isWicked || opt.isAligned);
        if (phase === 'biasRadar' && opt.isCorrect) session.biasSpotted = true;
        if (phase === 'wickedStep' && opt.isWicked) session.sceneResolved = true;
        if (phase === 'alignmentStep' && opt.isAligned) session.teamAligned = true;

        const nextMeters = {
          alignment: clampMeter(session.meters.alignment + (opt.delta?.alignment || 0)),
          trust: clampMeter(session.meters.trust + (opt.delta?.trust || 0)),
          impact: clampMeter(session.meters.impact + (opt.delta?.impact || 0)),
        };

        session.prevMeters = { ...session.meters };
        session.lastDelta = {
          alignment: nextMeters.alignment - session.meters.alignment,
          trust: nextMeters.trust - session.meters.trust,
          impact: nextMeters.impact - session.meters.impact,
        };
        session.meters = nextMeters;
        session.lastChoiceTitle = opt.title;
        session.feedback = { positive, text: opt.feedback };
        playSfx(positive ? 'sape' : 'trap', progress.muted);
        renderEpisode();
      });
    });
  }
}

init();
})();
