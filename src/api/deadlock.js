const BASE = 'https://api.deadlock-api.com';

async function get(path, params = {}) {
  const url = new URL(BASE + path);
  Object.entries(params).forEach(([k, v]) => {
    if (Array.isArray(v)) v.forEach(val => url.searchParams.append(k, val));
    else if (v !== '' && v !== null && v !== undefined) url.searchParams.append(k, v);
  });
  const res = await fetch(url.toString(), { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`API ${res.status} at ${path}`);
  return res.json();
}

export async function fetchHeroStats(heroIds, { minBadge, maxBadge } = {}) {
  return get('/v1/analytics/hero-stats', {
    hero_ids: heroIds,
    min_average_badge: minBadge,
    max_average_badge: maxBadge,
  });
}

// Fetch ALL combos of a given size, then filter client-side.
// Do NOT pass include_hero_ids with the whole pool — that means AND logic (all must be in one combo).
export async function fetchCombStats(combSize, { minBadge, maxBadge } = {}) {
  return get('/v1/analytics/hero-comb-stats', {
    comb_size: combSize,
    min_matches: 15,
    min_average_badge: minBadge,
    max_average_badge: maxBadge,
  });
}