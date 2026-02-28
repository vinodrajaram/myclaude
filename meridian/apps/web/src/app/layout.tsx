import type { Metadata } from 'next'
import { IBM_Plex_Sans, IBM_Plex_Mono, Cormorant_Garamond } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'

const ibmPlexSans = IBM_Plex_Sans({
  weight: ['300', '400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-ibm-sans',
})

const ibmPlexMono = IBM_Plex_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-ibm-mono',
})

const cormorantGaramond = Cormorant_Garamond({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-cormorant',
})

export const metadata: Metadata = {
  title: 'MERIDIAN',
  description: 'Investment banking intelligence platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){if(localStorage.getItem('meridian-theme')==='dark')document.documentElement.classList.add('dark')})()`,
          }}
        />
      </head>
      <body
        className={`${ibmPlexSans.variable} ${ibmPlexMono.variable} ${cormorantGaramond.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
