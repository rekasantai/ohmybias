import { EPISODES } from './data/episodes.js';
import { GLOSSARY } from './data/glossary.js';
import { loadProgress, saveProgress, resetProgress, clampMeter, getFacilitatorRank } from './state.js';
import { playSfx } from './audio.js';
import {
  uiIconSvg,
  hornbillSvg,
  puaDividerSvg,
  avatarSvg,
  episodeSceneSvg,
  tensionRingSvg,
  biasBadgeSvg,
  scoreRingSvg,
  biasRadarSvg,
  episodeEmblemSvg,
} from './svg-art.js';

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
