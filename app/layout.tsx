import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getConfig } from '@/config'
import ConfigProvider from '@/components/providers/ConfigProvider'

export async function generateMetadata(): Promise<Metadata> {
  const config = await getConfig()

  return {
    title: config.meta.title,
    description: config.meta.description,
    keywords: config.meta.keywords,
    openGraph: {
      title: config.meta.title,
      description: config.meta.description,
      type: 'website',
      locale: 'ja_JP',
      url: config.links.siteUrl,
      images: [
        {
          url: config.links.ogImageUrl,
          width: 1200,
          height: 630,
          alt: config.meta.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: config.meta.title,
      description: config.meta.description,
      images: [config.links.ogImageUrl],
    },
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const config = await getConfig()

  return (
    <html lang="ja" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600&family=Noto+Serif+JP:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans text-text-primary antialiased">
        <ConfigProvider initialConfig={config}>
          <Header />
          <main className="min-h-screen relative">
            <div className="absolute inset-0 pointer-events-none blur-3xl opacity-40" aria-hidden>
              <div className="absolute -top-32 left-12 h-64 w-64 rounded-full bg-accent/20" />
              <div className="absolute top-1/3 right-10 h-72 w-72 rounded-full bg-accent/10" />
            </div>
            <div className="relative">
              {children}
            </div>
          </main>
          <Footer />
        </ConfigProvider>
      </body>
    </html>
  )
}
