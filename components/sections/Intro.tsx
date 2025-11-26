'use client'

import { motion } from 'framer-motion'
import { useConfig } from '@/hooks/useConfig'

export default function Intro() {
  const config = useConfig()

  return (
    <section className="section-shell bg-transparent relative">
      <div className="absolute inset-0 pointer-events-none opacity-60" aria-hidden>
        <div className="absolute top-0 left-1/3 h-40 w-40 rounded-full bg-accent/15 blur-[90px]" />
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="card-panel max-w-3xl mx-auto text-center p-8 sm:p-12 space-y-8"
        >
          <p className="eyebrow justify-center text-accent">
            Invitation
          </p>
          {config.messages.intro.map((text, index) => (
            <p key={index} className="text-body text-text-primary leading-relaxed tracking-wide font-light">
              {text.split('\n').map((line, i) => (
                <span key={i} className="block mb-2 last:mb-0">
                  {line}
                </span>
              ))}
            </p>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
