'use client';

import { createContext, use } from 'react';
import type { ReactNode } from 'react';

const UrlContext = createContext('/');

export function RouterProvider({ children, url }: { children: ReactNode; url: string }) {
  return <UrlContext value={url}>{children}</UrlContext>;
}

async function navigate(href: string, history: 'push' | 'replace', scroll = true) {
  const { navigate: rwNavigate } = await import('rwsdk/client');
  await rwNavigate(href, { history, info: { scrollToTop: scroll } });
}

export function useRouter() {
  const url = new URL(use(UrlContext), 'http://localhost');

  return {
    path: url.pathname,
    query: url.search.slice(1),
    back: () => window.history.back(),
    push: (href: string, options?: { scroll?: boolean }) => navigate(href, 'push', options?.scroll),
    replace: (href: string, options?: { scroll?: boolean }) => navigate(href, 'replace', options?.scroll),
  };
}
