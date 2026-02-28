import type { SponsorData, Option, OptionSponsorData } from "./types/sponsor";

const SPONSORS_PLATINA: SponsorData[] = [
  {
    id: "bengo4",
    logoImageUrl: "/images/sponsor-logo/platina/cloud-sign.png",
    linkUrl: "https://www.bengo4.com/corporate/",
    plan: "platina",
    session: [
      {
        speaker: {
          id: "nobuaki-kambe",
          avatarUrl: "/images/avatars/sponsors/nobuaki-kambe.png",
          color: "default",
          sponsorId: "bengo4",
          talkSchedule: "10:55 - 11:05",
          talkTrack: "hacomono",
          socialUrls: {
            github: "https://github.com/nobuaki0331",
          },
          slide: "https://speakerdeck.com/bengo4com/20251025-cloudsign-vuefesjapan2025",
          ja: {
            name: "Nobuaki Kambe",
            affiliation: "弁護士ドットコム株式会社",
            title: "フロントエンドエンジニア",
          },
          en: {
            name: "Nobuaki Kambe",
            affiliation: "Bengo4.com, Inc.",
            title: "Frontend Engineer",
          },
        },
        ja: {
          title: "webpack 依存からの脱却！快適フロントエンド開発を Viteで実現する",
          overview:
            "弁護士ドットコム株式会社が提供するクラウドサインは、リリースしてから今年で10年を迎えます。フロントエンドの規模も大きくなり、webpackを使用し続けることによるペインがありました。\n\n本セッションでは、どのようなペインを抱えていて今回 Vite 移行に至ったのか、そして具体的な移行の方法、移行したことによってどのような恩恵を得ることができたのかの成果についてお話したいと思います。",
        },
        en: {
          title:
            "Breaking Free from Webpack Dependency! Achieving Comfortable Frontend Development with Vite",
          overview:
            "CloudSign, provided by Bengo4.com, Inc., marks its 10th anniversary this year since its release. As the frontend has grown in scale, we've experienced pain points from continuing to use webpack. \nIn this session, I would like to discuss what pain points we were facing that led us to migrate to Vite, the specific migration methods we used, and the benefits and results we achieved from this migration.",
        },
      },
    ],
    ja: {
      name: "弁護士ドットコム株式会社",
      logoImageAlt: "CLOUDSIGN powered by 弁護士ドットコム",
      description:
        "弁護士ドットコム株式会社について\n「プロフェッショナル・テックで、次の常識をつくる。」をミッションとして、人々と専門家をつなぐポータルサイト『弁護士ドットコム』『BUSINESS LAWYERS』『税理士ドットコム』、契約マネジメントプラットフォーム『クラウドサイン』、『リーガル特化型AIエージェント「Legal Brain エージェント」』を提供しています。\n当社はVue.js はサービス初期から活用しており、プロダクトを長年支えてきました。運営の皆様をはじめ、参加者の方々と一緒に Vue.js のコミュニティを盛り上げていきたいと思います。当日会場でお会いできるのを楽しみにしております。",
    },
    en: {
      name: "Bengo4.com,Inc.",
      logoImageAlt: "CLOUDSIGN powered by Bengo4.com",
      description:
        'At Bengo4.com, Inc., our mission is "Create the next common sense through professional tech," and we provide services that connect people with experts, including portal sites such as Bengo4.com, BUSINESS LAWYERS, and Zeiri4.com, as well as the contract management platform CLOUDSIGN and the legal-focused AI agent "Legal Brain Agent." \nWe have been leveraging Vue.js since the very beginning of our service, and it has supported our products for many years. Together with the organizers and all participants, we hope to energize the Vue.js community. We\'re really looking forward to seeing you at the venue!',
    },
  },
  {
    id: "yappli",
    logoImageUrl: "/images/sponsor-logo/platina/yappli.png",
    linkUrl: "https://yappli.co.jp/",
    plan: "platina",
    session: [
      {
        speaker: {
          id: "aose-yuu",
          avatarUrl: "/images/avatars/sponsors/aose-chan.jpg",
          color: "default",
          sponsorId: "yappli",
          talkSchedule: "11:05 - 11:15",
          talkTrack: "hacomono",
          socialUrls: {
            x: "https://x.com/aose_developer",
            bluesky: "https://bsky.app/profile/aose-yuu.bsky.social",
            github: "https://github.com/aose-yuu",
          },
          slide:
            "https://speakerdeck.com/aoseyuu/exploring-framework-agnostic-logic-sharing-with-alien-signals-and-custom-oss",
          ja: {
            name: "Aose Yuu",
            affiliation: "株式会社ヤプリ",
            title: "フロントエンドエンジニア",
          },
          en: {
            name: "Aose Yuu",
            affiliation: "Yappli, Inc.",
            title: "Front-end Engineer",
          },
        },
        ja: {
          title: "alien-signalsと自作OSSで実現するフレームワーク非依存なロジック共通化の探求",
          overview:
            'マルチプロダクト環境では、似通った処理やロジックを各プロダクトごとに重複実装しがちです。\n\n本セッションでは、"ロジックそのものをフレームワークから切り離し、Signalsをベースとした純粋なTypeScriptで一度だけ実装し、各フレームワークで同じ実装を活用する" というアプローチを共有します。\n\nこのアプローチを実現するために、Vue.js 3.6でも採用されるalien-signalsをベースとした自作OSSの『sigrea』というライブラリを構築しました。\n\nこのライブラリを用いて、フレームワークに依存しないロジックを定義し、各フレームワークへ薄いアダプターで橋渡しする設計方法をお話しします。',
        },
        en: {
          title: "Exploring Framework-Agnostic Logic Sharing with alien-signals and Custom OSS",
          overview:
            "In multi-product environments, we tend to duplicate similar processing and logic across each product.\n\nIn this session, I'll share an approach where we decouple logic from frameworks, implement it once in pure TypeScript based on Signals, and leverage the same implementation across different frameworks.\n\nTo realize this approach, I've built a custom OSS library called 'sigrea' based on alien-signals, which is set to be adopted in Vue.js 3.6.I'll discuss how to define framework-agnostic logic using this library and bridge it to each framework through thin adapters.",
        },
      },
    ],
    ja: {
      name: "株式会社ヤプリ",
      logoImageAlt: "株式会社ヤプリロゴ",
      description:
        "株式会社ヤプリは、「デジタルを簡単に、社会を便利に」をミッションに、ノーコードでアプリを開発・運用できるプラットフォーム「Yappli」と「Yappli CRM」を提供し、企業のモバイルDXを支援しています。導入企業は750社を超え、小売・EC、社内DX、公共機関など幅広い分野で活用されています。また、アプリ開発で培った技術を活かし、次世代Web構築プラットフォーム「Yappli WebX」を提供開始し、統合的な顧客体験を提供するデジタルエクスペリエンスプラットフォーム（DXP）へと進化を続けています。",
    },
    en: {
      name: "Yappli, Inc.",
      logoImageAlt: "yappli.inc logo",
      description: `Driven by its mission to make digital transformation accessible, Yappli offers no-code, AI powered platforms for mobile app and web development - "Yappli" and "Yappli WebX." Trusted by over 750 companies across diverse industries, the company delivers integrated solutions that elevate customer and employee experiences.`,
    },
  },
  {
    id: "lmi",
    logoImageUrl: "/images/sponsor-logo/platina/link-and-motivation.png",
    linkUrl: "https://www.lmi.ne.jp/",
    plan: "platina",
    session: [
      {
        speaker: {
          id: "nakagam3",
          avatarUrl: "/images/avatars/sponsors/yuki_nakagami.jpg",
          color: "default",
          sponsorId: "lmi",
          talkSchedule: "10:55 - 11:05",
          talkTrack: "mates",
          socialUrls: {
            x: "https://x.com/nakagam3",
            github: "https://github.com/nakagam3",
          },
          slide: "https://speakerdeck.com/lmi/vuefes2025-link-and-motivation",
          ja: {
            name: "中上 裕基",
            affiliation: "株式会社リンクアンドモチベーション",
            title: "フロントエンドエンジニア",
          },
          en: {
            name: "Yuki Nakagami",
            affiliation: "Link and Motivation Inc.",
            title: "Front-end Engineer",
          },
        },
        ja: {
          title: "VueはAIに弱い？そんなの都市伝説です",
          overview:
            "「AIにコード書かせるならReact」という空気、ありませんか？\nしかし、Vue.jsでもAIとの効果的なコラボレーションは十分に可能です。\n実際に取り組んでみると、重要なのはフレームワークではなく\u201C開発しやすさ\u201Cへの投資でした。\n人に優しい設計、その積み重ねが結果としてAIにも優しい環境をつくります。\nこのセッションでは、AI\u00D7Vue.jsでのプロダクト開発に挑戦してきた経験と、そこから得た学びを共有します。",
        },
        en: {
          title: "Is Vue Not Good with AI? That's Just an Urban Legend",
          overview:
            "Ever heard people say, \"If you're using AI to write code, go with React\"?\nBut we've found that effective collaboration with AI is just as possible with Vue.js.\nWhat really matters isn't the framework itself, but investing in a smoother developer experience.\nBy building human-friendly design step by step, we naturally create an environment that's also friendly for AI.\nIn this session, I'll share our experience developing products with AI and Vue.js, and the lessons we learned along the way.",
        },
      },
    ],
    ja: {
      name: "株式会社リンクアンドモチベーション",
      logoImageAlt: "株式会社リンクアンドモチベーションのシンボルと文字が組み合わさったロゴ",
      description: `Vue Fes Japan、今年もご一緒できることを心から嬉しく思います！\nリンクアンドモチベーションは、「モチベーションを科学し、働きがいのある会社を増やす」ことを目指すHR Techカンパニーです。Vue.jsのしなやかさ、開発の楽しさ、そして何よりもコミュニティの温かさに魅了され、日々"Vue.jsとともに"成長中です。Vue.jsを愛するすべての人たちのための「フェス」。開発者も、参加者も、スタッフも、関わるすべての人がコントリビューター。当日は、たくさんのVue.jsファンの皆さんとお話しできることを、楽しみにしております。Let's make it a Vue-tiful day!`,
    },
    en: {
      name: "Link and Motivation Inc.",
      logoImageAlt: "Corporate logo of Link and Motivation with symbol and text",
      description: `We're excited to join Vue Fes Japan again!\nLink and Motivation is an HR Tech company on a mission to create more fulfilling workplaces.\nCaptivated by the elegance and community of Vue.js, we've grown alongside it since 2017.\nLet's make it a Vue-tiful day together!`,
    },
  },
  {
    id: "uniquevision",
    logoImageUrl: "/images/sponsor-logo/platina/unique-vision.png",
    linkUrl: "https://www.uniquevision.co.jp/",
    plan: "platina",
    session: [
      {
        speaker: {
          id: "ryutaro-yako",
          avatarUrl: "/images/avatars/sponsors/ryutaro_yako.jpg",
          color: "default",
          sponsorId: "uniquevision",
          talkSchedule: "11:05 - 11:15",
          talkTrack: "mates",
          socialUrls: {
            github: "https://github.com/RyutaroYako",
          },
          ja: {
            name: "矢光 隆太郎",
            affiliation: "ユニークビジョン株式会社",
            title: "エンジニア",
          },
          en: {
            name: "Ryutaro Yako",
            affiliation: "Unique Vision Company, Japan.",
            title: "Engineer",
          },
        },
        ja: {
          title: "Storybook 駆動開発で実現する持続可能な Vue コンポーネント設計",
          overview:
            "Vue.js での開発において「再利用可能で保守しやすいコンポーネント設計」は重要な課題です。しかし実際のチーム開発では、コンポーネントのインターフェースが後から決まることで設計が複雑化したり、テストが後回しになって品質にばらつきが生じるといった問題に直面することがあります。\n\n私たちのチームでは、Storybook 駆動開発という手法を 1 年間実践し、これらの課題を解決してきました。従来の「実装 → テスト」ではなく、「インターフェース定義・Story 作成 → 実装 → 自動テスト」という流れに変えることで、手戻りの削減と高いテストカバレッジを実現しています。\n\nこの手法の核心は、実装前に Vue コンポーネントのインターフェースを明確に定義し、Story として表現することです。Storybook の制約が良い設計を促し、自動テスト作成が自然に習慣化されます。コンポーネント数が増えても、品質のばらつきがなく、新しいメンバーでも一定の品質を保てています。\n\nなぜこの手法が効果的なのか、どのような工夫でチーム全体に浸透させたのか、1 年間の実践で得た知見とベストプラクティスをお話しします。",
        },
        en: {
          title: "Sustainable Vue Component Design through Storybook-Driven Development",
          overview:
            'In Vue.js development, "designing reusable and maintainable components" is a critical challenge. However, in actual team development, we often face issues such as designs becoming complex when component interfaces are decided later, or quality inconsistencies arising when testing is postponed.\n\nOur team has been practicing Storybook-Driven Development for a year and has successfully resolved these challenges. By changing from the traditional "implementation → testing" flow to "interface definition/Story creation → implementation → automated testing," we\'ve achieved reduced rework and high test coverage.\n\nThe core of this approach is clearly defining Vue component interfaces before implementation and expressing them as Stories. Storybook\'s constraints promote good design, and automated test creation naturally becomes habitual. Even as the number of components grows, there\'s no quality variance, and new members can maintain consistent quality.\n\nI\'ll share why this approach is effective, how we successfully adopted it across the entire team, and the insights and best practices we\'ve gained from a year of practice.',
        },
      },
    ],
    ja: {
      name: "ユニークビジョン株式会社",
      logoImageAlt: "ユニークビジョン株式会社の企業ロゴ画像",
      description:
        "ユニークビジョンは、ソーシャルメディアを通じて企業のブランド体験を創出するテクノロジーカンパニーです。自社開発のSNSマーケティングツール「Belugaシリーズ」は、年間800件以上の施策を実施しています。\nプロダクト開発ではVue.jsを積極的に導入しており、Vue.js製のコンポーネントライブラリを社内OSSとして開発・改善する文化が根付いています。また、2022年から毎月開催しているエンジニア勉強会「UV Study」では、Vue.jsを頻繁にテーマとして取り上げています。\nツール・文化・場づくりの三位一体で、Vue.jsの発展を後押ししていきます。",
    },
    en: {
      name: "Unique Vision Company, Japan.",
      logoImageAlt: "Unique Vision Co., Ltd. corporate logo image",
      description:
        "Unique Vision is a technology-focused company that creates brand experiences through social media. Our in-house developed SNS marketing tool, the 'Beluga Series,' operates over 800 campaigns annually.\nWe actively utilize Vue.js in our product development, and have established a strong culture of developing and refining Vue.js component libraries as internal open-source software. Since 2022, our monthly 'UV Study' engineering workshops frequently feature Vue.js as a central theme. \nThrough tools, culture, and community-building, we drive the growth of Vue.js.",
    },
  },
];

const SPONSORS_GOLD: SponsorData[] = [
  {
    id: "codmon",
    logoImageUrl: "/images/sponsor-logo/gold/codmon.png",
    linkUrl: "https://www.codmon.com/",
    plan: "gold",
    option: ["intermission-slide"],
    ja: {
      name: "株式会社 コドモン",
      logoImageAlt: "株式会社コドモン",
      description:
        "「子どもを取り巻く環境をテクノロジーの力でよりよいものに」をミッションに掲げ、主力プロダクトである保育・教育施設向けICTサービス「CoDMON（コドモン）」をはじめ、複数の事業を展開しています。開発チームではいくつかのプロダクトや機能にて、Vue.js / Nuxt を採用し開発を行なっています！",
    },
    en: {
      name: "CoDMON, Inc.",
      logoImageAlt: "CoDMON, Inc.",
      description:
        "With the mission of 'Making the environment surrounding children better through the power of technology,' we operate multiple businesses, including our flagship product 'CoDMON,' an ICT service for childcare and educational facilities. Our development team uses Vue.js / Nuxt for several products and features!",
    },
  },
  {
    id: "studist",
    logoImageUrl: "/images/sponsor-logo/gold/studist.png",
    linkUrl: "https://studist.jp/",
    plan: "gold",
    ja: {
      name: "株式会社スタディスト",
      logoImageAlt: "株式会社スタディストのロゴ",
      description:
        "株式会社スタディストは「オペレーションから、働き方と未来を変えていく」というミッションをかかげ企業の生産性向上を支援するスタートアップです。マニュアル作成・共有システム「Teachme Biz」やコンサルティングなどのサービスを通じて「リーンオペレーション」を実現し、人々がクリエイティブな仕事に取り組める「知的活力みなぎる社会」をつくることを目指しています。",
    },
    en: {
      name: "Studist Corporation",
      logoImageAlt: "Studist Corporation logo",
      description: `Studist specializes in lean operations, offering the "Teachme Biz" platform for efficient manual management and productivity enhancement. This tool streamlines information sharing, simplifies work processes, and supports businesses in achieving operational excellence and sustainable growth.`,
    },
  },
  {
    id: "lycorp",
    logoImageUrl: "/images/sponsor-logo/gold/line-yahoo.png",
    linkUrl: "https://www.lycorp.co.jp/ja/technology-design/",
    plan: "gold",
    option: ["student-support"],
    session: [
      {
        speaker: {
          id: "yusuke-sano",
          avatarUrl: "/images/avatars/sponsors/yusuke-sano.jpg",
          color: "default",
          sponsorId: "lycorp",
          talkSchedule: "11:30 - 12:30",
          talkTrack: "cyberAgent",
          socialUrls: {
            github: "https://github.com/YusukeSano",
          },
          ja: {
            name: "佐野 友亮",
            affiliation: "LINEヤフー株式会社",
            title: "フロントエンドエンジニア",
          },
          en: {
            name: "Yusuke Sano",
            affiliation: "LY Corporation",
            title: "Frontend Developer",
          },
        },
        ja: {
          title: "LINE公式アカウントの技術スタックと開発の裏側",
          overview:
            "「LINE公式アカウント」プラットフォームは、国内外の幅広いユーザーと企業に利用される、拡張性と信頼性を重視した大規模プロダクトです。\n一般ユーザーが日々触れるLINE内のWebアプリケーション群と、ビジネスオーナーが運用で使用する管理画面の両輪で成り立ち、機能追加と品質改善を継続的に行っています。\n\n本セッションでは、Vue.jsを中心とした実際のプロダクト構成と技術選定、スケールし続ける開発の裏側を紹介します。",
        },
        en: {
          title: "The Tech Stack and Development Behind LINE Official Account",
          overview:
            "The LINE Official Account platform is a large-scale product that prioritizes scalability and reliability, serving a wide range of users and businesses both domestically and internationally.\nIt consists of two pillars: web applications within LINE that general users interact with daily, and admin dashboards that business owners use for operations, with continuous feature additions and quality improvements.\nIn this session, I'll introduce the actual product architecture and technology selection centered around Vue.js, as well as the behind-the-scenes of continuously scaling development.",
        },
      },
    ],
    ja: {
      name: "LINEヤフー株式会社",
      logoImageAlt: "LINEヤフー株式会社",
      description:
        "LINEヤフー株式会社は、2023年10月にLINE株式会社とヤフー株式会社を含むグループ会社の再編により誕生した、日本最大級のテックカンパニーです。当社は合併前から Vue.js を活用し、プロダクトの開発・提供や Vue.js および Vue Fes Japan への貢献・協賛を行ってきました。今後も Vue.js とともに、世の中やユーザーの生活を変えるようなプロダクトを開発してまいります。",
    },
    en: {
      name: "LY Corporation",
      logoImageAlt: "LY Corporation",
      description:
        "LY Corporation is one of Japan's largest tech companies formed in October 2023 through the reorganization of Group companies including LINE Corporation and Yahoo Japan Corporation.",
    },
  },
  {
    id: "st",
    logoImageUrl: "/images/sponsor-logo/gold/stores.png",
    linkUrl: "https://jobs.st.inc/",
    plan: "gold",
    ja: {
      name: "STORES 株式会社",
      logoImageAlt: "ストアーズ",
      description:
        "STORES 株式会社は、「Just for Fun」のミッションのもと、こだわりや情熱に駆動される経済を目指しています。小売、飲食、サービス業を中心とする中小事業者の店舗運営を支える幅広いプロダクトを提供しています。顧客データを基盤とした「STORES」のプロダクトを通じて、事業者の持続的な売上成長をサポートし、個性豊かで多様な商いがあふれる社会を実現します。",
    },
    en: {
      name: "STORES, Inc.",
      logoImageAlt: "STORES",
      description:
        'STORES Inc. aims to create an economy driven by passion and dedication under our mission of "Just for Fun." We provide a wide range of products that support store operations for small and medium-sized businesses, primarily in retail, food service, and service industries. Through our customer data-driven "STORES" products, we support sustainable revenue growth for businesses and realize a society overflowing with diverse and distinctive commerce.',
    },
  },
  {
    id: "finatext",
    logoImageUrl: "/images/sponsor-logo/gold/finatext-holdings.png",
    linkUrl: "https://hd.finatext.com/",
    plan: "gold",
    ja: {
      name: "株式会社Finatextホールディングス",
      logoImageAlt: "株式会社Finatextホールディングスのロゴ",
      description:
        'Finatextグループは「金融を"サービス"として再発明する」をミッションに、「金融がもっと暮らしに寄り添う世の中」を目指しているフィンテック企業グループです。証券、保険、融資などの基幹システムをSaaS化することで、スピーディーな開発を可能にしています。toBサービスとしてSaaS型基幹システムを提供するだけでなく、その上で稼働するtoCサービスも開発・提供しているマルチプロダクトな会社です。',
    },
    en: {
      name: "Finatext Holdings Ltd.",
      logoImageAlt: "Logo of Finatext Holdings, Inc.",
      description: `STORES Inc. aims to create an economy driven by passion and dedication under our mission of "Just for Fun." We provide a wide range of products that support store operations for small and medium-sized businesses, primarily in retail, food service, and service industries. Through our customer data-driven "STORES" products, we support sustainable revenue growth for businesses and realize a society overflowing with diverse and distinctive commerce.`,
    },
  },
  {
    id: "kinto-technologies",
    logoImageUrl: "/images/sponsor-logo/gold/kinto-technologies.png",
    linkUrl: "https://www.kinto-technologies.com/",
    plan: "gold",
    ja: {
      name: "KINTOテクノロジーズ株式会社",
      logoImageAlt: "KINTOテクノロジーズ　ロゴ",
      description:
        "KINTOテクノロジーズは、トヨタグループ各社が展開するモビリティサービスやビジネスをテクノロジーで支援するために、2021年4月に創設されたテックカンパニーです。\n世界30ヵ国で展開するグローバルモビリティブランド『KINTO』関連プロダクトや、マルチモーダルモビリティサービス『my route』など、クルマに乗る「人」に焦点を当てた新しいサービスの開発・運用を行っています。",
    },
    en: {
      name: "KINTO Technologies Corporation",
      logoImageAlt: "KINTOtechnologies logo",
      description:
        "KINTO Technologies is a tech company established in April 2021 to support the mobility services and businesses developed by various Toyota Group companies through technology.\nWe develop and operate new services that focus on the people who use cars, such as the global mobility brand KINTO, which operates in 30 countries worldwide, and the multimodal mobility service my route.",
    },
  },
  {
    id: "plaid",
    logoImageUrl: "/images/sponsor-logo/gold/plaid.png",
    linkUrl: "https://plaid.co.jp/",
    plan: "gold",
    option: ["student-support"],
    session: [
      {
        speaker: {
          id: "takumi-katayama",
          avatarUrl: "/images/avatars/sponsors/takumi-katayama.jpg",
          color: "default",
          sponsorId: "plaid",
          talkSchedule: "11:30 - 12:30",
          talkTrack: "cyberAgent",
          socialUrls: {
            github: "https://github.com/takurinton",
          },
          slide: "https://speakerdeck.com/plaidtech/plaid-unique-tech-and-internship-life",
          ja: {
            name: "片山拓海",
            affiliation: "株式会社プレイド",
            title: "ソフトウェアエンジニア",
          },
          en: {
            name: "Takumi Katayama",
            affiliation: "PLAID, Inc.",
            title: "Software Engineer",
          },
        },
        ja: {
          title: "プレイドのユニークな技術とインターンのリアル",
          overview:
            "このセッションでは、株式会社プレイドの内製DBやリアルタイム解析基盤などのユニークな技術、そしてインターンで挑めるプロジェクトや成長のリアルを、登壇者自身の「ここが本当に面白い！」という推しポイントを交えてお話しします。",
        },
        en: {
          title: "PLAID's Unique Technologies and the Reality of Internships",
          overview:
            "In this session, we'll discuss PLAID, Inc.'s unique technologies such as their in-house database and real-time analytics infrastructure, as well as the reality of projects interns can tackle and their growth opportunities. The speakers will share their personal \"this is what's really interesting!\" highlights and recommendations.",
        },
      },
    ],
    ja: {
      name: "株式会社プレイド",
      logoImageAlt: "株式会社プレイド",
      description:
        "プレイドは、オンライン上でのユーザー行動をリアルタイムに解析し、エンドユーザーに最適な体験を提供するためのCX（顧客体験）プラットフォーム「KARTE」などを提供しています。プレイドでは、2014年からVue.jsを採用し、KARTEなどのプロダクトの多くの機能をVue.jsで実装しています。当日はブースにて、プレイドのVue.jsや関連技術の活用の工夫などをお話しします。ぜひお立ち寄りください！",
    },
    en: {
      name: "PLAID, Inc.",
      logoImageAlt: "PLAID, Inc.",
      description:
        "PLAID, Inc. provides products such as KARTE, a customer experience (CX) platform that analyzes online user behavior in real time to help deliver optimal experiences to end users. We've been using Vue.js since 2014, and many core features of our products are built with it. At our booth, we'll be sharing how we leverage Vue.js and other related technologies in our development. Feel free to stop by and chat with us!",
    },
  },
  {
    id: "stockmark",
    logoImageUrl: "/images/sponsor-logo/gold/stockmark.png",
    linkUrl: "https://stockmark.co.jp/",
    plan: "gold",
    option: ["name-badge"],
    ja: {
      name: "ストックマーク株式会社",
      logoImageAlt: "Stockmark Inc.",
      description: `ストックマークは、自然言語処理に特化したスタートアップです。\nAIの力で情報の収集・共有・要約を行い情報の力で組織をより強くする「Acconect」のサービス提供をはじめ、自由な書式の文書の構造化を行う「SAT」の提供や、自社での1000億パラメータ規模のLLM・VLMの開発など多様な取り組みを行っています。`,
    },
    en: {
      name: "Stockmark Inc.",
      logoImageAlt: "Stockmark Inc.",
      description: `Stockmark is a startup specializing in natural language processing. We harness the power of AI to collect, share, and summarize information through our "Acconect" service, which strengthens organizations through the power of information. Our diverse initiatives include providing "SAT," a service that structures documents in flexible formats, as well as developing our own large language models (LLMs) and vision language models (VLMs) with parameters in the 100-billion scale.`,
    },
  },
  {
    id: "future",
    logoImageUrl: "/images/sponsor-logo/gold/future-architect.png",
    linkUrl: "https://www.future.co.jp/architect/",
    plan: "gold",
    option: ["room-naming-rights"],
    ja: {
      name: "フューチャーアーキテクト株式会社",
      logoImageAlt: "フューチャーアーキテクト株式会社",
      description:
        "フューチャーでは、各分野に精通するエンジニアが多数在籍しコミッタ―としても活躍しています。エンジニアが実装のみならず業務改革などのコンサルティングも行い、様々な業界のお客様の「経営と IT」を支援しています。現在も社会にインパクトのあるプロジェクトを数多く手掛けており、エンジニアを募集中です！Vue.js は多くのプロジェクトで活用しており、コミュニティへの貢献を通じて社会の発展に寄与します。",
    },
    en: {
      name: "Future Architect, Inc.",
      logoImageAlt: "Future Architect Inc.",
      description: `Future Architect, Inc. has many expert engineers in various domains, who also actively contribute as committers. Our engineers provide comprehensive support, from implementation to business consulting, empowering "management and IT" of clients in diverse industries. We are engaged in a multitude of meaningful projects and are looking for talented engineers to join our team! Vue.js is a widely adopted technology in our projects, and we intend to continuously contribute to societal progress by actively engaging with the community.`,
    },
  },
  {
    id: "generosity",
    logoImageUrl: "/images/sponsor-logo/gold/generosity.png",
    linkUrl: "https://generosity.co.jp",
    plan: "gold",
    ja: {
      name: "株式会社GENEROSITY",
      logoImageAlt: "株式会社GENEROSITY",
      description:
        "GENEROSITYは、リアルとデジタルを融合させ、企業の新たなブランド体験をデザインするスタジオです。イベントのDXや体験型サイネージ等を企画開発しております。\nVue.jsやWebGLを武器にまだ世にないインタラクティブな表現を追求しませんか？技術で世界を驚かせたいエンジニアを募集しています！",
    },
    en: {
      name: "GENEROSITY Inc.",
      logoImageAlt: "GENEROSITY Inc.",
      description:
        "GENEROSITY is a brand experience studio that fuses the real and digital worlds. We design and develop impactful digital solutions for events, interactive signage, and more for leading companies. We are looking for talented engineers who want to use their skills to surprise the world with technology!",
    },
  },
  {
    id: "hennge",
    logoImageUrl: "/images/sponsor-logo/gold/hennge.png",
    linkUrl: "https://hennge.com/jp/",
    plan: "gold",
    session: [
      {
        speaker: {
          id: "",
          avatarUrl: "",
          color: "default",
          attendedIndex: 1,
          socialUrls: {},
          ja: {
            name: "",
            affiliation: "",
          },
          en: {
            name: "",
            affiliation: "",
          },
        },
        ja: {
          title: "",
          overview: "",
        },
        en: {
          title: "",
          overview: "",
        },
      },
      {
        speaker: {
          id: "",
          avatarUrl: "",
          color: "default",
          ja: {
            name: "",
          },
          en: {
            name: "",
          },
        },
        ja: {
          title: "",
          overview: "",
        },
        en: {
          title: "",
          overview: "",
        },
      },
    ],
    ja: {
      name: "HENNGE株式会社",
      logoImageAlt:
        "白い背景に、縦に配置されたHENNGEのロゴと文字が黒でシンプルかつモダンなデザインです。",
      description:
        "HENNGEは日本を代表するクラウドセキュリティ企業です。HENNGE OneでID管理・データ損失防止、セキュリティを一括提供し、数千社以上が活用。\nOpen Source文化を大切にし、Vue.jsなど最新技術を取り入れた安全なSaaS開発を推進。多様で協働的なチーム文化のHENNGEブースへぜひお立ち寄りください。",
    },
    en: {
      name: "HENNGE K.K.",
      logoImageAlt:
        "On a white background, the HENNGE logo and lettering are vertically arranged in a simple and modern black design.",
      description:
        "HENNGE is Japan's leading cloud security company. With HENNGE One, we provide a comprehensive solution for ID management, data loss prevention and security, trusted by thousands of enterprises. We embrace an open-source culture and promote the use of cutting-edge technologies like Vue.js for secure SaaS development. Please come visit our booth to meet the team behind HENNGE!",
    },
  },
  {
    id: "ikkyu",
    logoImageUrl: "/images/sponsor-logo/gold/ikkyu.png",
    linkUrl: "https://www.ikyu.co.jp/",
    plan: "gold",
    ja: {
      name: "株式会社一休",
      logoImageAlt: "株式会社一休",
      description:
        "わたしたちは、「一休.com」「一休.comレストラン」といった宿やレストランなどのWeb予約サービスを運営しており、\nサービスを通して「こころに贅沢」な時間を世に増やすことを目指しています。 \n一休ではVue.jsを積極的に使用して、会員数1,000万を超える大規模なBtoCのサービスを運用しています。",
    },
    en: {
      name: "Ikyu Corporation",
      logoImageAlt: "Ikyu Corporation",
      description: `We offer IKYU.com, a online reservation platform for accommodations and restaurants.
    Through our platform, we aim to create more "luxurious moments for the heart" in the world. \nAt Ikyu, we actively use Vue.js to develop large-scale B2C services with over 10 million members.
    `,
    },
  },
  {
    id: "social-db",
    logoImageUrl: "/images/sponsor-logo/gold/social-databank.png",
    linkUrl: "https://social-db.co.jp",
    plan: "gold",
    ja: {
      name: "ソーシャルデータバンク株式会社",
      logoImageAlt: "ソーシャルデータバンク株式会社",
      description:
        '顧客とのコミュニケーションを"思い通り"に実現できるサービス"Liny"を開発しています。一人一人のお客様に適したアプローチを通じて、デジタル時代のコミュニケーションを豊かにすることを目指しています。',
    },
    en: {
      name: "Social Databank, Inc.",
      logoImageAlt: "Social Databank, Inc.",
      description: `We are developing "Liny," a service that achieves customer communication exactly the way you want it. With personalized approaches tailored to each customer, we aim to enrich communication experiences in the digital age.`,
    },
  },
  {
    id: "tebiki",
    logoImageUrl: "/images/sponsor-logo/gold/tebiki.png",
    linkUrl: "https://tebiki.co.jp/",
    plan: "gold",
    option: ["intermission-slide", "job-board"],
    ja: {
      name: "Tebiki株式会社",
      logoImageAlt: "Tebiki株式会社",
      description:
        "私たちは「現場の未来を切り拓く」をミッションに、動画教育システム『tebiki現場教育』と電子帳票システム『tebiki現場分析』を通じて、製造現場における動画撮影から作業データの分析まで一気通貫で支援し、DXを加速させます。AI動画処理基盤やリアルタイム画像解析、IoT連携、ペタバイト規模のビッグデータ可視化など、まだまだ多くの技術課題があります。現場DXを一緒に実現しましょう。",
    },
    en: {
      name: "Tebiki, Inc.",
      logoImageAlt: "Tebiki, Inc.",
      description:
        "We are on a mission to pioneer the future of frontline operations.\nOur products include Tebiki Frontline Training, a video-based training platform, and Tebiki Frontline Analytics, a digital form and data analysis system. These tools provide end-to-end support for frontline operations, from capturing training videos to analyzing operational data, and help accelerate digital transformation.\nWe are actively addressing complex engineering challenges such as scalable AI-powered video processing, real-time computer vision, IoT integration at the edge, and visualization of petabyte-scale data. Join us in shaping the future of frontline operations.",
    },
  },
  {
    id: "medpeer",
    logoImageUrl: "/images/sponsor-logo/gold/medpeer.png",
    linkUrl: "https://medpeer.co.jp/",
    plan: "gold",
    option: ["staff-t-shirts"],
    ja: {
      name: "メドピア株式会社",
      logoImageAlt: "メドピア株式会社",
      description:
        "メドピアは、医師が創業したヘルステック業界のリーディングカンパニー。「Supporting Doctors, Helping Patients.」のMissionのもと、医療現場のニーズを汲みながら医療従事者、患者、そして健康を維持したい人々を支えるサービスを提供しています。 柔軟でスピード感を持ったサービス開発で医療課題解決を目指すため、多くのプロダクトにVue、Nuxtを用いています。",
    },
    en: {
      name: "MedPeer, Inc.",
      logoImageAlt: "MedPeer, Inc.",
      description:
        'MedPeer, established by a practising physician, is a pioneering enterprise in the healthtech sector. Anchored by our mission\u2014"Supporting Doctors, Helping Patients."\u2014we provide solutions that address the needs of healthcare professionals, patients, and individuals striving to maintain their wellbeing. With a commitment to tackling healthcare challenges through agile and responsive service development, we strategically leverage Vue and Nuxt across many of our products.',
    },
  },
  {
    id: "career-design-center",
    logoImageUrl: "/images/sponsor-logo/gold/career-design-center.png",
    linkUrl:
      "https://directtype.jp/?utm_source=event&utm_medium=banner&utm_campaign=tech_event_251025",
    plan: "gold",
    ja: {
      name: "株式会社キャリアデザインセンター",
      logoImageAlt: "Direct type",
      description:
        "ITエンジニアのためのスカウト転職サービス『Direct type（ダイレクトタイプ）』。\n転職サイトや転職イベント、WEBマガジンなど、エンジニアに強い「type」が展開するサービスです。\n登録した経歴や希望条件を見た企業から直接スカウトが届くため、スキマ時間で転職活動を進められます。\nDirect typeのスカウトは100％IT求人で、有名企業からスタートアップまで1100以上が掲載中です。",
    },
    en: {
      name: "CAREER DESIGN CENTER CO.,LTD.",
      logoImageAlt: "Direct type",
      description: `"Direct type" is a scout-based job change service tailored for IT engineers.\n
    It is provided by the job platform "type," which also operates a job site, hosts career events, and runs a web magazine specifically targeting engineers to support their career development.\n
    By registering your work history and job preferences on Direct type, you can receive direct scout messages from companies that have viewed your profile, enabling you to conduct your job search more efficiently.\n
    All scout messages on Direct type are related to IT talent recruitment, and the platform is used by over 1,100 companies \u2014 ranging from well-known enterprises to startups.
`,
    },
  },
  {
    id: "andpad",
    logoImageUrl: "/images/sponsor-logo/gold/andpad.png",
    linkUrl: "https://engineer.andpad.co.jp/",
    plan: "gold",
    option: ["intermission-slide"],
    ja: {
      name: "株式会社アンドパッド",
      logoImageAlt: "アンドパッド ロゴ",
      description:
        "ANDPADは建築・建設業界に特化したクラウド型プロジェクト管理プラットフォームで、現場効率化から業務改善まで一元管理でき、21万社以上、55万人の毎日の業務を支えています。その多くはVue/Nuxtで実装され、建設現場の複雑な情報を解きほぐしたスマートな操作の実現、個社要求の多い見積・請求に対応するUI、開発スピードを上げるデザインシステムなど様々に工夫しています。ぜひブースにお立ち寄りください",
    },
    en: {
      name: "ANDPAD Inc.",
      logoImageAlt: "ANDPAD logo",
      description:
        "ANDPAD is a Vue/Nuxt-powered project management platform for construction, serving 550K+ users across 210K+ companies. We've built smart UIs that untangle complex construction data, customizable billing components, and a design system that accelerates development. Visit our booth!",
    },
  },
  {
    id: "mov",
    logoImageUrl: "/images/sponsor-logo/gold/mov.png",
    linkUrl: "https://mov.am/",
    plan: "gold",
    option: ["job-board"],
    ja: {
      name: "株式会社mov",
      logoImageAlt: "株式会社mov",
      description:
        "株式会社movは「日本のポテンシャルを最大化する」を使命として掲げ、「インバウンド事業」「店舗支援事業」の2事業を展開しています。movは活気のある日本を取り戻すために、日本市場、日本企業、日本のコンテンツを支援する会社として存在していきます。実直なコンサルティングのスタイルと、高水準のプロダクトで、着実かつ加速度的な成長を遂げています。",
    },
    en: {
      name: "mov inc.",
      logoImageAlt: "mov inc.",
      description: `mov inc. has a mission to "maximize Japan's potential" and is engaged in two businesses: "inbound business" and "store support business." MOV exists as a company that supports the Japanese market, Japanese companies, and Japanese content in order to bring back the vitality of Japan. With an honest consulting style and high-quality products, the company has achieved steady and accelerated growth.`,
    },
  },
  {
    id: "visasq",
    logoImageUrl: "/images/sponsor-logo/gold/visasq.png",
    linkUrl: "https://corp.visasq.co.jp/",
    plan: "gold",
    ja: {
      name: "株式会社ビザスク",
      logoImageAlt: "ビザスク",
      description:
        "ビザスクは「知見と、挑戦をつなぐ」をミッションに掲げ国内外70万人超の知見データベースを活用したナレッジプラットフォームを運営しています。新規事業開発、人材育成、グローバル戦略等、課題を抱える企業と知見を持つ個人を1 時間単位のインタビュー、オンラインアンケート調査、伴走支援などあらゆる手法でマッチングするサービスを展開しています。",
    },
    en: {
      name: "VisasQ Inc.",
      logoImageAlt: "VISASQ",
      description: `VisasQ operates a knowledge platform dedicated to its mission: "We make insightful connections possible." By leveraging an extensive global network of over 700,000 experts, we connect businesses challenges\u2014from new business development and HR strategies to global expansion\u2014with individuals possessing precisely the right knowledge. Our tailored solutions, including one-hour interviews, online surveys, and dedicated hands-on support, empower companies to overcome obstacles and achieve their most ambitious goals.`,
    },
  },
  {
    id: "job-draft",
    logoImageUrl: "/images/sponsor-logo/gold/tenshoku-draft.png",
    linkUrl:
      "https://job-draft.jp/?utm_source=site&utm_medium=conference&utm_campaign=allconference&utm_term=vuefes2025",
    plan: "gold",
    option: ["after-party"],
    ja: {
      name: "株式会社リブセンス",
      logoImageAlt: "転職ドラフト",
      description:
        "転職ドラフトは、「年収も実力も磨ける仕事」に出会える、ITエンジニア向けの転職サービスです。\n年収付きのスカウトが企業から届く「転職ドラフトスカウト」、ITエンジニアキャリアのプロに相談できる「転職ドラフトエージェント」を運営しています。",
    },
    en: {
      name: "Livesense Inc.",
      logoImageAlt: "Tenshoku-DRAFT",
      description: `Tenshoku-DRAFT helps IT engineers boost salary & skills. Get direct salary-inclusive scout offers via "Scout" or expert career advice via "Agent."\nFind a truly rewarding IT engineering path with us.`,
    },
  },
];

const SPONSORS_SILVER: SponsorData[] = [
  {
    id: "mates",
    logoImageUrl: "/images/sponsor-logo/silver/mates.png",
    linkUrl: "https://mates-app.jp/",
    plan: "silver",
    option: ["hall-naming-rights"],
    ja: {
      name: "株式会社メイツ",
      logoImageAlt: "株式会社メイツ | 教育のアップデートを目指す",
      description:
        "株式会社メイツは「教育をアップデートする」をミッションに、再現性・学習成果が高いICT教材 aim@ を提供しています。教育をより良くするプロダクトをともに作っていくエンジニアを募集しています。",
    },
    en: {
      name: "Mates Inc.",
      logoImageAlt: "Mates Corporation | Aiming to Update Education",
      description:
        'Mates Inc. provides ICT educational materials "aim@" with high reproducibility and learning outcomes under the mission of "updating education".We are looking for engineers who can work together to create products that improve education.',
    },
  },
  {
    id: "dmm-corp",
    logoImageUrl: "/images/sponsor-logo/silver/dmm-com.png",
    linkUrl: "https://dmm-corp.com/",
    plan: "silver",
    ja: {
      name: "合同会社DMM.com",
      logoImageAlt: "DMM.com",
      description:
        "会員数4,507万人（※）を誇る総合サービスサイト「DMM.com」を運営。1998年の創業以来、多岐にわたる事業を展開し、現在は60以上のサービスを運営。※2024年2月時点",
    },
    en: {
      name: "DMM.com LLC",
      logoImageAlt: "DMM.com",
      description: `We have been operating "DMM.com", a comprehensive service site with 45.07 million members*.\nSince its establishment in 1998, we have developed more than 60 services. * As of February 2024`,
    },
  },
  {
    id: "istyle",
    logoImageUrl: "/images/sponsor-logo/silver/istyle.png",
    linkUrl: "https://www.istyle.co.jp/",
    plan: "silver",
    option: ["intermission-slide", "job-board"],
    ja: {
      name: "株式会社 アイスタイル",
      logoImageAlt: "株式会社アイスタイル",
      description:
        "株式会社アイスタイルは、美容系総合サービス「@cosme（アットコスメ）」とEC・店舗を運営し、生活者情報を活用する企業横断型の新しいマーケティングプラットフォームを提供しています。",
    },
    en: {
      name: "istyle Inc.",
      logoImageAlt: "istyle, Inc.",
      description:
        "istyle, Inc. operates @cosme, a leading beauty platform, along with E-commerce and physical stores. By leveraging consumer data, we strive to build a new cross-organizational infrastructure that empowers innovative services.",
    },
  },
  {
    id: "CodeRabbit",
    logoImageUrl: "/images/sponsor-logo/silver/code-rabbit.png",
    linkUrl: "https://www.coderabbit.ai",
    plan: "silver",
    option: ["intermission-slide"],
    ja: {
      name: "CodeRabbit",
      logoImageAlt: "CodeRabbit",
      description:
        "CodeRabbitはコードレビューの時間とバグを減らすAIコードレビューサービスです。GitHub/GitLabなどと連携し、PRを自動でレビューします。VS Code機能拡張は無料で利用できます。",
    },
    en: {
      name: "CodeRabbit",
      logoImageAlt: "CodeRabbit",
      description:
        "CodeRabbit slashes code review time and catches bugs faster. It hooks into GitHub and GitLab to auto-review PRs. Free VS Code extension available.",
    },
  },
  {
    id: "crowd-works",
    logoImageUrl: "/images/sponsor-logo/silver/crowd-works.png",
    linkUrl: "https://crowdworks.co.jp/",
    plan: "silver",
    ja: {
      name: "株式会社 クラウドワークス",
      logoImageAlt: "株式会社クラウドワークスのロゴ",
      description:
        "日本最大級のクラウドソーシングサービス「クラウドワークス」は、サービス開発でVue.jsを積極的に活用しています。コミュニティの更なる発展を願い、Vue Fes Japanの成功を応援しています！",
    },
    en: {
      name: "CrowdWorks, Inc.",
      logoImageAlt: "CrowdWorks, Inc.'s logo",
      description:
        "As one of Japan's largest crowdsourcing platforms, CrowdWorks actively leverages Vue.js for our service development. We are delighted to support the success of Vue Fes Japan and hope for the continued development of the community.",
    },
  },
  {
    id: "kickflow",
    logoImageUrl: "/images/sponsor-logo/silver/kickflow.png",
    linkUrl: "https://kickflow.com/",
    plan: "silver",
    option: ["job-board"],
    ja: {
      name: "株式会社 kickflow",
      logoImageAlt: "株式会社kickflow",
      description:
        "私たちは、企業向けのクラウドワークフローであるkickflowを開発・提供しています。kickflowは企業の生産性向上で高く評価されており、大手企業や成長中の企業に導入されています。",
    },
    en: {
      name: "kickflow, Inc.",
      logoImageAlt: "kickflow, Inc.",
      description:
        "We develop and provide kickflow, a cloud workflow solution for businesses.kickflow is highly regarded for improving corporate productivity and is used by large and growing companies.",
    },
  },
];

const SPONSORS_BRONZE: SponsorData[] = [
  {
    id: "sentry",
    logoImageUrl: "/images/sponsor-logo/bronze/sentry.png",
    linkUrl: "https://sentry.ichizoku.io/",
    plan: "bronze",
    ja: {
      name: "Sentry",
      logoImageAlt: "Sentry Logo",
      description: "",
    },
    en: {
      name: "Sentry",
      logoImageAlt: "Sentry Logo",
      description: "",
    },
  },
  {
    id: "zauel",
    logoImageUrl: "/images/sponsor-logo/bronze/zauel-llc.png",
    linkUrl: "https://zauel.co.jp",
    plan: "bronze",
    ja: {
      name: "合同会社 ザウエル",
      logoImageAlt: "合同会社ザウエル",
      description: "",
    },
    en: {
      name: "ZAUEL LLC.",
      logoImageAlt: "ZAUEL LLC.",
      description: "",
    },
  },
  {
    id: "cyberagent",
    logoImageUrl: "/images/sponsor-logo/bronze/cyber-agent.png",
    linkUrl: "https://www.cyberagent.co.jp/",
    plan: "bronze",
    option: ["hands-on"],
    session: [
      {
        speaker: {
          id: "did0es",
          avatarUrl: "/images/avatars/sponsors/did0es.png",
          color: "default",
          sponsorId: "cyberagent",
          socialUrls: {
            x: "https://x.com/did0es",
            github: "https://github.com/shuta13",
          },
          slide:
            "https://speakerdeck.com/shuta13/vitetotypescriptnoproject-referencesde-da-gui-mo-monoreponouikatarogunoririsusaikuruwogao-su-hua-suru",
          ja: {
            name: "did0es",
            affiliation: "株式会社サイバーエージェント",
            title: "ソフトウェアエンジニア",
          },
          en: {
            name: "did0es",
            affiliation: "CyberAgent, Inc.",
            title: "Software Engineer",
          },
        },
        ja: {
          title:
            "ViteとTypeScriptのProject Referencesで大規模モノレポのUIカタログのリリースサイクルを高速化する",
          overview:
            "CyberAgent group Infrastructure Unit（CIU）のWebフロントエンドでは、50以上のパッケージを束ねたモノレポを運用しています。\nこのモノレポは、CIUのWebフロントエンドのUIや共通ロジック、APIクライアントなどを含むSDKとして、CIUの様々なサービスの開発に用いられています。\n本LTでは、SDKが提供しているUIのカタログについて、Viteを活用してリリースを高速化しているお話をします。\n特に、モノレポの管理に用いているTypeScriptのProject ReferencesとViteをどのように組み合わせて、開発サーバーを高速化しつつ、本番への変更にかかる時間を短縮しているのかについてご紹介します。",
        },
        en: {
          title:
            "Accelerating UI Catalog Release Cycles in Large-Scale Monorepos with Vite and TypeScript Project References",
          overview:
            "In the Web frontend of CyberAgent group Infrastructure Unit (CIU), we operate a monorepo that bundles over 50 packages.\nThis monorepo serves as an SDK containing UI components, common logic, and API clients for CIU's Web frontend, and is used in the development of various CIU services.\nIn this LT, I'll talk about how we're accelerating releases for the UI catalog provided by the SDK using Vite.\nIn particular, I'll introduce how we combine TypeScript's Project References, which we use for monorepo management, with Vite to speed up the development server while reducing the time required for production changes.",
        },
      },
      {
        speaker: {
          id: "jabelic",
          avatarUrl: "/images/avatars/sponsors/jabelic.png",
          color: "default",
          sponsorId: "cyberagent",
          socialUrls: {
            x: "https://x.com/Jabelic_",
            bluesky: "https://bsky.app/profile/jabelic.bsky.social",
            github: "https://github.com/Jabelic",
          },
          ja: {
            name: "Jabelic",
            affiliation: "株式会社サイバーエージェント",
            title: "Webフロントエンドエンジニア",
          },
          en: {
            name: "Jabelic",
            affiliation: "CyberAgent, Inc.",
            title: "Web Frontend Developer",
          },
        },
        ja: {
          title: "Vue.js コミュニティとサイバーエージェント",
          overview:
            "Jabelicがフロントエンドエンジニアになった身の上話と、サイバーエージェントについて軽く紹介させてください。",
        },
        en: {
          title: "Vue.js Community and CyberAgent",
          overview:
            "Let me share my personal story of how Jabelic became a frontend engineer and briefly introduce CyberAgent.",
        },
      },
    ],
    ja: {
      name: "株式会社サイバーエージェント",
      logoImageAlt: "株式会社サイバーエージェント",
      description: "",
    },
    en: {
      name: "CyberAgent, Inc.",
      logoImageAlt: "CyberAgent,Inc.",
      description: "",
    },
  },
  {
    id: "iki",
    logoImageUrl: "/images/sponsor-logo/bronze/iki.png",
    linkUrl: "https://iki-inc.net",
    plan: "bronze",
    ja: {
      name: "株式会社IKI",
      logoImageAlt: "株式会社IKI",
      description: "",
    },
    en: {
      name: "IKI Inc.",
      logoImageAlt: "IKI Inc.",
      description: "",
    },
  },
  {
    id: "ftechno-dev",
    logoImageUrl: "/images/sponsor-logo/bronze/future-techno-developers.png",
    linkUrl: "https://www.ftechno-dev.com/",
    plan: "bronze",
    ja: {
      name: "株式会社Future Techno Developers",
      logoImageAlt: "株式会社Future Techno Developers",
      description: "",
    },
    en: {
      name: "Future Techno Developers Co.,Ltd.",
      logoImageAlt: "Future Techno Developers Co., Ltd.",
      description: "",
    },
  },
  {
    id: "quick",
    logoImageUrl: "/images/sponsor-logo/bronze/quick.png",
    linkUrl: "https://quick-wpd.notion.site/",
    plan: "bronze",
    ja: {
      name: "株式会社クイック",
      logoImageAlt:
        '総合人材サービス会社「株式会社クイック」のロゴ。\n当社のシンボルマークのモチーフは「人」。"日本の人事部"を標榜する株式会社クイック、また"世界の人事部"をビジョンに掲げるクイックグループの象徴と言えます。ゆとりと豊かさを感じさせるソフトなフォルムには、時代にフィットするしなやかな感性と未来への確かな飛躍が託されています。',
      description: "",
    },
    en: {
      name: "QUICK CO.,LTD.",
      logoImageAlt: `The logo of "QUICK Co., Ltd.", a comprehensive human resources service company.
    The motif of our company's symbol mark is "people." It is a symbol of QUICK Co., Ltd., which calls itself "Japan's Human Resources Department," and of the QUICK Group, which has a vision of becoming "the world's Human Resources Department." The soft form, which exudes a sense of spaciousness and abundance, represents a flexible sensibility that fits the times and a sure leap into the future.
    `,
      description: "",
    },
  },
];

const SPONSORS_OPTION_ONLY: SponsorData[] = [
  {
    id: "hacomono",
    logoImageUrl: "/images/sponsor-logo/option/hacomono.png",
    linkUrl: "https://www.hacomono.co.jp/recruit/engineer/",
    plan: "option-only",
    option: ["hall-naming-rights", "intermission-slide"],
    ja: {
      name: "株式会社hacomono",
      logoImageAlt: "株式会社hacomono",
      description: "",
    },
    en: {
      name: "hacomono.inc",
      logoImageAlt: "hacomono.inc",
      description: "",
    },
  },
  {
    id: "studio",
    logoImageUrl: "/images/sponsor-logo/option/studio.png",
    linkUrl: "https://studio.design/ja",
    plan: "option-only",
    option: ["student-support"],
    session: [
      {
        speaker: {
          id: "koya-saito",
          avatarUrl: "/images/avatars/sponsors/koya-saito.jpg",
          color: "default",
          sponsorId: "studio",
          talkSchedule: "11:30 - 12:30",
          talkTrack: "cyberAgent",
          socialUrls: {
            github: "https://github.com/kokorau",
          },
          ja: {
            name: "齊藤広野",
            affiliation: "Studio株式会社",
            title: "フロントエンドエンジニア",
          },
          en: {
            name: "Koya Saito",
            affiliation: "Studio, Inc.",
            title: "Frontend Engineer",
          },
        },
        ja: {
          title: "Vue.jsを8年間使ってきた会社が今考えていること",
          overview:
            "Studio株式会社では、Vue.jsを1系から8年間使い続けてきました。Vue.jsの構文の変更や、TypeScriptの導入、周辺ツールの変遷などと付き合いながら、現在もアプリケーション開発の中心にあります。そんな会社のエンジニアに現在のVue.jsやフロントエンドについてどんなことを考えているのかアンケートを実施してみました。",
        },
        en: {
          title: "What a Company That's Been Using Vue.js for 8 Years Is Thinking Now",
          overview:
            "At Studio Inc., we have been using Vue.js continuously for 8 years since version 1. While dealing with changes in Vue.js syntax, the introduction of TypeScript, and the evolution of surrounding tools, it remains at the center of our application development today. We conducted a survey among our engineers to find out what they think about the current state of Vue.js and frontend development.",
        },
      },
    ],
    ja: {
      name: "Studio株式会社",
      logoImageAlt: "Studio株式会社",
      description: "",
    },
    en: {
      name: "Studio, Inc.",
      logoImageAlt: "Studio, Inc.",
      description: "",
    },
  },
];

const SPONSORS_CREATIVE: SponsorData[] = [
  {
    id: "ie3",
    logoImageUrl: "/images/sponsor-logo/creative/ie3.png",
    linkUrl: "https://ie3.jp/",
    plan: "creative",
    ja: {
      name: "IE3",
      logoImageAlt: "IE3 Logo",
      description:
        "IE3 は、ビジュアルアーティスト、エンジニア、デザイナーによるクリエイティブユニットです。「Make it First.」をミッションに、エンジニアリングとクリエイティブを融合させた新しい表現と体験の創造に挑戦しています。Media Art、Digital Signage、UI/UX Design、Webなど多領域に専門性を持ち、公共・商業施設でのメディアアートやサイネージなど大型プロジェクトを手がけています。文化庁メディア芸術祭優秀賞、Cannes Lions Goldなど豊富な受賞歴を誇ります。",
    },
    en: {
      name: "IE3",
      logoImageAlt: "IE3 Logo",
      description:
        'IE3 is a creative unit composed of visual artists, engineers, and designers. With the mission "Make it First.", we strive to create new expressions and experiences by fusing engineering and creativity. We specialize across multiple domains including media art, digital signage, UI/UX design, and web, and we have delivered large-scale projects including media art installations and signage for public and commercial facilities. Our achievements include prestigious awards such as the Excellence Award at the Japan Media Arts Festival and a Gold at the Cannes Lions.',
    },
  },
];

const SPONSORS_INDIVIDUAL: string[] = [
  "Yuhei FUJITA",
  "Naoki Haba",
  "uiuifree",
  "Katashin",
  "ubugeeei",
  "田中弘治",
  "yamanoku",
  "Natsuki",
  "Jabelic",
  "ナイトウコウスケ",
  "kzhrk",
  "江崎伸英",
  "Haoqun Jiang",
  "Daisuke Fujimoto",
  "近藤信幸",
  "SerKo",
  "yug1224",
  "Re:Vue",
  "Delton Ding",
  "LemonNeko",
  "みなみ@hecateball",
  "西脇美穂",
  "odan",
  ".ごっち(Goto Yuta)",
  "tsukkee",
  "白石  祐大",
  "IlyaL",
  "かみくず",
  "mizdra",
  "koyasaeki",
  "jiyuujin",
  "うめのこ",
  "みっちー",
  "ヨウ",
  "R.Okuyama",
  "ぽにょ@ponyoxa",
  "@cyber_snufkin",
  "Haruki Tetone",
  "いのうえたくや",
  "mew-ton",
  "みずの",
  "Hiroki Osame",
  "森田 竜一郎",
  "松永貴照",
];

const filterSponsorsByOption = (option: Option): SponsorData[] => [
  ...SPONSORS_PLATINA.filter((sponsor) => sponsor.option?.includes(option)),
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
const SPONSORS_STUDENT_SUPPORT: SponsorData[] = filterSponsorsByOption("student-support");
const SPONSORS_STAFF_T_SHIRTS: SponsorData[] = filterSponsorsByOption("staff-t-shirts");
const SPONSORS_EXHIBITION: SponsorData[] = filterSponsorsByOption("exhibition");
const SPONSORS_INTERMISSION_SLIDE: SponsorData[] = filterSponsorsByOption("intermission-slide");
const SPONSORS_JOB_BOARD: SponsorData[] = filterSponsorsByOption("job-board");

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
    title: "studentSupportSponsor",
    data: SPONSORS_STUDENT_SUPPORT,
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
    title: "intermissionSlideSponsor",
    data: SPONSORS_INTERMISSION_SLIDE,
  },
  {
    title: "jobBoardSponsor",
    data: SPONSORS_JOB_BOARD,
  },
];

export const SPONSORS = {
  PLATINA: SPONSORS_PLATINA,
  GOLD: SPONSORS_GOLD,
  SILVER: SPONSORS_SILVER,
  BRONZE: SPONSORS_BRONZE,
  OPTION_ONLY: SPONSORS_OPTION_ONLY,
  CREATIVE: SPONSORS_CREATIVE,
  INDIVIDUAL: SPONSORS_INDIVIDUAL,
  OPTION: SPONSORS_OPTION,
  JOB_BOARD: SPONSORS_JOB_BOARD,
};
