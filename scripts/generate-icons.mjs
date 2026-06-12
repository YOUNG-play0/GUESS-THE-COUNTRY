// Régénère les icônes PWA dans public/ à partir des fichiers sources.
//
// Usage : node scripts/generate-icons.mjs
//
// Contexte : les icônes historiques étaient des JPEG renommés en .png
// (et l'icône maskable faisait 1254×1254 au lieu de 512×512), ce que
// Lighthouse et PWABuilder rejettent. Ce script produit de vrais PNG
// aux dimensions déclarées dans le manifest, optimisés pour le precache.
import sharp from 'sharp';

const BG = '#0a0a1a'; // fond du thème, utilisé si l'image source n'est pas carrée

async function emit(src, size, dest) {
  await sharp(src)
    .resize(size, size, { fit: 'cover', background: BG })
    .png({ compressionLevel: 9, palette: true })
    .toFile(dest);
  console.log(`✅ ${dest} (${size}×${size})`);
}

// Icônes "any" : générées depuis le master le plus défini disponible
await emit('assets/icon-master.png', 192, 'public/icon-192.png');
await emit('assets/icon-master.png', 512, 'public/icon-512.png');
// Icône maskable : le master maskable a déjà la zone de sécurité intégrée
await emit('assets/icon-maskable-master.png', 512, 'public/icon-512-maskable.png');
