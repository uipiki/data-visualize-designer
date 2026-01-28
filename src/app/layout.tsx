import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Data Visualize Designer',
  description: 'データ視覚化の原則に基づいた「正しいグラフ」を簡単に作成できるWebサービス',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}
