import { AuthProvider } from '@/components/auth-provider'
import { QueryProvider } from '@/components/query-provider'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import '@/styles/globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata = {
  title: {
    default: 'Prevent - Protection Web Nouvelle Génération',
    template: '%s | Prevent',
  },
  description: 'Plateforme SaaS de cybersécurité pour protéger vos sites web contre les attaques en temps réel.',
  keywords: ['cybersécurité', 'protection web', 'DDoS', 'firewall', 'monitoring'],
  authors: [{ name: 'Prevent Team' }],
  creator: 'Prevent',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: '/',
    title: 'Prevent - Protection Web Nouvelle Génération',
    description: 'Plateforme SaaS de cybersécurité pour protéger vos sites web contre les attaques en temps réel.',
    siteName: 'Prevent',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prevent - Protection Web Nouvelle Génération',
    description: 'Plateforme SaaS de cybersécurité pour protéger vos sites web contre les attaques en temps réel.',
    creator: '@prevent_security',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={inter.variable} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <AuthProvider>
              <div className="relative flex min-h-screen flex-col">
                <div className="flex-1">{children}</div>
              </div>
              <Toaster />
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
