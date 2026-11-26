import type { RouteMiddleware } from 'rwsdk/router';

export const trimTrailingSlash =
  (): RouteMiddleware =>
  ({ request }) => {
    const url = new URL(request.url);
    if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
      url.pathname = url.pathname.replace(/\/+$/, '');
      return Response.redirect(url.toString(), 301);
    }
  };
