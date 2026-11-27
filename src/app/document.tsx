import type { DocumentProps } from 'rwsdk/router';
import styles from '@/styles.css?url';
// Same file Fontsource's @font-face in styles.css points at (content-hashed, so one asset).
import geistLatinWoff2 from '@fontsource-variable/geist/files/geist-latin-wght-normal.woff2?url';

const description =
  'Browse two million Goodreads books with RedwoodSDK, React Server Components, streaming search, and URL-driven filters.';

export const Document = ({ children }: DocumentProps) => (
  <html lang="en" suppressHydrationWarning>
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>RedwoodSDK Books</title>
      <meta name="description" content={description} />
      <meta name="theme-color" content="#fafafa" media="(prefers-color-scheme: light)" />
      <meta name="theme-color" content="#121212" media="(prefers-color-scheme: dark)" />
      <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      <link rel="preload" href={geistLatinWoff2} as="font" type="font/woff2" crossOrigin="anonymous" />
      <link rel="stylesheet" href={styles} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content="RedwoodSDK Books" />
      <meta property="og:title" content="RedwoodSDK Books" />
      <meta property="og:type" content="website" />
      <link rel="modulepreload" href="/src/client.tsx" />
    </head>
    <body className="bg-surface dark:bg-surface-dark text-black antialiased dark:text-white">
      {children}
      <script>import("/src/client.tsx")</script>
    </body>
  </html>
);
