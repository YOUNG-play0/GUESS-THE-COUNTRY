// Sons du jeu, générés en Web Audio API (aucun fichier audio).
// L'AudioContext est créé paresseusement au premier son (les navigateurs
// exigent un geste utilisateur préalable — toujours le cas ici : on joue
// un son après un clic ou pendant une partie déjà lancée au clic).

const STORAGE_KEY = 'gtc_sound';

let enabled = true;
try {
  enabled = (localStorage.getItem(STORAGE_KEY) ?? '1') === '1';
} catch {}

let ctx: AudioContext | null = null;

export function isSoundEnabled(): boolean {
  return enabled;
}

export function setSoundEnabled(on: boolean) {
  enabled = on;
  try {
    localStorage.setItem(STORAGE_KEY, on ? '1' : '0');
  } catch {}
}

function getCtx(): AudioContext | null {
  if (!enabled) return null;
  try {
    if (!ctx) {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    return ctx;
  } catch {
    return null;
  }
}

function tone(freq: number, startDelay: number, duration: number, type: OscillatorType = 'sine', volume = 0.12, freqEnd?: number) {
  const ac = getCtx();
  if (!ac) return;
  const t0 = ac.currentTime + startDelay;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (freqEnd) osc.frequency.exponentialRampToValueAtTime(freqEnd, t0 + duration);
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(volume, t0 + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(gain).connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

/** Ding de bonne réponse : le pitch monte d'un demi-ton par maillon de combo */
export function playCorrect(combo = 0) {
  const base = 520 * Math.pow(1.0595, Math.min(combo, 12));
  tone(base, 0, 0.12, 'sine', 0.14);
  tone(base * 1.5, 0.08, 0.18, 'sine', 0.12);
}

export function playWrong() {
  tone(190, 0, 0.22, 'square', 0.08, 110);
}

/** Tic-tac dramatique des dernières secondes */
export function playTick() {
  tone(1050, 0, 0.045, 'square', 0.05);
}

/** Fanfare : niveau gagné, record battu, succès débloqué */
export function playFanfare() {
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((f, i) => tone(f, i * 0.11, i === notes.length - 1 ? 0.45 : 0.16, 'triangle', 0.14));
}
