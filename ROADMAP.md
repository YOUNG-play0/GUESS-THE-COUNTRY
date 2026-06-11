# 🗺️ GUESS THE COUNTRY — Feuille de route complète

> Objectif final : publier le jeu sur le Google Play Store avec des mécaniques qui donnent envie de revenir chaque jour.
> Cocher les cases ☑️ au fur et à mesure. Ne pas sauter de phase : chaque phase prépare la suivante.

---

## 🧹 PHASE 0 — Hygiène du dépôt (30 min)

- [ ] **0.1** Retirer le topic `delete-repo` du dépôt GitHub (Settings du repo → Topics) — il signale que le repo doit être supprimé ⚠️ *Action manuelle dans l'interface GitHub (page du repo → ⚙️ à côté de « About » → champ Topics)*
- [x] **0.2** Écrire un `README.md` (description du jeu, capture d'écran, comment lancer en local)
- [x] **0.3** Corriger `package.json` : remplacer le nom générique `react-vite-tailwind` par `guess-the-country`, version `1.0.0`
- [x] **0.4** Ajouter un `.gitignore` propre (`dist/`, `node_modules/`)
- [x] **0.5** ⚠️ Nettoyer le `index.html` à la racine : il contient actuellement **tout le build minifié committé dans les sources** (sortie de vite-plugin-singlefile). Séparer clairement le code source du build
- [x] **0.6** Mettre en place un déploiement automatique GitHub Pages via **GitHub Actions** (à chaque push, le build est généré et déployé — plus jamais de build committé à la main)

---

## 🐛 PHASE 1 — Bugs et incohérences à corriger (audit du code)

### Bugs de gameplay
- [x] **1.1** ❤️ **Les vies ne servent à rien en mode Classique.** `lives: 3` est initialisé et affiché à l'écran, mais seul le mode Survie les décrémente (`useGameEngine.ts`). Décision à prendre : soit perdre une vie par erreur en Classique (et finir la partie à 0), soit masquer le compteur de vies hors Survie
- [x] **1.2** 🏛️ **Le type de question `monument` est du code mort.** Il existe dans `QuestionType` et les données (`monument: 'Eiffel Tower'`) mais `generateQuestion()` ne le génère jamais. L'implémenter (bonne question facile et visuelle) ou le retirer
- [x] **1.3** 📊 **Quitter une partie fausse les statistiques.** `handleQuitGame` → `endGame` → la partie est enregistrée dans les stats (totalGames, etc.) même si on quitte à la 1ʳᵉ question. Ne pas enregistrer les parties abandonnées avant X questions
- [x] **1.4** ⏱️ **Mode Chrono : double timer.** Le timer par question ET le chrono global tournent en même temps ; un timeout de question coupe le combo. Vérifier que c'est voulu (sinon, en Chrono, désactiver le timer par question)
- [x] **1.5** 🔢 **Survie limitée à 50 questions.** Un très bon joueur atteint la fin du tableau de questions et la partie s'arrête alors qu'il lui reste sa vie. Régénérer des questions à la volée quand on approche de la fin

### Bugs de traduction (l'app gère 8 langues dont l'arabe RTL !)
- [x] **1.6** 🌐 **Indice "capital" codé en dur en anglais** : `` `The capital is ${country.capital}` `` dans `useGameEngine.ts`. Passer par le système i18n
- [x] **1.7** 🌐 **Les noms de pays et tous les `hints` sont uniquement en anglais** *(noms FR faits ; traduction des hints → phase 2.4)* dans `countries.ts`. Un joueur français/arabe/chinois voit les réponses en anglais. Ajouter des traductions de noms de pays (au minimum FR + EN pour commencer)

### Bugs PWA / déploiement (bloquants pour le Play Store)
- [x] **1.8** 🚫 **Aucun service worker** : l'app n'est pas "installable" ni hors-ligne → refusée par PWABuilder. Ajouter `vite-plugin-pwa`
- [x] **1.9** 🔗 **`manifest.json` incohérent avec GitHub Pages** : `start_url: "/"` et icônes `/icon-192.png` alors que l'app vit sur `/GUESS-THE-COUNTRY/`. Corriger en chemins relatifs ou préfixés
- [x] **1.10** 🖼️ **Icône maskable mal configurée** : `icon-512-maskable.png` traîne à la racine (pas dans `public/`) et n'est pas déclarée dans le manifest ; les autres icônes utilisent `"purpose": "any maskable"` combiné (déconseillé). Déclarer une entrée `maskable` séparée
- [x] **1.11** 📱 **Drapeaux en emoji** : OK sur Android, mais prévoir un fallback image (flagcdn.com, déjà utilisé dans LanguageSelector) pour un rendu identique partout

---

## 🌍 PHASE 2 — Contenu (le nerf de la guerre)

- [ ] **2.1** Passer de **60 à 195 pays** (avec difficulté, capitale, continent, indices) — indispensable pour la mécanique de collection
- [ ] **2.2** Ajouter les **formes (silhouettes)** des pays manquants dans `countryShapes.ts`
- [ ] **2.3** Implémenter les questions **monument** (cf. bug 1.2) avec images
- [ ] **2.4** Traduire noms de pays + indices en français (puis autres langues progressivement)

---

## 🔥 PHASE 3 — Mécaniques d'addiction (par ordre d'impact)

### 3A. Rétention quotidienne — LE plus important
- [ ] **3.1** 🔥 **Streak de jours consécutifs** : compteur en évidence sur l'accueil, animation de flamme, "gel de streak" achetable en XP
- [ ] **3.2** 📅 **Défi du jour** : 5 questions identiques pour tous (générées depuis la date), 1 seule tentative, résultat partageable ("4/5 au GeoQuiz du jour 🌍")
- [ ] **3.3** 🎯 **3 quêtes quotidiennes** ("10 questions sur l'Afrique", "Combo x5"...) avec récompenses XP

### 3B. Collection et progression
- [ ] **3.4** 🛂 **Le Passeport** : chaque pays correctement deviné se débloque (drapeau coloré vs grisé), progression par continent "Europe 24/44"
- [ ] **3.5** 🏅 **Badges/Succès** : "Sans-faute", "Combo x10", "Maître de l'Asie", "100 parties"... avec popup de déblocage. Les stats nécessaires existent déjà dans `PlayerStats`

### 3C. Le "juice" (ressenti)
- [ ] **3.6** 🔊 **Sons** : ding croissant en pitch sur le combo, tic-tac dramatique sous 3 s, fanfare de niveau (Web Audio API, pas de fichiers lourds)
- [ ] **3.7** 📳 **Vibrations** (`navigator.vibrate`) : courte sur bonne réponse, double sur erreur
- [ ] **3.8** ⚡ **Bouton REVANCHE** en 1 tap sur l'écran Game Over + message "Record battu de justesse ! Il te manquait 40 pts"
- [ ] **3.9** 👻 **Duel fantôme** : barre de progression de ton record en temps réel pendant la partie (aucun serveur nécessaire)

### 3D. Plus tard (nécessite un backend)
- [ ] **3.10** 🔔 Notifications push ("Ta série de 6 jours expire dans 3 h !")
- [ ] **3.11** 🏆 Classement en ligne entre amis (Firebase gratuit)

---

## 📱 PHASE 4 — Préparation PWA → Android

- [ ] **4.1** Déployer la version corrigée sur GitHub Pages (HTTPS) et vérifier le score **Lighthouse PWA** (viser 100 % installable)
- [ ] **4.2** Tester l'installation "Ajouter à l'écran d'accueil" sur un vrai téléphone Android
- [ ] **4.3** Générer le package Android (`.aab`) avec **PWABuilder** (pwabuilder.com)
- [ ] **4.4** Héberger le fichier `assetlinks.json` dans `public/.well-known/` (fourni par PWABuilder) → supprime la barre d'adresse dans l'app
- [ ] **4.5** ⚠️ Conserver précieusement la **clé de signature** (.keystore) générée — sans elle, impossible de mettre à jour l'app plus tard

---

## 🏪 PHASE 5 — Publication Google Play

- [ ] **5.1** Créer le **compte développeur Google Play** (25 $ une seule fois) — prévoir une pièce d'identité pour la vérification
- [ ] **5.2** Rédiger une **politique de confidentialité** (OBLIGATOIRE, même sans collecte de données) et l'héberger sur une page du site
- [ ] **5.3** Préparer la fiche store : titre, description courte/longue, icône 512×512, bannière 1024×500, **minimum 2 captures d'écran** par format
- [ ] **5.4** Remplir le questionnaire de **classification du contenu** (jeu de quiz → tout public)
- [ ] **5.5** Remplir la section **Sécurité des données** (déclarer : aucune donnée collectée, tout est en local)
- [ ] **5.6** ⚠️ **Test fermé obligatoire** (compte personnel récent) : recruter **12 testeurs minimum pendant 14 jours** avant de pouvoir demander la publication publique. Commencer à recruter les testeurs DÈS MAINTENANT (amis, famille, groupes Discord/Reddit de testeurs)
- [ ] **5.7** Soumettre en production et attendre la validation (quelques jours)

---

## 🚀 PHASE 6 — Après le lancement

- [ ] **6.1** Suivre les stats Play Console (installations, désinstallations, crashs)
- [ ] **6.2** Répondre aux avis utilisateurs
- [ ] **6.3** Mises à jour régulières (astuce : comme c'est une TWA, le contenu web se met à jour SANS repasser par le Play Store — seules les modifs du manifest nécessitent un nouvel .aab)
- [ ] **6.4** Ajouter le backend (notifications + classement, phase 3D)
- [ ] **6.5** Envisager la monétisation douce (pas de pub agressive : ça tue la rétention)

---

## 📌 Ordre de bataille conseillé

| Semaine | Quoi |
|---------|------|
| 1 | Phase 0 + Phase 1 (bugs) |
| 2 | Phase 2 (195 pays) + début Phase 3A (streak, défi du jour) |
| 3 | Phase 3B + 3C (passeport, badges, sons) + Phase 4 (PWA) |
| 4 | Phase 5 (compte Play, fiche store, lancement du test fermé 14 jours) |
| 6 | Publication publique 🎉 |
