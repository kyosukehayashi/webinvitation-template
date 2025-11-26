import { NextRequest, NextResponse } from 'next/server'

const MAX_RESULTS = 10

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')?.trim()
  const max = Number.parseInt(searchParams.get('limit') || '6', 10)
  const maxResults = Number.isNaN(max)
    ? 6
    : Math.min(Math.max(max, 1), MAX_RESULTS)

  if (!query) {
    return NextResponse.json(
      { error: '検索キーワードを入力してください。' },
      { status: 400 }
    )
  }

  const apiKey = process.env.YOUTUBE_API_KEY
  console.log('YouTube API Key exists:', !!apiKey)
  console.log('Query:', query)
  
  if (!apiKey) {
    console.error('YOUTUBE_API_KEY is not set')
    return NextResponse.json(
      { error: 'YOUTUBE_API_KEY が設定されていません。' },
      { status: 500 }
    )
  }

  const params = new URLSearchParams({
    part: 'snippet',
    type: 'video',
    videoCategoryId: '10',
    maxResults: String(maxResults),
    q: `${query} official audio`,
    key: apiKey,
  })

  try {
    const youtubeUrl = `https://www.googleapis.com/youtube/v3/search?${params.toString()}`
    console.log('Fetching YouTube API:', youtubeUrl.replace(apiKey, 'API_KEY_HIDDEN'))
    
    const youtubeResponse = await fetch(youtubeUrl, {
      headers: {
        Accept: 'application/json',
      },
      next: { revalidate: 60 * 30 },
    })

    console.log('YouTube API response status:', youtubeResponse.status)

    if (!youtubeResponse.ok) {
      const errorText = await youtubeResponse.text()
      console.error('YouTube API error status:', youtubeResponse.status)
      console.error('YouTube API error body:', errorText)
      
      let errorDetail = ''
      try {
        const errorJson = JSON.parse(errorText)
        errorDetail = errorJson.error?.message || errorText
      } catch {
        errorDetail = errorText
      }
      
      return NextResponse.json(
        { 
          error: '楽曲情報の取得に失敗しました。時間をおいて再度お試しください。',
          detail: errorDetail 
        },
        { status: 502 }
      )
    }

    const data = await youtubeResponse.json()

    const results = (data.items || []).map((item: any) => ({
      id: item.id?.videoId,
      title: item.snippet?.title,
      artist: item.snippet?.channelTitle,
      thumbnail:
        item.snippet?.thumbnails?.medium?.url ||
        item.snippet?.thumbnails?.default?.url ||
        '',
      publishedAt: item.snippet?.publishedAt,
      url: item.id?.videoId
        ? `https://music.youtube.com/watch?v=${item.id.videoId}`
        : undefined,
    }))

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Music search error:', error)
    return NextResponse.json(
      { error: '予期せぬエラーが発生しました。' },
      { status: 500 }
    )
  }
}
