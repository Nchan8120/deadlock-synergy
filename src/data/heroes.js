export const HEROES = [
  { id: 1,  name: 'Infernus',    color: '#e8624a' },
  { id: 2,  name: 'Seven',       color: '#4a9fe8' },
  { id: 3,  name: 'Vindicta',    color: '#c44ae8' },
  { id: 4,  name: 'Lady Geist',  color: '#e84a7a' },
  { id: 6,  name: 'Abrams',      color: '#e8a24a' },
  { id: 7,  name: 'Wraith',      color: '#4ae89a' },
  { id: 8,  name: 'McGinnis',    color: '#e84a4a' },
  { id: 10, name: 'Paradox',     color: '#4ae8d8' },
  { id: 11, name: 'Dynamo',      color: '#a2e84a' },
  { id: 12, name: 'Kelvin',      color: '#4a7ae8' },
  { id: 13, name: 'Haze',        color: '#d84ae8' },
  { id: 14, name: 'Holliday',    color: '#e8c44a' },
  { id: 15, name: 'Bebop',       color: '#4ae8c4' },
  { id: 17, name: 'Grey Talon',  color: '#a2a2e8' },
  { id: 18, name: 'Mo & Krill',  color: '#7ae84a' },
  { id: 19, name: 'Shiv',        color: '#e8624a' },
  { id: 20, name: 'Ivy',         color: '#4ae87a' },
  { id: 25, name: 'Warden',      color: '#e87a4a' },
  { id: 27, name: 'Yamato',      color: '#e84a4a' },
  { id: 31, name: 'Lash',        color: '#c8e84a' },
  { id: 35, name: 'Viscous',     color: '#4acce8' },
  { id: 50, name: 'Mirage',      color: '#e8b24a' },
  { id: 52, name: 'Calico',      color: '#e84aaa' },
  { id: 53, name: 'Fathom',      color: '#4a7ce8' },
  { id: 55, name: 'Pocket',      color: '#7c4ae8' },
  { id: 56, name: 'Sinclair',    color: '#4ae8bc' },
  { id: 57, name: 'Tokamak',     color: '#e8a44a' },
  { id: 58, name: 'Trapper',     color: '#4ae864' },
  { id: 59, name: 'Viper',       color: '#8ae84a' },
  { id: 60, name: 'Wrecker',     color: '#e86c4a' },
  { id: 62, name: 'Vyper',       color: '#e84ac8' },
  { id: 65, name: 'Lash',        color: '#c8e84a' },
].filter((h, i, arr) => arr.findIndex(x => x.id === h.id) === i)
  .sort((a, b) => a.name.localeCompare(b.name));

export const HERO_BY_ID = Object.fromEntries(HEROES.map(h => [h.id, h]));

export const RANKS = [
  { label: 'All Ranks', value: '' },
  { label: 'Obscurus',  value: '0' },
  { label: 'Initiate',  value: '1' },
  { label: 'Seeker',    value: '2' },
  { label: 'Alchemist', value: '3' },
  { label: 'Arcanist',  value: '4' },
  { label: 'Ritualist', value: '5' },
  { label: 'Emissary',  value: '6' },
  { label: 'Archon',    value: '7' },
  { label: 'Oracle',    value: '8' },
  { label: 'Phantom',   value: '9' },
  { label: 'Ascendant', value: '10' },
  { label: 'Eternus',   value: '11' },
];

export function heroImgUrl(heroId) {
  return `https://assets.deadlock-api.com/v2/heroes/${heroId}/images/icon_hero_card`;
}
