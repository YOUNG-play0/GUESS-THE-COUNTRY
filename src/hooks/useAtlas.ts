import { useState, useCallback, useRef } from 'react';
import { AtlasExpression, AtlasSituation, atlasLevel, getAtlasPhrase, SITUATION_EXPRESSION } from '../data/atlas';
import { speakAtlas } from '../utils/atlasVoice';

export interface AtlasMessage {
  id: number;
  text: string;
  expression: AtlasExpression;
}

const VISIBLE_KEY = 'gtc_atlas_visible';

function loadVisible(): boolean {
  try { return (localStorage.getItem(VISIBLE_KEY) ?? '1') === '1'; } catch { return true; }
}

// Contrôleur d'ATLAS : niveau (suit le joueur), message courant, visibilité.
export function useAtlas(playerLevel: number) {
  const level = atlasLevel(playerLevel);
  const [visible, setVisible] = useState(loadVisible);
  const [message, setMessage] = useState<AtlasMessage | null>(null);
  const seq = useRef(0);

  const say = useCallback((situation: AtlasSituation) => {
    seq.current += 1;
    const text = getAtlasPhrase(situation, level);
    setMessage({ id: seq.current, text, expression: SITUATION_EXPRESSION[situation] });
    speakAtlas(text);
  }, [level]);

  // Phrase libre (réactions 1v1 imposées par le scénario)
  const sayText = useCallback((text: string, expression: AtlasExpression = 'normal') => {
    seq.current += 1;
    setMessage({ id: seq.current, text, expression });
    speakAtlas(text);
  }, []);

  const clear = useCallback(() => setMessage(null), []);

  const toggleVisible = useCallback(() => {
    setVisible(v => {
      const next = !v;
      try { localStorage.setItem(VISIBLE_KEY, next ? '1' : '0'); } catch {}
      return next;
    });
  }, []);

  return { level, visible, toggleVisible, message, say, sayText, clear };
}
