# 🌍 Guess The Country

Jeu de quiz géographique : devine le pays à partir de son drapeau, de sa capitale, d'un indice ou de sa silhouette. Pensé mobile-first, disponible en 8 langues (dont l'arabe en RTL), et destiné au Google Play Store via TWA.

**Jouer en ligne :** https://young-play0.github.io/GUESS-THE-COUNTRY/

## ✨ Fonctionnalités

- **4 modes de jeu** : Classique (15 questions), Survie (1 vie), Chrono (30 secondes), Carte (silhouettes de pays)
- **4 niveaux de difficulté** à débloquer en gagnant de l'XP (Facile → Expert)
- **Combos et multiplicateurs** : les bonnes réponses enchaînées multiplient les points (jusqu'à ×5)
- **Progression** : niveaux, XP, statistiques détaillées, meilleur score — tout est stocké en local, aucune donnée collectée
- **8 langues** : anglais, français, espagnol, allemand, portugais, chinois, japonais, arabe (RTL)
- **PWA** : installable sur l'écran d'accueil, fonctionne hors ligne

## 🛠️ Stack technique

React 19 · TypeScript · Vite · Tailwind CSS 4 · Framer Motion

## 🚀 Lancer en local

```bash
npm install
npm run dev       # serveur de développement (http://localhost:5173)
npm run build     # build de production dans dist/
npm run preview   # prévisualiser le build
```

## 📦 Déploiement

Le site est déployé automatiquement sur GitHub Pages par GitHub Actions à chaque push sur `main` (voir `.github/workflows/deploy.yml`). Le build n'est jamais committé dans les sources.

## 🗺️ Feuille de route

Voir [ROADMAP.md](ROADMAP.md) pour le plan complet jusqu'à la publication sur le Play Store.
