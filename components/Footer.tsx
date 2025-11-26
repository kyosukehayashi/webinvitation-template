'use client'

import { ArrowUp } from 'lucide-react'
import { useConfig } from '@/hooks/useConfig'

export default function Footer() {
  const config = useConfig()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative overflow-hidden bg-ink-primary text-white py-16 mt-8">
      <div className="absolute inset-0 opacity-60" aria-hidden>
        <div className="absolute -top-24 left-1/3 h-72 w-72 rounded-full bg-accent/40 blur-[120px]" />
        <div className="absolute bottom-0 right-12 h-48 w-48 rounded-full bg-white/20 blur-[80px]" />
      </div>
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <p className="eyebrow justify-center text-white/70">
              With Gratitude
            </p>
            <h3 className="font-serif text-3xl">
              ありがとうございます
            </h3>
            <p className="text-base leading-relaxed text-white/80">
              {config.messages.footer}
            </p>
          </div>

          <button
            onClick={scrollToTop}
            className="btn-pill text-white border border-white/30 hover:bg-white/10"
            aria-label="トップに戻る"
          >
            <ArrowUp className="w-4 h-4" />
            TOP
          </button>

          <div className="pt-8 border-t border-white/20">
            <p className="text-sm text-white/70">
              © 2026 {config.couple.displayNames} Wedding
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
