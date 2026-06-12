# 📦 Publication sur le Google Play Store (PWA → TWA)

Guide pas-à-pas pour transformer la PWA en application Android (`.aab`) avec
PWABuilder et la publier. Couvre les tâches **4.3, 4.4 et 4.5** de la ROADMAP.

## Prérequis (déjà en place ✅)

- PWA installable : manifest complet, service worker, icônes PNG valides
  (vérifiable à tout moment : `npm run build && node scripts/audit-pwa.mjs`)
- Site déployé en HTTPS : https://young-play0.github.io/GUESS-THE-COUNTRY/
- `public/.well-known/assetlinks.json` servi par le site (voir étape 3)

Avant de commencer, vérifie sur un téléphone Android (Chrome) que le site
propose bien « Ajouter à l'écran d'accueil » avec l'icône du jeu.

---

## 1. Générer le package Android avec PWABuilder (tâche 4.3)

1. Ouvre **https://www.pwabuilder.com** et colle l'URL du site :
   `https://young-play0.github.io/GUESS-THE-COUNTRY/`
2. Lance l'analyse : le rapport doit être vert (manifest + service worker).
   Les avertissements « screenshots » sont optionnels.
3. Clique **Package for stores → Android**.
4. Remplis les options du package :
   - **Package ID** : `io.github.young_play0.guessthecountry`
     ⚠️ Définitif : impossible d'en changer après la première publication.
   - **App name** : `Guess The Country` — **Short name** : `GeoQuiz`
   - **Version** : `1.0.0` / **Version code** : `1` (à incrémenter à chaque
     `.aab` envoyé sur le Play Console)
   - **Display mode** : `standalone` — **Status bar color** : `#6366f1`
   - **Signing key** : choisis **« Create new »** (première publication).
     PWABuilder génère la clé de signature — voir étape 2 IMPÉRATIVEMENT.
5. Télécharge le zip : il contient
   - `*.aab` → à envoyer sur le Play Console
   - `*.apk` (test) → installable directement sur un téléphone pour vérifier
   - `signing.keystore` + `signing-key-info.txt` → à sauvegarder (étape 2)
   - `assetlinks.json` → l'empreinte à recopier (étape 3)

## 2. Sauvegarder la clé de signature (tâche 4.5) ⚠️ CRITIQUE

Le fichier `signing.keystore` et les mots de passe contenus dans
`signing-key-info.txt` sont **irremplaçables** : sans eux, AUCUNE mise à
jour de l'app ne sera jamais possible (il faudrait republier sous un autre
package et perdre tous les utilisateurs et avis).

À faire immédiatement après le téléchargement :

1. **Ne JAMAIS committer** le keystore ni les mots de passe dans ce dépôt
   (le `.gitignore` exclut `*.keystore` par sécurité).
2. Faire **au moins 2 copies hors machine** : clé USB + coffre de mots de
   passe (Bitwarden/1Password : le fichier en pièce jointe et les mots de
   passe `keystore password`, `key password`, `key alias` en note sécurisée).
3. Noter l'empreinte SHA-256 (utile pour l'étape 3) :
   ```bash
   keytool -list -v -keystore signing.keystore -alias <key alias>
   # → ligne « SHA256: AA:BB:CC:... »
   ```

Astuce : au premier envoi sur le Play Console, tu peux activer **« Play App
Signing »** (Google garde une clé d'app et ta clé devient une clé d'upload).
C'est recommandé : Google peut alors te re-délivrer une clé d'upload en cas
de perte. Dans ce cas, l'empreinte à mettre dans `assetlinks.json` est celle
de la **clé de signature d'app** affichée dans Play Console → Configuration
→ Signature de l'app.

## 3. Activer assetlinks.json (tâche 4.4) — supprime la barre d'adresse

Le fichier est déjà servi à
`https://young-play0.github.io/GUESS-THE-COUNTRY/.well-known/assetlinks.json`
mais contient une empreinte factice. Après l'étape 1 :

1. Ouvre `public/.well-known/assetlinks.json` dans ce dépôt.
2. Remplace `REMPLACER_PAR_L_EMPREINTE_SHA256_DE_LA_CLE_DE_SIGNATURE` par
   l'empreinte SHA-256 réelle (format `AA:BB:CC:...`, celle de l'étape 2 —
   ou celle du fichier `assetlinks.json` fourni par PWABuilder, c'est la
   même). Vérifie aussi que `package_name` correspond au Package ID choisi.
3. Commit + push sur `main` → le déploiement GitHub Pages met le fichier en
   ligne automatiquement.
4. Vérifie avec l'outil officiel :
   https://developers.google.com/digital-asset-links/tools/generator
   (site `young-play0.github.io`, package `io.github.young_play0.guessthecountry`).

Sans ce fichier correct, l'app s'ouvre avec une barre d'adresse Chrome en
haut — c'est LE symptôme d'une empreinte erronée.

⚠️ Si GitHub Pages sert le site avec un sous-chemin (`/GUESS-THE-COUNTRY/`),
`assetlinks.json` doit être accessible **à la racine du domaine** pour la
vérification : `https://young-play0.github.io/.well-known/assetlinks.json`.
GitHub Pages « user site » le permet via un dépôt `young-play0.github.io`
dédié ; sinon, la TWA fonctionne aussi avec le fichier sous le sous-chemin
si `scope`/`host` de PWABuilder pointent bien sur le sous-chemin (PWABuilder
le configure automatiquement depuis l'URL analysée). En cas de barre
d'adresse persistante, créer le petit dépôt `young-play0.github.io` avec
uniquement `.well-known/assetlinks.json`.

## 4. Mises à jour futures

- Contenu web (questions, écrans, corrections) : un simple push sur `main`
  suffit, l'app TWA charge le site → **aucun nouveau `.aab` nécessaire**.
- Changement de manifest (nom, icônes, couleurs, shortcuts) : regénérer un
  `.aab` avec PWABuilder en **réutilisant `signing.keystore`** (option
  « Use mine ») et en incrémentant le **version code**, puis l'envoyer sur
  le Play Console.

## 5. Rappels Play Console (phase 5 de la ROADMAP)

- Compte développeur : 25 $ une fois, vérification d'identité.
- Politique de confidentialité obligatoire (page à héberger sur le site).
- Fiche store : icône 512×512 (déjà prête : `public/icon-512.png`),
  bannière 1024×500, ≥ 2 captures d'écran par format.
- Sécurité des données : déclarer « aucune donnée collectée » (tout est en
  localStorage, aucun serveur).
- **Test fermé obligatoire : 12 testeurs pendant 14 jours** avant de pouvoir
  demander la production — commencer à recruter dès maintenant.
