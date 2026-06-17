import { useEffect, useState } from 'react';

// Détecte le sens de défilement pour masquer/afficher la BottomNav
// (façon YouTube/Instagram). Chaque écran ayant son propre conteneur
// `overflow-y-auto`, on écoute le scroll en phase de CAPTURE sur window :
// l'événement scroll ne « bouillonne » pas, mais il est bien capté ainsi
// quel que soit le conteneur scrollé.
//
// resetKey : change à chaque changement d'écran → la barre réapparaît.
export function useHideOnScroll(resetKey?: unknown, threshold = 8): boolean {
  const [hidden, setHidden] = useState(false);

  // Toujours réafficher la barre quand on change d'écran
  useEffect(() => {
    setHidden(false);
  }, [resetKey]);

  useEffect(() => {
    let lastY = 0;
    let lastEl: EventTarget | null = null;

    const onScroll = (e: Event) => {
      const el = e.target as (HTMLElement | Document | null);
      // Scroll natif du document (body) OU d'un conteneur interne
      let y: number;
      if (!el || el === document || el === document.documentElement || el === document.body) {
        y = window.scrollY || document.documentElement.scrollTop || 0;
      } else if (typeof (el as HTMLElement).scrollTop === 'number') {
        y = (el as HTMLElement).scrollTop;
      } else {
        return;
      }

      // Nouveau conteneur scrollé : on réinitialise la référence
      if (el !== lastEl) {
        lastEl = el;
        lastY = y;
      }

      // Tout en haut → barre toujours visible
      if (y <= 4) {
        setHidden(false);
        lastY = y;
        return;
      }

      const dy = y - lastY;
      if (Math.abs(dy) < threshold) return; // ignore les micro-mouvements
      setHidden(dy > 0); // scroll vers le bas = cacher, vers le haut = montrer
      lastY = y;
    };

    window.addEventListener('scroll', onScroll, { capture: true, passive: true });
    return () => window.removeEventListener('scroll', onScroll, { capture: true } as EventListenerOptions);
  }, [threshold]);

  return hidden;
}
