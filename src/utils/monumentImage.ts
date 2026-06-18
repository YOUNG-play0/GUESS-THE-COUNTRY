// Préchargement des images de monuments (Wikipédia) AVANT d'afficher la
// question, pour ne pas perturber le timer. Cache localStorage partagé
// avec le composant MonumentImage (même clé).

const CACHE_KEY = 'gtc_monument_images';

function loadCache(): Record<string, string> {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}'); } catch { return {}; }
}
const cache: Record<string, string> = loadCache();
function saveCache() {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)); } catch {}
}

// Résout l'URL de la vignette via l'API REST de Wikipédia (avec cache).
// Retourne null si la page n'a pas d'image ou en cas d'échec.
export async function resolveMonumentUrl(title: string): Promise<string | null> {
  if (title in cache) return cache[title] || null;
  try {
    const page = encodeURIComponent(title.replace(/ /g, '_'));
    const r = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${page}`);
    if (r.status === 404) { cache[title] = ''; saveCache(); return null; }
    if (!r.ok) return null; // erreur transitoire : on ne met pas en cache
    const data: { thumbnail?: { source?: string } } = await r.json();
    const url = data?.thumbnail?.source || '';
    cache[title] = url;
    saveCache();
    return url || null;
  } catch {
    return null;
  }
}

// Précharge réellement l'image (décodage) avec un délai maximum.
export function preloadImage(url: string, timeoutMs: number): Promise<boolean> {
  return new Promise(resolve => {
    if (timeoutMs <= 0) { resolve(false); return; }
    const img = new Image();
    let done = false;
    const finish = (ok: boolean) => { if (!done) { done = true; resolve(ok); } };
    const to = setTimeout(() => finish(false), timeoutMs);
    img.onload = () => { clearTimeout(to); finish(true); };
    img.onerror = () => { clearTimeout(to); finish(false); };
    img.src = url;
  });
}

// Résout + précharge dans un budget total (ms). Retourne l'URL prête ou null.
export async function prepareMonumentImage(title: string, budgetMs: number): Promise<string | null> {
  const start = Date.now();
  const url = await Promise.race([
    resolveMonumentUrl(title),
    new Promise<null>(res => setTimeout(() => res(null), budgetMs)),
  ]);
  if (!url) return null;
  const remaining = budgetMs - (Date.now() - start);
  const ok = await preloadImage(url, remaining);
  return ok ? url : null;
}
