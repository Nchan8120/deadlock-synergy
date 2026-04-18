import { useState, useCallback } from 'react';

const MAX_PLAYERS = 6;
const MAX_HEROES_PER_PLAYER = 12;

function makePlayer(id) {
  return { id, name: `Player ${id}`, heroes: [] };
}

let nextId = 4;

export function usePlayers() {
  const [players, setPlayers] = useState([
    { id: crypto.randomUUID(), name: 'Player 1', heroes: [] },
    { id: crypto.randomUUID(), name: 'Player 2', heroes: [] },
  ]);

  const addPlayer = useCallback(() => {
    setPlayers(prev => {
      if (prev.length >= MAX_PLAYERS) return prev;
      return [...prev, { id: crypto.randomUUID(), name: `Player ${prev.length + 1}`, heroes: [] }];
    });
  }, []);

  const removePlayer = useCallback((id) => {
    setPlayers(prev => 
      prev
        .filter(p => p.id !== id)
        .map((p, i) => ({ ...p, name: p.name.startsWith('Player ') ? `Player ${i + 1}` : p.name }))
    );
  }, []);

  const renamePlayer = useCallback((id, name) => {
    setPlayers(prev => prev.map(p => p.id === id ? { ...p, name } : p));
  }, []);

  const addHero = useCallback((playerId, heroId) => {
    setPlayers(prev => prev.map(p => {
      if (p.id !== playerId) return p;
      if (p.heroes.includes(heroId) || p.heroes.length >= MAX_HEROES_PER_PLAYER) return p;
      return { ...p, heroes: [...p.heroes, heroId] };
    }));
  }, []);

  const removeHero = useCallback((playerId, heroId) => {
    setPlayers(prev => prev.map(p =>
      p.id === playerId ? { ...p, heroes: p.heroes.filter(h => h !== heroId) } : p
    ));
  }, []);

  const clearAll = useCallback(() => {
    setPlayers(prev => prev.map(p => ({ ...p, heroes: [] })));
  }, []);

  const allHeroIds = [...new Set(players.flatMap(p => p.heroes))];
  const totalHeroes = allHeroIds.length;

  return {
    players,
    allHeroIds,
    totalHeroes,
    canAddPlayer: players.length < MAX_PLAYERS,
    addPlayer,
    removePlayer,
    renamePlayer,
    addHero,
    removeHero,
    clearAll,
    MAX_HEROES_PER_PLAYER,
  };
}
