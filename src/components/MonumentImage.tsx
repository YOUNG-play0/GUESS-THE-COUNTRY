import { useEffect, useState } from 'react';

// Image d'un monument via l'API REST de Wikipédia (CORS ouvert, redirections
// suivies). Affichage purement décoratif : en cas d'échec (hors-ligne, page
// introuvable), le composant ne rend rien et la question reste jouable avec
// la carte texte. Les URLs résolues sont mémorisées dans localStorage.
const CACHE_KEY = 'gtc_monument_images';

function loadCache(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
  } catch {
    return {};
  }
}

const cache: Record<string, string> = loadCache();

function saveCache() {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {}
}

export default function MonumentImage({ title }: { title: string }) {
  const [src, setSrc] = useState<string | null>(() => cache[title] || null);
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    setBroken(false);
    if (cache[title] !== undefined) {
      setSrc(cache[title] || null);
      return;
    }
    let cancelled = false;
    const page = encodeURIComponent(title.replace(/ /g, '_'));
    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${page}`)
      .then(r => {
        if (r.ok) return r.json();
        if (r.status === 404) return {}; // page inexistante : cache négatif
        throw new Error(String(r.status));
      })
      .then((data: { thumbnail?: { source?: string } }) => {
        const url = data?.thumbnail?.source || '';
        cache[title] = url;
        saveCache();
        if (!cancelled) setSrc(url || null);
      })
      .catch(() => {
        // Échec réseau : pas de cache négatif, on retentera plus tard
        if (!cancelled) setSrc(null);
      });
    return () => {
      cancelled = true;
    };
  }, [title]);

  if (!src || broken) return null;
  return (
    <img
      src={src}
      alt={title}
      onError={() => setBroken(true)}
      className="mx-auto mb-4 rounded-2xl border border-white/10 shadow-2xl object-cover"
      style={{ maxWidth: 'min(280px, 70vw)', maxHeight: 180 }}
    />
  );
}
