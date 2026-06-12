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
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setBroken(false);
    setLoaded(false);
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
    // ⚠️ Aucun texte ici (pas de alt, pas de title) : pendant le chargement,
    // le navigateur afficherait le nom du monument et révélerait la réponse.
    // Tant que l'image n'est pas chargée : spinner neutre uniquement.
    <div className="relative mx-auto mb-4" style={{ maxWidth: 'min(280px, 70vw)' }}>
      {!loaded && (
        <div className="flex items-center justify-center rounded-2xl border border-white/10 bg-white/5" style={{ height: 140 }}>
          <span
            aria-hidden
            className="w-7 h-7 rounded-full border-2 border-white/15 border-t-indigo-400 animate-spin"
          />
        </div>
      )}
      <img
        src={src}
        alt=""
        aria-hidden
        onLoad={() => setLoaded(true)}
        onError={() => setBroken(true)}
        className={`mx-auto rounded-2xl border border-white/10 shadow-2xl object-cover ${loaded ? '' : 'absolute inset-0 opacity-0 pointer-events-none'}`}
        style={{ maxWidth: '100%', maxHeight: 180 }}
      />
    </div>
  );
}
