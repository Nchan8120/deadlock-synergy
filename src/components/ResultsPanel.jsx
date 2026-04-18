import { useState } from 'react';
import { ComboCard } from './ComboCard';
import { HeroAvatar } from './HeroAvatar';
import { HERO_BY_ID } from '../data/heroes';

function Tab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 20px', fontSize: 12, fontWeight: 600,
        fontFamily: 'var(--font-display)', letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: active ? 'var(--accent)' : 'var(--text-3)',
        borderBottom: active ? '2px solid var(--accent)' : '2px solid transparent',
        marginBottom: -1, transition: 'color 0.15s',
      }}
    >{label}</button>
  );
}

function HeroStatRow({ stat, rank }) {
  const hero = HERO_BY_ID[stat.id];
  if (!hero) return null;
  const wr = stat.wr;
  const color = wr >= 55 ? 'var(--green)' : wr <= 45 ? 'var(--red)' : 'var(--text)';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '8px 14px', borderBottom: '1px solid var(--border)',
      transition: 'background 0.1s',
    }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-2)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <HeroAvatar hero={hero} size={28} />
      <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{hero.name}</span>
      <span style={{ fontSize: 11, color: 'var(--text-3)', minWidth: 80, textAlign: 'right' }}>
        {stat.pick_count?.toLocaleString()} games
      </span>
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color, minWidth: 55, textAlign: 'right' }}>
        {wr.toFixed(1)}%
      </span>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div style={{
      padding: '48px 24px', textAlign: 'center',
      color: 'var(--text-3)', fontSize: 13,
    }}>
      <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.3 }}>◈</div>
      {message}
    </div>
  );
}

export function ResultsPanel({ status, heroStats, combos, error }) {
  const [tab, setTab] = useState('winrate');

  if (status === 'idle') return null;

  if (status === 'loading') {
    return (
      <div style={{
        background: 'var(--bg-1)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '60px 24px',
        textAlign: 'center',
      }}>
        <div style={{
          width: 36, height: 36, border: '2px solid var(--border)',
          borderTopColor: 'var(--accent)', borderRadius: '50%',
          margin: '0 auto 16px', animation: 'spin 0.8s linear infinite',
        }} />
        <div style={{ color: 'var(--text-2)', fontSize: 13 }}>Fetching synergy data...</div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div style={{
        background: 'var(--red-dim)', border: '1px solid var(--red)',
        borderRadius: 'var(--radius-lg)', padding: '20px 24px',
        color: 'var(--red)', fontSize: 13,
      }}>
        <strong>API Error:</strong> {error}
        <div style={{ marginTop: 6, fontSize: 12, color: 'var(--text-2)' }}>
          The Deadlock API may be temporarily unavailable. Try again in a moment.
        </div>
      </div>
    );
  }

  const byWinRate = [...combos].sort((a, b) => b.wr - a.wr);
  const byPlayed = [...combos].sort((a, b) => (b.matches ?? 0) - (a.matches ?? 0));
  const heroStatsSorted = [...heroStats].sort((a, b) => b.wr - a.wr);

  const comboList = tab === 'winrate' ? byWinRate : tab === 'played' ? byPlayed : [];
  const showHeroes = tab === 'heroes';

  return (
    <div style={{
      background: 'var(--bg-1)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px 0',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 12,
        }}>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700,
            letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text)',
          }}>Synergy Report</h2>
          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
            {combos.length} combo{combos.length !== 1 ? 's' : ''} found · {heroStats.length} heroes analyzed
          </span>
        </div>
        <div style={{ display: 'flex', gap: 0 }}>
          <Tab label="Best Win Rate" active={tab === 'winrate'} onClick={() => setTab('winrate')} />
          <Tab label="Most Played" active={tab === 'played'} onClick={() => setTab('played')} />
          <Tab label="Hero Stats" active={tab === 'heroes'} onClick={() => setTab('heroes')} />
        </div>
      </div>

      {/* Content */}
      <div>
        {showHeroes ? (
          heroStatsSorted.length === 0 ? (
            <EmptyState message="No hero stats returned for this pool and rank filter." />
          ) : heroStatsSorted.map(stat => (
            <HeroStatRow key={stat.id} stat={stat} />
          ))
        ) : (
          comboList.length === 0 ? (
            <EmptyState message={`No combo data found. Try adding more heroes or removing the rank filter.`} />
          ) : (
            <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {comboList.slice(0, 20).map((combo, i) => (
                <ComboCard key={i} combo={combo} />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
