import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Lumbridge RPG Prototype',
  description: 'A standalone Next.js + Phaser sandbox for the Lumbridge RPG MVP.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="app-body">{children}</body>
    </html>
  );
}
