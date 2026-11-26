import { handle } from '../../hosting/node-handler.mjs';

export default (request, context) => handle(request, promise => context.waitUntil(promise));

export const config = { path: '/*', preferStatic: true };
