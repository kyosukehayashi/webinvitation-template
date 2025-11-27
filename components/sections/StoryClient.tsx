'use client'

import { useConfig } from '@/hooks/useConfig'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface StoryItem {
  type: 'image' | 'video'
  src: string
  title: string
  description: string
}

export default function StoryClient() {
  const config = useConfig()
  const stories = (config.story || []) as unknown as StoryItem[]

  // ストーリーがない場合は非表示
  if (stories.length === 0) {
    return null
  }

  return (
    <section id="story" className="section-shell section-shell--light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <p className="eyebrow justify-center mb-4 text-accent">Storyline</p>
          <h2 className="font-serif text-section-title text-text-primary">
            Our Story
          </h2>
          <p className="text-text-secondary text-sm mt-2">私たちの物語</p>
        </motion.div>

        <div className="relative max-w-5xl mx-auto space-y-12 sm:space-y-16">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-line/80 -translate-x-1/2 hidden md:block" />

          {stories.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className={`relative flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 md:gap-12 items-center`}
            >
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-accent rounded-full border-4 border-white shadow-sm hidden md:block z-10" />

              <div className="w-full md:w-1/2">
                <div className="relative w-full aspect-[4/3] rounded-md overflow-hidden shadow-sm border border-white/50 bg-surface group">
                  {item.type === 'video' ? (
                    <video
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    >
                      <source src={item.src} type="video/mp4" />
                    </video>
                  ) : (
                    <Image
                      src={item.src}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
                </div>
              </div>

              <div className={`w-full md:w-1/2 space-y-4 ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'} text-center`}>
                <div className="pill mx-auto md:mx-0 justify-center md:justify-start uppercase tracking-[0.4em]">
                  STORY {index + 1}
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl text-text-primary">
                  {item.title}
                </h3>
                <p className="text-body text-text-secondary leading-relaxed whitespace-pre-line">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}