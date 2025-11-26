import { NextRequest, NextResponse } from 'next/server'
import { weddingConfig } from '@/config/wedding.config'

export async function POST(request: NextRequest) {
  console.log('=== RSVP API called ===')
  try {
    const body = await request.json()
    console.log('Received body:', body)

    // Validate required fields
    if (!body.name || !body.email || !body.attendance) {
      return NextResponse.json(
        { error: '必須項目を入力してください' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: '正しいメールアドレスを入力してください' },
        { status: 400 }
      )
    }

    // Log the RSVP data
    console.log('RSVP Submission:', {
      name: body.name,
      email: body.email,
      attendance: body.attendance,
      guests: body.guests || '',
      allergies: body.allergies || '',
      message: body.message || '',
      timestamp: new Date().toISOString(),
    })

    // Google Formに送信（Apps Scriptが自動でメール送信）
    try {
      const formData = new URLSearchParams()
      const { url, entryIds } = weddingConfig.googleForms.rsvp

      console.log('Google Form URL:', url)
      console.log('Entry IDs:', entryIds)

      // wedding.config.tsから取得したentry番号を使用
      formData.append(entryIds.name, body.name)
      formData.append(entryIds.email, body.email)
      formData.append(entryIds.attendance, body.attendance)
      if (body.guests) formData.append(entryIds.guests, body.guests)
      if (body.allergies) formData.append(entryIds.allergies, body.allergies)
      if (body.message) formData.append(entryIds.message, body.message)

      console.log('Form data to send:', formData.toString())

      if (url) {
        const formResponse = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData.toString(),
          // Google Formはリダイレクトを返すが、送信は成功している
          redirect: 'manual',
        })
        console.log('Google Form submission successful, status:', formResponse.status)
      } else {
        console.log('Google Form URL not configured in wedding.config.ts')
      }
    } catch (formError) {
      // Google Form送信エラーは致命的ではないのでログのみ
      console.error('Google Form submission error:', formError)
    }

    return NextResponse.json(
      {
        message: 'ご回答ありがとうございます',
        success: true
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('RSVP Error:', error)
    return NextResponse.json(
      { error: '送信に失敗しました。もう一度お試しください。' },
      { status: 500 }
    )
  }
}
