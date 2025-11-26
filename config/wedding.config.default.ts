/**
 * 結婚式 Web招待状 デフォルト設定ファイル
 */

export const weddingConfig = {
    // ============================================
    // 👰🤵 新郎新婦の情報
    // ============================================
    couple: {
        groom: {
            firstName: 'Taro',
            lastName: 'Yamada',
            fullName: '山田 太郎',
        },
        bride: {
            firstName: 'Hanako',
            lastName: 'Suzuki',
            fullName: '鈴木 花子',
        },
        // Heroセクションに表示される名前（英語）
        displayNames: 'Taro & Hanako',
        // Headerに表示されるタイトル（イニシャルなど）
        headerTitle: 'T · H',
    },

    // ============================================
    // 📅 式の詳細情報
    // ============================================
    event: {
        // 日付
        date: '2026年11月22日(日)',
        dateEn: 'November 22nd, 2026',

        // 時間
        ceremony: {
            label: '挙式',
            time: '10:30',
        },
        reception: {
            label: '披露宴',
            timeStart: '11:30',
            timeEnd: '14:00',
        },

        // 会場情報
        venue: {
            name: 'Sample Hotel Tokyo',
            nameEn: 'Sample Hotel Tokyo',
            room: '3F Grand Ballroom',
            address: '東京都千代田区1-1-1',
            mapUrl: 'https://maps.google.com/maps?q=Tokyo+Station&t=&z=15&ie=UTF8&iwloc=&output=embed',
            // Google Mapsの検索URL
            googleMapsLink: 'https://www.google.com/maps/search/?api=1&query=Tokyo+Station',
        },

        // RSVP期限
        rsvpDeadline: '2026年10月20日',
    },

    // ============================================
    // 📞 連絡先
    // ============================================
    contact: {
        email: 'sample@example.com',
        phone: '090-0000-0000',
        // 緊急連絡先(当日)
        emergencyPhone: '080-0000-0000',
    },

    // ============================================
    // 💝 メッセージ・文章
    // ============================================
    messages: {
        // Introセクションの挨拶文
        intro: [
            'このたび 私たちは結婚式を挙げることになりました',
            '日頃お世話になっている皆様に\n感謝の気持ちを込めて\nささやかではございますが\n披露宴を催したいと存じます',
            'ご多用中 誠に恐縮ではございますが\nぜひご出席賜りますよう\nお願い申し上げます',
        ],

        // Footerのメッセージ
        footer: '皆様のご出席を心よりお待ちしております',
    },

    // ============================================
    // ============================================
    // 🎞️ Hero画像・動画(スライドショー)
    // ============================================
    hero: {
        // 画像切り替え間隔(ミリ秒)
        rotationInterval: 7000,

        // 表示するアセット(画像または動画)
        assets: [
            {
                type: 'image',
                src: '/images/optimized/sample-story-2.webp',
                alt: 'サンプル画像1',
                transition: 'fade',
            },
            {
                type: 'video',
                src: '/videos/optimized/sample-hero-2-1080p.mp4',
                alt: 'サンプル動画2',
                transition: 'fade',
            },
        ] as const,
    },
    musicRequests: {
        title: 'Music Requests',
        subtitle: '楽曲リクエスト',
        description: '当日流してほしい曲や、最近お気に入りの曲を教えてください',
        placeholder: '曲名やアーティスト名で検索',
    },
    story: [
        {
            type: 'image',
            src: '/images/optimized/sample-story-1.webp',
            title: '出会い',
            description: '202X年X月、友人の紹介で出会いました。\n共通の趣味で意気投合し、\nすぐに惹かれ合いました。',
        },
        {
            type: 'video',
            src: '/videos/optimized/sample-hero-1-1080p.mp4',
            title: '初デート',
            description: '初めてのデートは思い出の場所へ。\n緊張しながらも、楽しい時間を過ごしました。',
        },
        {
            type: 'image',
            src: '/images/optimized/sample-story-3.webp',
            title: 'プロポーズ',
            description: '記念日の夜、思い出の場所で。\n「これからもずっと一緒にいてください」\nという言葉とともに、新しい人生が始まりました。',
        },
    ] as const,
    // ============================================
    // ❓ カップルクイズ
    // ============================================
    coupleQuiz: {
        title: 'Couple Quiz',
        subtitle: 'お二人についてのクイズ',
        description: '正解は当日のお楽しみです!直感でお答えください。',
        question: '新郎新婦が初めて出会った場所はどこでしょう?',
        options: [
            { label: '大学のサークル', value: 'circle' },
            { label: '友人の紹介で参加した食事会', value: 'dinner' },
            { label: '同じ会社のプロジェクト', value: 'work' },
            { label: '趣味のイベント', value: 'hobby' },
        ],
        // 正解(当日まで秘密!)
        correctAnswer: 'dinner',
    },

    // ============================================
    // 🚗 アクセス情報
    // ============================================
    access: {
        title: 'Access',
        subtitle: '会場へのアクセス',
        methods: [
            {
                type: '電車',
                description: 'JR山手線 東京駅より 徒歩5分\n東京メトロ丸ノ内線 東京駅より 徒歩7分',
            },
            {
                type: '車',
                description: '会場に駐車場がございます(30台)\n満車の場合は近隣のコインパーキングをご利用ください。',
            },
        ],
        notes: [
            '公共交通機関のご利用をお勧めいたします。',
            'お車でお越しの際は、事前にご連絡ください。',
        ],
    },

    // ============================================
    // 🔗 リンク・URL
    // ============================================
    links: {
        // サイトのURL（デプロイ後に更新）
        siteUrl: 'https://your-wedding-site.vercel.app',
        // OGP画像のURL（デプロイ後に更新）
        ogImageUrl: 'https://your-wedding-site.vercel.app/og-image.jpg',
    },

    // ============================================
    // 🎨 サイトメタ情報
    // ============================================
    meta: {
        title: 'Taro & Hanako | 結婚式のご案内',
        description: '2026年11月22日 Sample Hotel Tokyo にて挙式・披露宴を行います。皆様のご出席を心よりお待ちしております。',
        keywords: '結婚式,ウェディング,山田太郎,鈴木花子,Sample Hotel Tokyo',
    },


}

export type WeddingConfig = typeof weddingConfig
