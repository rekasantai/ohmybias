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
export function playSfx(kind, muted) {
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
