import { useState, useRef, useEffect } from 'react';
import { HEROES, HERO_BY_ID } from '../data/heroes';
import { HeroAvatar } from './HeroAvatar';

export function PlayerCard({ player, index, onAddHero, onRemoveHero, onRemove, onRename, allPlayers }) {
  const [renaming, setRenaming] = useState(false);
  const [nameVal, setNameVal] = useState(player.name);
  const [search, setSearch] = useState('');
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);
  const nameRef = useRef(null);

  // Track globally used heroes (other players' pools) for visual indication
  const usedElsewhere = new Set(
    allPlayers.filter(p => p.id !== player.id).flatMap(p => p.heroes)
  );

  const available = HEROES.filter(h =>
    !player.heroes.includes(h.id) &&
    h.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    function handleClick(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false);
        setSearch('');
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const colors = ['#e8a24a', '#4ae89a', '#4a9fe8', '#c44ae8', '#e84a7a', '#4ae8d8'];
  const accent = colors[index % colors.length];

  function commitRename() {
    setRenaming(false);
    if (nameVal.trim()) onRename(player.id, nameVal.trim());
    else setNameVal(player.name);
  }

  return (
    <div style={{
      background: 'var(--bg-1)',
      border: '1px solid var(--border)',
      borderTop: `2px solid ${accent}`,
      borderRadius: 'var(--radius-lg)',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 22, height: 22, borderRadius: 4,
          background: accent + '22', border: `1px solid ${accent}55`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontFamily: 'var(--font-display)', fontWeight: 700, color: accent,
        }}>{index + 1}</div>

        {renaming ? (
          <input
            ref={nameRef}
            value={nameVal}
            onChange={e => setNameVal(e.target.value)}
            onBlur={commitRename}
            onKeyDown={e => { if (e.key === 'Enter') commitRename(); if (e.key === 'Escape') { setRenaming(false); setNameVal(player.name); } }}
            autoFocus
            style={{
              flex: 1, background: 'var(--bg-2)', border: '1px solid var(--border-bright)',
              borderRadius: 4, padding: '2px 8px', color: 'var(--text)', fontSize: 13,
              fontFamily: 'var(--font-display)', fontWeight: 600, letterSpacing: '0.05em',
            }}
          />
        ) : (
          <span
            onClick={() => { setRenaming(true); setNameVal(player.name); }}
            style={{
              flex: 1, fontFamily: 'var(--font-display)', fontWeight: 600,
              fontSize: 14, letterSpacing: '0.06em', color: 'var(--text)',
              cursor: 'text', textTransform: 'uppercase',
            }}
            title="Click to rename"
          >{player.name}</span>
        )}

        <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
          {player.heroes.length} hero{player.heroes.length !== 1 ? 's' : ''}
        </span>

        <button
          onClick={() => onRemove(player.id)}
          title="Remove player"
          style={{ color: 'var(--text-3)', fontSize: 16, lineHeight: 1, padding: '0 2px' }}
        >×</button>
      </div>

      {/* Hero chips */}
      <div style={{
        minHeight: 36, display: 'flex', flexWrap: 'wrap', gap: 5,
        padding: player.heroes.length > 0 ? 0 : '6px 0',
      }}>
        {player.heroes.length === 0 ? (
          <span style={{ fontSize: 12, color: 'var(--text-3)', fontStyle: 'italic' }}>
            No heroes added yet
          </span>
        ) : player.heroes.map(heroId => {
          const hero = HERO_BY_ID[heroId];
          if (!hero) return null;
          return (
            <div key={heroId} style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '3px 6px 3px 4px',
              background: hero.color + '15',
              border: `1px solid ${hero.color}30`,
              borderRadius: 999,
              cursor: 'pointer',
              transition: 'border-color 0.15s, background 0.15s',
            }}
              onClick={() => onRemoveHero(player.id, heroId)}
              title="Click to remove"
              onMouseEnter={e => { e.currentTarget.style.background = hero.color + '30'; e.currentTarget.style.borderColor = hero.color + '60'; }}
              onMouseLeave={e => { e.currentTarget.style.background = hero.color + '15'; e.currentTarget.style.borderColor = hero.color + '30'; }}
            >
              <HeroAvatar hero={hero} size={18} />
              <span style={{ fontSize: 11, color: 'var(--text)', whiteSpace: 'nowrap', fontWeight: 500 }}>{hero.name}</span>
              <span style={{ fontSize: 9, color: 'var(--text-3)', marginLeft: 1 }}>×</span>
            </div>
          );
        })}
      </div>

      {/* Add hero dropdown */}
      <div ref={dropRef} style={{ position: 'relative' }}>
        <div
          onClick={() => setDropOpen(o => !o)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '7px 10px',
            background: 'var(--bg-2)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', cursor: 'pointer',
            fontSize: 12, color: 'var(--text-2)',
            transition: 'border-color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-bright)'}
          onMouseLeave={e => !dropOpen && (e.currentTarget.style.borderColor = 'var(--border)')}
        >
          <span style={{ color: accent, fontSize: 14, lineHeight: 1 }}>+</span>
          <span>Add hero to pool</span>
          <span style={{ marginLeft: 'auto', fontSize: 10, opacity: 0.5 }}>▾</span>
        </div>

        {dropOpen && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
            background: 'var(--bg-2)', border: '1px solid var(--border-bright)',
            borderRadius: 'var(--radius)', zIndex: 100, overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          }}>
            <div style={{ padding: '8px 8px 4px' }}>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search heroes..."
                autoFocus
                style={{
                  width: '100%', background: 'var(--bg-3)',
                  border: '1px solid var(--border)', borderRadius: 4,
                  padding: '5px 8px', color: 'var(--text)', fontSize: 12,
                  outline: 'none',
                }}
              />
            </div>
            <div style={{ maxHeight: 200, overflowY: 'auto' }}>
              {available.length === 0 ? (
                <div style={{ padding: '10px 12px', color: 'var(--text-3)', fontSize: 12 }}>
                  {search ? 'No heroes match' : 'All heroes added'}
                </div>
              ) : available.map(hero => (
                <div
                  key={hero.id}
                  onClick={() => {
                    onAddHero(player.id, hero.id);
                    setSearch('');
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '6px 10px', cursor: 'pointer',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-3)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <HeroAvatar hero={hero} size={22} />
                  <span style={{ fontSize: 12, color: 'var(--text)', fontWeight: 500 }}>{hero.name}</span>
                  {usedElsewhere.has(hero.id) && (
                    <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--text-3)', fontStyle: 'italic' }}>
                      in pool
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
