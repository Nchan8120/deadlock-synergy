const BASE = 'https://api.deadlock-api.com';

async function get(path, params = {}) {
  const url = new URL(BASE + path);
  Object.entries(params).forEach(([k, v]) => {
    if (Array.isArray(v)) v.forEach(val => url.searchParams.append(k, val));
    else if (v !== '' && v !== null && v !== undefined) url.searchParams.append(k, v);
  });
  const res = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${url.toString()}`);
  return res.json();
}

/**
 * Fetch overall hero stats for the given hero IDs.
 * @param {number[]} heroIds
 * @param {object} filters - { minBadge, maxBadge }
 */
export async function fetchHeroStats(heroIds, { minBadge, maxBadge } = {}) {
  return get('/v2/analytics/hero-stats', {
    hero_ids: heroIds,
    min_average_badge: minBadge,
    max_average_badge: maxBadge,
  });
}

/**
 * Fetch hero combo (synergy) stats for the given hero IDs.
 * The API returns pair/trio win-rate data.
 * @param {number[]} heroIds
 * @param {object} filters
 */
export async function fetchHeroComboStats(heroIds, { minBadge, maxBadge } = {}) {
  return get('/v2/analytics/hero-combo-stats', {
    hero_ids: heroIds,
    min_average_badge: minBadge,
    max_average_badge: maxBadge,
  });
}

/**
 * Fetch all heroes list from assets API.
 */
export async function fetchAllHeroes() {
  const res = await fetch('https://assets.deadlock-api.com/v2/heroes?only_active=true');
  if (!res.ok) throw new Error('Failed to load heroes list');
  return res.json();
}
