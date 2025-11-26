import { NextRequest, NextResponse } from 'next/server'
import { googleFormsConfig } from '@/config'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Validate required fields
        if (!body.title || !body.artist) {
            return NextResponse.json(
                { error: '曲名とアーティスト名を入力してください' },
                { status: 400 }
            )
        }

        // Log the music request data
        console.log('Music Request Submission:', {
            title: body.title,
            artist: body.artist,
            requester: body.requester || '匿名ゲスト',
            message: body.message || '',
            timestamp: new Date().toISOString(),
        })

        // Google Formに送信
        try {
            const formData = new URLSearchParams()
            const { url, entryIds } = googleFormsConfig.musicRequest

            // wedding.config.tsから取得したentry番号を使用
            formData.append(entryIds.title, body.title)
            formData.append(entryIds.artist, body.artist)
            if (body.requester) formData.append(entryIds.requester, body.requester)
            if (body.message) formData.append(entryIds.message, body.message)

            if (url) {
                await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: formData.toString(),
                    // Google Formはリダイレクトを返すが、送信は成功している
                    redirect: 'manual',
                })
                console.log('Music request Google Form submission successful')
            } else {
                console.log('Music request Google Form URL not configured in wedding.config.ts')
            }
        } catch (formError) {
            // Google Form送信エラーは致命的ではないのでログのみ
            console.error('Music request Google Form submission error:', formError)
        }

        return NextResponse.json(
            {
                message: 'リクエストありがとうございます！当日のプレイリストに反映させていただきます。',
                success: true
            },
            { status: 200 }
        )
    } catch (error) {
        console.error('Music Request Error:', error)
        return NextResponse.json(
            { error: '送信に失敗しました。もう一度お試しください。' },
            { status: 500 }
        )
    }
}
