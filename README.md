# Style Zone

Explore outfit ideas, filter by palette, style, occasion, store and shopping cost, and rate looks from 1 to 5. The browser and Obsidian plugin share one interface and one readable wardrobe collection.

## Use in Obsidian and on your phone

Install with BRAT using **jogurtfm/style-zone**. Open **Style Zone: Open wardrobe** from the command palette or the shirt ribbon icon. The default data folder is `Sync/Style Zone` inside your vault. Point both devices at the same synced vault and let notes and image attachments sync.

Version 0.3.0 adds head-to-toe product flat lays in Loadouts, Quick rate and the set editor. Tap a photographed item to inspect or swap it, or switch to the equipment grid. Earlier inspiration notes without exact products remain in the expandable **Ideas needing exact products** list instead of appearing as empty rating cards. Empty legacy equipment maps recover their slots from referenced items. Mobile tiles have explicit heights and rating photos load eagerly with retailer-CDN fallback.

The wardrobe homebase is the `Style Zone` subdirectory of the configured Relay root (`Sync` on this desktop), including research and drop folders. If the same shared root has a different local name on your phone, set the wardrobe folder to that root followed by `/Style Zone` in Style Zone settings.

The first release supports desktop and mobile through Obsidian APIs, without Node or Electron calls in the plugin. The phone itself still needs a device installation and check. A successful GitHub release does not establish that a phone has installed it.

The first open adds missing starter records once per configured wardrobe home. Existing IDs, handwritten notes and rating history are preserved. Subsequent opens respect deleted starter notes. To restore missing starters manually, run **Style Zone: Add starter outfit ideas**. The starter catalog contains 6 equipment sets and 28 exact products with dated retailer observations; it makes no claim that you own them. Product photos are stored as private vault assets, with a fallback to their original retailer CDN URLs. Binary photographs are not bundled into the public release.

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
- Inspect tagged product photos in an equipment board. Slots include shoes, socks, lower body, base layer, shirt, outer layer, neck, wrist, accessories, glasses and hat. Optional slots can stay empty.
- Open a slot to compare researched alternatives, swap products and save a new set. The original set stays intact. The item database keeps at least two starter choices for every slot, including compatible layering slots.
- Filter palettes, styles, occasions, stores, rating status and maximum USD cost to buy. Only owned items contribute zero cost. Unknown prices are excluded from a strict budget filter unless explicitly included.
- Open a product for the exact retailer page, photo credit, dated price and available size options. Rate complete sets with optional written feedback.
- Add pieces and outfits, attach images, and change ownership, prices and links. Handwritten note bodies and unfamiliar frontmatter fields are preserved.
- See a transparent taste profile, including patterns supported by few ratings. The latest rating per outfit is used once; history is retained. Signals are local feature associations, not a trained remote model.
- Export the catalog, complete rating history and derived preference summary as JSON for a stylist or language model. The agent can also read the Markdown folder directly.

Starter product observations were collected November 22, 2026 from the official Taylor Stitch, Thursday Boot Company and goodr storefronts. Every selected product had an available variant when checked; unavailable leads were excluded. The first batch leans toward heritage and casual clothing. Set totals range from $346 to $1,001 for every equipped item, before tax and shipping. Photos show exact products rather than approximations of runway garments. Prices, sizes and stock remain retailer snapshots. User records lacking verified product information are preserved separately from the shoppable item database.

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

To refresh the researched option evidence, use `node --use-system-ca scripts/scrape-slot-options.mjs --out .local/a-new-slot-report.json` with trusted Node 24+. It reads registered exact product URLs from the catalog, checks public retailer metadata and records available variants. It never overwrites wardrobe notes, ownership or ratings. Discover additional products from official retailers, assign their compatible slots, and review evidence before applying record updates. The current adapters cover Taylor Stitch, Thursday Boot Company and goodr.
