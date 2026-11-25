/**
 * Enhanced inline SVG generators with gradients, Borneo silhouettes,
 * expressive avatars, reactive Sarawakian dioramas, tension rings, and badges.
 */

export function hornbillSvg(size = 56) {
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

export function puaDividerSvg() {
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

export function avatarSvg({ skin = '#D89B6C', hair = '#1E1B18', shirt = '#2D6A4F', hat = 'none' }) {
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
export function episodeSceneSvg(epId, resolved = false) {
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

export function tensionRingSvg(stakeholders, aligned = false) {
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

export function biasBadgeSvg(epNumber, unlocked = true) {
  const icons = ['⚓', '🐑', '💸', '📺', '🛡️'];
  const fill = unlocked ? '#1B2A4A' : '#E2D8C0';
  const stroke = unlocked ? '#D9A441' : '#BFB49A';
  return `
  <svg width="42" height="48" viewBox="0 0 42 48" fill="none" aria-hidden="true">
    <path d="M21 2L38 9V25C38 35 29 43 21 46C13 43 4 35 4 25V9L21 2Z" fill="${fill}" stroke="${stroke}" stroke-width="2.2"/>
    <text x="21" y="29" text-anchor="middle" font-size="16">${unlocked ? icons[epNumber - 1] || '🦅' : '🔒'}</text>
  </svg>`;
}
