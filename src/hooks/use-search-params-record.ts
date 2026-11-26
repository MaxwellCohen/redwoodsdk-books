'use client';

import { useRouter } from '@/lib/router';
import { queryToRecord } from '@/lib/href';

export function useSearchParamsRecord() {
  const { query } = useRouter();
  return queryToRecord(query);
}
