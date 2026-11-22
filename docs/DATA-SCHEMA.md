# Style Zone data schema

All records use schema version `1`. Outfit and piece notes have YAML frontmatter, a title and a freeform Markdown body. IDs are lowercase letters, numbers and hyphens; keep them stable across renames. Unknown properties are preserved by the editor. Prices are numbers or `null`, never a string or an inferred zero.

## Outfit records

`Outfits/<stable-id>.md` contains `schema`, `type: outfit`, `id`, `title`, `season`, `styles` (array), `colors` (array), `occasions` (array), `piece_ids` (array), `image` (relative to the wardrobe folder), `image_credit`, and `source_urls` (array). Body text explains the combination and any practical substitutions. Images are inspiration, not proof that shopping equivalents match the original garments.

Shoppable equipment sets also contain `equipment`, an object mapping slot IDs to exact piece IDs. Every equipped ID must be in `piece_ids`. The supported slots are `shoes`, `socks`, `lower`, `base`, `shirt`, `outer`, `neck`, `wrist`, `accessories`, `glasses`, and `hat`. `base` is layer 0, `shirt` is layer 1, and `outer` is layer 2. Slots can be empty. The visual board uses product photos from the equipped records, never an unrelated runway photograph. Legacy inspiration notes can be preserved in Research.

A missing or empty equipment map is reconstructed in memory from referenced pieces and their compatible slots. A nonempty explicit map remains authoritative, preserving deliberately empty slots. Recovery does not rewrite the source note. New rating snapshots retain the recovered map. Outfits without any verified equipped products stay readable under Ideas needing exact products and are excluded from Quick rate. No files or rating events are deleted by this display rule.

On first open, the plugin adds missing generic starter records with create-only writes. Existing IDs and occupied paths win, including notes arriving concurrently through sync. Plugin-local settings mark that starter catalog version as prepared for the configured home, so later opens do not resurrect deleted starters. The explicit Add starter outfit ideas command can restore missing records.

`collection` optionally groups curated outfits without changing their IDs or taste tags. A collection filter combines with palette, price and the other filters. With equal preference scores, outfits with a valid current styling preview sort before unrendered outfits; explicit price, rating and title sorts retain their meaning.

`style_preview` optionally contains `kind: ai-styling-preview`, `image` (a relative vault asset path), `signature`, `generated_at` and `prompt_path`. The signature is a deterministic JSON description of the exact equipped item identities, color variants and photo sources. It binds the illustration to those products. A render displays only when its signature matches current equipment and all referenced pieces remain verified. A swap falls back to exact photos; saving a variation clears its inherited render. This does not delete the original image or alter earlier ratings. Renders are approximate styling illustrations and visibly labeled; they never replace product photographs as purchase evidence. Prompts, source photographs and outputs remain private vault assets.

## Piece records

`Pieces/<stable-id>.md` contains `schema`, `type: piece`, `id`, `title`, `category`, `colors` (array), `ownership` (`owned`, `wishlist` or `reference`), `price` (number or null), `currency` (USD for UI editing), `store`, `product_url`, `price_checked_at` (ISO date or empty), `price_note`, and `image`. Body text can record fit and fabric notes. Never infer ownership from an inspiration image.

Product option records add `slot`, `compatible_slots` (array), `product_id`, `sku` (an observed available variant SKU, not a user size selection), `image_source_url`, `image_credit`, `product_checked_at`, `availability` (`available`, `unavailable` or `unverified`) and `available_sizes`. A verified option requires an exact product URL, photo, price, product identifier and dated available status. Category pages and approximate equivalents cannot become shoppable visual items. Editing the identity, retailer link or photo clears verification until researched again.

`variant_color` optionally identifies an exact retailer Color option. Refreshes then consider only available variants of that color and use its variant photo and price range. Another color being available cannot make this color shoppable. A variant parameter in a buy link is an observed option reference, not the user's chosen size.

To research a set, read all piece notes for each compatible slot before adding products. Collect options across slots rather than duplicating a product per outfit. Save price and available variant evidence from official retailers in Research; retain product photo provenance. Exclude unavailable leads from the selectable slot options. Stock is observed at the recorded time, not monitored live.

Known shopping cost sums only pieces that are not owned. Missing records, unknown prices and non-USD prices make the total incomplete. Partial totals display the number of unpriced pieces. No currency conversion or live price refresh is implied.

## Rating events

`Ratings/<UUID>.md` contains YAML fields `schema`, `type: rating`, `id`, `outfit_id`, `rating` (integer 1–5), `created_at` (ISO timestamp), `note`, `reasons` (array) and `snapshot`. The snapshot stores the outfit title, styles, colors and occasions at rating time. A readable body repeats the score and feedback. Frontmatter is the structured source of truth.

New snapshots also retain `piece_ids` and `equipment`, allowing the stylist to inspect exact product and slot preferences even after a set changes. Older events without these optional fields remain valid.

Create a new file for every vote, including a changed opinion. Never edit previous events to simulate a new rating. Select the event with the greatest `created_at`, breaking timestamp ties lexically by `id`, for the current opinion. Different devices can create independent event files. Synced clock skew can affect timestamp ordering; conflict copies remain available for review.

## Preference signals

For each latest outfit rating, accumulate `rating - 3` for each distinct style, color and occasion in its snapshot. A feature score is `sum / (count + 3)`, which shrinks weak evidence toward neutral. Recommendation scores combine matching features and normalize by the square root of the number of matches. Display the evidence count and average rating with the signal. This is an interpretable local ranking, not proof of which feature caused the opinion.

For future suggestions, read the current catalog and rating files, consider written reasons alongside scores, and propose combinations using stable piece IDs. Preserve room for variety rather than treating a low-sample preference as a permanent rule.
