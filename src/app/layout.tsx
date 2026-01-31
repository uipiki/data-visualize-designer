import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://d20r-app.vercel.app'),
  title: 'Data Visualize Designer',
  description: 'データ視覚化のデザインを参考にしたグラフの出力ができるサイト',
  openGraph: {
    title: 'Data Visualize Designer',
    description: 'データ視覚化のデザインを参考にしたグラフの出力ができるサイト',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Data Visualize Designer',
    description: 'データ視覚化のデザインを参考にしたグラフの出力ができるサイト',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
