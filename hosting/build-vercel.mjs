// Emits a Vercel Build Output API v3 bundle from the RedwoodSDK build.
import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';

const out = '.vercel/output';
const fn = `${out}/functions/index.func`;

rmSync(out, { force: true, recursive: true });
mkdirSync(fn, { recursive: true });
cpSync('dist/client', `${out}/static`, { recursive: true });
cpSync('dist/worker/index.js', `${fn}/dist/worker/index.js`);
cpSync('hosting/node-handler.mjs', `${fn}/hosting/node-handler.mjs`);

writeFileSync(
  `${fn}/index.mjs`,
  `import { handle } from './hosting/node-handler.mjs';\nexport default { fetch: request => handle(request) };\n`,
);
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
  JSON.stringify({ version: 3, routes: [{ handle: 'filesystem' }, { src: '/(.*)', dest: '/index' }] }, null, 2),
);
