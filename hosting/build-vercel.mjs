// Emits a Vercel Build Output API v3 bundle from the RedwoodSDK build.
import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { build } from 'esbuild';

const out = '.vercel/output';
const fn = `${out}/functions/index.func`;

rmSync(out, { force: true, recursive: true });
mkdirSync(fn, { recursive: true });
cpSync('dist/client', `${out}/static`, { recursive: true });

await build({
  banner: { js: "import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);" },
  bundle: true,
  entryPoints: ['hosting/vercel-entry.mjs'],
  format: 'esm',
  outfile: `${fn}/index.mjs`,
  platform: 'node',
  target: 'node24',
});

writeFileSync(`${fn}/package.json`, JSON.stringify({ type: 'module' }));
writeFileSync(
  `${fn}/.vc-config.json`,
  JSON.stringify({
    handler: 'index.mjs',
    launcherType: 'Nodejs',
    runtime: 'nodejs24.x',
    supportsResponseStreaming: true,
  }),
);
writeFileSync(
  `${out}/config.json`,
  JSON.stringify(
    {
      version: 3,
      routes: [
        {
          src: '/assets/(.*)',
          headers: { 'Cache-Control': 'public, max-age=31536000, immutable' },
          continue: true,
        },
        { handle: 'filesystem' },
        { src: '/(.*)', dest: '/index' },
      ],
    },
    null,
    2,
  ),
);
