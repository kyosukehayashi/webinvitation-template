import { NextResponse } from 'next/server'
import { weddingConfig as defaultConfig } from '@/config'

/**
 * GET /api/config
 * 結婚式の設定を取得
 * KVへの依存を削除し、常にローカルのデフォルト設定を返します
 */
export async function GET() {
  return NextResponse.json(defaultConfig, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  })
}
