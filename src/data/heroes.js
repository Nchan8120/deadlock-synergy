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
  { label: 'All Ranks',  min: '',    max: ''    },
  { label: 'Obscurus',   min: '0',   max: '9'   },
  { label: 'Initiate',   min: '10',  max: '19'  },
  { label: 'Seeker',     min: '20',  max: '29'  },
  { label: 'Alchemist',  min: '30',  max: '39'  },
  { label: 'Arcanist',   min: '40',  max: '49'  },
  { label: 'Ritualist',  min: '50',  max: '59'  },
  { label: 'Emissary',   min: '60',  max: '69'  },
  { label: 'Archon',     min: '70',  max: '79'  },
  { label: 'Oracle',     min: '80',  max: '89'  },
  { label: 'Phantom',    min: '90',  max: '99'  },
  { label: 'Ascendant',  min: '100', max: '109' },
  { label: 'Eternus',    min: '110', max: '116' },
];

export function heroImgUrl(heroId) {
  return `https://assets.deadlock-api.com/v2/heroes/${heroId}/images/icon_hero_card.png`;
}
