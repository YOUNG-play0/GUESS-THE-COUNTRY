# 🚀 Déploiement sur Vercel (avec le chat ATLAS / Groq)

Héberger l'app sur **Vercel** active la fonction serverless `api/chat.js`,
donc la **conversation libre avec ATLAS** (Groq). GitHub Pages ne peut pas
le faire (pas de backend) — Vercel oui.

## 1. Obtenir une clé Groq (gratuit)

1. Crée un compte sur https://console.groq.com
2. **API Keys → Create API Key**, copie la clé (commence par `gsk_...`).

## 2. Importer le projet sur Vercel

1. Va sur https://vercel.com → **Add New… → Project**.
2. Importe le dépôt GitHub `YOUNG-play0/GUESS-THE-COUNTRY`.
3. Vercel détecte **Vite** automatiquement. Les réglages sont déjà fournis
   par `vercel.json` :
   - Build : `npm run build` · Output : `dist`
   - L'app est servie à la **racine `/`** (le `base` Vite bascule
     automatiquement : `/` sur Vercel, `/GUESS-THE-COUNTRY/` sur Pages).
   - `api/chat.js` devient une fonction serverless (Node), max 15 s.
4. **Avant de déployer** : section **Environment Variables**, ajoute
   - **Name** : `GROQ_API_KEY`
   - **Value** : ta clé `gsk_...`
   - Environnements : Production + Preview (+ Development si tu veux).
5. **Deploy**. Vercel te donne une URL `https://<projet>.vercel.app`.

> Si tu avais déjà déployé sans la clé : ajoute la variable puis
> **Redeploy** (un nouveau build est nécessaire pour la prendre en compte).

## 3. Vérifier

- Ouvre l'app Vercel → Profil → **Mon ami ATLAS** → conversation libre
  (réservée au Passe Premium ; active l'essai pour tester).
- Test direct de l'API :
  ```bash
  curl -X POST https://<projet>.vercel.app/api/chat \
    -H "Content-Type: application/json" \
    -d '{"message":"Salut Atlas, ça va ?"}'
  ```
  → doit renvoyer `{"reply":"..."}`.

## 4. Détails techniques

- **Modèle** : `llama-3.3-70b-versatile` (Groq), température 0.8,
  max_tokens 150. Limite côté client : 50 messages/jour/session.
- **`vercel.json`** : rewrite SPA `/(.*) → /index.html` (sauf `/api/...`),
  les fichiers statiques et la fonction sont servis avant le rewrite.
- **PWA** : `start_url`/`scope` relatifs → fonctionnent à la racine Vercel
  comme sous le sous-chemin Pages, sans changement.

## 5. Et GitHub Pages ?

Le déploiement Pages continue de fonctionner (le workflow build avec
`GHPAGES=1`). Si tu veux **Vercel comme seul hôte**, tu peux désactiver
GitHub Pages (Settings → Pages → Source : None) ou supprimer
`.github/workflows/deploy.yml`. À garder en tête : sur Pages le chat ATLAS
affiche un message « hors-ligne » (pas de backend) ; tout le reste marche.

## 6. Domaine Android / TWA

Si tu génères l'APK/AAB avec PWABuilder depuis l'URL Vercel, pense à
mettre à jour `public/.well-known/assetlinks.json` avec l'empreinte de
signature (voir `PUBLISHING.md`).
