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

  const analyze = useCallback(async (allHeroIds, players, rankMin, rankMax) => {
    if (allHeroIds.length < 2) return;
    setState({ status: 'loading', heroStats: [], combos: [], error: null });

    const rankParams = rankMin !== '' ? { minBadge: rankMin, maxBadge: rankMax } : {};
    const poolSet = new Set(allHeroIds);
    const playerCount = players.length;

    try {
      const [statsResult, combosResult] = await Promise.allSettled([
        fetchHeroStats(allHeroIds, rankParams),
        fetchCombStats(playerCount, rankParams),
      ]);

      const heroStats = statsResult.status === 'fulfilled' ? normalizeHeroStats(statsResult.value) : [];
      const combos = combosResult.status === 'fulfilled' ? normalizeCombos(combosResult.value) : [];
      const heroToPlayers = {};
      players.forEach(p => {
        p.heroes.forEach(hid => {
          if (!heroToPlayers[hid]) heroToPlayers[hid] = [];
          heroToPlayers[hid].push(p.id);
        });
      });
      // A combo is valid if we can assign each hero to a distinct player
      // (i.e. no two heroes need to come from the same single player)
      function canAssignToDistinctPlayers(heroIds) {
        // Try to find a valid 1-to-1 assignment via backtracking
        const used = new Set();
        function assign(i) {
          if (i === heroIds.length) return true;
          for (const pid of (heroToPlayers[heroIds[i]] || [])) {
            if (!used.has(pid)) {
              used.add(pid);
              if (assign(i + 1)) return true;
              used.delete(pid);
            }
          }
          return false;
        }
        return assign(0);
      }

      function getPlayerAssignment(heroIds) {
        const used = new Set();
        const assignment = {}; // heroId -> playerId
        function assign(i) {
          if (i === heroIds.length) return true;
          for (const pid of (heroToPlayers[heroIds[i]] || [])) {
            if (!used.has(pid)) {
              used.add(pid);
              assignment[heroIds[i]] = pid;
              if (assign(i + 1)) return true;
              used.delete(pid);
              delete assignment[heroIds[i]];
            }
          }
          return false;
        }
        assign(0);
        return assignment;
      }

      const filteredCombos = combos
        .filter(c => c.heroes.every(id => poolSet.has(id)))
        .filter(c => canAssignToDistinctPlayers(c.heroes))
        .map(c => {
          const assignment = getPlayerAssignment(c.heroes);
          const sortedHeroes = [...c.heroes].sort((a, b) => {
            const playerA = players.findIndex(p => p.id === assignment[a]);
            const playerB = players.findIndex(p => p.id === assignment[b]);
            return playerA - playerB;
          });
          return {
            ...c,
            heroDetails: sortedHeroes.map(id => ({
              ...(HERO_BY_ID[id] || {}),
              playerName: players.find(p => p.id === assignment[id])?.name ?? '',
            })),
          };
        });
      setState({ status: 'success', heroStats, combos: filteredCombos, error: null });
      } catch (err) {
      setState({ status: 'error', heroStats: [], combos: [], error: err.message });
    }
  }, []);

  const reset = useCallback(() => setState({ status: 'idle', heroStats: [], combos: [], error: null }), []);

  return { ...state, analyze, reset };
}