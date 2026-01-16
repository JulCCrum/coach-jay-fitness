import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Lessons Not Losses Fitness | Custom Meal Plans',
  description: 'Personalized nutrition coaching and custom meal plans designed for your goals, lifestyle, and preferences.',
  keywords: ['meal plans', 'nutrition coach', 'custom diet', 'personalized nutrition', 'weight loss', 'fitness'],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'LNL Fitness',
  },
  openGraph: {
    title: 'Lessons Not Losses Fitness | Custom Meal Plans',
    description: 'Personalized nutrition coaching and custom meal plans designed for your goals.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#c8ff00',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
