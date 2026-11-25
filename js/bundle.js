(function () {
  "use strict";
  // === js/state.js ===
const STORAGE_KEY = 'ohmybias_sarawak_v1';

const DEFAULT_PROGRESS = {
  completedEpisodes: {},
  muted: false,
  seenIntro: false,
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

function resetProgress() {
  const fresh = { ...DEFAULT_PROGRESS, completedEpisodes: {}, seenIntro: true };
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
 * Enhanced inline SVG generators with gradients, Borneo silhouettes,
 * expressive avatars, reactive Sarawakian dioramas, tension rings, and badges.
 */

function hornbillSvg(size = 56) {
  return `
  <svg width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" aria-hidden="true">
    <defs>
      <radialGradient id="hbBg" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stop-color="#2A4374"/>
        <stop offset="100%" stop-color="#121C33"/>
      </radialGradient>
      <linearGradient id="hbBeak" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#F5E2B3"/>
        <stop offset="100%" stop-color="#D9A441"/>
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="30" fill="url(#hbBg)" stroke="#D9A441" stroke-width="2.5"/>
    <path d="M21 47C21 34 25 24 35 21C40 20 44 23 44 28C44 36 37 43 35 49H21Z" fill="#0E1526"/>
    <path d="M26 26C30 21 36 21 39 25L36 34C31 34 27 30 26 26Z" fill="#FAF3E0"/>
    <path d="M36 17C43 15 50 17 51 22C46 23 40 22 36 21V17Z" fill="#C84B31"/>
    <path d="M38 21C47 21 55 25 57 31C49 31 43 28 38 26V21Z" fill="url(#hbBeak)"/>
    <circle cx="35" cy="25" r="2.2" fill="#121C33"/>
    <circle cx="35.6" cy="24.4" r="0.8" fill="#FFFFFF"/>
    <path d="M21 47L14 53H26L28 47H21Z" fill="#FAF3E0"/>
    <path d="M16 51H26" stroke="#121C33" stroke-width="1.5"/>
  </svg>`;
}

function puaDividerSvg() {
  return `
  <svg class="pua-divider" viewBox="0 0 360 14" preserveAspectRatio="none" aria-hidden="true">
    <defs>
      <pattern id="puaPattern" width="24" height="14" patternUnits="userSpaceOnUse">
        <path d="M0 7 L6 1 L12 7 L6 13 Z" fill="#C84B31"/>
        <path d="M12 7 L18 1 L24 7 L18 13 Z" fill="#D9A441"/>
        <circle cx="6" cy="7" r="1.6" fill="#FAF3E0"/>
        <circle cx="18" cy="7" r="1.6" fill="#1B2A4A"/>
      </pattern>
    </defs>
    <rect width="360" height="14" fill="url(#puaPattern)"/>
  </svg>`;
}

function avatarSvg({ skin = '#D89B6C', hair = '#1E1B18', shirt = '#2D6A4F', hat = 'none' }) {
  const hatLayer =
    hat === 'songkok'
      ? `<path d="M12.5 18C12.5 10.5 31.5 10.5 31.5 18Z" fill="#121C33"/><path d="M12.5 17H31.5" stroke="#D9A441" stroke-width="1.2"/>`
      : hat === 'headband'
        ? `<rect x="11.5" y="14.5" width="21" height="4.2" rx="2" fill="#C84B31"/><path d="M14 16.5L17 15L20 16.5L23 15L26 16.5L29 15" stroke="#D9A441" stroke-width="1"/>`
        : hat === 'tudung'
          ? `<path d="M9.5 28C9.5 12 34.5 12 34.5 28L37 43H7L9.5 28Z" fill="${shirt}"/><path d="M12.5 22C12.5 14 31.5 14 31.5 22" stroke="#F5E2B3" stroke-width="1" opacity="0.6"/>`
          : '';

  return `
  <svg viewBox="0 0 44 44" fill="none" aria-hidden="true">
    <defs>
      <radialGradient id="avBg" cx="50%" cy="35%" r="65%">
        <stop offset="0%" stop-color="#FFFDF7"/>
        <stop offset="100%" stop-color="#EFE4C8"/>
      </radialGradient>
    </defs>
    <rect width="44" height="44" fill="url(#avBg)"/>
    <path d="M7 44C7 33.5 13.5 29.5 22 29.5C30.5 29.5 37 33.5 37 44H7Z" fill="${shirt}"/>
    <path d="M17 30L22 34.5L27 30" stroke="#FAF3E0" stroke-width="1.4" opacity="0.7"/>
    ${hat === 'tudung' ? hatLayer : ''}
    <!-- Ears -->
    <circle cx="12.2" cy="21.5" r="2.2" fill="${skin}"/>
    <circle cx="31.8" cy="21.5" r="2.2" fill="${skin}"/>
    <!-- Head -->
    <circle cx="22" cy="21" r="9.6" fill="${skin}"/>
    ${hat !== 'tudung' ? `<path d="M12 20C12 11.5 32 11.5 32 20C29 15.5 15 15.5 12 20Z" fill="${hair}"/>` : ''}
    ${hat !== 'tudung' ? hatLayer : ''}
    <!-- Eyes & Eyebrows -->
    <path d="M16.5 18.8Q18.5 17.8 20 18.8" stroke="#1B2432" stroke-width="1" stroke-linecap="round"/>
    <path d="M24 18.8Q25.5 17.8 27.5 18.8" stroke="#1B2432" stroke-width="1" stroke-linecap="round"/>
    <circle cx="18.3" cy="21.2" r="1.4" fill="#1B2432"/>
    <circle cx="25.7" cy="21.2" r="1.4" fill="#1B2432"/>
    <circle cx="18.7" cy="20.7" r="0.45" fill="#FFFFFF"/>
    <circle cx="26.1" cy="20.7" r="0.45" fill="#FFFFFF"/>
    <!-- Warm Smile -->
    <path d="M18.5 25.4C20 27.2 24 27.2 25.5 25.4" stroke="#7A3E2E" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`;
}

/**
 * Richer Sarawakian SVG Dioramas with gradients, Mount Santubong backdrop, and water reflections.
 */
function episodeSceneSvg(epId, resolved = false) {
  const skyGrad = resolved
    ? `<linearGradient id="sky_${epId}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1E3A6E"/><stop offset="65%" stop-color="#2A6F97"/><stop offset="100%" stop-color="#D9A441" stop-opacity="0.55"/></linearGradient>`
    : `<linearGradient id="sky_${epId}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#121C33"/><stop offset="100%" stop-color="#253860"/></linearGradient>`;

  if (epId === 'ep1') {
    const waterY = resolved ? 105 : 88;
    return `
    <svg viewBox="0 0 360 128" fill="none" aria-hidden="true">
      <defs>${skyGrad}</defs>
      <rect width="360" height="128" fill="url(#sky_${epId})"/>
      <!-- Distant Santubong Silhouette -->
      <path d="M0 98L55 62L95 78L150 48L215 86L360 72V102H0V98Z" fill="#162642" opacity="0.7"/>
      <!-- Kuching Heritage Shophouses -->
      <rect x="16" y="38" width="66" height="60" rx="2" fill="#FAF3E0"/>
      <rect x="24" y="48" width="14" height="18" rx="2" fill="#2A6F97"/>
      <rect x="46" y="48" width="14" height="18" rx="2" fill="#2A6F97"/>
      <path d="M12 40L49 20L86 40H12Z" fill="#C84B31"/>
      <rect x="90" y="46" width="68" height="52" rx="2" fill="#F5E2B3"/>
      <rect x="100" y="56" width="14" height="16" rx="2" fill="#1B2A4A"/>
      <rect x="124" y="56" width="14" height="16" rx="2" fill="#1B2A4A"/>
      <path d="M86 48L124 28L162 48H86Z" fill="#2D6A4F"/>
      <!-- Kopitiam & Laksa Stall -->
      <rect x="176" y="54" width="92" height="44" rx="4" fill="#D9A441"/>
      <rect x="182" y="60" width="80" height="15" rx="2" fill="#1B2A4A"/>
      <text x="222" y="70.5" text-anchor="middle" fill="#FAF3E0" font-size="8.5" font-weight="bold">LAKSA STALL</text>
      <rect x="186" y="80" width="20" height="18" fill="#FAF3E0" opacity="0.8"/>
      <rect x="212" y="80" width="20" height="18" fill="#FAF3E0" opacity="0.8"/>
      <!-- Street & Drain Water -->
      <rect x="0" y="98" width="360" height="30" fill="#2B3240"/>
      <rect x="0" y="${waterY}" width="360" height="${128 - waterY}" fill="${resolved ? '#2D6A4F' : '#3B82A6'}" opacity="0.85"/>
      <line x1="28" y1="${waterY + 6}" x2="96" y2="${waterY + 6}" stroke="#FAF3E0" stroke-width="1.5" opacity="0.4" stroke-linecap="round"/>
      <line x1="190" y1="${waterY + 9}" x2="270" y2="${waterY + 9}" stroke="#FAF3E0" stroke-width="1.5" opacity="0.35" stroke-linecap="round"/>
      ${resolved
        ? `<circle cx="308" cy="36" r="15" fill="#F5E2B3" opacity="0.9"/><circle cx="195" cy="44" r="5" fill="#F5E2B3"/><circle cx="222" cy="44" r="5" fill="#F5E2B3"/><circle cx="249" cy="44" r="5" fill="#F5E2B3"/>`
        : `<path d="M286 24C296 14 316 14 324 24C332 24 336 34 328 38H282C274 34 278 24 286 24Z" fill="#94A3B8"/><line x1="292" y1="43" x2="288" y2="56" stroke="#93C5FD" stroke-width="2"/><line x1="308" y1="43" x2="304" y2="56" stroke="#93C5FD" stroke-width="2"/><line x1="322" y1="43" x2="318" y2="56" stroke="#93C5FD" stroke-width="2"/>`
      }
    </svg>`;
  }

  if (epId === 'ep2') {
    return `
    <svg viewBox="0 0 360 128" fill="none" aria-hidden="true">
      <defs>${skyGrad}</defs>
      <rect width="360" height="128" fill="url(#sky_${epId})"/>
      <path d="M0 90C55 42 115 58 175 82C235 42 295 48 360 84V128H0V90Z" fill="#1E4D3B"/>
      <path d="M0 98C70 68 150 78 220 94C275 68 320 75 360 92V128H0V98Z" fill="#2D6A4F"/>
      <!-- Longhouse on Stilts -->
      <rect x="44" y="50" width="272" height="36" rx="3" fill="#8C5A3C"/>
      <rect x="44" y="72" width="272" height="14" fill="#A46B46"/>
      <path d="M34 52L180 20L326 52H34Z" fill="#C84B31"/>
      <path d="M44 52L180 24L316 52" stroke="#D9A441" stroke-width="1.5" fill="none"/>
      ${[64, 122, 180, 238, 292].map((x) => `<rect x="${x}" y="86" width="7" height="22" fill="#4E2F1B"/>`).join('')}
      <!-- Baram River & Reflections -->
      <rect x="0" y="106" width="360" height="22" fill="#2A6F97"/>
      <line x1="40" y1="115" x2="120" y2="115" stroke="#FAF3E0" stroke-width="1.5" opacity="0.35"/>
      <line x1="210" y1="118" x2="310" y2="118" stroke="#FAF3E0" stroke-width="1.5" opacity="0.35"/>
      ${[80, 130, 180, 230, 280]
        .map((x) => `<circle cx="${x}" cy="64" r="${resolved ? 6.5 : 3}" fill="${resolved ? '#F5E2B3' : '#94A3B8'}"/>`)
        .join('')}
    </svg>`;
  }

  if (epId === 'ep3') {
    return `
    <svg viewBox="0 0 360 128" fill="none" aria-hidden="true">
      <defs>${skyGrad}</defs>
      <rect width="360" height="128" fill="url(#sky_${epId})"/>
      <path d="M0 98C90 54 185 78 360 46V128H0V98Z" fill="#1E4D3B"/>
      <path d="M0 108C125 78 245 90 360 74V128H0V108Z" fill="#2D6A4F"/>
      ${[50, 94, 138]
        .map(
          (x) => `
        <rect x="${x}" y="52" width="5" height="50" fill="#5C3A21"/>
        <circle cx="${x + 2.5}" cy="58" r="9" fill="#1B4332"/>
        <circle cx="${x + 2.5}" cy="74" r="8" fill="#40916C"/>`
        )
        .join('')}
      <rect x="234" y="34" width="38" height="62" rx="7" fill="#121C33" stroke="#D9A441" stroke-width="2.2"/>
      ${resolved
        ? `<circle cx="253" cy="65" r="9" fill="#2D6A4F"/><path d="M284 54C291 59 291 71 284 76" stroke="#D9A441" stroke-width="2.8" stroke-linecap="round"/><path d="M296 47C307 55 307 75 296 83" stroke="#F5E2B3" stroke-width="2.5" stroke-linecap="round"/>`
        : `<line x1="245" y1="56" x2="261" y2="72" stroke="#C84B31" stroke-width="3"/><line x1="261" y1="56" x2="245" y2="72" stroke="#C84B31" stroke-width="3"/>`
      }
    </svg>`;
  }

  if (epId === 'ep4') {
    return `
    <svg viewBox="0 0 360 128" fill="none" aria-hidden="true">
      <defs>${skyGrad}</defs>
      <rect width="360" height="128" fill="url(#sky_${epId})"/>
      <path d="M0 32L98 96H0V32Z" fill="#5C3A21"/>
      <path d="M0 58L62 96H0V58Z" fill="#2D6A4F" opacity="0.7"/>
      <rect x="0" y="96" width="360" height="32" fill="#2A6F97"/>
      <line x1="30" y1="112" x2="140" y2="112" stroke="#FAF3E0" stroke-width="1.5" opacity="0.35"/>
      ${[162, 222, 282]
        .map(
          (x) => `
        <rect x="${x}" y="70" width="34" height="24" fill="#FAF3E0"/>
        <rect x="${x + 11}" y="78" width="12" height="16" fill="#5C3A21"/>
        <path d="M${x - 4} 71L${x + 17} 55L${x + 38} 71H${x - 4}Z" fill="#C84B31"/>`
        )
        .join('')}
      <rect x="118" y="48" width="5" height="48" fill="#D9A441"/>
      <circle cx="120.5" cy="46" r="5.5" fill="${resolved ? '#40916C' : '#C84B31'}"/>
      ${resolved
        ? `<circle cx="120.5" cy="46" r="14" stroke="#D9A441" stroke-width="2" stroke-dasharray="4 3"/><circle cx="120.5" cy="46" r="24" stroke="#F5E2B3" stroke-width="1.5" stroke-dasharray="4 3"/>`
        : ''}
    </svg>`;
  }

  return `
  <svg viewBox="0 0 360 128" fill="none" aria-hidden="true">
    <defs>${skyGrad}</defs>
    <rect width="360" height="128" fill="url(#sky_${epId})"/>
    <rect x="24" y="38" width="28" height="66" fill="#253860"/>
    <rect x="58" y="24" width="34" height="80" fill="#2A6F97"/>
    <rect x="98" y="48" width="26" height="56" fill="#1B2A4A"/>
    <rect x="64" y="34" width="8" height="10" fill="#F5E2B3" opacity="0.7"/>
    <rect x="78" y="34" width="8" height="10" fill="#F5E2B3" opacity="0.7"/>
    <rect x="246" y="56" width="78" height="48" rx="4" fill="#2D6A4F"/>
    <path d="M238 58L285 33L332 58H238Z" fill="#D9A441"/>
    <path d="M126 64Q182 28 242 64" stroke="${resolved ? '#40916C' : '#C84B31'}" stroke-width="3.2" stroke-dasharray="${resolved ? 'none' : '5 4'}" fill="none"/>
    <circle cx="184" cy="46" r="10" fill="${resolved ? '#D9A441' : '#C84B31'}"/>
    <text x="184" y="49" text-anchor="middle" fill="#121C33" font-size="8.5" font-weight="bold">3G</text>
    <rect x="0" y="104" width="360" height="24" fill="#1B2A4A"/>
  </svg>`;
}

function tensionRingSvg(stakeholders, aligned = false) {
  const lineColor = aligned ? '#2D6A4F' : '#C84B31';
  const dash = aligned ? '' : 'stroke-dasharray="5 4"';
  const centerFill = aligned ? '#2D6A4F' : '#D9A441';
  const centerLabel = aligned ? 'ALIGNED' : 'TENSION';

  return `
  <div class="tension-ring-box">
    <svg viewBox="0 0 280 112" fill="none" aria-hidden="true" style="width:100%; height:108px;">
      <line x1="140" y1="24" x2="54" y2="86" stroke="${lineColor}" stroke-width="2.5" ${dash}/>
      <line x1="140" y1="24" x2="226" y2="86" stroke="${lineColor}" stroke-width="2.5" ${dash}/>
      <line x1="54" y1="86" x2="226" y2="86" stroke="${lineColor}" stroke-width="2.5" ${dash}/>
      <rect x="110" y="54" width="60" height="18" rx="9" fill="${centerFill}"/>
      <text x="140" y="66" text-anchor="middle" fill="#FFFFFF" font-size="8.5" font-weight="bold">${centerLabel}</text>
      <circle cx="140" cy="22" r="16" fill="#FAF3E0" stroke="#D9A441" stroke-width="2"/>
      <text x="140" y="25" text-anchor="middle" fill="#1B2A4A" font-size="7.5" font-weight="bold">${stakeholders[0].name.split(' ')[0]}</text>
      <circle cx="54" cy="86" r="16" fill="#FAF3E0" stroke="#D9A441" stroke-width="2"/>
      <text x="54" y="89" text-anchor="middle" fill="#1B2A4A" font-size="7.5" font-weight="bold">${stakeholders[1].name.split(' ')[0]}</text>
      <circle cx="226" cy="86" r="16" fill="#FAF3E0" stroke="#D9A441" stroke-width="2"/>
      <text x="226" y="89" text-anchor="middle" fill="#1B2A4A" font-size="7.5" font-weight="bold">${stakeholders[2].name.split(' ')[0]}</text>
    </svg>
  </div>`;
}

function biasBadgeSvg(epNumber, unlocked = true) {
  const icons = ['⚓', '🐑', '💸', '📺', '🛡️'];
  const fill = unlocked ? '#1B2A4A' : '#E2D8C0';
  const stroke = unlocked ? '#D9A441' : '#BFB49A';
  return `
  <svg width="42" height="48" viewBox="0 0 42 48" fill="none" aria-hidden="true">
    <path d="M21 2L38 9V25C38 35 29 43 21 46C13 43 4 35 4 25V9L21 2Z" fill="${fill}" stroke="${stroke}" stroke-width="2.2"/>
    <text x="21" y="29" text-anchor="middle" font-size="16">${unlocked ? icons[epNumber - 1] || '🦅' : '🔒'}</text>
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
const btnMute = document.getElementById('btnMute');
const btnHelp = document.getElementById('btnHelp');
const btnKamus = document.getElementById('btnKamus');
const btnCloseKamus = document.getElementById('btnCloseKamus');
const kamusModal = document.getElementById('kamusModal');
const kamusTabs = document.getElementById('kamusTabs');
const kamusContent = document.getElementById('kamusContent');
const introModal = document.getElementById('introModal');
const btnCloseIntro = document.getElementById('btnCloseIntro');
const btnStartFromIntro = document.getElementById('btnStartFromIntro');

let progress = loadProgress();
let activeKamusTab = 'biases';
let session = null;

function init() {
  topbarLogo.innerHTML = hornbillSvg(28);
  syncMuteButton();

  brandHome.addEventListener('click', () => {
    playSfx('tap', progress.muted);
    session = null;
    renderHome();
  });

  brandHome.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      session = null;
      renderHome();
    }
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

  renderHome();
}

function syncMuteButton() {
  btnMute.textContent = progress.muted ? '🔇' : '🔊';
  btnMute.setAttribute('aria-label', progress.muted ? 'Unmute sound' : 'Mute sound');
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

function renderHome() {
  const rank = getFacilitatorRank(progress.completedEpisodes);
  const completedCount = Object.keys(progress.completedEpisodes).length;
  const nextEp = EPISODES.find((ep) => !progress.completedEpisodes[ep.id]) || EPISODES[0];

  mainStage.innerHTML = `
    <section class="hero-card animate-in">
      <div class="hero-top">
        <div class="hero-mascot">${hornbillSvg(56)}</div>
        <div>
          <h1 class="hero-title">Oh My Bias!</h1>
          <p class="hero-subtitle">Sarawak Edition • Tame bias &amp; align teams.</p>
        </div>
      </div>
      <div class="rank-pill">${rank.badge} ${rank.title} (${completedCount}/5)</div>
    </section>

    <div class="badge-strip" aria-label="Collected Terabai Bias Badges">
      ${EPISODES.map((ep) => {
        const unlocked = Boolean(progress.completedEpisodes[ep.id]);
        return `
        <div class="badge-slot">
          ${biasBadgeSvg(ep.number, unlocked)}
          <span>Ep ${ep.number}</span>
        </div>`;
      }).join('')}
    </div>

    ${puaDividerSvg()}

    <button class="btn-primary" id="btnQuickPlay" type="button">
      ${completedCount === 0 ? '▶ Start Episode 1 (4 min)' : `▶ Play Next: Ep ${nextEp.number} — ${nextEp.location}`}
    </button>

    <div style="display:flex; justify-content:space-between; align-items:center;">
      <span class="eyebrow">Sarawak Campaign</span>
      ${completedCount > 0 ? '<button class="icon-btn" id="btnReset" type="button" style="color:var(--accent-terracotta); border-color:var(--border-warm); background:var(--surface-card);">Reset</button>' : ''}
    </div>

    <div class="episode-list">
      ${EPISODES.map((ep) => {
        const done = progress.completedEpisodes[ep.id];
        return `
        <button class="episode-card ${done ? 'completed' : ''}" data-ep="${ep.id}" type="button">
          <div class="episode-meta">
            <span class="episode-tag">Ep ${ep.number} • ${ep.location}</span>
            <span class="episode-name">${ep.title}</span>
            <span class="episode-bias">🎯 ${ep.biasFocus}</span>
          </div>
          <span class="episode-badge">${done ? `✓ ${done.score}%` : 'Play →'}</span>
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
      progress = resetProgress();
      playSfx('trap', progress.muted);
      renderHome();
    });
  }

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
    meters: { alignment: 50, trust: 50, impact: 50 },
    feedback: null,
    biasSpotted: false,
    sceneResolved: false,
    teamAligned: false,
  };
  renderEpisode();
}

function renderMetersHtml(meters) {
  return `
  <div class="meters-bar" aria-label="Team Compass Meters">
    <div class="meter-item">
      <div class="meter-label"><span>🤝 Align</span><span>${meters.alignment}%</span></div>
      <div class="meter-track"><div class="meter-fill alignment" style="width:${meters.alignment}%"></div></div>
    </div>
    <div class="meter-item">
      <div class="meter-label"><span>🌿 Trust</span><span>${meters.trust}%</span></div>
      <div class="meter-track"><div class="meter-fill trust" style="width:${meters.trust}%"></div></div>
    </div>
    <div class="meter-item">
      <div class="meter-label"><span>⚡ Impact</span><span>${meters.impact}%</span></div>
      <div class="meter-track"><div class="meter-fill impact" style="width:${meters.impact}%"></div></div>
    </div>
  </div>`;
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
      <span>📍 ${episode.location}</span>
      <span>${resolved ? '✨ Resolved' : '⚠️ Tension'}</span>
    </div>
  </div>`;
}

function renderEpisode() {
  const { episode, phase, meters, feedback, speakerIdx, sceneResolved, teamAligned } = session;

  if (phase === 'briefing') {
    const speakers = episode.briefing.stakeholders;
    const sp = speakers[speakerIdx];
    const isLastSpeaker = speakerIdx === speakers.length - 1;

    mainStage.innerHTML = `
      ${renderPhasePills(phase)}
      ${renderSceneStage(episode, false)}

      <div class="story-card animate-in">
        <span class="eyebrow">Ep ${episode.number} • ${episode.title}</span>
        <p style="font-size:0.86rem;">${episode.briefing.setup}</p>
      </div>

      <div class="comic-bubble-card animate-in">
        <div class="speaker-header">
          <div class="speaker-id">
            <div class="stakeholder-avatar">${avatarSvg(sp.avatar)}</div>
            <div>
              <div style="font-size:0.86rem; font-weight:800; color:var(--bg-indigo);">${sp.name}</div>
              <div style="font-size:0.72rem; font-weight:700; color:var(--accent-terracotta);">${sp.role}</div>
            </div>
          </div>
          <span class="mood-chip">${sp.mood}</span>
        </div>

        <div class="speech-bubble">“${sp.quote}”</div>

        <div class="speaker-nav">
          <button class="icon-btn" id="btnPrevSpeaker" type="button" ${speakerIdx === 0 ? 'disabled style="opacity:0.4; color:var(--bg-indigo); border-color:var(--border-warm);"' : 'style="color:var(--bg-indigo); border-color:var(--border-warm);"'}>← Prev</button>
          <div class="speaker-dots">
            ${speakers.map((_, i) => `<span class="speaker-dot ${i === speakerIdx ? 'active' : ''}"></span>`).join('')}
          </div>
          <button class="icon-btn" id="btnNextSpeaker" type="button" style="color:var(--bg-indigo); border-color:var(--border-warm);">${isLastSpeaker ? '3 / 3' : 'Next →'}</button>
        </div>
      </div>

      <div class="choices-stack">
        <button class="btn-primary" id="btnToBias" type="button">
          ${isLastSpeaker ? 'Activate Bias Radar →' : `Next Speaker (${speakerIdx + 1}/${speakers.length}) →`}
        </button>
      </div>
    `;

    document.getElementById('btnPrevSpeaker').addEventListener('click', () => {
      if (session.speakerIdx > 0) {
        playSfx('tap', progress.muted);
        session.speakerIdx -= 1;
        renderEpisode();
      }
    });

    document.getElementById('btnNextSpeaker').addEventListener('click', () => {
      playSfx('tap', progress.muted);
      if (session.speakerIdx < speakers.length - 1) {
        session.speakerIdx += 1;
      } else {
        session.phase = 'biasRadar';
      }
      renderEpisode();
    });

    document.getElementById('btnToBias').addEventListener('click', () => {
      playSfx('tap', progress.muted);
      if (!isLastSpeaker) {
        session.speakerIdx += 1;
      } else {
        session.phase = 'biasRadar';
      }
      renderEpisode();
    });
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
      ${renderMetersHtml(meters)}

      <div class="debrief-box animate-in">
        <div class="debrief-badge-row">
          ${biasBadgeSvg(episode.number, true)}
          <div>
            <span class="eyebrow" style="color:var(--accent-gold);">Badge Unlocked: ${episode.badgeName}</span>
            <h2 style="font-size:1.1rem; color:var(--text-light);">${episode.title} (${score}%)</h2>
          </div>
        </div>
        <div class="debrief-takeaway">
          <strong>🎯 ${episode.biasFocus}:</strong> ${episode.debrief.biasSummary}
        </div>
        <div class="debrief-takeaway">
          <strong>🧭 ${episode.wickedPrinciple}:</strong> ${episode.debrief.wickedTakeaway}
        </div>
        <div class="debrief-takeaway" style="border-left:3px solid var(--accent-gold);">
          <strong>💡 Golden Rule:</strong> ${episode.debrief.teamTip}
        </div>
      </div>

      <div class="choices-stack">
        <button class="btn-secondary" id="btnCopySummary" type="button">📋 Copy Result Card</button>
        ${nextEp ? `<button class="btn-primary" id="btnNextEp" type="button">Next: Ep ${nextEp.number} — ${nextEp.location} →</button>` : ''}
        <button class="btn-secondary" id="btnBackHome" type="button">Return to Ruai Hub</button>
      </div>
    `;

    document.getElementById('btnCopySummary').addEventListener('click', async () => {
      const text = `Oh My Bias! Sarawak — Ep ${episode.number}: ${episode.title}\nBadge: ${episode.badgeName} | Score: ${score}%\nAlign ${meters.alignment}% • Trust ${meters.trust}% • Impact ${meters.impact}%`;
      try {
        await navigator.clipboard.writeText(text);
        document.getElementById('btnCopySummary').textContent = '✓ Copied to Clipboard!';
      } catch {
        document.getElementById('btnCopySummary').textContent = 'Score Saved Locally ✓';
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

  const topVisual =
    phase === 'biasRadar'
      ? `<div class="mini-speakers">
          ${episode.briefing.stakeholders
            .map(
              (st) => `
            <div class="mini-speaker">
              <div class="stakeholder-avatar">${avatarSvg(st.avatar)}</div>
              <span>${st.name.split(' ')[0]}</span>
              <span style="font-size:0.62rem; color:var(--text-secondary);">${st.mood}</span>
            </div>`
            )
            .join('')}
        </div>`
      : phase === 'wickedStep'
        ? renderSceneStage(episode, sceneResolved)
        : tensionRingSvg(episode.briefing.stakeholders, teamAligned);

  mainStage.innerHTML = `
    ${renderPhasePills(phase)}
    ${renderMetersHtml(meters)}
    ${topVisual}

    <div class="story-card animate-in">
      <span class="eyebrow">${phase === 'biasRadar' ? '🔍 Bias Radar' : phase === 'wickedStep' ? '🛠️ Wicked Toolkit' : '🤝 Team Alignment'}</span>
      <p style="font-weight:700; font-size:0.9rem; color:var(--bg-indigo);">${stepData.prompt}</p>
    </div>

    ${
      feedback
        ? `
      <div class="hornbill-tip ${feedback.positive ? 'wicked-hit' : 'trap-hit'} animate-in">
        <div class="hornbill-tip-icon">${hornbillSvg(36)}</div>
        <div class="hornbill-tip-body">
          <strong>Bujang:</strong> ${feedback.text}
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
                ? `<div class="chip-row">${opt.chips.map((c) => `<span class="tradeoff-chip">${c}</span>`).join('')}</div>`
                : ''
            }
          </button>`
          )
          .join('')}
      </div>`
    }
  `;

  if (feedback) {
    document.getElementById('btnNextPhase').addEventListener('click', () => {
      playSfx('tap', progress.muted);
      session.feedback = null;
      session.phase =
        phase === 'biasRadar'
          ? 'wickedStep'
          : phase === 'wickedStep'
            ? 'alignmentStep'
            : 'debrief';
      renderEpisode();
    });
  } else {
    mainStage.querySelectorAll('[data-opt]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const opt = stepData.options[Number(btn.dataset.opt)];
        const positive = Boolean(opt.isCorrect || opt.isWicked || opt.isAligned);
        if (phase === 'biasRadar' && opt.isCorrect) session.biasSpotted = true;
        if (phase === 'wickedStep' && opt.isWicked) session.sceneResolved = true;
        if (phase === 'alignmentStep' && opt.isAligned) session.teamAligned = true;

        session.meters = {
          alignment: clampMeter(session.meters.alignment + (opt.delta?.alignment || 0)),
          trust: clampMeter(session.meters.trust + (opt.delta?.trust || 0)),
          impact: clampMeter(session.meters.impact + (opt.delta?.impact || 0)),
        };
        session.feedback = { positive, text: opt.feedback };
        playSfx(positive ? 'sape' : 'trap', progress.muted);
        renderEpisode();
      });
    });
  }
}

init();

})();
