// Voix d'ATLAS via la Web Speech API (gratuit, natif Android Chrome).
// Toggle indépendant du son du jeu (clé localStorage distincte).

const VOICE_KEY = 'gtc_atlas_voice';

let enabled = true;
try { enabled = (localStorage.getItem(VOICE_KEY) ?? '1') === '1'; } catch {}

let frVoice: SpeechSynthesisVoice | null = null;
let voicesReady = false;

function supported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

// Choisit une voix française masculine si possible
function pickVoice() {
  if (!supported()) return;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return;
  const fr = voices.filter(v => v.lang?.toLowerCase().startsWith('fr'));
  const male = fr.find(v => /(thomas|paul|nicolas|henri|male|homme|guillaume)/i.test(v.name));
  frVoice = male || fr[0] || null;
  voicesReady = true;
}

if (supported()) {
  pickVoice();
  // Les voix arrivent souvent de façon asynchrone
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

// ATLAS parle à voix haute. On retire les emojis pour une lecture propre.
export function speakAtlas(text: string) {
  if (!enabled || !supported() || !text) return;
  try {
    if (!voicesReady) pickVoice();
    const clean = text.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '').trim();
    if (!clean) return;
    window.speechSynthesis.cancel(); // coupe la phrase précédente
    const u = new SpeechSynthesisUtterance(clean);
    u.lang = 'fr-FR';
    u.rate = 0.9;
    u.pitch = 0.85; // légèrement bas (voix masculine)
    if (frVoice) u.voice = frVoice;
    window.speechSynthesis.speak(u);
  } catch {}
}

export function stopAtlasVoice() {
  if (supported()) {
    try { window.speechSynthesis.cancel(); } catch {}
  }
}
