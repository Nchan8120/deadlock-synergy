# ⬡ Synergy Lock — Deadlock Party Analyzer

Find the best hero combos and win rates for your Deadlock party, powered by [deadlock-api.com](https://deadlock-api.com).

## Features

- **Up to 6 players** — add each player's hero pool (heroes they actually play)
- **Combo win rates** — see which duo/trio/stack combos from your pool have the highest win rates
- **Most played combos** — sorted by total games played together
- **Rank filter** — filter all data by rank bracket (Obscurus → Eternus)
- **Renameable players** — click any player name to rename them to a gamertag

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

The `dist/` folder can be deployed to Vercel, Netlify, GitHub Pages, etc.

## How to Use

1. Each player card = one person in your party
2. Click **"Add hero to pool"**, search, and select their heroes
3. Click a hero chip to remove it
4. Click a player's name to rename them
5. Optionally pick a rank bracket
6. Hit **Analyze Synergies**
7. Browse results:
   - **Best Win Rate** — highest win % combos
   - **Most Played** — most games played together
   - **Hero Stats** — individual hero win rates

## API

All data is free from [deadlock-api.com](https://deadlock-api.com) — no API key needed.

- `/v2/analytics/hero-stats` — per-hero win/pick rates
- `/v2/analytics/hero-combo-stats` — duo/trio combo stats
- Images from `assets.deadlock-api.com`

## Project Structure

```
src/
├── api/deadlock.js          # API fetch functions
├── components/
│   ├── HeroAvatar.jsx       # Hero image with fallback
│   ├── PlayerCard.jsx       # Player slot + hero pool manager
│   ├── ComboCard.jsx        # Single combo result row
│   └── ResultsPanel.jsx     # Tabbed results view
├── data/heroes.js           # Hero list, IDs, colors, ranks
├── hooks/
│   ├── usePlayers.js        # Player & pool state management
│   └── useSynergy.js        # API fetch + data normalization
└── App.jsx
```

## Notes

- Combo data may be sparse for small pools or niche rank brackets — broaden the pool or remove rank filter if results are empty
- Not affiliated with Valve or the Deadlock API team
