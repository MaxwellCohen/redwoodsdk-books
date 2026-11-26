/** Matches Next `cacheLife('hours')`: revalidate 1h. */
export const CATALOG_CACHE_TTL_SECONDS = 3600;

/** Host-provided shared store: Workers KV, Vercel Runtime Cache or Netlify Blobs. */
export type CatalogStore = {
  get(key: string): Promise<unknown>;
  put(key: string, value: unknown, ttlSeconds: number): Promise<void>;
};

type Entry<T> = { expiresAt: number; value: T };

const TTL_MS = CATALOG_CACHE_TTL_SECONDS * 1000;
const memory = new Map<string, Entry<unknown>>();
const inflight = new Map<string, Promise<unknown>>();

let boundStore: CatalogStore | undefined;

export function bindCatalogStore(store: CatalogStore | undefined) {
  if (store) boundStore = store;
}

/** Falls back to the Workers Cache API (per-colo) when no shared store is bound. */
const edgeCacheStore: CatalogStore = {
  async get(key) {
    const cache = (globalThis as { caches?: CacheStorage & { default?: Cache } }).caches?.default;
    const hit = await cache?.match(edgeRequest(key));
    return hit?.ok ? hit.json() : undefined;
  },
  async put(key, value, ttlSeconds) {
    const cache = (globalThis as { caches?: CacheStorage & { default?: Cache } }).caches?.default;
    await cache?.put(
      edgeRequest(key),
      new Response(JSON.stringify(value), {
        headers: { 'Cache-Control': `max-age=${ttlSeconds}`, 'Content-Type': 'application/json' },
      }),
    );
  },
};

function edgeRequest(key: string) {
  return new Request(`https://books-catalog-cache.internal/v1/${encodeURIComponent(key)}`);
}

function store(): CatalogStore {
  return (
    boundStore ?? (globalThis as { __BOOKS_CATALOG_STORE__?: CatalogStore }).__BOOKS_CATALOG_STORE__ ?? edgeCacheStore
  );
}

async function cached<T>(key: string, load: () => Promise<T>): Promise<T> {
  const hit = memory.get(key) as Entry<T> | undefined;
  if (hit && hit.expiresAt > Date.now()) return hit.value;

  const pending = inflight.get(key);
  if (pending) return pending as Promise<T>;

  const next = (async () => {
    const remote = (await store()
      .get(key)
      .catch(() => undefined)) as T | undefined;
    if (remote != null) {
      memory.set(key, { expiresAt: Date.now() + TTL_MS, value: remote });
      return remote;
    }

    const value = await load();
    memory.set(key, { expiresAt: Date.now() + TTL_MS, value });
    await store()
      .put(key, value, CATALOG_CACHE_TTL_SECONDS)
      .catch(() => undefined);
    return value;
  })().finally(() => inflight.delete(key));

  inflight.set(key, next);
  return next;
}

export function withTtlCache<Args extends unknown[], Result>(
  name: string,
  fn: (...args: Args) => Promise<Result>,
): (...args: Args) => Promise<Result> {
  return (...args: Args) => cached(`${name}:${JSON.stringify(args)}`, () => fn(...args));
}
