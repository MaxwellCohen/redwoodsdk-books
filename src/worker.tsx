import { layout, render, route } from 'rwsdk/router';
import { defineApp } from 'rwsdk/worker';
import { bindCatalogStore } from '@/lib/catalog-cache';

import { Document } from '@/app/document';
import { Layout } from '@/app/layout';
import { BookPage } from '@/app/pages/book';
import { HomePage } from '@/app/pages/home';
import { NotFoundPage } from '@/app/pages/not-found';
import { trimTrailingSlash } from '@/app/trailing-slash';

export type AppContext = object;

const app = defineApp([
  trimTrailingSlash(),
  render(Document, [
    layout(Layout, [
      route('/', HomePage),
      route('/:id', BookPage),
      route('/*', ({ response }) => {
        response.status = 404;
        return <NotFoundPage />;
      }),
    ]),
  ]),
]);

export default {
  ...app,
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const kv = env.CATALOG_CACHE;
    if (kv) {
      bindCatalogStore({
        get: key => kv.get(key, 'json'),
        put: (key, value, ttlSeconds) => kv.put(key, JSON.stringify(value), { expirationTtl: ttlSeconds }),
      });
    }
    return app.fetch(request, env, ctx);
  },
};
