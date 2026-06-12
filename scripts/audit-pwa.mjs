// Audit d'installabilité PWA du build (critères Lighthouse + PWABuilder).
//
// Usage : npm run build && node scripts/audit-pwa.mjs
//
// Remplace un vrai run Lighthouse quand Chrome n'est pas disponible :
// vérifie le manifest (champs requis pour l'installation et le Play Store),
// les icônes (dimensions réelles lues dans l'en-tête PNG), le service
// worker et les balises de index.html. Sort avec un code ≠ 0 si un
// critère bloquant manque.
import { readFileSync, existsSync } from 'fs';
import path from 'path';

const DIST = 'dist';
let errors = 0;
let warnings = 0;

const ok = m => console.log(`  ✅ ${m}`);
const ko = m => { console.log(`  ❌ ${m}`); errors++; };
const warn = m => { console.log(`  ⚠️  ${m}`); warnings++; };

function pngSize(file) {
  const buf = readFileSync(file);
  // IHDR : largeur/hauteur en big-endian aux octets 16-23
  return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
}

console.log('— Manifest —');
const manifestPath = path.join(DIST, 'manifest.webmanifest');
if (!existsSync(manifestPath)) {
  ko('manifest.webmanifest absent du build');
  process.exit(1);
}
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

for (const field of ['name', 'short_name', 'start_url', 'display', 'icons', 'theme_color', 'background_color']) {
  manifest[field] ? ok(`${field}`) : ko(`champ requis manquant : ${field}`);
}
for (const field of ['id', 'scope', 'description', 'orientation', 'lang', 'categories']) {
  manifest[field] ? ok(`${field} (qualité store)`) : warn(`champ recommandé manquant : ${field}`);
}
manifest.display === 'standalone' || manifest.display === 'fullscreen'
  ? ok(`display: ${manifest.display}`)
  : ko(`display doit être standalone/fullscreen (actuel : ${manifest.display})`);
if (manifest.screenshots?.length) ok('screenshots présents');
else warn('pas de screenshots dans le manifest (recommandé pour la fiche d\'installation enrichie)');
if (manifest.shortcuts?.length) ok(`shortcuts (${manifest.shortcuts.length})`);
else warn('pas de shortcuts (recommandé par PWABuilder)');

console.log('— Icônes —');
const icons = manifest.icons ?? [];
const has192 = icons.some(i => i.sizes?.includes('192x192') && (i.purpose ?? 'any').includes('any'));
const has512 = icons.some(i => i.sizes?.includes('512x512') && (i.purpose ?? 'any').includes('any'));
const hasMaskable = icons.some(i => (i.purpose ?? '').includes('maskable'));
has192 ? ok('icône 192×192 purpose any') : ko('icône 192×192 (purpose any) requise');
has512 ? ok('icône 512×512 purpose any') : ko('icône 512×512 (purpose any) requise');
hasMaskable ? ok('icône maskable déclarée') : warn('pas d\'icône maskable');
icons.some(i => (i.purpose ?? '').includes('any') && (i.purpose ?? '').includes('maskable'))
  ? warn('purpose "any maskable" combiné — déconseillé')
  : ok('purposes any/maskable séparés');

for (const icon of icons) {
  const file = path.join(DIST, icon.src);
  if (!existsSync(file)) { ko(`fichier icône absent du build : ${icon.src}`); continue; }
  const { w, h } = pngSize(file);
  const expected = icon.sizes.split('x').map(Number);
  w === expected[0] && h === expected[1]
    ? ok(`${icon.src} fait réellement ${w}×${h}`)
    : ko(`${icon.src} déclaré ${icon.sizes} mais fait ${w}×${h}`);
}

console.log('— Service worker —');
existsSync(path.join(DIST, 'sw.js')) ? ok('sw.js présent') : ko('sw.js absent');
existsSync(path.join(DIST, 'registerSW.js')) ? ok('registerSW.js présent') : warn('registerSW.js absent');
const html = readFileSync(path.join(DIST, 'index.html'), 'utf8');
html.includes('registerSW') || html.includes('serviceWorker')
  ? ok('enregistrement du SW référencé dans index.html')
  : ko('aucun enregistrement de service worker dans index.html');

console.log('— index.html —');
html.includes('name="viewport"') ? ok('meta viewport') : ko('meta viewport manquante');
html.includes('name="theme-color"') ? ok('meta theme-color') : warn('meta theme-color manquante');
html.includes('manifest.webmanifest') ? ok('lien manifest injecté') : ko('lien manifest absent');
html.includes('apple-touch-icon') ? ok('apple-touch-icon (iOS)') : warn('apple-touch-icon manquant');

console.log('— Divers —');
existsSync(path.join(DIST, '.well-known/assetlinks.json'))
  ? ok('.well-known/assetlinks.json présent (TWA sans barre d\'adresse)')
  : warn('.well-known/assetlinks.json absent (requis en phase 4.4)');

console.log(`\nRésultat : ${errors} erreur(s) bloquante(s), ${warnings} avertissement(s).`);
console.log(errors === 0
  ? '✅ Le build remplit les critères d\'installabilité PWA (HTTPS assuré par GitHub Pages).'
  : '❌ Corriger les erreurs ci-dessus avant de passer par PWABuilder.');
process.exit(errors ? 1 : 0);
