# Style Zone wardrobe

Your outfits, clothing records and ratings live here. Open the Style Zone command or shirt icon in Obsidian to browse them.

This folder is the wardrobe homebase inside the existing Relay shared root: `Sync/Style Zone` in the configured vault. Relay carries its contents between devices; BRAT distributes plugin code. Do not store wardrobe data inside `.obsidian/plugins/system3-relay`.

## Folders

- `Outfits` contains one Markdown note per suggested outfit.
- `Pieces` contains one Markdown note per owned piece or shopping idea.
- Each researched product record has a primary slot and compatible slots, exact buy link, photo source, price, sizes and observation date. The interface filters these records into an option database for each equipment slot.
- `Ratings` contains one Markdown note per rating event. Every 1–5 rating is preserved; your most recent rating per outfit drives the taste profile.
- `Inspirations` is a place to drop references you like.
- `Existing Pieces` is a place to drop photos of clothes you own. Use Add a piece to catalog each photo, or ask your stylist to turn the files into piece records.
- `Assets/Research` contains the starter research photos. These travel through your vault sync, separately from plugin updates.
- `Assets/Uploads` contains photos attached through the interface.
- `Exports` contains explicit exports for your stylist.
- `Research` contains collected sources, visual indexes and research notes. The workspace `agentresearch` shortcut points here.
- `Research/Product Research 2026-11-22` contains official retailer observations and the slot option index. Earlier approximate outfit ideas are preserved in `Research/Archived Ideas 2026-11-21`.

## Working with your stylist

Tell the agent to read this folder, the outfit and piece notes, and all rating notes. Markdown frontmatter contains the structured fields. Body text contains styling and personal notes. No special database service or API key is needed.

Keep IDs stable. Use existing piece IDs when creating new combinations. Never mark an idea as owned without confirmation. A blank price means unknown. Price observations have a date and source link; they are not live inventory promises. Preserve all rating notes, including earlier opinions. Read the latest files before editing, and preserve handwritten notes and unknown properties.

Drop folders are inboxes. Dropping an image alone does not infer its garment, price, tags or ownership. The UI or a stylist must create the corresponding record before it participates in filters and outfit costs.

## Phone setup

Use the same synced vault on your phone. Install Style Zone through BRAT with repository `jogurtfm/style-zone`, then open **Style Zone: Open wardrobe**. The plugin settings default to `Sync/Style Zone`.

Ratings and catalog records are Markdown notes; photos use ordinary image files. Let your existing vault sync finish on both devices. GitHub distributes the plugin; your vault sync carries wardrobe data. A browser running on your PC is a separate local view of those same files and does not need to stay running for the phone plugin.

The public plugin contains starter note templates. Starter photographs stay in your vault. If you use a new vault without the research assets, the plugin still opens, and you can attach your own photos.
