// Voix d'ATLAS via la Web Speech API (gratuit, natif Android Chrome).
// Toggle indépendant du son du jeu. Choix de la MEILLEURE voix dispo :
// FR masculine > FR (toute) > EN. Phrases courtes (≤ ~2 s), pas de
// chevauchement (la phrase précédente est coupée).

const VOICE_KEY = 'gtc_atlas_voice';

let enabled = true;
try { enabled = (localStorage.getItem(VOICE_KEY) ?? '1') === '1'; } catch {}

let chosen: SpeechSynthesisVoice | null = null;
let voicesReady = false;

function supported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

// Score d'une voix : on privilégie le français masculin, puis FR, puis EN,
// avec un bonus pour les voix « premium / natural / enhanced » de l'appareil.
function scoreVoice(v: SpeechSynthesisVoice): number {
  const lang = (v.lang || '').toLowerCase();
  const name = (v.name || '').toLowerCase();
  let s = 0;
  if (lang.startsWith('fr')) s += 100;
  else if (lang.startsWith('en')) s += 20;
  else return -1; // ni FR ni EN → on évite
  // Voix masculines connues (FR + génériques)
  if (/(thomas|paul|nicolas|henri|guillaume|daniel|male|homme|google français)/i.test(name)) s += 30;
  if (/(femme|female|amelie|amélie|audrey|marie|julie|virginie)/i.test(name)) s -= 15;
  // Qualité (voix « naturelles » des OS récents)
  if (/(natural|enhanced|premium|neural|google|siri)/i.test(name)) s += 10;
  if (v.localService) s += 3;
  return s;
}

function pickVoice() {
  if (!supported()) return;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return;
  let best: SpeechSynthesisVoice | null = null;
  let bestScore = -Infinity;
  for (const v of voices) {
    const sc = scoreVoice(v);
    if (sc > bestScore) { bestScore = sc; best = v; }
  }
  chosen = bestScore > -1 ? best : voices[0];
  voicesReady = true;
}

if (supported()) {
  pickVoice();
  window.speechSynthesis.onvoiceschanged = pickVoice;
}

export function isVoiceEnabled(): boolean {
  return enabled;
}

export function setVoiceEnabled(on: boolean) {
  enabled = on;
  try { localStorage.setItem(VOICE_KEY, on ? '1' : '0'); } catch {}
  if (!on && supported()) window.speechSynthesis.cancel();
}

// Nettoie + raccourcit le texte pour rester sous ~2 s de lecture.
// (≈ 0,9 mots/seconde de marge → on coupe autour de 14 mots / 90 caractères,
// proprement à la fin d'une phrase si possible.)
function trimForSpeech(text: string): string {
  let s = text.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '').replace(/\s+/g, ' ').trim();
  if (!s) return '';
  // Garde la première phrase si le texte est long
  const firstSentence = s.split(/(?<=[.!?])\s/)[0];
  if (firstSentence && firstSentence.length <= 110) s = firstSentence;
  const MAX = 90;
  if (s.length > MAX) {
    const cut = s.slice(0, MAX);
    const lastSpace = cut.lastIndexOf(' ');
    s = (lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trim();
  }
  return s;
}

// ATLAS parle. Coupe toujours la phrase précédente (pas de chevauchement).
export function speakAtlas(text: string) {
  if (!enabled || !supported() || !text) return;
  try {
    if (!voicesReady) pickVoice();
    const clean = trimForSpeech(text);
    if (!clean) return;
    window.speechSynthesis.cancel(); // anti-chevauchement
    const u = new SpeechSynthesisUtterance(clean);
    u.lang = chosen?.lang || 'fr-FR';
    u.rate = 1.02;  // un poil rapide → phrases vives, pas traînantes
    u.pitch = 0.9;  // légèrement bas (voix masculine)
    u.volume = 1;
    if (chosen) u.voice = chosen;
    window.speechSynthesis.speak(u);
  } catch {}
}

export function stopAtlasVoice() {
  if (supported()) {
    try { window.speechSynthesis.cancel(); } catch {}
  }
}
