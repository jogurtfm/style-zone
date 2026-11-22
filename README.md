# Style Zone

Explore outfit ideas, filter by palette, style, occasion, store and shopping cost, and rate looks from 1 to 5. The browser and Obsidian plugin share one interface and one readable wardrobe collection.

## Use in Obsidian and on your phone

Install with BRAT using **jogurtfm/style-zone**. Open **Style Zone: Open wardrobe** from the command palette or the shirt ribbon icon. The default data folder is `Sync/Style Zone` inside your vault. Point both devices at the same synced vault and let notes and image attachments sync.

The first release supports desktop and mobile through Obsidian APIs, without Node or Electron calls in the plugin. The phone itself still needs a device installation and check. A successful GitHub release does not establish that a phone has installed it.

If you need starting records, run **Style Zone: Add starter outfit ideas**. Existing IDs are preserved. The 12 ideas and 29 suggested equivalents are not claims about clothes you own. Research photographs are private vault assets and are not bundled into the public release. Missing photos display a style placeholder.

## Browser companion

Requires Node 20.11+ and npm. The local browser server binds only to `127.0.0.1` and reads the same wardrobe files as Obsidian.

```powershell
npm ci
npm run build
node scripts/setup-local.mjs --vault 'C:\Path\To\YourVault'
npm start
```

Open `http://127.0.0.1:8790`. On Windows, `Launch Style Zone.ps1` can start the configured companion in the background and open it. Local vault paths are saved only in ignored `.local/config.json`.

The browser server does not expose your vault over the internet. The phone uses the Obsidian plugin and vault sync directly.

## What you can do

- Browse a grid of suggestions or use Quick rate, with automatic progression and keyboard shortcuts 1–5.
- Filter palettes, styles, occasions, stores, rating status and maximum USD cost to buy. Only owned items contribute zero cost. Unknown prices are excluded from a strict budget filter unless explicitly included.
- Open a look for sources, credits, suggested equivalents, dated prices, retailer links and optional rating feedback.
- Add pieces and outfits, attach images, and change ownership, prices and links. Handwritten note bodies and unfamiliar frontmatter fields are preserved.
- See a transparent taste profile, including patterns supported by few ratings. The latest rating per outfit is used once; history is retained. Signals are local feature associations, not a trained remote model.
- Export the catalog, complete rating history and derived preference summary as JSON for a stylist or language model. The agent can also read the Markdown folder directly.

Most starter prices are deliberately blank until an exact equivalent is selected. Three observations were collected November 21, 2026: a Levi’s rugby listing, Levi’s 501 Clean Rigid jeans, and Clarks Brantin loafers. Prices are snapshots; sizes, colors, offers, tax and shipping can change. Store category links are labeled as browsing references.

## Readable data and sync

See [the vault guide](docs/VAULT-GUIDE.md) and [the data schema](docs/DATA-SCHEMA.md). No hidden database or cloud account is required. Records use stable IDs and versioned YAML frontmatter. Ratings are independent, immutable Markdown event files, reducing the chance of two devices overwriting each other’s votes. Concurrent changes to the same clothing note require reopening the item editor; Obsidian Sync conflict handling still applies.

GitHub contains code and generic starter templates. Personal records, photos, ratings, research downloads, exports, vault settings and credentials do not belong in this repository. There is no telemetry or automatic LLM network request.

## Development and release

```powershell
npm run typecheck
npm run build
npm test
```

`main.js`, `manifest.json` and `styles.css` are the three BRAT release assets. Keep the release tag and manifest version identical. Browser output is generated into ignored `dist/`. `scripts/github.mjs` uses an existing Windows Git Credential Manager login and Node 24 with `--use-system-ca`; credentials stay in memory. It checks authentication by default and publishes only with `--publish`.
