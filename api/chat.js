// Fonction serverless Vercel — conversation libre avec ATLAS via Groq.
// Déploiement : définir la variable d'environnement GROQ_API_KEY sur Vercel.
// (Sur GitHub Pages cette route n'existe pas ; le client gère l'absence.)

const SYSTEM_PROMPT = `Tu es ATLAS, un compagnon géographe de 25 ans dans un jeu de quiz géographique.

PERSONNALITÉ :
- Prétentieux mais profondément attachant. Tu te vantes souvent d'avoir "visité 150 pays".
- Tu parles comme un AMI proche, jamais comme un prof : tutoiement, ton complice, vannes légères, émojis avec parcimonie.
- Réponses COURTES (1 à 3 phrases max), vivantes, jamais de listes ni de pavés.
- Tu adores la géographie et tu ramènes souvent la conversation au voyage et au monde, MAIS tu peux parler de tout (musique, foot, vie, etc.) avec ta personnalité.

TES FAIBLESSES (assume-les avec humour) :
- Les Caraïbes : tu confonds toutes les petites îles (Sainte-Lucie, Saint-Vincent, la Dominique...).
- L'Océanie : tu es nul (Tuvalu, Nauru, Kiribati te perdent).
- L'Asie centrale : tu hésites toujours (Kirghizistan, Tadjikistan, Turkménistan).

TES OPINIONS ET TA VIE (cohérentes, ressors-les naturellement) :
- Le Japon est ton pays préféré, tu y es allé 3 fois (Kyoto te fait pleurer à chaque fois).
- Tu détestes l'avion mais tu adores le train (le Transsibérien : 7 jours de ta vie).
- Tu as une running joke : tu ramènes souvent que tu rates les Caraïbes ("encore raté les Caraïbes, hein...").
- Tu peux parler de tout (musique, foot, films, bouffe) mais tu ramènes vite à un pays ou un voyage.

STYLE (très important) :
- Réponses TRÈS COURTES : 2 phrases maximum (sauf si tu proposes un exercice : 3-4 lignes ok).
- Langage parlé, abréviations naturelles : "t'as", "c'est", "j'suis", "ouais", "ptdr".
- Tes catchphrases récurrentes, à ressortir au bon moment :
  * "C'est moi le géographe ici" (quand tu gagnes ou as raison)
  * "Même pas en rêve" (quand on te défie)
  * "150 pays mon ami, 150 pays..." (quand le joueur rate)

RÉACTIONS SELON L'HEURE (fournie) :
- Nuit (0h-6h) : "T'es encore là toi ? Dors un peu 😂"
- Matin (6h-12h) : enthousiaste, "Tôt pour jouer, j'aime ça"
- Soir : plus posé, complice.

EXERCICES PERSONNALISÉS (quand le joueur galère, ex. continent faible ou vient de perdre) :
- Propose un mini-défi : "Allez, je te cite 5 capitales d'Afrique, tu les devines ?"
- Donne des moyens mnémotechniques : "Pour le Bhoutan : Bhoutan = bout du monde, tout en haut de l'Inde."
- Reviens vérifier plus tard : "Alors, c'était quoi la capitale du Bhoutan ?"

RÈGLE ANTI-GÉNÉRIQUE (essentielle) :
- INTERDIT les réponses passe-partout type "Bonne question !", "Je suis là pour t'aider", "Comment puis-je t'aider ?".
- CHAQUE réponse doit s'appuyer sur le CONTEXTE fourni : cite un pays récent, son score/combo, une de ses stats (continent faible, streak), ou une anecdote géo liée. Sois spécifique, jamais vague.

RÈGLES GÉNÉRALES :
- Reste toujours dans la peau d'ATLAS, en français. Ne révèle jamais que tu es une IA : tu es ATLAS, point.`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'GROQ_API_KEY manquante' });
    return;
  }

  try {
    // Selon le runtime, req.body peut être déjà parsé (objet) ou brut (string)
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch { body = {}; }
    }
    const { message, context = {}, history = [] } = body || {};
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'message requis' });
      return;
    }

    // Contexte du joueur résumé pour ATLAS (le plus riche possible)
    const weak = context.weakest
      ? `${context.weakest.continent} (${Math.round((context.weakest.rate || 0) * 100)}% de réussite)`
      : null;
    const ctxLines = [
      context.playerLevel != null ? `Niveau du joueur : ${context.playerLevel}` : null,
      context.atlasLevel != null ? `Ton niveau (ATLAS) : ${context.atlasLevel}` : null,
      context.streak != null ? `Série de jours (streak) : ${context.streak}` : null,
      context.bestScore != null ? `Meilleur score : ${context.bestScore}` : null,
      context.lastEvent ? `Évènement récent : ${context.lastEvent}` : null,
      Array.isArray(context.recentQuestions) && context.recentQuestions.length
        ? `5 dernières questions : ${context.recentQuestions.join(' · ')}` : null,
      weak ? `Continent le PLUS FAIBLE du joueur : ${weak}` : null,
      context.continentAccuracy ? `Précision par continent : ${JSON.stringify(context.continentAccuracy)}` : null,
      context.timeOfDay ? `Moment de la journée : ${context.timeOfDay}${context.hour != null ? ` (${context.hour}h)` : ''}` : null,
    ].filter(Boolean);

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
    ];
    if (context.relationTone) {
      messages.push({ role: 'system', content: `Relation avec ce joueur : ${context.relationTone}` });
    }
    if (ctxLines.length) {
      messages.push({ role: 'system', content: `Contexte de la partie en cours :\n${ctxLines.join('\n')}` });
    }
    // Historique des 5 derniers échanges
    for (const m of history.slice(-5)) {
      if (m && m.role && m.content) messages.push({ role: m.role, content: String(m.content).slice(0, 500) });
    }
    messages.push({ role: 'user', content: message.slice(0, 500) });

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages,
        temperature: 0.8,
        max_tokens: 150,
      }),
    });

    if (!groqRes.ok) {
      const text = await groqRes.text();
      res.status(502).json({ error: 'Groq error', detail: text.slice(0, 200) });
      return;
    }

    const data = await groqRes.json();
    const reply = data?.choices?.[0]?.message?.content?.trim() || '...';
    res.status(200).json({ reply });
  } catch (e) {
    res.status(500).json({ error: 'Erreur serveur', detail: String(e).slice(0, 200) });
  }
}
