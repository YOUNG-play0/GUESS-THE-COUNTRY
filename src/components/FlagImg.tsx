import { useState, type CSSProperties } from 'react';

// Drapeau : image flagcdn en priorité (rendu identique partout — les emojis
// drapeaux s'affichent en codes « FR », « DE » sur Windows), repli sur
// l'emoji si l'image ne charge pas (hors-ligne, CDN bloqué...).
export default function FlagImg({ code, emoji, cdnWidth = 80, emojiSize = 24, className, style }: {
  code: string;
  emoji: string;
  cdnWidth?: 80 | 160 | 320;
  emojiSize?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const [failedCode, setFailedCode] = useState<string | null>(null);
  if (!code || failedCode === code) {
    return <span className="select-none" style={{ fontSize: emojiSize }}>{emoji}</span>;
  }
  return (
    <img
      src={`https://flagcdn.com/w${cdnWidth}/${code}.png`}
      alt="Flag"
      className={className}
      style={style}
      onError={() => setFailedCode(code)}
    />
  );
}
