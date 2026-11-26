'use client';

import { hrefToTarget } from '@/lib/href';
import type { ComponentProps, ReactNode } from 'react';

type Props = Omit<ComponentProps<'a'>, 'children' | 'href'> & {
  children?: ReactNode;
  href: string;
  prefetch?: boolean | 'auto' | 'hover';
};

// RedwoodSDK intercepts same-origin <a> clicks and turns them into RSC navigations.
export function FastLink({ children = null, href, prefetch: _prefetch, ...props }: Props) {
  return (
    <a {...props} href={hrefToTarget(href)}>
      {children}
    </a>
  );
}
