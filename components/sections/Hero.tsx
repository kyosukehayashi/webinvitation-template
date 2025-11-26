'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useConfig } from '@/hooks/useConfig'

type TransitionType = 'fade' | 'slideLeft' | 'slideRight' | 'slideUp' | 'slideDown' | 'zoomIn' | 'zoomOut'

interface HeroAsset {
  type: 'image' | 'video'
  src: string
  alt: string
  transition: TransitionType
}

export default function Hero() {
  const config = useConfig()
  const shouldReducedMotion = useReducedMotion()
  const [activeIndex, setActiveIndex] = useState(0)
  const [heroAssets, setHeroAssets] = useState<HeroAsset[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showWelcome, setShowWelcome] = useState(true)

  // Refs for both foreground and background videos
  const fgVideoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const bgVideoRefs = useRef<(HTMLVideoElement | null)[]>([])

  // 設定からアセットを読み込む
  useEffect(() => {
    if (config.hero.assets && config.hero.assets.length > 0) {
      setHeroAssets(config.hero.assets as unknown as HeroAsset[])

      const timer = setTimeout(() => {
        setShowWelcome(false)
        setIsLoading(false)
      }, 2500)

      return () => clearTimeout(timer)
    } else {
      console.warn('⚠️ Heroアセットが設定されていません。config/wedding.config.tsを確認してください。')
      setIsLoading(false)
    }
  }, [config])

  // Unified Timer & Event Logic for Slide Rotation
  useEffect(() => {
    if (heroAssets.length === 0 || showWelcome || isLoading) {
      return
    }

    const currentAsset = heroAssets[activeIndex]
    const rotationInterval = config.hero.rotationInterval || 5000
    let timer: NodeJS.Timeout

    const handleNext = () => {
      setActiveIndex((current) => (current + 1) % heroAssets.length)
    }

    if (currentAsset.type === 'video') {
      const fgVideo = fgVideoRefs.current[activeIndex]

      // 1. Set max duration timer (min(video_length, rotationInterval))
      // We set the timer for rotationInterval. If video ends earlier, the ended event handles it.
      // If video is longer, this timer handles it.
      timer = setTimeout(handleNext, rotationInterval)

      // 2. Handle video ended event (if video is shorter than interval)
      if (fgVideo) {
        fgVideo.addEventListener('ended', handleNext)
      }

      return () => {
        clearTimeout(timer)
        if (fgVideo) {
          fgVideo.removeEventListener('ended', handleNext)
        }
      }
    } else {
      // Image: just use interval
      timer = setTimeout(handleNext, rotationInterval)
      return () => clearTimeout(timer)
    }
  }, [activeIndex, heroAssets, showWelcome, isLoading, config.hero.rotationInterval])

  // Video Playback Synchronization
  useEffect(() => {
    // Play active videos, pause others
    heroAssets.forEach((_, index) => {
      const fgVideo = fgVideoRefs.current[index]
      const bgVideo = bgVideoRefs.current[index]

      if (index === activeIndex) {
        // Reset and play active videos
        if (fgVideo) {
          fgVideo.currentTime = 0
          fgVideo.play().catch(() => { })
        }
        if (bgVideo) {
          bgVideo.currentTime = 0
          bgVideo.play().catch(() => { })
        }
      } else {
        // Pause inactive videos
        if (fgVideo) fgVideo.pause()
        if (bgVideo) bgVideo.pause()
      }
    })
  }, [activeIndex, heroAssets])

  // Preload next video
  useEffect(() => {
    if (heroAssets.length === 0) return
    const nextIndex = (activeIndex + 1) % heroAssets.length
    const nextAsset = heroAssets[nextIndex]

    if (nextAsset.type === 'video') {
      const fgVideo = fgVideoRefs.current[nextIndex]
      if (fgVideo && fgVideo.readyState < 4) {
        fgVideo.load()
      }
      const bgVideo = bgVideoRefs.current[nextIndex]
      if (bgVideo && bgVideo.readyState < 4) {
        bgVideo.load()
      }
    }
  }, [activeIndex, heroAssets])

  return (
    <motion.section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* 常に表示される暗いオーバーレイ */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/35 to-black/55 z-[2]" />

      {/* Loading/Welcome Background Overlay */}
      <motion.div
        className="absolute inset-0 z-[3] bg-gradient-to-br from-surface via-white to-accent/light/30"
        initial={{ opacity: 1 }}
        animate={{ opacity: showWelcome ? 1 : 0 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        style={{ pointerEvents: showWelcome ? 'auto' : 'none' }}
      >
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-0 left-0 w-96 h-96 bg-rose-200 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-slate-200 rounded-full blur-3xl" />
        </div>
      </motion.div>

      {/* 背景層: ぼかし動画/画像 */}
      <div className="absolute inset-0 z-0">
        {heroAssets.map((asset, index) => {
          const isActive = index === activeIndex
          return (
            <motion.div
              key={`bg-${asset.src}-${index}`}
              aria-hidden="true"
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{
                opacity: isActive ? 1 : 0,
                zIndex: isActive ? 1 : 0
              }}
              transition={{ duration: 1.5 }}
            >
              {asset.type === 'video' ? (
                <video
                  ref={(el) => { bgVideoRefs.current[index] = el }}
                  muted
                  playsInline
                  loop
                  className="w-full h-full object-cover filter blur-xl scale-110 brightness-90"
                >
                  <source src={asset.src} type="video/mp4" />
                  <source src={asset.src.replace('-1080p.mp4', '-720p.mp4')} type="video/mp4" />
                </video>
              ) : (
                <Image
                  src={asset.src}
                  alt=""
                  fill
                  priority={index === 0}
                  className="object-cover filter blur-xl scale-110 brightness-90"
                  sizes="100vw"
                />
              )}
            </motion.div>
          )
        })}
      </div>

      {/* 前景層: 動画/画像 */}
      <div className="absolute inset-0 z-10">
        {heroAssets.map((asset, index) => {
          const isActive = index === activeIndex
          return (
            <motion.div
              key={`${asset.src}-${index}`}
              aria-hidden={!isActive}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{
                opacity: isActive ? 1 : 0,
                zIndex: isActive ? 10 : 0
              }}
              transition={{ duration: 1.5 }}
            >
              {asset.type === 'video' ? (
                <video
                  ref={(el) => { fgVideoRefs.current[index] = el }}
                  muted
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-contain"
                >
                  <source src={asset.src} type="video/mp4" />
                  <source src={asset.src.replace('-1080p.mp4', '-720p.mp4')} type="video/mp4" />
                </video>
              ) : (
                <Image
                  src={asset.src}
                  alt={asset.alt}
                  fill
                  priority={index === 0}
                  className="object-contain"
                  sizes="100vw"
                />
              )}
            </motion.div>
          )
        })}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="relative z-20 text-center px-4 sm:px-6 lg:px-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="space-y-6 sm:space-y-8"
        >
          <p className={`eyebrow justify-center ${showWelcome ? 'text-ink-muted' : 'text-white/70'}`}>
            Wedding Invitation
          </p>
          <h1 className={`font-serif text-display font-light tracking-[0.2em] transition-colors duration-1000 ${showWelcome ? 'text-ink-primary' : 'text-white'}`}>
            {config.couple.displayNames}
          </h1>

          <div className={`space-y-3 text-base sm:text-lg font-light transition-colors duration-1000 ${showWelcome ? 'text-ink-muted' : 'text-white/90'}`}>
            <p className="tracking-wide">{config.event.date}</p>
            <p className={`text-sm sm:text-base ${showWelcome ? 'opacity-80' : 'opacity-90'}`}>
              {config.event.ceremony.label} {config.event.ceremony.time} | {config.event.reception.label} {config.event.reception.timeStart} - {config.event.reception.timeEnd}
            </p>
            <p className={`text-sm sm:text-base ${showWelcome ? 'opacity-80' : 'opacity-90'}`}>{config.event.venue.name}</p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: showWelcome ? 0 : 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="pt-8"
          >
            <Link href="#rsvp" className="btn-primary">
              ご出欠のご連絡
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showWelcome ? 0 : 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-6 h-6 text-white/70" />
        </motion.div>
      </motion.div>
    </motion.section>
  )
}
