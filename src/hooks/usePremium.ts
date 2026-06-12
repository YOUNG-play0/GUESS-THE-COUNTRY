import { useState, useCallback } from 'react';

// Passe du Savoir — structure d'abonnement SANS vrai paiement.
// ⚠️ Démo locale (localStorage) : le vrai paiement passera par Google Play
// Billing via la Digital Goods API quand l'app sera packagée en TWA
// (phase 5 de la ROADMAP). Toute la logique de gating est déjà branchée
// sur ce hook : il suffira de remplacer subscribe()/buyContinentPack()
// par les appels Play Billing.

export type PremiumPlan = 'free' | 'trial' | 'monthly' | 'yearly';

export interface PremiumState {
  plan: PremiumPlan;
  /** Fin d'essai (ISO) quand plan === 'trial' */
  trialEndsAt?: string;
  /** Continents dont le Pack (0,99 €) a été acheté — accès Explorateur à vie */
  continentPacks: string[];
  /** L'essai gratuit ne peut être utilisé qu'une fois */
  trialUsed: boolean;
}

export const PRICES = {
  monthly: '2,99 €',
  yearly: '14,99 €',
  continentPack: '0,99 €',
} as const;

export const TRIAL_DAYS = 7;

const STORAGE_KEY = 'gtc_premium';

const DEFAULT_STATE: PremiumState = {
  plan: 'free',
  continentPacks: [],
  trialUsed: false,
};

function load(): PremiumState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_STATE;
}

function save(s: PremiumState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {}
}

function trialDaysLeft(s: PremiumState): number {
  if (s.plan !== 'trial' || !s.trialEndsAt) return 0;
  return Math.max(0, Math.ceil((new Date(s.trialEndsAt).getTime() - Date.now()) / 86400000));
}

export function usePremium() {
  const [state, setState] = useState<PremiumState>(load);

  const update = useCallback((fn: (s: PremiumState) => PremiumState) => {
    setState(prev => {
      const next = fn(prev);
      save(next);
      return next;
    });
  }, []);

  // Essai expiré → retour au plan gratuit (constaté à la lecture)
  const effectivePlan: PremiumPlan =
    state.plan === 'trial' && trialDaysLeft(state) === 0 ? 'free' : state.plan;

  const isPremium = effectivePlan !== 'free';

  const startTrial = useCallback(() => {
    update(s => s.trialUsed ? s : {
      ...s,
      plan: 'trial',
      trialEndsAt: new Date(Date.now() + TRIAL_DAYS * 86400000).toISOString(),
      trialUsed: true,
    });
  }, [update]);

  // Démo : active l'abonnement localement (phase 5 : Play Billing)
  const subscribe = useCallback((plan: 'monthly' | 'yearly') => {
    update(s => ({ ...s, plan }));
  }, [update]);

  const buyContinentPack = useCallback((continent: string) => {
    update(s => s.continentPacks.includes(continent)
      ? s
      : { ...s, continentPacks: [...s.continentPacks, continent] });
  }, [update]);

  // Accès Mode Explorateur : tout avec le Passe, sinon les continents achetés
  const explorerContinents = useCallback((): string[] | 'all' | null => {
    if (isPremium) return 'all';
    if (state.continentPacks.length > 0) return state.continentPacks;
    return null;
  }, [isPremium, state.continentPacks]);

  return {
    plan: effectivePlan,
    isPremium,
    trialDaysLeft: trialDaysLeft(state),
    trialUsed: state.trialUsed,
    continentPacks: state.continentPacks,
    startTrial,
    subscribe,
    buyContinentPack,
    explorerContinents,
  };
}
