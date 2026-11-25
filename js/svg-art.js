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
export function uiIconSvg(name, size = 18) {
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
export function hornbillSvg(size = 56, mood = 'neutral') {
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
export function puaDividerSvg() {
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
export function avatarSvg({ skin = '#D89B6C', hair = '#1E1B18', shirt = '#2D6A4F', hat = 'none' } = {}, mood = '') {
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
export function episodeSceneSvg(epId, resolved = false) {
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
export function tensionRingSvg(stakeholders, aligned = false) {
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
export function biasBadgeSvg(epNumber, unlocked = true, size = 44) {
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
export function scoreRingSvg(score) {
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
export function biasRadarSvg(spotted = false) {
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
export function episodeEmblemSvg(epNumber) {
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
