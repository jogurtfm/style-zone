# Style Zone working rules

The public repository contains plugin and browser source, generic starter templates and documentation. Personal wardrobe data lives in a configured Obsidian vault outside this repository. `.local` holds private machine configuration and test artifacts.

Read `docs/DATA-SCHEMA.md` before adding records or changing persistence. Preserve stable IDs, handwritten Markdown, unknown frontmatter fields and every rating event. Re-read current files and detect concurrent changes before saving. Never invent ownership, prices, availability or user ratings. Store price observations with dates, source links and caveats.

Keep plugin runtime compatible with Obsidian mobile: no Node, Electron, absolute machine paths or filesystem adapters in `src/main.ts` or shared UI/model modules. Node filesystem code belongs only in local development scripts.

Verify meaningful persistence, filtering and ranking changes with the existing tests, plus typecheck and build. Publish only reviewed source and the three matched BRAT runtime assets. Do not add research photos, vault content, ratings, exports, credentials or local configuration to GitHub. A public release is not proof of phone installation.
