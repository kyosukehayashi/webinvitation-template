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
            {
                type: 'video',
                src: '/videos/optimized/sample-hero-1-1080p.mp4',
                alt: 'サンプル動画2',
                transition: 'fade',
            },
            {
                type: 'image',
                src: '/images/optimized/sample-story-1.webp',
                alt: 'サンプル画像1',
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
        questions: [
            {
                id: 'meeting-place',
                question: '私たちが初めて出会った場所はどこでしょう？',
                hint: '共通の趣味を通じて出会いました。',
                explanation: '正解は「山岳サークルの早朝トレッキング」。自然好きがきっかけで距離が縮まりました。',
                options: [
                    {
                        label: '大学のゼミ',
                        value: 'seminar',
                        description: '同じ学部だったことはありますが、出会いは別のきっかけです。',
                    },
                    {
                        label: '友人主催のBBQ',
                        value: 'bbq',
                        description: '友人が多く集まるイベントではよく顔を合わせていました。',
                    },
                    {
                        label: '山岳サークルのトレッキング',
                        value: 'trekking',
                        isCorrect: true,
                        description: '早朝の集合でお互い眠そうにしていたのが印象的だったとか。',
                    },
                    {
                        label: '会社の新卒研修',
                        value: 'orientation',
                        description: '同期ではありますが、出会いは入社前でした。',
                    },
                ],
            },
            {
                id: 'first-date',
                question: '初めてのデートで訪れた場所は？',
                hint: '映画の後に海沿いを散歩しました。',
                explanation: '正解は「みなとみらいの映画館」。上映後に観覧車に乗って夜景を眺めました。',
                options: [
                    {
                        label: '渋谷のカフェ巡り',
                        value: 'shibuya',
                        description: 'コーヒー好きな2人ですが、初デートは少し遠出でした。',
                    },
                    {
                        label: 'みなとみらいの映画館',
                        value: 'minatomirai',
                        isCorrect: true,
                        description: '記念すべき初デートはロマンチックな夜景と共に。',
                    },
                    {
                        label: '鎌倉の寺社巡り',
                        value: 'kamakura',
                        description: 'のちに訪れたお気に入りスポットですが、初回ではありません。',
                    },
                    {
                        label: '自宅でオンラインゲーム',
                        value: 'online',
                        description: 'ゲームも好きですが、初デートは対面で。',
                    },
                ],
            },
        ],
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


    // ============================================
    // 📝 セクション設定（テキスト・ラベル等）
    // ============================================
    sections: {
        hero: {
            eyebrow: 'Wedding Invitation',
            rsvpButton: 'ご出欠のご連絡',
        },
        intro: {
            eyebrow: 'Invitation',
            // messages are already in config.messages.intro
        },
        details: {
            eyebrow: 'Details',
            title: 'Details',
            subtitle: '式詳細',
            weddingCelebration: 'Wedding Celebration',
            labels: {
                date: 'Date',
                schedule: 'Schedule',
                venue: 'Venue',
            },
            contactMessage: 'ご不明な点がございましたら',
            rsvpMessage: {
                prefix: 'ご出欠のご連絡は',
                suffix: 'までにお願いいたします',
            },
        },
        story: {
            eyebrow: 'Storyline',
            title: 'Our Story',
            subtitle: '私たちの物語',
            storyLabel: 'STORY',
        },
        venue: {
            eyebrow: 'Venue',
            title: '会場のご案内',
            description: '迷わずお越しいただけるよう、所在地とアクセス情報をまとめました。',
            googleMapsButton: 'Google Maps で開く',
        },
        rsvp: {
            eyebrow: 'RSVP',
            title: 'ご出欠のご連絡',
            description: 'お手数ですが、ご出欠のご意向やアレルギーなどございましたら下記フォームにてお知らせください。',
            deadlineLabel: '回答期限：',
            form: {
                name: { label: 'お名前', placeholder: '山田 太郎' },
                email: { label: 'メールアドレス', placeholder: 'example@email.com' },
                attendance: { label: 'ご出欠', options: { attending: '出席', absent: '欠席' } },
                guests: { label: 'ご同伴者数（任意）', placeholder: '例：1名' },
                allergies: { label: 'アレルギーの有無（任意）', placeholder: '例：えび、かに' },
                message: { label: 'メッセージ（任意）', placeholder: 'お二人へのメッセージをお願いします' },
                submitButton: { default: '送信する', sending: '送信中...' },
            },
            success: {
                pill: 'RSVP Received',
                title: 'ご回答ありがとうございます',
                message: 'ご出欠のご連絡を承りました。\n当日、皆様にお会いできることを楽しみにしております。',
                button: '別の回答を送信する',
            },
        },
        musicRequests: {
            pill: 'プレイリストにあなたの1曲を',
            searchPlaceholder: 'アーティスト名や曲名で検索',
            searchButton: { default: '楽曲を検索', searching: '検索中...' },
            searchResultsTitle: '検索結果',
            requestButton: 'リクエスト',
            previewButton: '試聴',
            form: {
                title: '楽曲リクエスト',
                name: { label: 'お名前（任意）', placeholder: '例：ゲスト 太郎（空欄の場合は「匿名ゲスト」として表示されます）' },
                message: { label: 'メッセージ（任意）', placeholder: 'この曲にまつわる思い出や聴きどころをぜひ教えてください' },
                cancelButton: 'キャンセル',
                submitButton: { default: 'リクエストを送信', sending: '登録中...' },
            },
            success: {
                message: 'リクエストありがとうございます！\n当日のプレイリストに反映させていただきます。\nどんな曲が流れるかは、当日のお楽しみです♪',
            },
        },
        coupleQuiz: {
            pill: 'Couple Discovery Quiz',
            title: 'お二人をもっと知ろう',
            description: 'クイズに答えて、おふたりの意外な一面に触れてみましょう。披露宴当日のトリビアトークのヒントにもなります。',
            questionCount: '問目',
            hintLabel: 'ヒント：',
            explanationLabel: '解説',
            correctCountLabel: '現在の正解数：',
            buttons: {
                reset: '最初からやり直す',
                next: '次のクイズへ',
            },
        },
    },

}

export type WeddingConfig = typeof weddingConfig
