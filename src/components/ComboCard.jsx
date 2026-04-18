import { HeroAvatar } from './HeroAvatar';

function WrBadge({ wr }) {
  const color = wr >= 55 ? 'var(--green)' : wr <= 45 ? 'var(--red)' : 'var(--accent)';
  const bg = wr >= 55 ? 'var(--green-dim)' : wr <= 45 ? 'var(--red-dim)' : 'var(--accent-dim)';
  return (
    <div style={{
      background: bg, border: `1px solid ${color}40`,
      borderRadius: 6, padding: '6px 12px', textAlign: 'center', flexShrink: 0,
    }}>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color, lineHeight: 1 }}>
        {wr.toFixed(1)}%
      </div>
      <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 2 }}>win rate</div>
    </div>
  );
}

export function ComboCard({ combo, rank }) {
  const { heroDetails, wr, matches, wins } = combo;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      background: 'var(--bg-1)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', padding: '12px 14px',
      transition: 'border-color 0.15s',
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-bright)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      {/* Hero avatars */}
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', flex: 1, minWidth: 0 }}>
        {heroDetails.map((hero, i) => (
          <div key={hero.id} style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: hero.color + '12',
            border: `1px solid ${hero.color}25`,
            borderRadius: 999, padding: '3px 8px 3px 4px',
          }}>
            <HeroAvatar hero={hero} size={24} />
            <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)', whiteSpace: 'nowrap' }}>
              {hero.name}
            </span>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: 'var(--text-3)' }}>
            {wins?.toLocaleString()} / {matches?.toLocaleString()} games
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 1 }}>
            {heroDetails.length === 2 ? 'duo' : heroDetails.length === 3 ? 'trio' : `${heroDetails.length}-stack`}
          </div>
        </div>
        <WrBadge wr={wr} />
      </div>
    </div>
  );
}
