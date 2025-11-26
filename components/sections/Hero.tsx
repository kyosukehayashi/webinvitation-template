'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
// Cloudinary関連の削除
// import { getCloudinaryImages, type CloudinaryImage } from '@/lib/cloudinary'
// import HeroWelcome from './HeroWelcome'
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
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  // 設定からアセットを読み込む
  useEffect(() => {
    if (config.hero.assets && config.hero.assets.length > 0) {
      // Readonly配列を可変配列として扱うためにキャスト
      setHeroAssets(config.hero.assets as unknown as HeroAsset[])

      // 画像の読み込みが完了したら（ここでは即時）、2.5秒後にウェルカム画面をフェードアウト
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

  // 動画が終了したら次の動画に切り替え
  useEffect(() => {
    // heroAssetsが読み込まれていない、またはウェルカム画面表示中は何もしない
    if (heroAssets.length === 0 || showWelcome || isLoading) {
      return
    }

    let cleanupFn: (() => void) | null = null

    // DOM更新を待つために少し遅延
    const setupTimer = setTimeout(() => {
      const currentVideo = videoRefs.current[activeIndex]

      if (!currentVideo) {
        return
      }

      const handleVideoEnded = () => {
        setActiveIndex((current) => {
          const nextIndex = (current + 1) % heroAssets.length
          return nextIndex
        })
      }

      currentVideo.addEventListener('ended', handleVideoEnded)

      // クリーンアップ関数を保存
      cleanupFn = () => {
        currentVideo.removeEventListener('ended', handleVideoEnded)
      }
    }, 100) // 100ms遅延

    return () => {
      clearTimeout(setupTimer)
      if (cleanupFn) {
        cleanupFn()
      }
    }
  }, [activeIndex, heroAssets, showWelcome, isLoading])

  // 画像の自動切り替え（rotationIntervalを使用）
  useEffect(() => {
    // heroAssetsが読み込まれていない、またはウェルカム画面表示中は何もしない
    if (heroAssets.length === 0 || showWelcome || isLoading) {
      return
    }

    // 現在のアセットが画像の場合のみタイマーを設定
    const currentAsset = heroAssets[activeIndex]
    if (currentAsset?.type === 'image') {
      const timer = setInterval(() => {
        setActiveIndex((current) => {
          const nextIndex = (current + 1) % heroAssets.length
          return nextIndex
        })
      }, config.hero.rotationInterval || 5000)

      return () => clearInterval(timer)
    }
  }, [activeIndex, heroAssets, showWelcome, isLoading, config.hero.rotationInterval])

  // 次の動画を事前に読み込む（シームレスな切り替えのため）
  useEffect(() => {
    if (heroAssets.length === 0 || showWelcome || isLoading) {
      return
    }

    const nextIndex = (activeIndex + 1) % heroAssets.length
    const nextVideo = videoRefs.current[nextIndex]

    if (nextVideo && nextVideo.readyState < 4) {
      // 次の動画をプリロード
      nextVideo.load()
    }
  }, [activeIndex, heroAssets, showWelcome, isLoading])

  // アクティブな動画のみ再生、他は一時停止
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === activeIndex) {
          video.currentTime = 0  // 最初から再生
          video.play().catch(err => console.log('Video play failed:', err))
        } else {
          video.pause()
        }
      }
    })
  }, [activeIndex])

  // 各トランジションタイプに応じたアニメーション設定を取得
  const getTransitionVariants = (transition: TransitionType, isActive: boolean) => {
    const baseInactive = { opacity: 0 }
    return {
      initial: { opacity: 0 },
      animate: isActive ? { opacity: 1 } : { opacity: 0 },
    }
  }

  return (
    <motion.section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* 常に表示される暗いオーバーレイ（明るさを一定に保つ） */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/35 to-black/55 z-[1]" />

      {/* Loading/Welcome Background Overlay (Gradient) */}
      <motion.div
        className="absolute inset-0 z-[2] bg-gradient-to-br from-surface via-white to-accent/light/30"
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

      {/* 前景層: 動画/画像 */}
      <div className="absolute inset-0 z-10">
        {heroAssets.map((asset, index) => {
          const variants = getTransitionVariants(asset.transition, activeIndex === index)
          return (
            <motion.div
              key={`${asset.src}-${index}`}
              aria-hidden={activeIndex !== index}
              className="absolute inset-0"
              initial={variants.initial}
              animate={shouldReducedMotion ? { opacity: index === activeIndex ? 1 : 0 } : variants.animate}
              transition={{
                duration: shouldReducedMotion ? 0 : 1.8,
                ease: [0.43, 0.13, 0.23, 0.96],
              }}
            >
              {asset.type === 'video' ? (
                <video
                  ref={(el) => {
                    videoRefs.current[index] = el
                  }}
                  autoPlay={index === 0}
                  muted
                  playsInline
                  preload={index === activeIndex || index === (activeIndex + 1) % heroAssets.length ? "auto" : "none"}
                  style={{ willChange: index === activeIndex ? 'transform, opacity' : 'auto' }}
                  className="w-full h-full object-contain"
                >
                  <source src={asset.src} type="video/mp4" />
                  <source
                    src={asset.src.replace('-1080p.mp4', '-720p.mp4')}
                    type="video/mp4"
                  />
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
