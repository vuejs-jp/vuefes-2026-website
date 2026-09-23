import type { SponsorData, Option, OptionSponsorData } from "./types/sponsor";

const SPONSORS_PLATINUM: SponsorData[] = [
  {
    id: "link-and-motivation",
    plan: "platinum",
    programIds: ["platinum-sponsor-session-1"],
    option: ["after-party"],
    logoImageUrl: "/images/sponsor-logo/platinum/link-and-motivation.png",
    ja: {
      name: "株式会社リンクアンドモチベーション",
      linkUrl: "https://www.lmi.ne.jp/",
      logoImageAlt: "株式会社リンクアンドモチベーションのロゴ",
      description:
        'リンクアンドモチベーションは、「モチベーションを科学し、働きがいのある会社を増やす」ことを目指すHR Techカンパニーです。\nVue.jsのしなやかさ、開発の楽しさ、そして何よりもコミュニティの温かさに魅了され、今日も"Vue.jsに夢中"です。\n\nVue.jsを愛するすべての人がコントリビューターになる「フェス」。\n今年もプラチナスポンサーとして、そしてアフターパーティーのホストとしてもご一緒できること、心から嬉しく思います！\n当日は、たくさんのVue.jsファンの皆さんとお話しできることを、楽しみにしております。\n\nLet\'s make it a Vue-tiful day!',
    },
    en: {
      name: "Link and Motivation Inc.",
      linkUrl: "https://www.lmi.ne.jp/english/",
      logoImageAlt: "Link and Motivation logo",
      description:
        "Link and Motivation is an HR Tech company on a mission to create more fulfilling workplaces through the science of motivation.\nWe're drawn to the flexibility of Vue.js, the joy of building with it, and above all, the warmth of its community. Today, just as always, we're still in love with Vue.js.\n\nVue Fes Japan is a festival where everyone who loves Vue.js can be a contributor.\nWe are truly delighted to be part of Vue Fes Japan again this year as a Platinum Sponsor and the host of the After Party.\n\nWe can't wait to meet and connect with fellow Vue.js enthusiasts throughout the event.\nLet's make it a Vue-tiful day!",
    },
  },
  {
    id: "dress-code",
    plan: "platinum",
    programIds: ["platinum-sponsor-session-3"],
    logoImageUrl: "/images/sponsor-logo/platinum/dress-code.png",
    ja: {
      name: "Dress Code株式会社",
      linkUrl: "https://www.dress-code.com/ja",
      logoImageAlt: "Dress Code株式会社のロゴ",
      description:
        "「あらゆる業務を整理し、誰でも自然に気持ちよく実行できる」をミッションに掲げ、業務の「摩擦問題」という社会課題に挑戦するスタートアップです。\n現在、情シス、人事労務、総務といった様々な領域の業務課題解決のためのソリューションを構築し、それらを統合したコンパウンドプロダクトを目指しています。\n今後はさらに、採用、コーポレートガバナンスなどの領域への展開を予定しており、業務オペレーション全体を支える統合プラットフォームとして進化していきます。\n・詳細: https://www.dress-code.com/ja\n・テックブログ: https://zenn.dev/p/dress_code",
    },
    en: {
      name: "Dress Code Inc.",
      linkUrl: "https://www.dress-code.com/ja",
      logoImageAlt: "[Dress Code Inc] logo",
      description:
        'We are a startup tackling the social challenge of "operational friction" in business processes, guided by our mission to "organize all operations so that anyone can naturally and comfortably execute them."\nWe are currently developing solutions to address operational challenges across multiple domains, including IT administration, HR and labor affairs, and general affairs. Our goal is to integrate these into a unified compound product.\nGoing forward, we plan to expand into areas such as recruiting and corporate governance, evolving into an integrated platform that supports the full spectrum of business operations.\n・Learn more: https://www.dress-code.com/ja\n・Tech Blog: https://zenn.dev/p/dress_code',
    },
  },
  {
    id: "vercel",
    plan: "platinum",
    programIds: ["platinum-sponsor-session-2"],
    logoImageUrl: "/images/sponsor-logo/platinum/vercel.png",
    ja: {
      name: "Vercel inc.",
      linkUrl: "http://vercel.com/",
      logoImageAlt: "Vercel",
      description:
        "Vercelは、次世代のAI向けエージェンティック・インフラを開発しています。Next.js、AI SDK、v0の開発元であるVercelは、人間とAIエージェントが共にソフトウェアを開発、リリース、拡張できるプラットフォームを提供しています。Meta、Ramp、Supremeをはじめとする、世界中の数多くの開発者がVercelを使って日々プロダクトをリリースしています。",
    },
    en: {
      name: "Vercel inc.",
      linkUrl: "http://vercel.com/",
      logoImageAlt: "Vercel",
      description:
        "Vercel is the agentic infrastructure company. As the team behind Next.js, AI SDK, and v0, Vercel is the platform where humans and AI agents build, ship, and scale software together. We are trusted by Meta, Ramp, Supreme, and millions of developers worldwide to ship what's next.",
    },
  },
  {
    id: "bengo4",
    plan: "platinum",
    programIds: ["platinum-sponsor-session-4"],
    logoImageUrl: "/images/sponsor-logo/platinum/bengo4.png",
    ja: {
      name: "弁護士ドットコム株式会社",
      linkUrl: "https://www.bengo4.com/corporate/",
      logoImageAlt: "弁護士ドットコム株式会社のロゴ",
      description:
        "「プロフェッショナル・テックで、次の常識をつくる。」をミッションに掲げ、国内弁護士の60%以上が登録する日本最大級の法律ポータルサイト「弁護士ドットコム」を運営。税務相談の「税理士ドットコム」、国内電子契約市場No.1の「クラウドサイン」、法務特化型AIエージェント「Legal Brain エージェント」など革新的なサービスを展開。",
    },
    en: {
      name: "Bengo4.com,Inc.",
      linkUrl: " https://www.bengo4.com/corporate/en/",
      logoImageAlt: "Bengo4.com,Inc. logo",
      description:
        "With the mission \"Be the Professional-Tech Company,\" we operate Bengo4.com, one of Japan's largest legal portal sites, where over 60% of the country's attorneys are registered. We also offer a range of innovative services, including Zeirishi.com for tax consultation, CloudSign—the No. 1 electronic contract service in the Japanese market—and Legal Brain Agent, an AI agent specialized for legal affairs.",
    },
  },
  {
    id: "cloudflare",
    plan: "platinum",
    programIds: ["platinum-sponsor-session-5"],
    logoImageUrl: "/images/sponsor-logo/platinum/cloudflare.png",
    ja: {
      name: "Cloudflare, Inc.",
      linkUrl: "https://www.cloudflare.com/",
      logoImageAlt: "Cloudflare",
      description:
        "Cloudflareがインターネットの20%を支えて得た知見と技術が、あなたのものになります。Cloudflareは、コンピュート、AI推論、ストレージを備えたAI Cloudです。インフラ管理不要。アプリケーションの開発と提供に集中できます。",
    },
    en: {
      name: "Cloudflare, Inc.",
      linkUrl: "https://www.cloudflare.com/",
      logoImageAlt: "Cloudflare",
      description:
        "Everything Cloudflare learned from powering 20% of the Internet is yours by default. Cloudflare is your AI Cloud with compute, AI inference, and storage — letting you ship applications instead of managing infrastructure.",
    },
  },
  {
    id: "unique-vision",
    plan: "platinum",
    programIds: ["platinum-sponsor-session-6"],
    logoImageUrl: "/images/sponsor-logo/platinum/unique-vision.png",
    ja: {
      name: "ユニークビジョン株式会社",
      linkUrl: "https://www.uniquevision.co.jp/",
      logoImageAlt: "ユニークビジョン株式会社の企業ロゴ画像",
      description:
        "ユニークビジョンは、ソーシャルメディアを通じて企業のブランド体験を創出するテクノロジーカンパニーです。自社開発のSNSマーケティングツール「Belugaシリーズ」は、年間800件以上の施策を実施しています。\nプロダクト開発ではVue.jsを積極的に導入しており、Vue.js製のコンポーネントライブラリを社内OSSとして開発・改善する文化が根付いています。また、2022年から毎月開催しているエンジニア勉強会「UV Study」では、Vue.jsを頻繁にテーマとして取り上げています。\nツール・文化・場づくりの三位一体で、Vue.jsの発展を後押ししていきます。",
    },
    en: {
      name: "Unique Vision Company, Japan.",
      linkUrl: "https://www.uniquevision.co.jp/",
      logoImageAlt: "Unique Vision Co., Ltd. corporate logo image",
      description:
        "Unique Vision is a technology-focused company that creates brand experiences through social media. Our in-house developed SNS marketing tool, the 'Beluga Series,' operates over 800 campaigns annually.\nWe actively utilize Vue.js in our product development, and have established a strong culture of developing and refining Vue.js component libraries as internal open-source software. Since 2022, our monthly 'UV Study' engineering workshops frequently feature Vue.js as a central theme.\nThrough tools, culture, and community-building, we drive the growth of Vue.js.",
    },
  },
];
const SPONSORS_GOLD: SponsorData[] = [
  {
    id: "finatext",
    plan: "gold",
    logoImageUrl: "/images/sponsor-logo/gold/finatext.png",
    ja: {
      name: "株式会社Finatextホールディングス",
      linkUrl: "https://finatext.com/",
      logoImageAlt: "株式会社Finatextホールディングス",
      description:
        "Finatextグループは、AI時代の金融インフラを提供する企業グループです。証券・保険・貸金の基幹システムをマルチテナントのプラットフォームとして設計・開発し、パートナー企業が最短距離で金融サービスを構築できる基盤を提供しています。エンジニアの活躍領域はデータ、ビジネスロジック、コンテキスト、エージェントの全レイヤーにわたり、AIを前提とした技術的チャレンジに取り組める環境があります。",
    },
    en: {
      name: "Finatext Holdings Ltd.",
      linkUrl: "https://finatext.com/",
      logoImageAlt: "Finatext Holdings Ltd.",
      description:
        "Finatext Group provides financial infrastructure for the AI era. We design and develop core systems for securities, insurance, and lending as multi-tenant platforms, enabling our partners to build financial services in the shortest possible time. Our engineering spans every layer—data, business logic, context, and agents—offering an environment where you can take on technical challenges with AI at the core.",
    },
  },
  {
    id: "plaid",
    plan: "gold",
    logoImageUrl: "/images/sponsor-logo/gold/plaid.png",
    ja: {
      name: "株式会社プレイド",
      linkUrl: "https://plaid.co.jp/",
      logoImageAlt: "株式会社プレイドのロゴ",
      description:
        "プレイドは、2014年からVue.jsを採用し、顧客体験プラットフォーム「KARTE」をはじめとするプロダクトの開発を続けてきました。我々はプロダクト開発にとどまらず、膨大なデータ処理と連携する周辺の仕組みも含め、自社で一貫して構築しています。ブースでは、Vue.jsや周辺技術の活用事例、技術課題への取り組み、AI前提の開発の進め方や技術の活かし方などを紹介します。ぜひお立ち寄りください！",
    },
    en: {
      name: "PLAID, Inc.",
      linkUrl: "https://plaid.co.jp/en/",
      logoImageAlt: "PLAID, Inc. logo",
      description:
        "PLAID, Inc. has been using Vue.js since 2014 to build products including KARTE, our customer experience platform. Beyond product development itself, we also build the supporting systems that connect with large-scale data processing entirely in-house. At our booth, we’ll share how we use Vue.js and related technologies, how we approach technical challenges, and how we are currently incorporating AI into our development practices. We look forward to seeing you there!",
    },
  },
  {
    id: "andpad",
    plan: "gold",
    logoImageUrl: "/images/sponsor-logo/gold/andpad.png",
    ja: {
      name: "株式会社アンドパッド",
      linkUrl: "https://engineer.andpad.co.jp/",
      logoImageAlt: "株式会社アンドパッドのロゴ",
      description:
        "ANDPADは建築・建設業界に特化したクラウド型プロジェクト管理プラットフォームで、現場効率化から業務改善まで一元管理でき、26万社以上、69万人の毎日の業務を支えています。その多くはVue/Nuxtで実装され、建設現場の複雑な情報を解きほぐしたスマートな操作の実現、個社要求の多い見積・請求に対応するUI、開発スピードを上げるデザインシステムなど様々に工夫しています。ぜひブースにお立ち寄りください",
    },
    en: {
      linkUrl: "https://engineer.andpad.co.jp/",
      name: "ANDPAD Inc.",
      logoImageAlt: "ANDPAD logo",
      description:
        "ANDPAD is a leading construction tech platform in Japan, streamlining workflows for 260k+ companies and 690k+ daily users. Driven heavily by Vue/Nuxt, our frontend architecture focuses on tackling complex industry data to deliver seamless UX. From building flexible, customizable estimation UI to maintaining our own design system for rapid development, we are deeply invested in the Vue ecosystem. Come visit our booth and explore our engineering culture!",
    },
  },
  {
    id: "hacomono",
    plan: "gold",
    option: ["hall-naming-rights"],
    logoImageUrl: "/images/sponsor-logo/gold/hacomono.png",
    ja: {
      name: "株式会社hacomono",
      linkUrl: "https://www.hacomono.co.jp/recruit/engineer/",
      logoImageAlt: "株式会社hacomono",
      description:
        "hacomonoはウェルネス産業向けVertical SaaS企業です。ジュニアスクールや公共施設など全国11,000店舗以上が導入。2026年3月にはtoC向け新サービスFitFitsをリリースしました。",
    },
    en: {
      name: "hacomono, inc.",
      linkUrl: "https://www.hacomono.co.jp/recruit/engineer/",
      logoImageAlt: "hacomono.inc",
      description:
        'hacomono is a leading vertical SaaS provider tailored for the wellness industry, trusted by over 11,000 facilities nationwide, including junior sports schools and public centers. In March 2026, the company expanded its portfolio by launching "FitFits," a new service designed directly for consumers (to-C).',
    },
  },
  {
    id: "kickflow",
    plan: "gold",
    logoImageUrl: "/images/sponsor-logo/gold/kickflow.png",
    ja: {
      name: "株式会社kickflow",
      linkUrl:
        "https://careers.kickflow.co.jp/?utm_source=vuefes&utm_medium=sponsor_logo&utm_campaign=vuefes2026_sponsor",
      logoImageAlt: "株式会社kickflow",
      description:
        "私たちは、中堅〜大企業向けの稟議・ワークフローSaaS「kickflow」を開発しています。顧客の価値にフォーカスしながら、フロントエンドはVue/Nuxtで構築し、AIを前提とした開発文化のもと、少人数チームで爆速開発を大切にしています。ぜひブースにお立ち寄りください。",
    },
    en: {
      name: "kickflow, Inc.",
      linkUrl:
        "https://careers.kickflow.co.jp/?utm_source=vuefes&utm_medium=sponsor_logo&utm_campaign=vuefes2026_sponsor",
      logoImageAlt: "kickflow, Inc.",
      description:
        "We develop kickflow, a cloud-based approval and workflow SaaS built for mid-to-large enterprises. With a focus on customer value, our frontend is built with Vue and Nuxt, and within an AI-first development culture, our small team values rapid development. Please stop by our booth!",
    },
  },
  {
    id: "coderabbit",
    plan: "gold",
    logoImageUrl: "/images/sponsor-logo/gold/coderabbit.png",
    ja: {
      name: "CodeRabbit, Inc.",
      linkUrl: "https://coderabbit.link/atsushija",
      logoImageAlt: "CodeRabbit",
      description:
        "CodeRabbitはAIコードレビューサービスです。GitHubやGitLabなどのGit管理システムと連携し、AIを使ってコードレビューを提供します。コードレビューにかかる工数を半減し、不具合の数も大幅に軽減します。\nCodeRabbitは、オープンソースのリポジトリに対して無料で利用できます。また、VS Code機能拡張やCLIも提供しています。",
    },
    en: {
      name: "CodeRabbit, Inc.",
      linkUrl: "https://coderabbit.link/atsushi",
      logoImageAlt: "CodeRabbit",
      description:
        "CodeRabbit is an AI-powered code review service. We integrate with Git managements such as GitHub and GitLab to provide code reviews using AI. CodeRabbit cuts the time spent on code reviews in half and significantly reduces the number of bugs.\nCodeRabbit is available for free for OSS. And we also offer the VS Code extension and CLI.",
    },
  },
  {
    id: "generosity",
    plan: "gold",
    logoImageUrl: "/images/sponsor-logo/gold/generosity.png",
    ja: {
      name: "株式会社GENEROSITY",
      linkUrl: "https://generosity.co.jp/",
      logoImageAlt: "株式会社GENEROSITYのロゴ",
      description:
        "株式会社GENEROSITYは、リアルとデジタルを掛け合わせて新たな体験価値を創造するブランドエクスペリエンススタジオです。Webサイトやアプリ開発に加え、イベント会場や商業空間の大型ディスプレイ向けUI設計、バックエンドやインフラ領域にも挑戦できます。自ら作った体験が現場で人々の笑顔や感動につながる瞬間を見届けながら成長できる環境です。人の心を動かす体験を、ともに創る仲間を募集しています。",
    },
    en: {
      name: "GENEROSITY Inc.",
      linkUrl: "https://generosity.co.jp/",
      logoImageAlt: "GENEROSITY inc. logo",
      description:
        "At GENEROSITY inc., engineering extends beyond the screen. Our team designs and builds interactive experiences for real-world spaces, where interface design must consider not only pixels but also physical scale, viewing distance, and the way people naturally interact with technology. The development process spans the full technology stack, from frontend applications to backend systems and cloud infrastructure, providing opportunities to grow as a versatile engineer. Perhaps the most rewarding part is experiencing your work in the real world—visiting the venue, watching people interact with what you’ve built, and seeing the smiles on their faces as they enjoy the experience.",
    },
  },
  {
    id: "line-yahoo",
    plan: "gold",
    logoImageUrl: "/images/sponsor-logo/gold/line-yahoo.png",
    ja: {
      name: "LINEヤフー株式会社",
      linkUrl: "https://www.lycorp.co.jp/ja/technology-design/",
      logoImageAlt: "LINEヤフー株式会社",
      description:
        "LINEヤフー株式会社は、2023年10月にLINE株式会社とヤフー株式会社を含むグループ会社の再編により誕生した、日本最大級のテックカンパニーです。当社は合併前から Vue.js を活用し、プロダクトの開発・提供や Vue.js への貢献・協賛を積極的に行ってきました。今後も Vue.js とともに、世の中やユーザーの生活を変えるようなプロダクトを開発してまいります。",
    },
    en: {
      name: "LY Corporation",
      linkUrl: "https://www.lycorp.co.jp/en/technology-design/",
      logoImageAlt: "LY Corporation",
      description:
        "LY Corporation is one of Japan's largest tech companies, established in October 2023. Since before the merger, we have actively utilized Vue.js in developing and delivering our products, as well as contributing to and sponsoring the Vue.js project. Going forward, we will continue to develop products with Vue.js that transform society and the lives of our users.",
    },
  },
  {
    id: "studio",
    plan: "gold",
    logoImageUrl: "/images/sponsor-logo/gold/studio.png",
    ja: {
      name: "Studio株式会社",
      linkUrl: "https://studio.design/ja/",
      logoImageAlt: "Studio株式会社",
      description:
        "StudioはWeb制作プラットフォーム「Studio（スタジオ）」を開発・提供しています。国内利用数No.1の国産ノーコードCMSとして、ユーザー数は90万人を突破。スクラッチ開発に匹敵するクオリティのWebサイトを、構築から公開・運用までワンストップで実現できます。",
    },
    en: {
      name: "Studio, Inc.",
      linkUrl: "https://studio.design/",
      logoImageAlt: "Studio, Inc.",
      description:
        'Studio develops and provides "Studio," a web creation platform. As Japan\'s most widely used no-code CMS, Studio has grown to over 900,000 users. The platform enables organizations to build, publish, and manage high-quality websites with a level of quality comparable to custom-built solutions—all in one place.',
    },
  },
  {
    id: "social-databank",
    plan: "gold",
    logoImageUrl: "/images/sponsor-logo/gold/social-databank.png",
    ja: {
      name: "ソーシャルデータバンク株式会社",
      linkUrl: "https://social-db.co.jp/",
      logoImageAlt: "ソーシャルデータバンク株式会社",
      description:
        "企業が顧客とのコミュニケーションを“思い通り”に実現できるサービス”Liny”を開発しています。一人一人のお客様に適したアプローチを通じて、デジタル時代の人々のコミュニケーションを豊かにすることを目指しています。",
    },
    en: {
      name: "Social Databank, Inc.",
      linkUrl: "https://social-db.co.jp/",
      logoImageAlt: "Social Databank, Inc.",
      description:
        'We are developing "Liny," a service that achieves customer communication exactly the way you want it. With personalized approaches tailored to each customer, we aim to enrich communication experiences in the digital age.',
    },
  },
  {
    id: "ldfcorp",
    plan: "gold",
    logoImageUrl: "/images/sponsor-logo/gold/line-digital-frontier.png",
    ja: {
      name: "LINE Digital Frontier株式会社",
      linkUrl: "https://ldfcorp.com/ja",
      logoImageAlt: "LINE Digital Frontier 株式会社",
      description:
        "LINE Digital Frontier 株式会社は、スマートフォンやタブレットで気軽にマンガ作品が楽しめる電子コミックサービス「LINEマンガ」、国内最大級の電子書籍販売サービス「ebookjapan」と、紙書籍オンライン販売サービス「bookfan」を運営しています。「マンガの未来を創る」べく、ユーザー、クリエイター、そしてパートナー企業に対して最高の価値を提供し続けてまいります。",
    },
    en: {
      name: "LINE Digital Frontier Corp.",
      linkUrl: "https://ldfcorp.com/ja",
      logoImageAlt: " LINE Digital Frontier Corp. ",
      description:
        'LINE Digital Frontier Corp. operates "LINE MANGA," an electronic comic service that allows users to easily enjoy manga on smartphones and tablets; "ebookjapan," one of the largest electronic book retail services in Japan; and "bookfan," an online service for physical books. Aiming to "create the future of manga," we will continue to provide the greatest possible value to our users, creators, and partner companies.',
    },
  },
  {
    id: "mov",
    plan: "gold",
    logoImageUrl: "/images/sponsor-logo/gold/mov.png",
    ja: {
      name: "株式会社mov",
      linkUrl: "https://mov.am/",
      logoImageAlt: "mov inc.",
      description:
        "株式会社movは「日本のポテンシャルを最大化する」を使命に掲げ、「インバウンド事業」「店舗支援事業」を展開しています。活気ある日本を取り戻すため、日本市場・日本企業・日本のコンテンツを支援し続けます。実直なコンサルティングと、エンジニアが磨き上げる高水準のプロダクト。この両輪で着実かつ加速度的に成長しています。皆さんとより良いプロダクトづくりの未来を描けることを楽しみにしています。",
    },
    en: {
      name: "mov inc.",
      linkUrl: "https://mov.am/",
      logoImageAlt: "mov inc.",
      description:
        'mov inc. is driven by its mission to "maximize Japan\'s potential," operating two business divisions: an Inbound Tourism business and a Store Support business. To help restore a vibrant Japan, we remain committed to supporting the Japanese market, Japanese companies, and Japanese content. Our growth rests on two pillars: honest, straightforward consulting and high-quality products crafted day by day by our engineers. Through both, we continue to grow steadily and at an accelerating pace. We look forward to envisioning a future of better product development together with everyone gathering at VueFes.',
    },
  },
  {
    id: "livesense",
    plan: "gold",
    logoImageUrl: "/images/sponsor-logo/gold/livesense.png",
    ja: {
      name: "株式会社リブセンス",
      linkUrl:
        "https://job-draft.jp/?utm_source=site&utm_medium=conference&utm_campaign=allconference&utm_term=vuefes2026",
      logoImageAlt: "転職ドラフト",
      description:
        "転職ドラフトは、「年収も実力も磨ける仕事」に出会える、現年収非公開のITエンジニア向けの転職サービスです。\n年収付きのスカウトが企業から届く「転職ドラフトスカウト」、ITエンジニアキャリアのプロに相談できる「転職ドラフトエージェント」を運営しています。",
    },
    en: {
      name: "Livesense Inc.",
      linkUrl:
        "https://job-draft.jp/?utm_source=site&utm_medium=conference&utm_campaign=allconference&utm_term=vuefes2026",
      logoImageAlt: "Tenshoku-DRAFT",
      description:
        'Tenshoku-DRAFT helps IT engineers boost salary & skills. Get direct salary-inclusive scout offers via "Scout" or expert career advice via "Agent."\nFind a truly rewarding IT engineering path with us.',
    },
  },
  {
    id: "hennge",
    plan: "gold",
    option: ["job-board"],
    logoImageUrl: "/images/sponsor-logo/gold/hennge.png",
    ja: {
      name: "HENNGE株式会社",
      linkUrl: "https://hennge.com/jp/",
      logoImageAlt: "HENNGE",
      description:
        "最近の失敗は、なんですか？\nHENNGEの社名は、変化（HENNKA）と挑戦（CHALLENGE）に由来します。挑戦に失敗はつきものだからこそ「失敗からの学び」を大切にしています。\n「テクノロジーの解放で、世の中を変えていく。」理念のもと、グローバル企業として国内シェアNo.1のIDaaS「HENNGE One」を展開しています。\nテクノロジーを愛し、変化を起こしたい方はぜひブースへ！",
    },
    en: {
      name: "HENNGE K.K.",
      linkUrl: "https://hennge.com/global/",
      logoImageAlt: "HENNGE",
      description:
        'What was your most recent failure?\nOur name, HENNGE, comes from "HENKA" (change) and "CHALLENGE"! \nWhen you try new things, mistakes are part of the process. That’s why we celebrate learning from our failures.\nDriven by our mission to "Liberate Technology to Change the World," we are a diverse, global team. \nOur main service is "HENNGE One," the No.1 IDaaS in Japan!\n\nIf you love technology and want to make an impact, come visit our booth! We can’t wait to meet you.',
    },
  },
];
const SPONSORS_SILVER: SponsorData[] = [
  {
    id: "mates",
    plan: "silver",
    option: ["name-badge"],
    logoImageUrl: "/images/sponsor-logo/silver/mates.png",
    ja: {
      name: "株式会社メイツ",
      linkUrl: "https://eng.mates.education/",
      logoImageAlt: "株式会社メイツのロゴ",
      description:
        "株式会社メイツは「教育をアップデートする」をミッションに、再現性・学習成果が高いICT教材 aim@ を提供しています。 教育をより良くするプロダクトをともに作っていくエンジニアを募集しています。",
    },
    en: {
      name: "Mates Inc.",
      linkUrl: "https://eng.mates.education/",
      logoImageAlt: "Mates Inc. logo",
      description:
        "Mates Inc. provides ICT educational materials “aim@” with high reproducibility and learning outcomes under the mission of “updating education”. We are looking for engineers who can work together to create products that improve education.",
    },
  },
  {
    id: "medpeer",
    plan: "silver",
    option: ["room-naming-rights"],
    logoImageUrl: "/images/sponsor-logo/silver/medpeer.png",
    ja: {
      name: "メドピア株式会社",
      linkUrl: "https://medpeer.co.jp/",
      logoImageAlt: "メドピア株式会社のロゴ",
      description:
        "ヘルステックの常識を塗り替える。\nメドピアは医師が創業し20余年の今、AIファーストな第二創業期。\nVue.js・Nuxtで主要プロダクトを磨き、技術で医療の未来を塗り替える挑戦を共にしませんか。",
    },
    en: {
      name: "MedPeer.inc",
      linkUrl: "https://medpeer.co.jp/",
      logoImageAlt: "[MedPeer]logo",
      description:
        "Redefining what health tech can be.\nStarted by a doctor and now more than 20 years in, MedPeer has entered a second founding era, going AI-first.\nWe build our core products on Vue.js and Nuxt, working to change the future of healthcare through technology. Come build it with us.",
    },
  },
  {
    id: "istyle",
    plan: "silver",
    option: ["intermission-slide", "job-board"],
    logoImageUrl: "/images/sponsor-logo/silver/istyle.png",
    ja: {
      name: "株式会社アイスタイル",
      linkUrl: "https://www.istyle.co.jp/",
      logoImageAlt: "株式会社アイスタイルのロゴ",
      description:
        "株式会社アイスタイルは、美容系総合サービス「@cosme（アットコスメ）」とEC・店舗を運営し、生活者情報を活用する企業横断型の新しいマーケティングプラットフォームを提供しています。",
    },
    en: {
      name: "istyle, Inc.",
      linkUrl: "https://www.istyle.co.jp/en/",
      logoImageAlt: "istyle logo",
      description:
        "istyle, Inc. operates @cosme, a leading beauty platform, along with E-commerce and physical stores. By leveraging consumer data, we strive to build a new cross-organizational infrastructure that empowers innovative services.",
    },
  },
  {
    id: "alpaca-connect",
    plan: "silver",
    logoImageUrl: "/images/sponsor-logo/silver/alpaca-connect.png",
    ja: {
      name: "株式会社アルパカコネクト",
      linkUrl: "https://alpaca-connect.com",
      logoImageAlt: "株式会社アルパカコネクトのロゴ",
      description:
        "キャラクターとクリエイターをつなぐプレイ・バイ・ウェブ（PBW）サービス「アルパカコネクト」を開発・運営。Vue.jsを活用し、物語やイラスト、ボイス、ロールプレイを通じた豊かな創作体験を提供します。",
    },
    en: {
      name: "Alpaca Connect, Inc.",
      linkUrl: "https://alpaca-connect.com",
      logoImageAlt: "ALPACA CONNECT CO., LTD.",
      description:
        "Alpaca Connect develops and operates a Play-by-Web (PBW) platform where stories, artwork, voice, and role-playing come together. Built with Vue.js, we strive to create a seamless and engaging creative experience for our community.",
    },
  },
  {
    id: "engineer-rakuen-radio",
    plan: "silver",
    logoImageUrl: "/images/sponsor-logo/silver/engineer-rakuen-radio.png",
    ja: {
      name: "Findy presents エンジニアの楽園ラジオ",
      linkUrl: "https://engineer.rakuen-radio.com/",
      logoImageAlt: "Findy presents エンジニアの楽園ラジオ",
      description:
        "Tokyofmポッドキャスト公式番組「Findy presents エンジニアの楽園ラジオ」はエンジニアの楽園を目指して旅するラジオです。プログラミングから子育てに至るまで楽園を求めてさすらいます。",
    },
    en: {
      name: "Findy presents: Engineer's Rakuen Radio",
      linkUrl: "https://engineer.rakuen-radio.com/",
      logoImageAlt: "Findy presents: Engineer's Rakuen Radio",
      description:
        "The official Tokyo FM podcast 'Findy presents: Engineer's Rakuen Radio' is a show that journeys on a quest for an engineer's paradise. From programming to parenting, it wanders through various topics in pursuit of paradise.",
    },
  },
];
const SPONSORS_BRONZE: SponsorData[] = [
  {
    id: "stores",
    plan: "bronze",
    logoImageUrl: "/images/sponsor-logo/bronze/stores.png",
    ja: {
      name: "STORES 株式会社",
      linkUrl: "https://jobs.st.inc/",
      logoImageAlt: "STORES 株式会社",
      description: "",
    },
    en: {
      name: "STORES, Inc.",
      linkUrl: "https://jobs.st.inc/",
      logoImageAlt: "STORES, Inc.",
      description: "",
    },
  },
  {
    id: "i-cubed-systems",
    plan: "bronze",
    programIds: ["student-support-sponsor-session-1"],
    option: ["student-support-standard"],
    logoImageUrl: "/images/sponsor-logo/bronze/i-cubed-systems.png",
    ja: {
      name: "株式会社 アイキューブドシステムズ",
      linkUrl: "https://www.icubedsystems.com/",
      logoImageAlt: "株式会社 アイキューブドシステムズのロゴ",
      description: "",
    },
    en: {
      name: "i Cubed Systems, Inc.",
      linkUrl: "https://www.icubedsystems.com/",
      logoImageAlt: "i Cubed Systems, Inc. logo",
      description: "",
    },
  },
  {
    id: "crowd-works",
    plan: "bronze",
    logoImageUrl: "/images/sponsor-logo/bronze/crowd-works.png",
    ja: {
      name: "株式会社クラウドワークス",
      linkUrl: "https://crowdworks.co.jp",
      logoImageAlt: "株式会社クラウドワークスのロゴ",
      description: "",
    },
    en: {
      name: "CrowdWorks, Inc.",
      linkUrl: "https://crowdworks.co.jp/en",
      logoImageAlt: "CrowdWorks, Inc. logo",
      description: "",
    },
  },
  {
    id: "about-the-engineer",
    plan: "bronze",
    logoImageUrl: "/images/sponsor-logo/bronze/about-the-engineer.png",
    ja: {
      name: "合同会社AboutTheEngineer",
      linkUrl: "https://abouttheengineer.com",
      logoImageAlt: "合同会社About The Engineer",
      description: "",
    },
    en: {
      name: "About The Engineer, LLC",
      linkUrl: "https://abouttheengineer.com",
      logoImageAlt: "About The Engineer, LLC",
      description: "",
    },
  },
];
const SPONSORS_OPTION_ONLY: SponsorData[] = [
  {
    id: "w3c",
    plan: "option-only",
    option: ["student-support-mini"],
    logoImageUrl: "/images/sponsor-logo/option-only/w3c.png",
    ja: {
      name: "W3C",
      linkUrl: "http://www.w3.org",
      logoImageAlt: "World Wide Web Consortium (W3C)",
      description: "",
    },
    en: {
      name: "W3C",
      linkUrl: "http://www.w3.org",
      logoImageAlt: "World Wide Web Consortium (W3C) ",
      description: "",
    },
  },
  {
    id: "cybozu",
    plan: "option-only",
    option: ["room-naming-rights", "intermission-slide"],
    logoImageUrl: "/images/sponsor-logo/option-only/cybozu.png",
    ja: {
      name: "サイボウズ株式会社",
      linkUrl: "https://cybozu.co.jp/recruit/",
      logoImageAlt: "サイボウズ株式会社",
      description: "",
    },
    en: {
      name: "Cybozu, Inc.",
      linkUrl: "https://cybozu.co.jp/recruit/",
      logoImageAlt: "Cybozu, Inc.",
      description: "",
    },
  },
  {
    id: "supporterz",
    plan: "option-only",
    programIds: ["student-support-sponsor-session-2"],
    option: ["student-support-standard"],
    logoImageUrl: "/images/sponsor-logo/option-only/supporterz.png",
    ja: {
      name: "株式会社サポーターズ",
      linkUrl: "https://corp.supporterz.jp/",
      logoImageAlt: "株式会社サポーターズ",
      description: "",
    },
    en: {
      name: "Supporterz, Inc.",
      linkUrl: "https://corp.supporterz.jp/",
      logoImageAlt: "Supporterz, Inc.",
      description: "",
    },
  },
  {
    id: "hackz",
    plan: "option-only",
    option: ["student-support-mini"],
    logoImageUrl: "/images/sponsor-logo/option-only/hackz.png",
    ja: {
      name: "株式会社ハックツ",
      linkUrl: "https://hackz.team",
      logoImageAlt: "株式会社ハックツ ロゴ",
      description: "",
    },
    en: {
      name: "Hack’z Inc.",
      linkUrl: "https://hackz.team",
      logoImageAlt: "Hack'z inc. logo",
      description: "",
    },
  },
  {
    id: "tech-world",
    plan: "option-only",
    option: ["media"],
    logoImageUrl: "/images/sponsor-logo/option-only/tech-world.png",
    ja: {
      name: "株式会社テックワールド",
      linkUrl: "https://www.youtube.com/@TECHWORLD111",
      logoImageAlt: "株式会社テックワールドのロゴ",
      description: "",
    },
    en: {
      name: "TECH WORLD, Inc.",
      linkUrl: "https://www.youtube.com/@TECHWORLD111",
      logoImageAlt: "TechWorld Inc. logo",
      description: "",
    },
  },
  {
    id: "tech-train",
    plan: "option-only",
    option: ["media"],
    logoImageUrl: "/images/sponsor-logo/option-only/tech-train.png",
    ja: {
      name: "株式会社TechBowl",
      linkUrl: "https://service.techtrain.dev",
      logoImageAlt: "テックトレイン",
      description: "",
    },
    en: {
      name: "TechBowl Inc.",
      linkUrl: "https://service.techtrain.dev",
      logoImageAlt: "TechTrain",
      description: "",
    },
  },
  {
    id: "esa",
    plan: "option-only",
    option: ["tool"],
    logoImageUrl: "/images/sponsor-logo/option-only/esa.png",
    ja: {
      name: "esa",
      linkUrl: "https://esa.io/",
      logoImageAlt: "esa",
      description: "",
    },
    en: {
      name: "esa",
      linkUrl: "https://esa.io/",
      logoImageAlt: "esa",
      description: "",
    },
  },
  {
    id: "minato-dev",
    plan: "option-only",
    option: ["student-support-mini"],
    logoImageUrl: "/images/sponsor-logo/option-only/minato-dev.png",
    ja: {
      name: "Minato.dev",
      linkUrl: "https://minato-dev.connpass.com/",
      logoImageAlt: "Minato.devのロゴ",
      description: "",
    },
    en: {
      name: "Minato.dev",
      linkUrl: "https://minato-dev.connpass.com/",
      logoImageAlt: "Minato.dev logo",
      description: "",
    },
  },
  {
    id: "optim",
    plan: "option-only",
    option: ["student-support-mini"],
    logoImageUrl: "/images/sponsor-logo/option-only/optim.png",
    ja: {
      name: "株式会社オプティム",
      linkUrl:
        "https://www.optim.co.jp/?utm_source=event&utm_medium=referral&utm_campaign=Vuefes2026",
      logoImageAlt: "株式会社オプティム ロゴ",
      description: "",
    },
    en: {
      name: "OPTiM Corp.",
      linkUrl:
        "https://www.optim.com/?utm_source=event&utm_medium=referral&utm_campaign=Vuefes2026",
      logoImageAlt: "OPTiM Corporation Logo",
      description: "",
    },
  },
  {
    id: "digitalvalue",
    plan: "option-only",
    programIds: ["lunch-sponsor-lt-1"],
    option: ["lunch"],
    logoImageUrl: "/images/sponsor-logo/option-only/digitalvalue.png",
    ja: {
      name: "株式会社デジタルバリュー",
      linkUrl: "https://www.digitalvalue.co.jp/",
      logoImageAlt: "株式会社デジタルバリューのロゴ",
      description: "",
    },
    en: {
      name: "Digital Value Co., Ltd.",
      linkUrl: "https://www.digitalvalue.co.jp/",
      logoImageAlt: "Digital Value Co., Ltd. Logo",
      description: "",
    },
  },
];
const SPONSORS_CREATIVE: SponsorData[] = [];
const SPONSORS_INDIVIDUAL: string[] = [];

const filterSponsorsByOption = (option: Option): SponsorData[] => [
  ...SPONSORS_PLATINUM.filter((sponsor) => sponsor.option?.includes(option)),
  ...SPONSORS_GOLD.filter((sponsor) => sponsor.option?.includes(option)),
  ...SPONSORS_SILVER.filter((sponsor) => sponsor.option?.includes(option)),
  ...SPONSORS_BRONZE.filter((sponsor) => sponsor.option?.includes(option)),
  ...SPONSORS_OPTION_ONLY.filter((sponsor) => sponsor.option?.includes(option)),
];

const SPONSORS_HALL_NAMING_RIGHTS: SponsorData[] = filterSponsorsByOption("hall-naming-rights");
const SPONSORS_ROOM_NAMING_RIGHTS: SponsorData[] = filterSponsorsByOption("room-naming-rights");
const SPONSORS_HANS_ON: SponsorData[] = filterSponsorsByOption("hands-on");
const SPONSORS_LIVE_TRANSLATION: SponsorData[] = filterSponsorsByOption("live-translation");
const SPONSORS_NAME_BADGE: SponsorData[] = filterSponsorsByOption("name-badge");
const SPONSORS_AFTER_PARTY: SponsorData[] = filterSponsorsByOption("after-party");
const SPONSORS_STUDENT_SUPPORT_STANDARD: SponsorData[] = filterSponsorsByOption(
  "student-support-standard",
);
const SPONSORS_STUDENT_SUPPORT_MINI: SponsorData[] = filterSponsorsByOption("student-support-mini");
const SPONSORS_STAFF_T_SHIRTS: SponsorData[] = filterSponsorsByOption("staff-t-shirts");
const SPONSORS_EXHIBITION: SponsorData[] = filterSponsorsByOption("exhibition");
const SPONSORS_INTERMISSION_SLIDE: SponsorData[] = filterSponsorsByOption("intermission-slide");
const SPONSORS_JOB_BOARD: SponsorData[] = filterSponsorsByOption("job-board");
const SPONSORS_MEDIA: SponsorData[] = filterSponsorsByOption("media");
const SPONSORS_TOOL: SponsorData[] = filterSponsorsByOption("tool");
const SPONSORS_LUNCH: SponsorData[] = filterSponsorsByOption("lunch");

const SPONSORS_OPTION: OptionSponsorData[] = [
  {
    title: "hallNamingRightsSponsor",
    data: SPONSORS_HALL_NAMING_RIGHTS,
  },
  {
    title: "roomNamingRightsSponsor",
    data: SPONSORS_ROOM_NAMING_RIGHTS,
  },
  {
    title: "handsOnSponsor",
    data: SPONSORS_HANS_ON,
  },
  {
    title: "liveTranslationSponsor",
    data: SPONSORS_LIVE_TRANSLATION,
  },
  {
    title: "nameBadgeSponsor",
    data: SPONSORS_NAME_BADGE,
  },
  {
    title: "afterPartySponsor",
    data: SPONSORS_AFTER_PARTY,
  },
  {
    title: "studentSupportStandardSponsor",
    data: SPONSORS_STUDENT_SUPPORT_STANDARD,
  },
  {
    title: "studentSupportMiniSponsor",
    data: SPONSORS_STUDENT_SUPPORT_MINI,
  },
  {
    title: "staffTShirtsSponsor",
    data: SPONSORS_STAFF_T_SHIRTS,
  },
  {
    title: "exhibitionSponsor",
    data: SPONSORS_EXHIBITION,
  },
  {
    title: "lunchSponsor",
    data: SPONSORS_LUNCH,
  },
  {
    title: "intermissionSlideSponsor",
    data: SPONSORS_INTERMISSION_SLIDE,
  },
  {
    title: "jobBoardSponsor",
    data: SPONSORS_JOB_BOARD,
  },
  {
    title: "mediaSponsor",
    data: SPONSORS_MEDIA,
  },
  {
    title: "toolSponsor",
    data: SPONSORS_TOOL,
  },
];

export const SPONSORS = {
  PLATINUM: SPONSORS_PLATINUM,
  GOLD: SPONSORS_GOLD,
  SILVER: SPONSORS_SILVER,
  BRONZE: SPONSORS_BRONZE,
  OPTION_ONLY: SPONSORS_OPTION_ONLY,
  CREATIVE: SPONSORS_CREATIVE,
  INDIVIDUAL: SPONSORS_INDIVIDUAL,
  OPTION: SPONSORS_OPTION,
  JOB_BOARD: SPONSORS_JOB_BOARD,
};
