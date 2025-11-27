'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, CheckCircle2 } from 'lucide-react'
import { useConfig } from '@/hooks/useConfig'

interface FormData {
  name: string
  email: string
  attendance: '出席' | '欠席' | ''
  guests: string
  allergies: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  attendance?: string
}

export default function RSVP() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    attendance: '',
    guests: '',
    allergies: '',
    message: '',
  })

  const config = useConfig()
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'お名前を入力してください'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスを入力してください'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '正しいメールアドレスを入力してください'
    }

    if (!formData.attendance) {
      newErrors.attendance = 'ご出欠を選択してください'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsSuccess(true)
        setFormData({
          name: '',
          email: '',
          attendance: '',
          guests: '',
          allergies: '',
          message: '',
        })
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  if (isSuccess) {
    return (
      <section id="rsvp" className="section-shell bg-base">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-panel mx-auto max-w-2xl p-10 text-center space-y-6"
          >
            <div className="pill mx-auto w-fit">
              <CheckCircle2 className="h-4 w-4" />
              {config.sections?.rsvp?.success?.pill || 'RSVP Received'}
            </div>
            <h3 className="font-serif text-3xl text-text-primary">
              {config.sections?.rsvp?.success?.title || 'ご回答ありがとうございます'}
            </h3>
            <p className="text-text-secondary leading-relaxed whitespace-pre-line">
              {config.sections?.rsvp?.success?.message || 'ご出欠のご連絡を承りました。\n当日、皆様にお会いできることを楽しみにしております。'}
            </p>
            <button
              onClick={() => setIsSuccess(false)}
              className="btn-ghost mx-auto"
            >
              {config.sections?.rsvp?.success?.button || '別の回答を送信する'}
            </button>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section id="rsvp" className="section-shell bg-base">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <p className="eyebrow justify-center text-accent">{config.sections?.rsvp?.eyebrow || 'RSVP'}</p>
          <h2 className="mt-4 font-serif text-section-title text-text-primary">
            {config.sections?.rsvp?.title || 'ご出欠のご連絡'}
          </h2>
          <p className="mt-4 text-sm text-text-secondary">
            {config.sections?.rsvp?.description || 'お手数ですが、ご出欠のご意向やアレルギーなどございましたら下記フォームにてお知らせください。'}
          </p>
          <p className="mt-3 text-sm font-semibold text-accent">
            {config.sections?.rsvp?.deadlineLabel || '回答期限：'}{config.event.rsvpDeadline}まで
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-auto max-w-2xl"
        >
          <form onSubmit={handleSubmit} className="card-panel space-y-8 p-8 sm:p-12">
            {/* Name */}
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-semibold text-text-primary">
                {config.sections?.rsvp?.form?.name?.label || 'お名前'} <span className="text-accent">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full rounded-2xl border px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 ${errors.name
                  ? 'border-red-400 focus:ring-red-200'
                  : 'border-line focus:border-accent/60 focus:ring-accent/15'
                  }`}
                placeholder={config.sections?.rsvp?.form?.name?.placeholder || '山田 太郎'}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-text-primary">
                {config.sections?.rsvp?.form?.email?.label || 'メールアドレス'} <span className="text-accent">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full rounded-2xl border px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 ${errors.email
                  ? 'border-red-400 focus:ring-red-200'
                  : 'border-line focus:border-accent/60 focus:ring-accent/15'
                  }`}
                placeholder={config.sections?.rsvp?.form?.email?.placeholder || 'example@email.com'}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Attendance */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-text-primary">
                {config.sections?.rsvp?.form?.attendance?.label || 'ご出欠'} <span className="text-accent">*</span>
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <label className="flex-1">
                  <input
                    type="radio"
                    name="attendance"
                    value="出席"
                    checked={formData.attendance === '出席'}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="rounded-2xl border-2 px-6 py-4 text-center text-sm font-semibold text-text-secondary transition-all peer-checked:border-accent peer-checked:bg-accent peer-checked:text-white">
                    {config.sections?.rsvp?.form?.attendance?.options?.attending || '出席'}
                  </div>
                </label>
                <label className="flex-1">
                  <input
                    type="radio"
                    name="attendance"
                    value="欠席"
                    checked={formData.attendance === '欠席'}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="rounded-2xl border-2 px-6 py-4 text-center text-sm font-semibold text-text-secondary transition-all peer-checked:border-accent peer-checked:bg-accent peer-checked:text-white">
                    {config.sections?.rsvp?.form?.attendance?.options?.absent || '欠席'}
                  </div>
                </label>
              </div>
              {errors.attendance && (
                <p className="mt-1 text-sm text-red-500">{errors.attendance}</p>
              )}
            </div>

            {/* Guests */}
            {formData.attendance === '出席' && (
              <div>
                <label htmlFor="guests" className="mb-2 block text-sm font-semibold text-text-primary">
                  {config.sections?.rsvp?.form?.guests?.label || 'ご同伴者数（任意）'}
                </label>
                <input
                  type="text"
                  id="guests"
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-line px-4 py-3 text-sm transition-all focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/15"
                  placeholder={config.sections?.rsvp?.form?.guests?.placeholder || '例：1名'}
                />
              </div>
            )}

            {/* Allergies */}
            {formData.attendance === '出席' && (
              <div>
                <label htmlFor="allergies" className="mb-2 block text-sm font-semibold text-text-primary">
                  {config.sections?.rsvp?.form?.allergies?.label || 'アレルギーの有無（任意）'}
                </label>
                <input
                  type="text"
                  id="allergies"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-line px-4 py-3 text-sm transition-all focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/15"
                  placeholder={config.sections?.rsvp?.form?.allergies?.placeholder || '例：えび、かに'}
                />
              </div>
            )}

            {/* Message */}
            <div>
              <label htmlFor="message" className="mb-2 block text-sm font-semibold text-text-primary">
                {config.sections?.rsvp?.form?.message?.label || 'メッセージ（任意）'}
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full resize-none rounded-2xl border border-line px-4 py-3 text-sm transition-all focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/15"
                placeholder={config.sections?.rsvp?.form?.message?.placeholder || 'お二人へのメッセージをお願いします'}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <>{config.sections?.rsvp?.form?.submitButton?.sending || '送信中...'}</>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  {config.sections?.rsvp?.form?.submitButton?.default || '送信する'}
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  )
}
