'use client'

import { useMemo, useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Loader2,
  Music2,
  Plus,
  Search,
  Send,
  Sparkles,
  X,
  ExternalLink,
} from 'lucide-react'

interface TrackResult {
  id: string
  title: string
  artist: string
  thumbnail: string
  publishedAt?: string
  url?: string
}

export default function MusicRequests() {
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<TrackResult[]>([])
  const [selectedTrack, setSelectedTrack] = useState<TrackResult | null>(null)
  const [requester, setRequester] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [showRequestForm, setShowRequestForm] = useState(false)
  const formRef = useRef<HTMLDivElement>(null)

  const canSubmit = useMemo(
    () => Boolean(selectedTrack),
    [selectedTrack]
  )

  // スクロール処理
  useEffect(() => {
    if (showRequestForm && formRef.current) {
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 100)
    }
  }, [showRequestForm])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!query.trim()) {
      setError('検索キーワードを入力してください。')
      return
    }

    setIsSearching(true)
    setError(null)

    try {
      const response = await fetch(`/api/music-search?q=${encodeURIComponent(query.trim())}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '検索に失敗しました。')
      }

      setResults(data.results || [])
      if ((data.results || []).length === 0) {
        setError('該当する楽曲が見つかりませんでした。キーワードを変えてお試しください。')
      }
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : '検索に失敗しました。')
    } finally {
      setIsSearching(false)
    }
  }

  const handleSelectTrack = (track: TrackResult) => {
    setSelectedTrack(track)
    setRequester('')
    setMessage('')
    setShowRequestForm(true)
  }

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTrack) return

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/music-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: selectedTrack.title,
          artist: selectedTrack.artist,
          requester: requester.trim() || '',
          message: message.trim() || '',
        }),
      })

      if (response.ok) {
        setSubmitSuccess(true)
        setSelectedTrack(null)
        setRequester('')
        setMessage('')
        setShowRequestForm(false)

        // 3秒後に成功メッセージを非表示
        setTimeout(() => setSubmitSuccess(false), 3000)
      } else {
        alert('送信に失敗しました。もう一度お試しください。')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('送信に失敗しました。もう一度お試しください。')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setSelectedTrack(null)
    setRequester('')
    setMessage('')
    setShowRequestForm(false)
  }

  return (
    <section id="music-requests" className="section-shell bg-base">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <div className="pill mx-auto mb-4 justify-center">
            <Sparkles className="h-4 w-4" />
            プレイリストにあなたの1曲を
          </div>
          <h2 className="font-serif text-section-title text-text-primary mb-4">
            Music Request Lounge
          </h2>
          <p className="text-text-secondary leading-relaxed text-sm sm:text-base">
            YouTube Musicと連携したリクエストコーナーです。おふたりとゲストの皆さまで、
            当日のサウンドトラックを一緒に作り上げましょう。
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mx-auto max-w-4xl"
        >
          {/* Search Form */}
          <div className="card-panel p-6 sm:p-8 mb-8">
            <form
              onSubmit={handleSearch}
              className="flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-accent" />
                <input
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="アーティスト名や曲名で検索"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm focus:border-accent focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/10"
                />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    検索中...
                  </>
                ) : (
                  <>
                    <Music2 className="h-4 w-4" />
                    楽曲を検索
                  </>
                )}
              </button>
            </form>
            {error && (
              <p className="mt-3 text-sm text-red-500">{error}</p>
            )}
          </div>

          {/* Search Results */}
          <AnimatePresence>
            {results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-8"
              >
                <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <Music2 className="w-5 h-5 text-accent" />
                  検索結果
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {results.map((track) => (
                    <motion.div
                      key={track.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-all hover:shadow-lg"
                    >
                      <div className="relative aspect-video w-full bg-gray-100">
                        {track.thumbnail ? (
                          <Image
                            src={track.thumbnail}
                            alt={track.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, 50vw"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-rose-100 to-pink-100">
                            <Music2 className="w-12 h-12 text-rose-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col gap-3 p-4">
                        <div>
                          <p className="text-sm font-semibold text-text-primary line-clamp-2">
                            {track.title}
                          </p>
                          <p className="text-xs text-text-secondary mt-1">{track.artist}</p>
                        </div>
                        <div className="mt-auto flex items-center justify-between gap-2">
                          {track.url && (
                            <a
                              href={track.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-accent hover:text-accent-hover"
                            >
                              試聴
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => handleSelectTrack(track)}
                            className="btn-primary px-4 py-2"
                          >
                            <Plus className="h-4 w-4" />
                            リクエスト
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Request Form - スクロール対応 */}
          <AnimatePresence>
            {showRequestForm && selectedTrack && (
              <motion.div
                ref={formRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-8 rounded-[24px] border border-line bg-white p-6 shadow-floating"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                    <Music2 className="w-5 h-5 text-accent" />
                    楽曲リクエスト
                  </h3>
                  <button
                    onClick={handleCancel}
                    className="text-text-muted hover:text-text-primary transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-start gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    {selectedTrack.thumbnail ? (
                      <Image
                        src={selectedTrack.thumbnail}
                        alt={selectedTrack.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-rose-100 to-pink-100">
                        <Music2 className="w-8 h-8 text-rose-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-primary truncate">
                      {selectedTrack.title}
                    </p>
                    <p className="text-xs text-text-secondary">{selectedTrack.artist}</p>
                  </div>
                </div>

                <form onSubmit={handleSubmitRequest} className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-text-secondary">
                      お名前（任意）
                    </label>
                    <input
                      type="text"
                      value={requester}
                      onChange={(event) => setRequester(event.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10"
                      placeholder="例：ゲスト 太郎（空欄の場合は「匿名ゲスト」として表示されます）"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-text-secondary">
                      メッセージ（任意）
                    </label>
                    <textarea
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      rows={3}
                      className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10 resize-none"
                      placeholder="この曲にまつわる思い出や聴きどころをぜひ教えてください"
                    />
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="btn-ghost"
                    >
                      <X className="h-4 w-4" />
                      キャンセル
                    </button>
                    <button
                      type="submit"
                      disabled={!canSubmit || isSubmitting}
                      className="btn-primary disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          登録中...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          リクエストを送信
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success Message */}
          <AnimatePresence>
            {submitSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-8 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-center"
              >
                <p className="text-sm font-medium text-green-800">
                  リクエストありがとうございます！<br />
                  当日のプレイリストに反映させていただきます。<br />
                  どんな曲が流れるかは、当日のお楽しみです♪
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
