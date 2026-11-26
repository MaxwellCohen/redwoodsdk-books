import { layout, render, route } from 'rwsdk/router';
import { defineApp } from 'rwsdk/worker';

import { Document } from '@/app/document';
import { Layout } from '@/app/layout';
import { BookPage } from '@/app/pages/book';
import { HomePage } from '@/app/pages/home';
import { NotFoundPage } from '@/app/pages/not-found';
import { trimTrailingSlash } from '@/app/trailing-slash';

export type AppContext = object;

export default defineApp([
  trimTrailingSlash(),
  render(Document, [
    layout(Layout, [
      route('/', HomePage),
      route('/:id', BookPage),
      route('/*', ({ response }) => {
        response.status = 404;
        return <NotFoundPage />;
      }),
    ]),
  ]),
]);
