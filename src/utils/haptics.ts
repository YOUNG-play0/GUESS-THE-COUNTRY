// Retours haptiques (no-op si l'appareil ne vibre pas).
function vibrate(pattern: number | number[]) {
  try {
    navigator.vibrate?.(pattern);
  } catch {}
}

export const haptics = {
  /** Courte sur bonne réponse */
  correct: () => vibrate(15),
  /** Double sur erreur ou temps écoulé */
  wrong: () => vibrate([50, 30, 50]),
  /** Succès, record */
  celebrate: () => vibrate([20, 40, 20, 40, 60]),
};
