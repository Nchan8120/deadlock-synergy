import { useState, useCallback } from 'react';
import { fetchHeroStats, fetchCombStats } from '../api/deadlock';
import { HERO_BY_ID } from '../data/heroes';

function normalizeHeroStats(raw) {
  const arr = Array.isArray(raw) ? raw : (raw?.data ?? []);
  return arr.map(entry => {
    const wins = entry.wins ?? 0;
    const matches = entry.matches ?? 0;
    return { id: entry.hero_id, wins, matches, wr: matches > 0 ? (wins / matches) * 100 : null };
  }).filter(e => e.id && e.wr !== null);
}

function normalizeCombos(raw) {
  const arr = Array.isArray(raw) ? raw : (raw?.data ?? []);
  return arr
    .filter(e => Array.isArray(e.hero_ids) && e.hero_ids.length >= 2 && e.matches > 0)
    .map(e => ({ heroes: e.hero_ids, wins: e.wins, matches: e.matches, wr: (e.wins / e.matches) * 100 }));
}

export function useSynergy() {
  const [state, setState] = useState({ status: 'idle', heroStats: [], combos: [], error: null });

  const analyze = useCallback(async (allHeroIds, rankMin, rankMax) => {
    if (allHeroIds.length < 2) return;
    setState({ status: 'loading', heroStats: [], combos: [], error: null });

    const rankParams = rankMin !== '' ? { minBadge: rankMin, maxBadge: rankMax } : {};
    const poolSet = new Set(allHeroIds);

    try {
      const [statsResult, duosResult, triosResult] = await Promise.allSettled([
        fetchHeroStats(allHeroIds, rankParams),
        fetchCombStats(2, rankParams),
        fetchCombStats(3, rankParams),
      ]);

      const heroStats = statsResult.status === 'fulfilled' ? normalizeHeroStats(statsResult.value) : [];
      const duos = duosResult.status === 'fulfilled' ? normalizeCombos(duosResult.value) : [];
      const trios = triosResult.status === 'fulfilled' ? normalizeCombos(triosResult.value) : [];

      // Keep only combos where every hero exists in the party pool
      const combos = [...duos, ...trios]
        .filter(c => c.heroes.every(id => poolSet.has(id)))
        .map(c => ({ ...c, heroDetails: c.heroes.map(id => HERO_BY_ID[id]).filter(Boolean) }));

      setState({ status: 'success', heroStats, combos, error: null });
    } catch (err) {
      setState({ status: 'error', heroStats: [], combos: [], error: err.message });
    }
  }, []);

  const reset = useCallback(() => setState({ status: 'idle', heroStats: [], combos: [], error: null }), []);

  return { ...state, analyze, reset };
}