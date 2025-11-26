/**
 * Cloudinary画像管理ヘルパー
 * 
 * Cloudinaryから画像を取得し、自動最適化を行います。
 * ビルド不要で画像を追加・削除できます。
 */

const PUBLIC_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const SERVER_BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

const CLOUDINARY_IMAGES_ROUTE = '/api/cloudinary/images'

export interface CloudinaryImage {
  url: string
  publicId: string
  width: number
  height: number
  format: string
}

interface CloudinaryImagesApiResponse {
  images?: CloudinaryImage[]
  error?: string
}

/**
 * Cloudinaryフォルダから画像一覧を取得
 * 
 * @param folder - フォルダ名 ('hero' または 'story')
 * @param options - 追加オプション
 * @returns 画像情報の配列
 */
export async function getCloudinaryImages(
  folder: 'hero' | 'story',
  options?: {
    maxResults?: number
  }
): Promise<CloudinaryImage[]> {
  if (!PUBLIC_CLOUD_NAME) {
    console.error('❌ NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set in environment variables')
    return []
  }

  const params = new URLSearchParams({ folder })

  if (options?.maxResults !== undefined && !Number.isNaN(options.maxResults)) {
    const clamped = Math.max(1, Math.min(options.maxResults, 500))
    params.set('maxResults', clamped.toString())
  }

  const baseUrl = typeof window === 'undefined' ? SERVER_BASE_URL : ''
  const requestUrl = `${baseUrl}${CLOUDINARY_IMAGES_ROUTE}?${params.toString()}`

  try {
    const response = await fetch(requestUrl, {
      cache: 'no-store',
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`❌ Failed to fetch images from Cloudinary API route (${response.status})`)
      console.error(errorText)
      return []
    }

    const data = (await response.json()) as CloudinaryImagesApiResponse

    if (data.error) {
      console.error(`❌ Cloudinary API error: ${data.error}`)
      return []
    }

    const images = data.images ?? []

    if (images.length === 0) {
      console.warn(`⚠️ No images found in Cloudinary folder: ${folder}`)
      return []
    }

    console.log(`✅ Loaded ${images.length} images from Cloudinary folder: ${folder}`)

    return images
  } catch (error) {
    console.error('❌ Error fetching Cloudinary images:', error)
    return []
  }
}

/**
 * CloudinaryのURLを最適化
 * 
 * 自動的に以下を適用:
 * - WebP/AVIF形式への変換（ブラウザが対応している場合）
 * - 指定サイズへのリサイズ
 * - 画質の自動最適化
 * - デバイス解像度への自動対応
 * 
 * @param url - 元のCloudinary URL
 * @param options - 最適化オプション
 * @returns 最適化されたURL
 */
export function optimizeCloudinaryUrl(
  url: string,
  options?: {
    width?: number
    height?: number
    quality?: number | 'auto'
  }
): string {
  if (!url || !url.includes('cloudinary.com')) {
    return url
  }

  const { width = 1920, height, quality = 'auto' } = options || {}

  try {
    // URLを分解: /upload/ の前後に分ける
    const parts = url.split('/upload/')
    if (parts.length !== 2) {
      console.warn('⚠️ Invalid Cloudinary URL format')
      return url
    }

    // 変換パラメータを構築
    const transforms: string[] = []

    // 幅の指定
    if (width) {
      transforms.push(`w_${width}`)
    }

    // 高さの指定（オプション）
    if (height) {
      transforms.push(`h_${height}`)
    }

    // 画質設定（auto = Cloudinaryが自動最適化）
    transforms.push(`q_${quality}`)

    // フォーマット自動選択（WebP/AVIFに自動変換）
    transforms.push('f_auto')

    // クロップモード: アスペクト比を維持しながら縮小
    transforms.push('c_limit')

    // デバイスのピクセル比に応じて自動調整
    transforms.push('dpr_auto')

    // 最適化されたURLを返す
    return `${parts[0]}/upload/${transforms.join(',')}/${parts[1]}`
  } catch (error) {
    console.error('❌ Error optimizing Cloudinary URL:', error)
    return url
  }
}

/**
 * Cloudinaryの画像URLから公開IDを抽出
 * 
 * @param url - Cloudinary URL
 * @returns 公開ID
 */
export function extractPublicId(url: string): string {
  try {
    const parts = url.split('/upload/')
    if (parts.length !== 2) return ''

    // 変換パラメータを除去
    const pathParts = parts[1].split('/')
    const filename = pathParts[pathParts.length - 1]
    return filename.split('.')[0]
  } catch {
    return ''
  }
}

/**
 * Cloudinary設定状況をチェック
 * 
 * @returns 設定状況のオブジェクト
 */
export function checkCloudinaryConfig() {
  const isConfigured = !!PUBLIC_CLOUD_NAME
  const hasServerCredentials = !!(process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)

  if (!isConfigured) {
    console.warn('⚠️ Cloudinary is not configured')
    console.warn('ヒント: .env.local に NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME を設定してください')
  } else if (!hasServerCredentials) {
    console.warn('⚠️ Cloudinary server credentials are not configured')
    console.warn('ヒント: .env.local に CLOUDINARY_API_KEY と CLOUDINARY_API_SECRET を設定してください')
  } else {
    console.log(`✅ Cloudinary configured with cloud name: ${PUBLIC_CLOUD_NAME}`)
  }

  return {
    isConfigured,
    cloudName: PUBLIC_CLOUD_NAME,
    hasServerCredentials,
  }
}
