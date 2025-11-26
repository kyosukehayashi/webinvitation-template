'use client'

import { motion } from 'framer-motion'
import { MapPin, ExternalLink } from 'lucide-react'
import { useConfig } from '@/hooks/useConfig'

export default function Venue() {
  const config = useConfig()

  return (
    <section id="venue" className="section-shell bg-gradient-to-b from-base/80 via-surface to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <p className="eyebrow justify-center mb-3 text-accent">Venue</p>
          <h2 className="font-serif text-3xl sm:text-4xl text-text-primary">
            会場のご案内
          </h2>
          <p className="mt-3 text-sm text-text-secondary">
            迷わずお越しいただけるよう、所在地とアクセス情報をまとめました。
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="mx-auto max-w-5xl card-panel"
        >
          <div className="grid gap-8 lg:grid-cols-[1.1fr,1fr] p-6 sm:p-10">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">
                {config.event.venue.room}
              </p>
              <h3 className="font-serif text-2xl text-text-primary">
                {config.event.venue.name}
              </h3>
              <p className="flex items-start gap-2 text-sm text-text-secondary">
                <MapPin className="mt-1 h-4 w-4 text-accent" />
                <span>{config.event.venue.address}</span>
              </p>

              <div className="space-y-3 rounded-lg bg-base p-4">
                {config.access.methods.map((method) => (
                  <div key={method.type} className="space-y-1">
                    <p className="text-sm font-semibold text-text-primary">{method.type}</p>
                    <p className="text-sm text-text-secondary whitespace-pre-line">
                      {method.description}
                    </p>
                  </div>
                ))}
              </div>

              {config.access.notes.length > 0 && (
                <ul className="space-y-1 text-xs text-text-muted">
                  {config.access.notes.map((note, index) => (
                    <li key={index}>※{note}</li>
                  ))}
                </ul>
              )}

              <a
                href={config.event.venue.googleMapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-accent/40 px-5 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-white"
              >
                Google Maps で開く
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-100 shadow-inner">
              <div className="relative h-[320px] w-full bg-gray-100 sm:h-[380px]">
                <iframe
                  src={config.event.venue.mapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="会場地図"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
