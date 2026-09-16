import type { Metadata, Viewport } from 'next';
import './globals.css';
import '@/styles/portal.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
};

export const metadata: Metadata = {
  title: 'HỒ KIỆT – GAMEVUI 24H | Cổng Game Online Miễn Phí Hay Nhất',
  description:
    'Kho game online miễn phí của Hồ Kiệt với nhiều trò chơi vui nhộn, game 3D, hành động, bắn súng, đua xe, giải đố và nhiều thể loại khác. Chơi ngay không cần cài đặt!',
  keywords: [
    'hồ kiệt',
    'gamevui 24h',
    'bắn gà 3d',
    'chicken mayhem 3d',
    'game online miễn phí',
    'game 3d web',
    'mini game'
  ],
  authors: [{ name: 'Hồ Kiệt' }]
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
