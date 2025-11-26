# 💒 Wedding Invitation Website

モダンで美しい結婚式Web招待状テンプレートです。Next.js、TypeScript、Tailwind CSSで構築されています。

## ✨ 特徴

- 📱 **レスポンシブデザイン** - モバイル、タブレット、デスクトップに対応
- 🎨 **美しいアニメーション** - Framer Motionによるスムーズなアニメーション
- 🎵 **YouTube連携** - 楽曲リクエスト機能(YouTube検索)
- 📝 **Google Forms連携** - 出席確認と楽曲リクエストをGoogle Formsで管理
- 🗺️ **Google Maps統合** - 会場への地図とアクセス情報
- ⚡ **高速** - Next.js 14の最新機能を活用
- 🔒 **プライバシー保護** - 個人情報は安全に管理

## 🚀 クイックスタート

### 前提条件

- Node.js 18以上
- pnpm (推奨) または npm
- Googleアカウント (Google Forms、YouTube API用)

### 1. リポジトリをフォーク

このリポジトリを**プライベートリポジトリ**としてフォークしてください:

1. GitHubでこのリポジトリのページを開く
2. **Use this template** をクリック
3. **Create a new repository** を選択
4. リポジトリ名を入力(例: `our-wedding-invitation`)
5. **Private** を選択 ⚠️ **重要!**
6. **Create repository** をクリック

### 2. ローカルにクローン

```bash
git clone https://github.com/yourusername/our-wedding-invitation.git
cd our-wedding-invitation
pnpm install
```

### 3. 画像・動画の準備と最適化

このプロジェクトでは、画像と動画を最適化して使用します。設定ファイルを編集する前に、まず素材を準備します。

#### 3.1 素材の配置

以下のディレクトリに**元データ**を配置してください:

```
public/
├── images/
│   └── raw/                # 元画像 (.jpg, .png)
└── videos/
    └── raw/                # 元動画 (.mp4, .mov)
```

#### 3.2 最適化スクリプトの実行

ターミナルで以下のコマンドを実行して、メディアを最適化します:

```bash
npm run optimize-media
```

これにより、以下のディレクトリに最適化されたファイルが生成されます:
- `public/images/optimized/` (WebP形式、リサイズ済み)
- `public/videos/optimized/` (1080p/720p MP4)

### 4. 設定ファイルの作成と編集

生成されたメディアパスを使用して、設定ファイルを作成します。

#### 4.1 ファイルの作成

```bash
cp config/wedding.config.default.ts config/wedding.config.ts
```

#### 4.2 設定の編集

`config/wedding.config.ts` を開いて、以下の情報を編集してください。
**注意**: `wedding.config.ts` は個人情報を含むため、`.gitignore` に追加されています。

1. **新郎新婦の情報** (`couple`)
   - 名前、ヘッダータイトルなど
2. **式の日時・会場** (`event`)
3. **メディア設定** (`hero`, `story`)
   - **重要**: 手順3で生成された `optimized` フォルダ内のパスを指定してください。
   
   ```typescript
   hero: {
     assets: [
       {
         type: 'video',
         src: '/videos/optimized/your-video-1080p.mp4', // 最適化された動画パス
         alt: 'オープニングムービー',
       },
       {
         type: 'image',
         src: '/images/optimized/your-photo.webp', // 最適化された画像パス
         alt: 'メイン写真',
       },
     ],
   },
   ```
4. **連絡先・メッセージ** (`contact`, `messages`)

### 5. Google Formsを設定

#### 5.1 フォームの作成
[Google Forms](https://forms.google.com/) で「出席確認」と「楽曲リクエスト」の2つのフォームを作成します。

#### 5.2 Entry IDの取得と設定
各フォームの入力項目の `entry.xxxxxx` IDを取得し、`config/wedding.config.ts` の `googleForms` セクションに設定します。

> 💡 **詳細ガイド**: 手順の詳細は [`docs/GOOGLE_FORM.md`](docs/GOOGLE_FORM.md) を参照してください。

### 6. YouTube APIを設定

楽曲リクエスト機能でYouTube検索を使用するために必要です。

1. [Google Cloud Console](https://console.cloud.google.com/) でプロジェクトを作成
2. **YouTube Data API v3** を有効化
3. APIキーを作成し、`.env.local` ファイルに設定:

```bash
YOUTUBE_API_KEY=your_youtube_api_key_here
```

### 7. 開発サーバーを起動

```bash
pnpm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて確認できます。

### 8. Vercelにデプロイ

1. GitHubにプッシュ
2. [Vercel](https://vercel.com/) でプロジェクトをインポート
3. 環境変数 `YOUTUBE_API_KEY` を設定
4. デプロイ実行

## 📁 プロジェクト構成

```
wedding-invitation/
├── app/                    # Next.js App Router
├── components/            # Reactコンポーネント
├── config/                # 設定ファイル
│   ├── wedding.config.ts  # 本番用設定 (git対象外)
│   └── wedding.config.default.ts # デフォルト設定
├── docs/                  # ドキュメント
├── public/                # 静的ファイル
│   ├── images/
│   │   ├── raw/           # 画像元データ
│   │   └── optimized/     # 最適化済み画像
│   └── videos/
│       ├── raw/           # 動画元データ
│       └── optimized/     # 最適化済み動画
└── scripts/               # ユーティリティスクリプト
```

## 🛠️ 技術スタック

- **フレームワーク**: [Next.js 14](https://nextjs.org/)
- **言語**: [TypeScript](https://www.typescriptlang.org/)
- **スタイリング**: [Tailwind CSS](https://tailwindcss.com/)
- **アニメーション**: [Framer Motion](https://www.framer.com/motion/)

## 📝 ライセンス

MIT License
