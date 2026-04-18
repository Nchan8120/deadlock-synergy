import { useState, useCallback } from 'react';
import { fetchHeroStats, fetchHeroComboStats } from '../api/deadlock';
import { HERO_BY_ID } from '../data/heroes';

function parseWinRate(entry) {
  if (!entry) return null;
  const wins = entry.wins ?? entry.win_count ?? entry.wins_count ?? 0;
  const matches = entry.matches ?? entry.match_count ?? entry.matches_count ?? 0;
  if (!matches) return null;
  return { wins, matches, wr: (wins / matches) * 100 };
}

function normalizeHeroStats(raw) {
  const arr = Array.isArray(raw) ? raw : (raw?.data ?? []);
  return arr.map(entry => {
    const id = entry.hero_id ?? entry.id;
    const stats = parseWinRate(entry);
    return { id, ...stats, pick_count: entry.matches ?? entry.match_count ?? 0 };
  }).filter(e => e.id && e.wr !== null);
}

function normalizeCombos(raw) {
  const arr = Array.isArray(raw) ? raw : (raw?.data ?? []);
  return arr.map(entry => {
    const heroes = entry.hero_ids ?? entry.heroes ?? [];
    const stats = parseWinRate(entry);
    return { heroes, ...stats };
  }).filter(e => e.heroes?.length >= 2 && e.wr !== null);
}

export function useSynergy() {
  const [state, setState] = useState({
    status: 'idle', // idle | loading | success | error
    heroStats: [],
    combos: [],
    error: null,
  });

  const analyze = useCallback(async (allHeroIds, rank) => {
    if (allHeroIds.length < 2) return;
    setState({ status: 'loading', heroStats: [], combos: [], error: null });

    const rankParams = rank !== '' ? { minBadge: rank, maxBadge: rank } : {};

    try {
      const [statsRaw, combosRaw] = await Promise.allSettled([
        fetchHeroStats(allHeroIds, rankParams),
        fetchHeroComboStats(allHeroIds, rankParams),
      ]);

      const heroStats = statsRaw.status === 'fulfilled'
        ? normalizeHeroStats(statsRaw.value)
        : [];

      let combos = combosRaw.status === 'fulfilled'
        ? normalizeCombos(combosRaw.value)
        : [];

      // Filter combos to only include heroes that exist in the pool
      const poolSet = new Set(allHeroIds);
      combos = combos.filter(c => c.heroes.every(id => poolSet.has(id)));

      // Enrich combos with names
      combos = combos.map(c => ({
        ...c,
        heroDetails: c.heroes.map(id => HERO_BY_ID[id]).filter(Boolean),
      }));

      setState({ status: 'success', heroStats, combos, error: null });
    } catch (err) {
      setState({ status: 'error', heroStats: [], combos: [], error: err.message });
    }
  }, []);

  const reset = useCallback(() => {
    setState({ status: 'idle', heroStats: [], combos: [], error: null });
  }, []);

  return { ...state, analyze, reset };
}
