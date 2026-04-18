import { useState } from 'react';
import { usePlayers } from './hooks/usePlayers';
import { useSynergy } from './hooks/useSynergy';
import { PlayerCard } from './components/PlayerCard';
import { ResultsPanel } from './components/ResultsPanel';
import { RANKS } from './data/heroes';
import './index.css';

function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        width: 36, height: 36, borderRadius: 8,
        background: 'var(--accent)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18, fontFamily: 'var(--font-display)', fontWeight: 700, color: '#0a0b0d',
      }}>⬡</div>
      <div>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700,
          letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text)', lineHeight: 1,
        }}>Synergy Lock</div>
        <div style={{ fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.06em', marginTop: 2 }}>
          DEADLOCK PARTY ANALYZER
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [rank, setRank] = useState({ min: '', max: '' });
  const {
    players, allHeroIds, totalHeroes, canAddPlayer,
    addPlayer, removePlayer, renamePlayer, addHero, removeHero, clearAll,
  } = usePlayers();
  const synergy = useSynergy();

  function handleAnalyze() {
    synergy.analyze(allHeroIds, players, rank.min, rank.max);
  }

  function handleClear() {
    clearAll();
    synergy.reset();
  }

  const canAnalyze = totalHeroes >= 2 && synergy.status !== 'loading';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(232,162,74,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(232,162,74,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 960, margin: '0 auto', padding: '24px 16px 60px' }}>
        <header style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 32, flexWrap: 'wrap', gap: 12,
        }}>
          <Logo />
          <div style={{ fontSize: 12, color: 'var(--text-3)' }}>
            Powered by{' '}
            <a href="https://deadlock-api.com" target="_blank" rel="noopener"
              style={{ color: 'var(--accent)', textDecoration: 'none' }}>
              deadlock-api.com
            </a>
          </div>
        </header>

        <div style={{
          background: 'var(--bg-1)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: '14px 18px',
          marginBottom: 24, fontSize: 12, color: 'var(--text-2)', lineHeight: 1.7,
        }}>
          <span style={{ color: 'var(--accent)', fontWeight: 600 }}>How it works: </span>
          Add each player's hero pool below (heroes they play), then hit Analyze.
          You'll see which combos from your party have the best win rates and pick rates.
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          <select
            value={RANKS.find(r => r.min === rank.min)?.label ?? 'All Ranks'}
            onChange={e => {
              const found = RANKS.find(r => r.label === e.target.value);
              setRank(found ? { min: found.min, max: found.max } : { min: '', max: '' });
            }}
            style={{
              flex: '1 1 160px', background: 'var(--bg-1)',
              border: '1px solid var(--border)', borderRadius: 'var(--radius)',
              color: 'var(--text)', padding: '8px 12px', fontSize: 12, cursor: 'pointer', outline: 'none',
            }}
          >
            {RANKS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>

          <button
            onClick={handleClear}
            style={{
              padding: '8px 14px', fontSize: 12, color: 'var(--text-3)',
              border: '1px solid var(--border)', borderRadius: 'var(--radius)',
              background: 'transparent', cursor: 'pointer',
            }}
          >Clear All</button>

          <button
            onClick={handleAnalyze}
            disabled={!canAnalyze}
            style={{
              padding: '8px 24px', fontSize: 13, fontWeight: 700,
              fontFamily: 'var(--font-display)', letterSpacing: '0.08em', textTransform: 'uppercase',
              background: canAnalyze ? 'var(--accent)' : 'var(--bg-3)',
              color: canAnalyze ? '#0a0b0d' : 'var(--text-3)',
              border: 'none', borderRadius: 'var(--radius)',
              cursor: canAnalyze ? 'pointer' : 'not-allowed', opacity: canAnalyze ? 1 : 0.6,
            }}
          >
            {synergy.status === 'loading' ? 'Analyzing...' : 'Analyze Synergies'}
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 12, marginBottom: 16,
        }}>
          {players.map((player, i) => (
            <PlayerCard
              key={player.id}
              player={player}
              index={i}
              allPlayers={players}
              onAddHero={addHero}
              onRemoveHero={removeHero}
              onRemove={removePlayer}
              onRename={renamePlayer}
            />
          ))}

          {canAddPlayer && (
            <button
              onClick={addPlayer}
              style={{
                background: 'transparent', border: '1px dashed var(--border)',
                borderRadius: 'var(--radius-lg)', padding: '32px 16px',
                color: 'var(--text-3)', fontSize: 13, cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              <span style={{ fontSize: 24, lineHeight: 1 }}>+</span>
              <span style={{ fontSize: 12 }}>Add Player</span>
              <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{players.length}/6 players</span>
            </button>
          )}
        </div>

        {totalHeroes > 0 && (
          <div style={{ marginBottom: 24, fontSize: 12, color: 'var(--text-3)' }}>
            {totalHeroes} unique hero{totalHeroes !== 1 ? 's' : ''} across {players.length} player{players.length !== 1 ? 's' : ''}
            {totalHeroes < 2 ? ' — add at least 2 heroes to analyze' : ' — ready to analyze'}
          </div>
        )}

        <ResultsPanel
          status={synergy.status}
          heroStats={synergy.heroStats}
          combos={synergy.combos}
          error={synergy.error}
        />

        <footer style={{
          marginTop: 48, paddingTop: 20, borderTop: '1px solid var(--border)',
          fontSize: 11, color: 'var(--text-3)', textAlign: 'center', lineHeight: 1.8,
        }}>
          Not affiliated with Valve. Data from{' '}
          <a href="https://deadlock-api.com" target="_blank" rel="noopener"
            style={{ color: 'var(--text-2)', textDecoration: 'none' }}>deadlock-api.com</a>.
        </footer>
      </div>
    </div>
  );
}
