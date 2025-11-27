'use client'

import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, Mail, Heart } from 'lucide-react'
import { useConfig } from '@/hooks/useConfig'

export default function Details() {
  const config = useConfig()

  return (
    <section id="details" className="section-shell bg-gradient-to-b from-white/80 via-base to-base">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <div className="eyebrow justify-center mb-4 text-accent">
            <Heart className="w-4 h-4" />
            {config.sections?.details?.eyebrow || 'Details'}
          </div>
          <h2 className="font-serif text-section-title text-text-primary mb-3">
            {config.sections?.details?.title || 'Details'}
          </h2>
          <p className="text-text-secondary">{config.sections?.details?.subtitle || '式詳細'}</p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Main Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="card-panel overflow-hidden"
          >
            {/* Header with couple names */}
            <div className="bg-gradient-to-r from-accent/15 via-white to-accent/10 px-8 py-10 text-center border-b border-line">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <p className="text-sm text-accent mb-3 tracking-[0.4em] uppercase">{config.sections?.details?.weddingCelebration || 'Wedding Celebration'}</p>
                <h3 className="font-serif text-3xl sm:text-4xl text-text-primary mb-2">
                  {config.couple.displayNames}
                </h3>
                {/* <p className="text-text-secondary text-sm">
                  {config.couple.bride.fullName} & {config.couple.groom.fullName}
                </p> */}
              </motion.div>
            </div>

            {/* Details Grid */}
            <div className="p-8 sm:p-12 space-y-10">
              {/* Date */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="pb-8 border-b border-line"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-text-secondary mb-2 tracking-wide uppercase">{config.sections?.details?.labels?.date || 'Date'}</h4>
                    <p className="text-xl sm:text-2xl font-serif text-text-primary">
                      {config.event.date}
                    </p>
                    <p className="text-sm text-text-muted mt-1">{config.event.dateEn}</p>
                  </div>
                </div>
              </motion.div>

              {/* Time */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="pb-8 border-b border-line"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-text-secondary mb-3 tracking-wide uppercase">{config.sections?.details?.labels?.schedule || 'Schedule'}</h4>
                    <div className="space-y-3">
                      <div className="flex items-baseline gap-3">
                        <span className="text-sm font-medium text-accent min-w-[60px]">
                          {config.event.ceremony.time}
                        </span>
                        <span className="text-base text-text-primary">
                          {config.event.ceremony.label}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-3">
                        <span className="text-sm font-medium text-accent min-w-[60px]">
                          {config.event.reception.timeStart}
                        </span>
                        <span className="text-base text-text-primary">
                          {config.event.reception.label}
                        </span>
                        <span className="text-sm text-text-muted">
                          〜 {config.event.reception.timeEnd}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Venue */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="pb-2"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-text-secondary mb-2 tracking-wide uppercase">{config.sections?.details?.labels?.venue || 'Venue'}</h4>
                    <p className="text-xl sm:text-2xl font-serif text-text-primary mb-1">
                      {config.event.venue.name}
                    </p>
                    <p className="text-sm text-text-secondary mb-2">{config.event.venue.room}</p>
                    <p className="text-sm text-text-muted">{config.event.venue.address}</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Contact Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-surface px-8 py-6 border-t border-line"
            >
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-center">
                <p className="text-sm text-text-muted">{config.sections?.details?.contactMessage || 'ご不明な点がございましたら'}</p>
                <a
                  href={`mailto:${config.contact.email}`}
                  className="inline-flex items-center gap-2 text-accent hover:text-accent-hover transition-colors font-medium"
                >
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{config.contact.email}</span>
                </a>
              </div>
            </motion.div>
          </motion.div>

          {/* RSVP Deadline Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 text-center"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-line bg-white/70 shadow-sm">
              <Heart className="w-4 h-4 text-accent" />
              <p className="text-sm text-text-secondary">
                <span className="font-medium text-text-primary">{config.sections?.details?.rsvpMessage?.prefix || 'ご出欠のご連絡は'}</span>は
                <span className="font-semibold text-accent mx-1">{config.event.rsvpDeadline}</span>
                {config.sections?.details?.rsvpMessage?.suffix || 'までにお願いいたします'}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
