/**
 * 結婚式設定のエクスポート
 * 
 * wedding.config.ts から設定を読み込みます
 * wedding.config.ts が存在しない場合は wedding.config.default.ts を使用します
 */

import type { WeddingConfig } from './wedding.config.default'

let weddingConfig: WeddingConfig

try {
  // まず wedding.config.ts を読み込み
  weddingConfig = require('./wedding.config').weddingConfig
} catch (error) {
  // wedding.config.ts が存在しない場合は wedding.config.default.ts を使用
  console.warn('⚠️  wedding.config.ts not found, using wedding.config.default.ts')
  weddingConfig = require('./wedding.config.default').weddingConfig
}

export { weddingConfig }
export type { WeddingConfig } from './wedding.config.default'

/**
 * 結婚式設定を取得
 * 常に wedding.config.ts の内容を返します
 */
export async function getConfig() {
  return weddingConfig
}

/**
 * 設定の保存(無効化)
 * KV依存削除のため、何もしません
 */
export async function saveConfig(
  config: typeof weddingConfig,
  metadata?: any
): Promise<void> {
  console.warn('⚠️ saveConfig is disabled (KV dependency removed)')
}

/**
 * 設定のリセット(無効化)
 */
export async function resetConfig(): Promise<void> {
  console.warn('⚠️ resetConfig is disabled (KV dependency removed)')
}

/**
 * 設定履歴の取得(無効化)
 */
export async function getConfigHistory(): Promise<any[]> {
  return []
}

/**
 * クライアントサイド用のフック
 */
export function useConfig() {
  return weddingConfig
}
