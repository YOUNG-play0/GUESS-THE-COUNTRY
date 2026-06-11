// Génère src/data/countryShapes.ts à partir d'un GeoJSON mondial.
//
// Usage :
//   curl -L -o /tmp/world.geojson https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson
//   node scripts/generate-shapes.mjs /tmp/world.geojson
//
// Chaque silhouette est normalisée dans une viewBox 0 0 100 100 (utilisée
// telle quelle par GameScreen) et simplifiée (Douglas-Peucker) pour rester
// légère. Les pays trop petits pour donner une silhouette lisible (atolls)
// sont volontairement exclus : le mode Carte ne propose que les pays présents
// dans countryShapes.
import { readFileSync, writeFileSync } from 'fs';

const geojsonPath = process.argv[2] ?? '/tmp/world.geojson';
const world = JSON.parse(readFileSync(geojsonPath, 'utf8'));

// Liste des pays du jeu : name est la clé, code sert à matcher le GeoJSON.
const countriesTs = readFileSync('src/data/countries.ts', 'utf8');
const games = [...countriesTs.matchAll(/name: '((?:[^'\\]|\\.)*)', nameFr: '(?:[^'\\]|\\.)*', code: '([A-Z]{2})'/g)]
  .map(m => ({ name: m[1].replace(/\\'/g, "'"), code: m[2] }));
if (games.length !== 195) throw new Error(`195 pays attendus, ${games.length} trouvés`);

// Le dataset Natural Earth a des ISO_A2 manquants pour certains pays.
const NAME_FALLBACK = { FR: 'France', NO: 'Norway' };

const byCode = new Map();
const byName = new Map();
for (const ft of world.features) {
  byCode.set(ft.properties['ISO3166-1-Alpha-2'], ft);
  byName.set(ft.properties.name, ft);
}

// --- Géométrie ---------------------------------------------------------

function rings(geometry) {
  // Anneaux extérieurs uniquement (pas les trous)
  if (geometry.type === 'Polygon') return [geometry.coordinates[0]];
  if (geometry.type === 'MultiPolygon') return geometry.coordinates.map(p => p[0]);
  throw new Error(`géométrie inattendue : ${geometry.type}`);
}

// Décale les longitudes pour les pays à cheval sur l'antiméridien (Russie, Fidji…)
function unwrap(ringsList) {
  const lons = ringsList.flat().map(p => p[0]);
  if (Math.max(...lons) - Math.min(...lons) > 180) {
    return ringsList.map(r => r.map(([x, y]) => [x < 0 ? x + 360 : x, y]));
  }
  return ringsList;
}

function ringArea(r) {
  let a = 0;
  for (let i = 0; i < r.length - 1; i++) a += r[i][0] * r[i + 1][1] - r[i + 1][0] * r[i][1];
  return Math.abs(a / 2);
}

function bbox(pts) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const [x, y] of pts) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
  return { x0, y0, x1, y1, diag: Math.hypot(x1 - x0, y1 - y0) };
}

// Douglas-Peucker
function simplify(ring, tol) {
  const keep = new Array(ring.length).fill(false);
  keep[0] = keep[ring.length - 1] = true;
  const stack = [[0, ring.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    if (b - a < 2) continue;
    const [ax, ay] = ring[a], [bx, by] = ring[b];
    const dx = bx - ax, dy = by - ay;
    const len2 = dx * dx + dy * dy;
    let maxD = -1, maxI = -1;
    for (let i = a + 1; i < b; i++) {
      const [px, py] = ring[i];
      let d;
      if (len2 === 0) d = Math.hypot(px - ax, py - ay);
      else {
        const t = ((px - ax) * dx + (py - ay) * dy) / len2;
        d = Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
      }
      if (d > maxD) { maxD = d; maxI = i; }
    }
    if (maxD > tol) { keep[maxI] = true; stack.push([a, maxI], [maxI, b]); }
  }
  return ring.filter((_, i) => keep[i]);
}

// --- Construction des silhouettes --------------------------------------

const MAX_POINTS = 130;       // budget de points par pays
const AREA_RATIO = 0.03;      // île gardée si ≥ 3 % de la plus grande
const BBOX_GROWTH = 2.2;      // … et si elle n'éloigne pas trop le cadre
const MIN_DIAG_DEG = 0.05;    // silhouette illisible en dessous (atolls)

const shapes = {};
const skipped = [];

for (const { name, code } of games) {
  const ft = byCode.get(code) ?? byName.get(NAME_FALLBACK[code]);
  if (!ft) { skipped.push(`${name} (absent du GeoJSON)`); continue; }

  let rs = unwrap(rings(ft.geometry));
  // Projection équirectangulaire centrée sur le pays (x corrigé par cos(lat))
  const lats = rs.flat().map(p => p[1]);
  const k = Math.cos(((Math.min(...lats) + Math.max(...lats)) / 2) * Math.PI / 180);
  rs = rs.map(r => r.map(([x, y]) => [x * k, -y]));

  // Sélection des polygones : le plus grand + les îles proches assez grandes
  rs.sort((a, b) => ringArea(b) - ringArea(a));
  const mainArea = ringArea(rs[0]);
  const mainDiag = bbox(rs[0]).diag;
  const kept = [rs[0]];
  for (const r of rs.slice(1)) {
    if (ringArea(r) < mainArea * AREA_RATIO) break;
    const merged = bbox(kept.flat().concat(r));
    if (merged.diag <= mainDiag * BBOX_GROWTH) kept.push(r);
  }

  const box = bbox(kept.flat());
  if (box.diag < MIN_DIAG_DEG) { skipped.push(`${name} (trop petit)`); continue; }

  // Simplification avec tolérance croissante jusqu'à tenir le budget
  let tol = box.diag / 250;
  let simplified;
  for (let i = 0; i < 12; i++) {
    simplified = kept.map(r => simplify(r, tol)).filter(r => r.length >= 4);
    const total = simplified.reduce((s, r) => s + r.length, 0);
    if (total <= MAX_POINTS && simplified.length > 0) break;
    tol *= 1.5;
  }
  if (!simplified.length) { skipped.push(`${name} (simplifié à néant)`); continue; }

  // Normalisation dans 100×100 avec marge, aspect préservé
  const M = 4;
  const nb = bbox(simplified.flat());
  const scale = (100 - 2 * M) / Math.max(nb.x1 - nb.x0, nb.y1 - nb.y0);
  const ox = (100 - (nb.x1 - nb.x0) * scale) / 2;
  const oy = (100 - (nb.y1 - nb.y0) * scale) / 2;
  const fmt = v => (Math.round(v * 10) / 10).toString();

  const path = simplified.map(r => {
    const pts = r.map(([x, y]) => [ox + (x - nb.x0) * scale, oy + (y - nb.y0) * scale]);
    return 'M' + pts.map(([x, y]) => `${fmt(x)},${fmt(y)}`).join('L') + 'Z';
  }).join(' ');

  shapes[name] = path;
}

// --- Écriture -----------------------------------------------------------

const esc = s => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
const lines = [
  '// ⚠️ Fichier généré — ne pas éditer à la main.',
  '// Régénération : voir scripts/generate-shapes.mjs',
  '// Silhouettes réelles (Natural Earth), viewBox 0 0 100 100.',
  'export const countryShapes: Record<string, string> = {',
  ...games.filter(g => shapes[g.name]).map(g => `  '${esc(g.name)}': '${shapes[g.name]}',`),
  '};',
  '',
];
writeFileSync('src/data/countryShapes.ts', lines.join('\n'));

console.log(`${Object.keys(shapes).length} silhouettes générées, ${skipped.length} pays exclus :`);
for (const s of skipped) console.log('  -', s);
