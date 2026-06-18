import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, Inter, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'

const grotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-grotesk' })
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
})

export const metadata: Metadata = {
  title: 'MEMETIME — The Visual History of Internet Culture',
  description:
    'An interactive museum of internet culture. Travel from 1996 to today through the memes that built the online world.',
}

export const viewport: Viewport = {
  themeColor: '#050816',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${grotesk.variable} ${inter.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
