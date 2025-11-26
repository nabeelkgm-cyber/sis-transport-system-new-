// app/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SIS Transport Management System',
  description: 'Transport Management System for Shantiniketan Indian School',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
