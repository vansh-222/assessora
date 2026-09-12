// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Assessora — AI-Powered Academic Assessments',
    template: '%s | Assessora',
  },
  description:
    'Upload your study material and generate personalised Bloom\'s Taxonomy assessments powered by AI. Track your knowledge gaps and improve systematically.',
  keywords: ['assessment', 'quiz', 'bloom taxonomy', 'AI', 'education', 'study'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-slate-50 antialiased">{children}</body>
    </html>
  );
}
