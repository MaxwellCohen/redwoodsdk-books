import { getCache, waitUntil } from '@vercel/functions';
import { handle } from './node-handler.mjs';

// Vercel Runtime Cache as the shared catalog cache across function instances.
globalThis.__BOOKS_CATALOG_STORE__ = {
  get: key => getCache({ namespace: 'catalog' }).get(key),
  put: (key, value, ttlSeconds) =>
    getCache({ namespace: 'catalog' }).set(key, value, { tags: ['catalog'], ttl: ttlSeconds }),
};

export default { fetch: request => handle(request, waitUntil) };
