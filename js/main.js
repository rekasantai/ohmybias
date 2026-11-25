import { EPISODES } from './data/episodes.js';
import { GLOSSARY } from './data/glossary.js';
import { loadProgress, saveProgress, resetProgress, clampMeter, getFacilitatorRank } from './state.js';
import { playSfx } from './audio.js';
import { hornbillSvg, puaDividerSvg, avatarSvg, episodeSceneSvg, tensionRingSvg, biasBadgeSvg } from './svg-art.js';

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
