"use client";

// ─────────────────────────────────────────────
// SHARED HELPERS
// ─────────────────────────────────────────────

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const soundEnabled = localStorage.getItem("soundEnabled") !== "false";
  if (!soundEnabled) return null;
  try {
    const Cls = window.AudioContext || (window as any).webkitAudioContext;
    return Cls ? new Cls() : null;
  } catch {
    return null;
  }
}

function makeOsc(
  ctx: AudioContext,
  type: OscillatorType,
  freq: number,
  startGain: number,
  startTime: number,
  duration: number,
  dest: AudioNode,
  freqEnd?: number,
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);
  if (freqEnd !== undefined) {
    osc.frequency.exponentialRampToValueAtTime(freqEnd, startTime + duration);
  }
  gain.gain.setValueAtTime(startGain, startTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
  osc.connect(gain);
  gain.connect(dest);
  osc.start(startTime);
  osc.stop(startTime + duration);
}

// ─────────────────────────────────────────────
// 1. BASIC SYNTH CLICK (backward-compat)
// ─────────────────────────────────────────────
export function playSynthSound(
  type: OscillatorType = "triangle",
  frequency = 220,
  duration = 0.08,
) {
  const ctx = getCtx();
  if (!ctx) return;
  makeOsc(ctx, type, frequency, 0.2, ctx.currentTime, duration, ctx.destination);
}

// ─────────────────────────────────────────────
// 2. RETRO CHORD — plays 3 frequencies at once
//    Used for: hover on main CTA buttons
// ─────────────────────────────────────────────
export function playChord(rootFreq = 330) {
  const ctx = getCtx();
  if (!ctx) return;
  const t = ctx.currentTime;
  const ratios = [1, 1.25, 1.5]; // major triad
  ratios.forEach((r) => makeOsc(ctx, "triangle", rootFreq * r, 0.15, t, 0.18, ctx.destination));
}

// ─────────────────────────────────────────────
// 3. ASCENDING ARPEGGIO — musical scale sweep
//    Used for: page load, section reveal
// ─────────────────────────────────────────────
export function playArpeggio(rootFreq = 220, steps = 4) {
  const ctx = getCtx();
  if (!ctx) return;
  const t = ctx.currentTime;
  const scale = [1, 1.2, 1.5, 1.8, 2, 2.4];
  for (let i = 0; i < steps; i++) {
    makeOsc(ctx, "square", rootFreq * scale[i % scale.length], 0.12, t + i * 0.065, 0.12, ctx.destination);
  }
}

// ─────────────────────────────────────────────
// 4. POWER-UP JINGLE — ascending glide + chord
//    Used for: form submit success, achievements
// ─────────────────────────────────────────────
export function playPowerUp() {
  const ctx = getCtx();
  if (!ctx) return;
  const t = ctx.currentTime;

  // Sweep up
  makeOsc(ctx, "square", 300, 0.15, t, 0.3, ctx.destination, 900);
  // Chord hit at the end
  [660, 825, 990].forEach((f) =>
    makeOsc(ctx, "triangle", f, 0.12, t + 0.28, 0.25, ctx.destination),
  );
}

// ─────────────────────────────────────────────
// 5. RETRO CLICK — snappy 8-bit pixel tap
//    Used for: button hover, tag click
// ─────────────────────────────────────────────
export function playClick(pitch: "low" | "mid" | "high" = "mid") {
  const ctx = getCtx();
  if (!ctx) return;
  const t = ctx.currentTime;
  const freqs = { low: 160, mid: 280, high: 440 };
  makeOsc(ctx, "square", freqs[pitch], 0.15, t, 0.055, ctx.destination);
}

// ─────────────────────────────────────────────
// 6. SPAWN SOUND — upward sweep (guestbook note)
// ─────────────────────────────────────────────
export function playSpawnSound() {
  const ctx = getCtx();
  if (!ctx) return;
  const t = ctx.currentTime;
  // Main sweep
  makeOsc(ctx, "sine", 280, 0.18, t, 0.22, ctx.destination, 1400);
  // Harmonic layer
  makeOsc(ctx, "triangle", 560, 0.09, t + 0.05, 0.18, ctx.destination, 1800);
}

// ─────────────────────────────────────────────
// 7. ERROR BUZZ — descending glitch
//    Used for: form validation fail
// ─────────────────────────────────────────────
export function playError() {
  const ctx = getCtx();
  if (!ctx) return;
  const t = ctx.currentTime;
  makeOsc(ctx, "sawtooth", 300, 0.18, t, 0.12, ctx.destination, 120);
  makeOsc(ctx, "square", 250, 0.1, t + 0.08, 0.1, ctx.destination, 100);
}

// ─────────────────────────────────────────────
// 8. COIN PICKUP — iconic two-tone blip
//    Used for: stat counters, small achievements
// ─────────────────────────────────────────────
export function playCoin() {
  const ctx = getCtx();
  if (!ctx) return;
  const t = ctx.currentTime;
  makeOsc(ctx, "square", 988, 0.15, t, 0.075, ctx.destination);
  makeOsc(ctx, "square", 1318, 0.15, t + 0.08, 0.1, ctx.destination);
}

// ─────────────────────────────────────────────
// 9. MENU NAVIGATE — soft lateral blip
//    Used for: tab/filter switch, pagination
// ─────────────────────────────────────────────
export function playNavigate(direction: "left" | "right" = "right") {
  const ctx = getCtx();
  if (!ctx) return;
  const t = ctx.currentTime;
  const base = direction === "right" ? 330 : 262;
  makeOsc(ctx, "triangle", base, 0.15, t, 0.07, ctx.destination);
  makeOsc(ctx, "triangle", base * 1.5, 0.08, t + 0.05, 0.06, ctx.destination);
}

// ─────────────────────────────────────────────
// 10. KEYBOARD TYPE — subtle mechanical press
//    Used for: typing in input fields
// ─────────────────────────────────────────────
export function playKeypress() {
  const ctx = getCtx();
  if (!ctx) return;
  const t = ctx.currentTime;
  // Short noise-like burst via high-freq square
  const freq = 800 + Math.random() * 400;
  makeOsc(ctx, "square", freq, 0.08, t, 0.03, ctx.destination);
}

// ─────────────────────────────────────────────
// 11. DRAG START / DRAG END
//    Used for: guestbook note drag
// ─────────────────────────────────────────────
export function playDragStart() {
  const ctx = getCtx();
  if (!ctx) return;
  makeOsc(ctx, "triangle", 220, 0.12, ctx.currentTime, 0.1, ctx.destination, 330);
}

export function playDragEnd() {
  const ctx = getCtx();
  if (!ctx) return;
  const t = ctx.currentTime;
  makeOsc(ctx, "triangle", 440, 0.15, t, 0.05, ctx.destination, 330);
  makeOsc(ctx, "triangle", 330, 0.1, t + 0.05, 0.08, ctx.destination);
}

// ─────────────────────────────────────────────
// 12. HOVER WHOOSH — airy swipe
//    Used for: card hover enter
// ─────────────────────────────────────────────
export function playWhoosh() {
  const ctx = getCtx();
  if (!ctx) return;
  makeOsc(ctx, "sine", 600, 0.1, ctx.currentTime, 0.12, ctx.destination, 200);
}
