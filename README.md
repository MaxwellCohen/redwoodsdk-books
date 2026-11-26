<div align="center">

<img src="public/logo.svg" alt="RedwoodSDK Books" width="72" height="72" />

# RedwoodSDK Books

RedwoodSDK Books is built from a Goodreads dataset of over 2,000,000 books. The live catalog includes books with usable cover images and uses [RedwoodSDK](https://rwsdk.com/), Drizzle, and PostgreSQL.

</div>

---

Rebuild of [vercel-labs/book-inventory](https://github.com/vercel-labs/book-inventory), now archived, ported to [RedwoodSDK](https://rwsdk.com/) (React Server Components on Cloudflare Workers). [Full dataset here](https://mengtingwan.github.io/data/goodreads.html).

## Run locally

```bash
pnpm install
pnpm dev
```

`POSTGRES_URL` is optional. Without it the app serves a small preview catalog.

```bash
pnpm types
pnpm build
```

## Deploy

- Cloudflare Workers: `pnpm deploy:cloudflare` (set the secret with `wrangler secret put POSTGRES_URL`).
- Vercel: `vercel.json` runs the build, then `hosting/build-vercel.mjs` wraps the Worker bundle in a Node function (Build Output API).
- Netlify: `netlify/functions/server.mjs` runs the same Worker bundle in a Netlify Function; static files come from `dist/client`.

## Testing

Playwright covers catalog search, filters, pagination, and book pages.

```bash
pnpm test:e2e
```

## Database

The original dataset contains more than two million Goodreads books. The schema uses PostgreSQL's `unaccent` extension for accent-insensitive title search:

```sql
CREATE EXTENSION IF NOT EXISTS unaccent;
```

The source dataset is available from the [UCSD Book Graph project](https://mengtingwan.github.io/data/goodreads.html).

Set `POSTGRES_URL`, then create the schema and load the bundled four-book sample:

```bash
pnpm db:setup
```

Optionally generate the cover-image placeholders after seeding:

```bash
pnpm db:seed-thumbhash
```
