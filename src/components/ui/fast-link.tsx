'use client';

import { hrefToTarget } from '@/lib/href';
import type { ComponentProps, ReactNode } from 'react';

type Props = Omit<ComponentProps<'a'>, 'children' | 'href'> & {
  children?: ReactNode;
  href: string;
  prefetch?: boolean | 'auto' | 'hover';
};

// RedwoodSDK intercepts same-origin <a> clicks and turns them into RSC navigations.
// <link rel="x-prefetch"> asks RedwoodSDK to warm its client navigation cache for that URL.
export function FastLink({ children = null, href, prefetch, ...props }: Props) {
  const target = hrefToTarget(href);

  return (
    <>
      {prefetch === true ? <link href={target} rel="x-prefetch" /> : null}
      <a {...props} href={target}>
        {children}
      </a>
    </>
  );
}
