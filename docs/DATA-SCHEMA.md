# Style Zone data schema

All records use schema version `1`. Outfit and piece notes have YAML frontmatter, a title and a freeform Markdown body. IDs are lowercase letters, numbers and hyphens; keep them stable across renames. Unknown properties are preserved by the editor. Prices are numbers or `null`, never a string or an inferred zero.

## Outfit records

`Outfits/<stable-id>.md` contains `schema`, `type: outfit`, `id`, `title`, `season`, `styles` (array), `colors` (array), `occasions` (array), `piece_ids` (array), `image` (relative to the wardrobe folder), `image_credit`, and `source_urls` (array). Body text explains the combination and any practical substitutions. Images are inspiration, not proof that shopping equivalents match the original garments.

## Piece records

`Pieces/<stable-id>.md` contains `schema`, `type: piece`, `id`, `title`, `category`, `colors` (array), `ownership` (`owned`, `wishlist` or `reference`), `price` (number or null), `currency` (USD for UI editing), `store`, `product_url`, `price_checked_at` (ISO date or empty), `price_note`, and `image`. Body text can record fit and fabric notes. Never infer ownership from an inspiration image.

Known shopping cost sums only pieces that are not owned. Missing records, unknown prices and non-USD prices make the total incomplete. Partial totals display the number of unpriced pieces. No currency conversion or live price refresh is implied.

## Rating events

`Ratings/<UUID>.md` contains YAML fields `schema`, `type: rating`, `id`, `outfit_id`, `rating` (integer 1–5), `created_at` (ISO timestamp), `note`, `reasons` (array) and `snapshot`. The snapshot stores the outfit title, styles, colors and occasions at rating time. A readable body repeats the score and feedback. Frontmatter is the structured source of truth.

Create a new file for every vote, including a changed opinion. Never edit previous events to simulate a new rating. Select the event with the greatest `created_at`, breaking timestamp ties lexically by `id`, for the current opinion. Different devices can create independent event files. Synced clock skew can affect timestamp ordering; conflict copies remain available for review.

## Preference signals

For each latest outfit rating, accumulate `rating - 3` for each distinct style, color and occasion in its snapshot. A feature score is `sum / (count + 3)`, which shrinks weak evidence toward neutral. Recommendation scores combine matching features and normalize by the square root of the number of matches. Display the evidence count and average rating with the signal. This is an interpretable local ranking, not proof of which feature caused the opinion.

For future suggestions, read the current catalog and rating files, consider written reasons alongside scores, and propose combinations using stable piece IDs. Preserve room for variety rather than treating a low-sample preference as a permanent rule.
