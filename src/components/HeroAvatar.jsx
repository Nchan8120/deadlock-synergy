import { useState } from 'react';
import { heroImgUrl } from '../data/heroes';

export function HeroAvatar({ hero, size = 28 }) {
  const [imgError, setImgError] = useState(false);

  const initials = hero.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        flexShrink: 0,
        background: hero.color + '33',
        border: `1.5px solid ${hero.color}55`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.36,
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        color: hero.color,
        letterSpacing: '0.03em',
      }}
    >
      {!imgError ? (
        <img
          src={hero.img}
          alt={hero.name}
          width={size}
          height={size}
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          onError={() => setImgError(true)}
        />
      ) : initials}
    </div>
  );
}
