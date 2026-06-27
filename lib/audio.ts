"use client";

export function playSynthSound(
  type: "sine" | "square" | "sawtooth" | "triangle" = "triangle",
  frequency = 220,
  duration = 0.08,
) {
  if (typeof window === "undefined") return;

  // Retrieve setting, default to true if not set
  const soundEnabled = localStorage.getItem("soundEnabled") !== "false";
  if (!soundEnabled) return;

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const audioCtx = new AudioContextClass();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);

    // Retro click envelope: Instant attack, exponential decay
    gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      audioCtx.currentTime + duration,
    );

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (error) {
    console.warn("Failed to play sound:", error);
  }
}

export function playSpawnSound() {
  if (typeof window === "undefined") return;

  const soundEnabled = localStorage.getItem("soundEnabled") !== "false";
  if (!soundEnabled) return;

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const audioCtx = new AudioContextClass();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.type = "sine";
    osc.frequency.setValueAtTime(300, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.15);

    gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.15);
  } catch (error) {
    console.warn("Failed to play spawn sound:", error);
  }
}
