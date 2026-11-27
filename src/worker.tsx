import { layout, render, route } from 'rwsdk/router';
import { defineApp, type RequestInfo } from 'rwsdk/worker';
import { bindCatalogStore } from '@/lib/catalog-cache';

import { Document } from '@/app/document';
import { Layout } from '@/app/layout';
import { BookPage } from '@/app/pages/book';
import { HomePage } from '@/app/pages/home';
import { NotFoundPage } from '@/app/pages/not-found';
import { trimTrailingSlash } from '@/app/trailing-slash';

export type AppContext = object;

/**
 * HTML and RSC navigation payloads (`?__rsc`, so a separate CDN key) for the catalog pages.
 * Browsers always revalidate; the Vercel/Netlify CDN keeps a copy for 5 minutes and may serve
 * it stale for up to an hour while it refetches. The catalog data itself is cached for 1 hour.
 */
const DOCUMENT_CACHE_CONTROL = 'public, max-age=0, s-maxage=300, stale-while-revalidate=3600';
const NO_STORE_CACHE_CONTROL = 'private, no-cache, no-store, max-age=0, must-revalidate';

/** Route middleware (runs before the page in the route's handler array). */
const cacheDocument = ({ response }: RequestInfo) => {
  response.headers.set('Cache-Control', DOCUMENT_CACHE_CONTROL);
};

const app = defineApp([
  trimTrailingSlash(),
  render(Document, [
    layout(Layout, [
      route('/', [cacheDocument, HomePage]),
      route('/:id', [cacheDocument, BookPage]),
      route('/*', ({ response }) => {
        response.status = 404;
        return <NotFoundPage />;
      }),
    ]),
  ]),
]);

export default {
  ...app,
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const kv = env.CATALOG_CACHE;
    if (kv) {
      bindCatalogStore({
        get: key => kv.get(key, 'json'),
        put: (key, value, ttlSeconds) => kv.put(key, JSON.stringify(value), { expirationTtl: ttlSeconds }),
      });
    }
    const response = await app.fetch(request, env, ctx);
    // A render error turns the page into a 500 that still carries the route's headers.
    if (response.status >= 400 && response.headers.get('Cache-Control')?.includes('s-maxage')) {
      response.headers.set('Cache-Control', NO_STORE_CACHE_CONTROL);
    }
    return response;
  },
};
