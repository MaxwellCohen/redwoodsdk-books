import { getStore } from '@netlify/blobs';
import { handle } from '../../hosting/node-handler.mjs';

// Netlify Blobs as the shared catalog cache across function instances.
globalThis.__BOOKS_CATALOG_STORE__ = {
  async get(key) {
    const entry = await getStore('catalog-cache').get(key, { type: 'json' });
    return entry && entry.expiresAt > Date.now() ? entry.value : undefined;
  },
  put: (key, value, ttlSeconds) =>
    getStore('catalog-cache').setJSON(key, { expiresAt: Date.now() + ttlSeconds * 1000, value }),
};

export default (request, context) => handle(request, promise => context.waitUntil(promise));

export const config = { path: '/*', preferStatic: true };
