// Runs the RedwoodSDK Cloudflare Worker bundle on a Node runtime (Vercel / Netlify).
// The host CDN serves dist/client, so the ASSETS binding only answers misses.
import worker from '../dist/worker/index.js';

const assets = { fetch: () => new Response('Not found', { status: 404 }) };

export function handle(request, waitUntil = promise => void promise.catch(() => {})) {
  const env = { ...process.env, ASSETS: assets };
  const ctx = { waitUntil, passThroughOnException() {}, props: {} };
  return worker.fetch(request, env, ctx);
}
