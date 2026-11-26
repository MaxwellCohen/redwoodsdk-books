import type { RequestInfo } from 'rwsdk/worker';
import { BackToBooksLink } from '@/features/book/components/back-to-books-link';
import { BookDetail } from '@/features/book/components/book-detail';
import { queryToRecord } from '@/lib/href';
import { getApiDelayMs, parseSearchParams } from '@/lib/url-state';

export function BookPage({ params, request }: RequestInfo<{ id: string }>) {
  const searchParams = parseSearchParams(queryToRecord(new URL(request.url).search));

  return (
    <div className="flex flex-1 flex-col px-4 py-5 sm:px-6">
      <BackToBooksLink className="mb-6" />
      <div>
        <BookDetail delayMs={getApiDelayMs(searchParams)} id={params.id} />
      </div>
    </div>
  );
}
