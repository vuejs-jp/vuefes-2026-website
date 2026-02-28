import type { SpeakerData, StudentSupportSpeakerData } from "./types/speaker";

const evan: SpeakerData = {
  id: "yyx990803",
  avatarUrl: "/images/avatars/evan-you.png",
  color: "default",
  attendedIndex: 1,
  talkSchedule: "10:10 - 10:50",
  talkTrack: "hacomono",
  socialUrls: {
    github: "https://github.com/yyx990803",
    x: "https://x.com/youyuxi",
    bluesky: "https://bsky.app/profile/evanyou.me",
  },
  ja: {
    name: "Evan You",
    title: "Vue.js、Vite クリエーター",
  },
  en: {
    name: "Evan You",
    affiliation: "Creator of Vue.js & Vite",
  },
};

export const SESSION_SPEAKERS: SpeakerData[] = [
  evan,
  {
    id: "danielroe",
    avatarUrl: "/images/avatars/daniel-roe.png",
    color: "purple",
    attendedIndex: 4,
    talkSchedule: "12:50 - 13:20",
    talkTrack: "hacomono",
    socialUrls: {
      github: "https://github.com/danielroe",
      bluesky: "https://bsky.app/profile/danielroe.dev",
    },
    slide:
      "https://rfihabsudkpoqozp.public.blob.vercel-storage.com/slides/2025-09-20-wts-beyond-framework.pdf",
    ja: {
      name: "Daniel Roe",
      title: "Nuxt コアチームリード",
      talkTitle: import.meta.vfFeatures.guestDetailsDaniel
        ? "フレームワークを超えて：次の10年のウェブを築く"
        : "TBD",
      talkOverview: import.meta.vfFeatures.guestDetailsDaniel
        ? `フロントエンドのツール群は驚くほどのスピードで進化していますが、優れたウェブアプリケーションの基盤は驚くほど変わらずに存在しています。

本講演では、Daniel がフレームワークの移行からホスティング環境の変化に至るまで、技術の移り変わりを乗り越えて発展し続けるプロジェクトの設計方法を探ります。
Nuxt コアチームを率いる経験や、世界中の開発者コミュニティとの協働から得た知見をもとに、Daniel はパターン、落とし穴、そしてソフトウェアを「強靭で適応力があり、そして楽しく開発できるもの」にするための実践的な戦略を共有します。`
        : undefined,
    },
    en: {
      name: "Daniel Roe",
      affiliation: "Nuxt core team lead",
      talkTitle: import.meta.vfFeatures.guestDetailsDaniel
        ? "Beyond the Framework: Building for the Next Decade of the Web"
        : "TBD",
      talkOverview: import.meta.vfFeatures.guestDetailsDaniel
        ? `Frontend tooling moves at breakneck speed, but the foundations of great web applications remain surprisingly constant.

In this talk, Daniel explores how to architect projects that will thrive across technology shifts — from framework migrations to evolving hosting landscapes.
Drawing from his work leading the Nuxt core team and collaborating with global developer communities, Daniel shares patterns, pitfalls, and practical strategies for building software that stays resilient, adaptable, and joyful to work on.`
        : undefined,
    },
  },
  {
    id: "johnsoncodehk",
    avatarUrl: "/images/avatars/johnson-chu.png",
    color: "orange",
    attendedIndex: 5,
    talkSchedule: "13:35 - 14:05",
    talkTrack: "hacomono",
    socialUrls: {
      github: "https://github.com/johnsoncodehk",
      x: "https://x.com/johnsoncodehk",
    },
    ja: {
      name: "Johnson Chu",
      title: "Vue.js コアチームメンバー、Volar.js 作者",
      // TODO:
      talkTitle: import.meta.vfFeatures.guestDetailsJohnson
        ? "5 年間における Vue 言語ツールの進化"
        : "TBD",
      talkOverview: import.meta.vfFeatures.guestDetailsJohnson
        ? "この 5 年間における Vue の言語ツールの大きな変化と、それらにまつわる裏話を共有します。"
        : undefined,
    },
    en: {
      name: "Johnson Chu",
      affiliation: "Vue.js core team member, Volar.js author",
      // TODO:
      talkTitle: import.meta.vfFeatures.guestDetailsJohnson
        ? "Vue Language Tooling in 5 Years"
        : "TBD",
      talkOverview: import.meta.vfFeatures.guestDetailsJohnson
        ? "I will share with you the significant changes in Vue's language tooling over the past five years, along with the stories behind them."
        : undefined,
    },
  },
  {
    id: "akryum",
    avatarUrl: "/images/avatars/guillaume-chau.png",
    color: "navy",
    attendedIndex: 6,
    talkSchedule: "14:20 - 14:50",
    talkTrack: "hacomono",
    socialUrls: {
      github: "https://github.com/Akryum",
      x: "https://x.com/Akryum",
      bluesky: "https://bsky.app/profile/guillaume.akryum.dev",
    },
    slide: "https://slides.akryum.dev/2025-10-rstore-vue-fes/",
    ja: {
      name: "Guillaume Chau",
      title: "Directus Web アーキテクト",
      talkTitle: import.meta.vfFeatures.guestDetailsAkryum
        ? "rstoreとローカルファーストなストア構築の課題"
        : "TBD",
      talkOverview: import.meta.vfFeatures.guestDetailsAkryum
        ? `私たちは rstore とは何か、そして柔軟な状態管理ソリューションとしてどのように機能するのかを探っていきます。

次のような興味深い問いに答えていきましょう。
・「ローカルファースト」とはどういう意味なのか？
・rstore は Pinia とどう違うのか？
・どのようにして多様なユースケースをサポートできる拡張性を実現したのか？
・「データフェデレーション」とは何か？
・オフライン同期エンジンはどのように作るのか？`
        : undefined,
    },
    en: {
      name: "Guillaume Chau",
      affiliation: "Directus web architect",
      talkTitle: import.meta.vfFeatures.guestDetailsAkryum
        ? "rstore and the challenge of building a local-first store"
        : "TBD",
      talkOverview: import.meta.vfFeatures.guestDetailsAkryum
        ? `We will explore what is rstore and how it works as a flexible state management solution.

Let's answer many interesting questions like:
・What does local-first mean?
・How is rstore different from pinia?
・How was it made extensible to support many use cases?
・What is data federation?
・How to make an offline sync engine?`
        : undefined,
    },
  },
  {
    id: "baku89",
    avatarUrl: "/images/avatars/baku-hashimoto.png",
    color: "default",
    attendedIndex: 7,
    talkSchedule: "15:05 - 15:35",
    talkTrack: "hacomono",
    socialUrls: {
      github: "https://github.com/baku89",
      x: "https://x.com/_baku89",
    },
    slide: "https://baku89.com/ja/vuefes2025",
    ja: {
      name: "橋本 麦",
      title: "映像作家",
      talkTitle: import.meta.vfFeatures.guestDetailsBaku ? "Vue.jsでつくる実験映像" : "TBD",
      talkOverview: import.meta.vfFeatures.guestDetailsBaku
        ? "映像作家として、Vue.jsを使って自作のモーショングラフィックス制作ツールやUIライブラリを開発しながら、コマ撮りやミュージック・ビデオづくりを行ってきました。本セッションでは、非エンジニア視点でのVueの活用法、創作フローにおけるGUI開発の役割、そして表現とツール開発が交差する実践例を紹介します。"
        : undefined,
    },
    en: {
      name: "Baku Hashimoto",
      title: "Experimental Filmmaker",
      talkTitle: import.meta.vfFeatures.guestDetailsBaku
        ? "Building Animation Tools with Vue.js by/for an Experimental Filmmaker"
        : "TBD",
      talkOverview: import.meta.vfFeatures.guestDetailsBaku
        ? "As an experimental filmmaker, I've used Vue.js not only to make tools for my animation practice, including stop-motion and generative motion graphics, but also to explore how tool development can be part of a creative process. In this talk, I'll share how Vue supports artistic workflows from a non-engineer's perspective."
        : undefined,
    },
  },
  {
    id: "hi-ogawa",
    avatarUrl: "/images/avatars/hi-ogawa.png",
    color: "purple",
    attendedIndex: 8,
    talkSchedule: "13:35 - 14:05",
    talkTrack: "mates",
    socialUrls: {
      github: "https://github.com/hi-ogawa",
      bluesky: "https://bsky.app/profile/hiogawa.bsky.social",
      x: "https://twitter.com/hiroshi_18181",
    },
    slide: "https://hiroshi-talks.vercel.app/2025-10-25",
    ja: {
      name: "小川 浩志",
      affiliation: "VoidZero Inc.",
      title: "Vitest、Vite コアチームメンバー",
      talkTitle: import.meta.vfFeatures.guestDetailsOgawa
        ? "Inside Vitest: テストフレームワークアーキテクチャの詳細解説"
        : "TBD",
      talkOverview: import.meta.vfFeatures.guestDetailsOgawa
        ? `このトークでは、Vitestのアーキテクチャ的な独自性について探求します。Viteの幅広いフレームワークエコシステムとプラグイン機能の活用方法、Node.js、ブラウザ、エッジ環境でテストを実行可能にするランタイム非依存アーキテクチャ、そしてモッキング、カバレッジ、テストの並列実行システムなどのコア機能の実装について解説します。
内部構造を理解することで、ソフトウェア開発ワークフローを改善するためのテストの書き方やとパフォーマンス最適化を学ぶことができます。`
        : undefined,
    },
    en: {
      name: "Hiroshi Ogawa",
      affiliation: "VoidZero Inc.",
      title: "Vitest & Vite core team member",
      talkTitle: import.meta.vfFeatures.guestDetailsOgawa
        ? "Inside Vitest: Test Framework Architecture Deep Dive"
        : "TBD",
      talkOverview: import.meta.vfFeatures.guestDetailsOgawa
        ? `This talk explores what makes Vitest architecturally unique, including how it leverages Vite's broad framework ecosystem and plugin capabilities, its runtime agnostic architecture that enables running the same tests across Node.js, browsers, and edge environments, and the implementation of core testing features like mocking, coverage, and parallel execution systems.
By understanding the internals, you'll learn better testing practices and test performance optimization techniques to improve your software development workflow.`
        : undefined,
    },
  },
  {
    id: "leaysgur",
    avatarUrl: "/images/avatars/yuji-sugiura.png",
    color: "orange",
    attendedIndex: 9,
    talkSchedule: "12:50 - 13:20",
    talkTrack: "mates",
    socialUrls: {
      github: "https://github.com/leaysgur",
      x: "https://x.com/leaysgur",
    },
    slide: "https://leaysgur.github.io/slides/vuefes_jp-2025/",
    ja: {
      name: "杉浦 有右嗣",
      affiliation: "VoidZero Inc.",
      title: "Oxc コアチームメンバー",
      talkTitle: import.meta.vfFeatures.guestDetailsLeaysgur
        ? "OXCというOSSへの貢献と、その振り返り"
        : "TBD",
      talkOverview: import.meta.vfFeatures.guestDetailsLeaysgur
        ? `OXCは、Rust製のJavaScript関連ツール群を扱うOSSです。
そのOXCに貢献するようになって、1年半以上が経っていました。
これまで、どういった想いでOSS活動を続けてきたか、またそれはどういう内容だったのかを一挙に振り返ります。`
        : undefined,
    },
    en: {
      name: "Yuji Sugiura",
      affiliation: "VoidZero Inc.",
      title: "Oxc core team member",
      talkTitle: import.meta.vfFeatures.guestDetailsLeaysgur
        ? "Contributing to OSS, Reflecting on OXC"
        : "TBD",
      talkOverview: import.meta.vfFeatures.guestDetailsLeaysgur
        ? `OXC is an OSS project that is a collection of JavaScript-related tools written in Rust.
It's been over a year and a half since I first started contributing to OXC.
Let me reflect on my motivations for OSS contribution and what those contributions involved.`
        : undefined,
    },
  },
  {
    id: "yamanoku",
    avatarUrl: "/images/avatars/yamanoku.png",
    color: "default",
    talkSchedule: "12:50 - 13:20",
    talkTrack: "feature",
    socialUrls: {
      github: "https://github.com/yamanoku",
      x: "https://x.com/yamanoku",
      bluesky: "https://bsky.app/profile/yamanoku.net",
    },
    slide: "https://yamanoku.net/vuefes-japan-2025/slide/",
    ja: {
      name: "やまのく",
      title: "会社員",
      talkTitle: "生成AI時代のWebアプリケーションアクセシビリティ改善",
      talkOverview:
        "本セッションでは、Webアプリケーションのアクセシビリティを改善していくために2025年10月時点での生成AI技術を活用したVue.js / Nuxtによる開発だけに限らない汎用的な改善手法についてを紹介します。\nこのセッションを聴いて明日から使える具体的なツール選定の勘所と思考のフレームワークと具体的なアクションプランを提示します。\n誰もが使えるプロダクトを届けるため、すべての開発者へ新たな武器となる活用を一緒に探求していきます。",
    },
    en: {
      name: "yamanoku",
      title: "Company Employee",
      talkTitle: "Improving Web App Accessibility in the Generative AI Era",
      talkOverview: `In this session, we'll find out about useful, common methods for improving web application accessibility — not limited to development using Vue.js / Nuxt — by leveraging generative AI technologies as of October 2025.

You'll get useful advice you can put into practice, like how to choose the right tools, a thinking framework to guide your decisions, and a concrete action plan you can start applying right away.

Together, we'll discover how all developers can use these new tools to build more accessible products for everyone.`,
    },
  },
  {
    id: "neginasu",
    avatarUrl: "/images/avatars/neginasu.png",
    color: "purple",
    talkSchedule: "13:35 - 14:05",
    talkTrack: "feature",
    socialUrls: {
      github: "https://github.com/neginasu",
      x: "https://x.com/neginasu_grid",
      bluesky: "https://bsky.app/profile/neginasu-grid.bsky.social",
    },
    slide:
      "https://speakerdeck.com/neginasu/which-vue-validation-library-should-we-really-use-the-limits-of-self-made-validation-and-how-i-finally-moved-on",
    ja: {
      name: "ねぎなす",
      affiliation: "株式会社デザインワン・ジャパン",
      title: "フロントエンドエンジニア",
      talkTitle:
        "Vueのバリデーション、結局どれを選べばいい？\n― 自作バリデーションの限界と、脱却までの道のり ―",
      talkOverview:
        "Vue 3をベースにした弊社プロダクトでは、長年にわたり自作のバリデーションロジックを使い続けてきました。しかしその運用は次第に限界を迎えつつありました。\nドキュメント不足、仕様のばらつき、複雑な独自仕様による学習コストの高さ──これらの課題が積み重なり、保守性は年々低下。技術的負債として無視できないものになっていました。\n\n本セッションでは、こうした背景をふまえ、Vueの主要なバリデーションライブラリ（Vuelidate、vee-validate、Zodなど）をどう比較・検討し、最終的にどのような観点で選定・導入を決断したのか、そのプロセスを詳しくご紹介します。\nまた、単にライブラリを選ぶだけでなく、\n\n・ライブラリ導入で得られた実際のメリット（公式ドキュメントの充実、習得のしやすさ、メンテナンス性の向上）\n・レガシーな自作バリデーションから移行する際に直面したリアルな課題\n・部分的な共存戦略や段階的な移行手法\n\nなど、「理想と現実のギャップをどう埋めたか」にもフォーカスします。\n対象は、\n\n・既存の自作バリデーションに限界を感じている方\n・Vue 3環境でのバリデーションライブラリ導入を検討している開発チーム\n\nプロダクトの技術的負債に立ち向かい、より健全な開発体験を目指すためのヒントを得られることを目的としています。\n",
    },
    en: {
      name: "neginasu",
      affiliation: "DesignOne Japan, Inc.",
      title: "Frontend Engineer",
      talkTitle:
        "Which Vue Validation Library Should We Really Use?\nThe Limits of Self-Made Validation and How I Finally Moved On",
      talkOverview:
        "Our product, built on Vue 3, had relied for years on a custom-built validation logic. However, over time, this homegrown solution began to show its limitations. A lack of documentation, inconsistent specifications, and the complexity of our proprietary setup all contributed to a growing maintenance burden. Eventually, the system became a significant source of technical debt that could no longer be ignored.\n\nIn this session, we'll walk you through how we confronted this issue. We'll share how we evaluated major Vue validation libraries—like Vuelidate, vee-validate, and Zod—what criteria guided our decision, and how we ultimately chose and implemented a new solution.\n\nBeyond just selecting a library, we'll discuss the tangible benefits we gained from the transition: comprehensive official documentation, ease of learning, and improved maintainability.\n\nWe'll also dive into real-world challenges we faced during the migration from our legacy validation system, strategies for partial coexistence, and phased rollout methods—highlighting how we bridged the gap between ideal plans and practical constraints.\n\nThis talk is especially relevant for:\n\nDevelopers struggling with the limitations of custom validation logic\n\nTeams considering introducing a validation library in a Vue 3 environment\n\nOur goal is to share insights that can help you tackle technical debt and move toward a healthier, more sustainable development experience.",
    },
  },
  {
    id: "toddeTV",
    avatarUrl: "/images/avatars/todde-tv.jpg",
    color: "orange",
    talkSchedule: "14:20 - 14:50",
    talkTrack: "mates",
    socialUrls: {
      github: "https://github.com/toddeTV",
      x: "https://x.com/toddeTV",
      bluesky: "https://bsky.app/profile/todde.tv",
    },
    slide: "https://talk-2025-10-25-vue-fes-japan.vercel.app/",
    ja: {
      name: "Thorsten Seyschab",
      affiliation: "自営業",
      title: "コンピューターサイエンティスト、ウェブエンジニア",
      talkTitle: "Vue で 3D を楽しむ",
      talkOverview:
        "VueJSを使ってウェブショップにインタラクティブな3D体験をもたらしたり、ミニゲームを作成したりする方法について考えたことはありませんか？没入感のあるウェブベースアプリケーションを作成するために、VueJSとWebGLを組み合わせた汎用性を発見しましょう。このトークでは、WebGL Render APIの技術的な深さと、その強力なラッパーライブラリであるThreeJSとTresJSを紹介し、ブラウザで第三次元を解き放つ方法を実演します。\nウェブベースの3D開発に興味を持つ初心者と愛好者を対象としたこのトークでは、これらの技術の課題、制限、そして可能性を案内します。ミニゲームのコンセプトへの先行的な覗き見を含む、実世界のプロジェクトから得られた洞察を獲得できます。eコマースからゲーミングまで、様々なアプリケーションにこれらのツールを統合する方法についての包括的な理解を持って帰ることができます。",
    },
    en: {
      name: "Thorsten Seyschab",
      affiliation: "Self-employed",
      title: "Computer Scientist & Web Engineer",
      talkTitle: "Playing with Vue in 3D",
      talkOverview:
        "Ever wondered how to bring interactive 3D experiences to webshops, or even create a mini-game, using VueJS? Discover the versatility of VueJS paired with WebGL to create immersive web-based applications. This talk showcases the technical depths of the WebGL Render API and its powerful wrapper libraries ThreeJS and TresJS, to unlock the third dimension in the browser.\n\nAimed at beginners and enthusiasts interested in web-based 3D development, this talk navigates through the challenges, limitations, and potential of these technologies. You will gain insights drawn from real-world projects, including a sneak peek into a mini-game concept. Walk away with a comprehensive understanding of how to integrate these tools into various applications, from eCommerce to gaming.",
    },
  },
  {
    id: "naitokosuke",
    avatarUrl: "/images/avatars/naitokosuke.png",
    color: "navy",
    talkSchedule: "14:20 - 14:50",
    talkTrack: "feature",
    socialUrls: {
      github: "https://github.com/naitokosuke",
      x: "https://x.com/@naitokosuke",
      bluesky: "https://bsky.app/profile/n-aito.bsky.social",
    },
    slide: "https://naitokosuke.github.io/vue-fes-japan-2025-slide-lite",
    ja: {
      name: "ナイトウコウスケ",
      affiliation: "株式会社メイツ",
      title: "フロントエンドエンジニア",
      talkTitle: "最高の DX -\nNuxt Typed Router と Pinia Colada で実現する次世代 Vue/Nuxt 開発",
      talkOverview: `「ルート名の typo でまたエラー」
「データフェッチングの状態管理で毎回同じボイラープレート」
「TypeScript 使ってるのにルーティングは文字列頼み」

Vue/Nuxt 開発でのこんな日常的なストレスを解決したくありませんか？

本セッションでは、Nuxt Typed Router と Pinia Colada を使った実践的な DX 改善手法をお伝えします。
ファイルベースルーティングによる自動型生成で、ルート名・パラメータの補完が効くようになり、宣言的なデータフェッチングでローディング・エラー状態の管理から解放されます。

型情報が豊富で宣言的なコードは、開発者だけでなく AI にとっても理想的な環境を提供します。
「面倒な作業」から「本質的な開発」へとシフトし、AI 時代の開発スタイルに最適化された環境構築の具体的な方法を、実際のコード例と導入時の注意点も含めて詳しくご紹介します。`,
    },
    en: {
      name: "naitokosuke",
      affiliation: "mates Inc.",
      title: "Frontend Developer",
      talkTitle:
        "The Ultimate Developer Experience:\nNext Generation Vue/Nuxt Development with Nuxt Typed Router and Pinia Colada",
      talkOverview: `"Tired of errors from typos in route names?"
"Repeating the same boilerplate for data fetching state management?"
"Still relying on plain strings for routing—even with TypeScript?"

If these sound familiar in your Vue/Nuxt development workflow, this session is for you.

We'll dive into practical strategies for improving developer experience using \`Nuxt Typed Router\` and \`Pinia Colada\`. With automatic type generation from file-based routing, you'll get full autocompletion for route names and parameters. Declarative data fetching frees you from manually managing loading and error states.

Rich type information and declarative code don't just help developers—they create an ideal environment for AI-assisted development as well.

We'll show you how to shift from tedious tasks to meaningful development by building a modern, AI-optimized setup—complete with real code examples and key considerations for adoption.`,
    },
  },
  {
    id: "vados-cosmonic",
    avatarUrl: "/images/avatars/vados-cosmonic.png",
    color: "purple",
    talkSchedule: "15:05 - 15:35",
    talkTrack: "mates",
    socialUrls: {
      github: "https://github.com/vados-cosmonic",
      x: "https://x.com/vadosware",
    },
    ja: {
      name: "Victor",
      affiliation: "Cosmonic",
      title: "バックエンドエンジニア",
      talkTitle: "New Vue：サーバーサイドで動く WebAssembly/WASI プラットフォーム",
      talkOverview:
        "もはや昔ながらの emscriptenではありません。WebAssembly のサーバーサイドの時代が到来しました。WebAssembly System Interface（WASI）と WebAssembly Components によって実現されるこの新時代において、Vue アプリがどのようにこのプラットフォームに適合するのかをご紹介します。\nこのトークでは、サーバーサイド WebAssembly とは何か、それを使う利点は何か、Vue + Vite が、ほとんど手間をかけることなく、この新しいプラットフォームへのアクセスを実現する方法をご紹介します。",
    },
    en: {
      name: "Victor",
      affiliation: "Cosmonic",
      title: "Backend Engineer",
      talkTitle: "A New Vue: The Server Side WebAssembly/WASI Platform",
      talkOverview:
        "Not your grandad's emscripten -- the era of WebAssembly on the server is here, powered by WebAssembly System Interface (WASI) and WebAssembly Components. I'll show you how Vue apps fit into the new platform.\n\nIn this talk we'll cover what WebAssembly on the server is, why you might want to use it, and how Vue + Vite bring you access to another platform with (almost) no work on your part.",
    },
  },
  {
    id: "hiranuma",
    avatarUrl: "/images/avatars/hiranuma.jpg",
    color: "default",
    talkSchedule: "15:05 - 15:35",
    talkTrack: "feature",
    socialUrls: {
      github: "https://github.com/hiranuma",
      x: "https://x.com/waka_405",
      bluesky: "https://bsky.app/profile/waka405.bsky.social",
    },
    ja: {
      name: "平沼 真吾",
      affiliation: "株式会社GENEROSITY",
      title: "CTO",
      talkTitle:
        "Vue 3.6時代のリアクティビティ最前線 〜Vapor/alien-signalsの実践とパフォーマンス最適化〜",
      talkOverview:
        "Alien Signalsとは\nVue 3.6で導入された新しいリアクティビティシステム「Alien Signals」により、状態変更の処理効率が大幅に向上。メモリ使用量はVue 3.5比で14%削減され、計算プロパティや副作用の最適化も実現。これにより、大規模なSPAでもパフォーマンス低下を感じにくくなります。\n\nVapor Modeの革新\nVapor ModeはVirtual DOMのオーバーヘッドを排除し、コンポーネントから直接DOMを生成。APIの変更なしで導入でき、100,000コンポーネントを100msでマウント可能という圧倒的なパフォーマンスを実現しています。\n\n実践Tips\n既存プロジェクトでの移行手順、リアクティビティの落とし穴、Vapor Mode適用時のベストプラクティス、SolidJSなど他フレームワークとの比較も交えて解説します。",
    },
    en: {
      name: "Shingo Hiranuma",
      affiliation: "GENEROSITY inc.",
      title: "CTO",
      talkTitle:
        "The Cutting Edge of Reactivity in Vue 3.6: Mastering Vapor and alien-signals for Reactive Performance",
      talkOverview:
        "What Are Alien Signals?\nAlien Signals is a new reactivity system introduced in Vue 3.6 that significantly boosts the efficiency of state updates. Compared to Vue 3.5, it reduces memory usage by 14% and enhances the performance of computed properties and side effects. As a result, even large-scale SPAs experience noticeably smoother performance.\n\nThe Innovation of Vapor Mode\nVapor Mode eliminates the overhead of the Virtual DOM by rendering DOM elements directly from components. It requires no changes to existing APIs and delivers exceptional performance—capable of mounting 100,000 components in just 100ms.\n\nPractical Tips\nThis session will cover migration steps for existing projects, common pitfalls in the new reactivity system, best practices for using Vapor Mode, and comparisons with other frameworks like SolidJS.",
    },
  },
  {
    id: "wattanx",
    avatarUrl: "/images/avatars/wattanx.png",
    color: "purple",
    talkSchedule: "15:45 - 16:15",
    talkTrack: "mates",
    socialUrls: {
      github: "https://github.com/wattanx",
      x: "https://x.com/pontaxx",
      bluesky: "https://bsky.app/profile/wattanx.dev",
    },
    slide: "https://talks.wattanx.dev/2025/vue-fes-japan/",
    ja: {
      name: "wattanx",
      affiliation: "STORES 株式会社",
      title: "デザインエンジニア / nuxt ecosystem team",
      talkTitle: "Demystifying Nuxt Test Utils",
      talkOverview: `Nuxt アプリケーションを Vitest と @vue/test-utils だけでテストしようとすると、プラグインや ミドルウェア、さらにはサーバーサイドレンダリングまで本番と同じ条件を再現するのは容易ではありません。

こうした課題を解決してくれるのが @nuxt/test-utils です。本セッションでは 実際の現場で役立つ Tips や具体的な使い方だけでなく、テスト環境上で Nuxt がどのように動作するのか、その仕組みを解説します。

このセッションを通じて、より多くの開発者が "明日から現場で使える知識" と "仕組みへの理解" の両方を持ち帰り、効率的に Nuxt アプリケーションをテストできるようになることを目指します。`,
    },
    en: {
      name: "wattanx",
      affiliation: "STORES, Inc.",
      title: "Design Engineer / nuxt ecosystem team",
      talkTitle: "Demystifying Nuxt Test Utils",
      talkOverview: `Testing a Nuxt application with only Vitest and @vue/test-utils makes it challenging to fully replicate the production environment, including plugins, middleware, and server-side rendering.

@nuxt/test-utils addresses these challenges. This session will provide practical tips and specific usage examples, while also explaining the mechanics of Nuxt in a test environment.

This session aims to equip developers with practical knowledge and a deeper understanding of Nuxt's behavior in testing, enabling them to efficiently test Nuxt applications.`,
    },
  },
  {
    id: "sayn0",
    avatarUrl: "/images/avatars/sayn0.jpg",
    color: "orange",
    talkSchedule: "15:50 - 16:20",
    talkTrack: "feature",
    socialUrls: {
      x: "https://x.com/sayn0de",
    },
    slide:
      "https://speakerdeck.com/sayn0/aiqu-dong-dejin-meruyi-cun-raiburarigeng-xin-vue-puroziekutonopin-zhi-xiang-shang-tokai-fa-supidogai-shan-noshi-jian-lu",
    ja: {
      name: "sayn0",
      affiliation: "エン株式会社",
      title: "フロントエンドエンジニア",
      talkTitle:
        "AI駆動で進める依存ライブラリ更新 ─ Vue プロジェクトの品質向上と開発スピード改善の実践録",
      talkOverview:
        "依存ライブラリの更新は「地味だけれど怖い」作業です。しかし AI の急速な進化によって、そのアップデート体験は確実に変わり始めています。\n本セッションでは、Cursor や Claude Code などの AI ツールを活用し、実サービスの Vue コードベースを AI 駆動でアップグレードした事例を取り上げます。具体的には次のポイントを掘り下げます。\n・影響調査からコード変換、テスト自動生成までを半自動化\n・AI を QA プロセスに組み込み、仕様書とテストケースをリアルタイムで照合\n・プロジェクトバッファ／制約スラックを簡易可視化し、潜在リスクを先読み\n・ビルド時間、バンドルサイズ、循環的複雑度など、複数指標で体感できる改善を確認\n・AI の提案をログとして蓄積し、レビューと再学習へつなげる継続改善サイクル\nAI を導入して何が楽になり、どの壁にぶつかったのか――数値化しにくい「肌感覚」も交えて率直に共有します。",
    },
    en: {
      name: "sayn0",
      affiliation: "en Inc.",
      title: "Frontend Engineer",
      talkTitle:
        "Keeping Dependencies Up to Date with AI: A Practical Journey to Better Code Quality and Faster Development in Vue Projects",
      talkOverview:
        "Updating dependencies may seem like a minor task, but it's often nerve-wracking. With the rapid evolution of AI, however, that upgrade experience is starting to change in very real ways.\n\nIn this session, we'll explore how we used AI tools like Cursor and Claude Code to drive the upgrade of a real Vue codebase in a production service. Key highlights include:\n\n* Semi-automating the entire process from impact analysis to code transformation and test generation\n* Integrating AI into the QA process to cross-check specifications and test cases in real time\n* Visualizing project buffers and constraint slack to anticipate hidden risks\n* Measuring tangible improvements across multiple metrics—build times, bundle size, and cyclomatic complexity\n* Creating a feedback loop by logging AI suggestions for ongoing review and retraining\n\nWe'll share what got easier, what didn't go as planned, and how it *felt* to make this shift—giving you a candid look at the real-world impact of bringing AI into the upgrade process.",
    },
  },
  {
    id: "yuichkun",
    avatarUrl: "/images/avatars/yuichkun.jpg",
    color: "navy",
    talkSchedule: "16:35 - 17:05",
    talkTrack: "feature",
    socialUrls: {
      github: "https://github.com/yuichkun",
      x: "https://x.com/yogo_escentier",
    },
    slide: "https://building-audio-apps-with-js.vercel.app/1",
    ja: {
      name: "Yuichi Yogo",
      affiliation: "Escentier",
      title: "音楽家、エンジニア",
      talkTitle: "オーディオアプリケーションをWebでつくる",
      talkOverview: `概要:
ウェブアプリはもはや無音ではありません。
Web Audio API、WebAssembly、そしてGPUアクセラレーションの進化により、ブラウザ上のオーディオはネイティブ環境に匹敵するレベルに到達しています。本セッションでは、Vue（および、より広いフロントエンド）開発者に向けて、パフォーマンスやユーザー体験を損なうことなくリアルタイムのオーディオ処理をアプリに統合するための、実践的で本番運用に耐える戦略を解説します。

主なポイント:
- Web Audio API & AudioWorklet – ブラウザで自在なDSP(音声信号処理)を実現するための基盤
- RNBO → WebAssembly – Cycling '74のRNBOでオーディオモジュールを素早くプロトタイプし、WebAssemblyを通じてウェブにデプロイする
- JUCE – オーディオデベロッパーコミュニティで広く使われているフレームワークとしてのJUCEをざっくり概説
- GPU-Accelerated Audio – DSPをGPUにオフロードして大規模並列性を活用する新たなパターンを探る
- ブラウザの制約 – 現状の各種ブラウザのオーディオ周りの制約と、ワークアラウンドを紹介

対象者:
Vue.jsをビジュアルの枠を超えて、没入型の音響体験へと拡張したいフロントエンドエンジニア、クリエイティブコーダー、オーディオデベロッパー。

前提知識:
JavaScript/TypeScriptとVue.jsの基本的な知識。
DSP(音声信号処理)の予備知識は不要です。`,
    },
    en: {
      name: "Yuichi Yogo",
      affiliation: "Escentier",
      title: "Musician & Engineer",
      talkTitle: "Building Production-Ready Audio Applications in Web",
      talkOverview: `Abstract:
Web applications are no longer silent. Thanks to the evolution of the Web Audio API, WebAssembly, and GPU acceleration, browser-based audio can now rival native environments. In this talk I will guide Vue (and broader front-end) developers through practical, production-ready strategies for integrating real-time audio processing into their apps—without sacrificing performance or user experience.

Key Takeaways:
- Web Audio API & AudioWorklet – Build a solid foundation for low-latency DSP in the browser.
- RNBO → WebAssembly – Build prototype-oriented audio modules in Cycling '74's RNBO and deploy them to the web via WebAssembly.
- JUCE – High-level overview of JUCE as a widely used framework in the audio community, with a brief note on how it may relate to web workflows.
- GPU-Accelerated Audio – Explore emerging patterns that offload DSP to the GPU for massive parallelism.
- Browser Limitations – Understand current constraints and proven work-arounds.

Target Audience:
Front-end engineers, creative coders, and audio developers who want to push Vue.js beyond visuals and into immersive sonic experiences.

Prerequisites:
Basic familiarity with JavaScript/TypeScript and Vue.js. No prior DSP knowledge required—concepts will be introduced from first principles.`,
    },
  },
  {
    id: "antfu",
    avatarUrl: "/images/avatars/antfu.png",
    color: "navy",
    talkSchedule: "17:25 - 17:50",
    talkTrack: "feature",
    socialUrls: {
      github: "https://github.com/antfu",
      x: "https://x.com/antfu7",
      bluesky: "https://bsky.app/profile/antfu.me",
    },
    slide: "https://talks.antfu.me/2025/vuefes/1",
    ja: {
      name: "Anthony Fu",
      affiliation: "NuxtLabs",
      title: "デザインエンジニア",
      talkTitle: "Introducing Vite DevTools",
      talkOverview:
        "新しい Vite DevTools の紹介と、その開発の背景、実際の画面を少しお見せしながら、今後のビジョンについてご説明します。Rolldown や Vite の活用がどのように変わっていくのかもご紹介します。",
    },
    en: {
      name: "Anthony Fu",
      affiliation: "NuxtLabs",
      title: "Design Engineer",
      talkTitle: "Introducing Vite DevTools",
      talkOverview:
        "This talk will introduce the new Vite DevTools, share the background behind its development, and give you a glimpse of the actual interface. We'll also discuss our vision for the future and how tools like Rolldown and Vite itself are evolving and changing the way they're used.",
    },
  },
];

export const LT_SPEAKERS: SpeakerData[] = [
  {
    id: "ssssota",
    avatarUrl: "/images/avatars/ssssota.png",
    color: "default",
    talkSchedule: "16:25 - 17:25",
    talkTrack: "mates",
    socialUrls: {
      github: "https://github.com/ssssota",
      x: "https://x.com/ssssotaro",
      bluesky: "https://bsky.app/profile/ssssota.bsky.social",
    },
    slide: "https://speakerdeck.com/ssssota/why-do-rust-based-tools-run-without-a-rust-environment",
    ja: {
      name: "ssssota",
      affiliation: "株式会社ZOZO",
      title: "フロントエンドエンジニア",
      talkTitle: "なんでRustの環境構築してないのにRust製のツールが動くの？",
      talkOverview:
        "最近はRust製のツールが幅を利かせています。RolldownやBiomeなんかは最近よく聞きます。\nVoidZeroという会社は「次世代のJavaScriptツールチェーンを作る」と言いながらRustのプロジェクトが半数を占めているという噂も。\n\nJavaScript/TypeScript系エンジニアである我々は気付かないうちにRust製のソフトウェアを使っているようです。\nRustの開発・実行環境なんて用意した記憶がないのに...。\n\n改めてRust製のツールが（JavaScriptと協調しながら）動く仕組みをおさらいしましょう。",
    },
    en: {
      name: "ssssota",
      affiliation: "ZOZO, inc.",
      title: "Frontend Developer",
      talkTitle: "Why Do Rust-Based Tools Run Without a Rust Environment?",
      talkOverview: `These days, tools built with Rust are becoming mainstream. You've probably been hearing a lot about projects like Rolldown and Biome. There's even a rumor that at the company VoidZero, which aims to "build the next generation of JavaScript toolchains," half of their projects are now Rust-based.

It seems that we, as JavaScript/TypeScript engineers, are using Rust-based software without even realizing it—even though we have no memory of ever setting up a Rust development environment.

Let's take a fresh look at how these Rust-based tools work, especially in coordination with JavaScript.`,
    },
  },
  {
    id: "NaokiHaba",
    avatarUrl: "/images/avatars/naokihaba.png",
    color: "purple",
    talkSchedule: "16:25 - 17:25",
    talkTrack: "mates",
    socialUrls: {
      github: "https://github.com/NaokiHaba",
      x: "https://x.com/naokihaba",
      bluesky: "https://bsky.app/profile/naokihaba.bsky.social",
    },
    slide:
      "https://speakerdeck.com/naokihaba/nuxt-4-no-singleton-data-fetching-layer-de-he-gabian-warunoka",
    ja: {
      name: "Naoki Haba",
      affiliation: "株式会社 コドモン",
      title: "ソフトウェアエンジニア",
      talkTitle: "Nuxt4のSingleton Data Fetching Layerで何が変わるのか",
      talkOverview:
        "Nuxt4で導入されるSingleton Data Fetching Layerは、従来のuseFetch/useAsyncDataの問題点を根本的に解決する新しいアーキテクチャです。本LTでは、メモリ使用量の削減、リアクティブキーのサポート、自動的なデータクリーンアップなど、パフォーマンスと開発体験を劇的に改善する新機能を5分間で解説します。",
    },
    en: {
      name: "Naoki Haba",
      affiliation: "codmon inc",
      title: "Software Engineer",
      talkTitle: "What Changes with the Singleton Data Fetching Layer in Nuxt 4",
      talkOverview:
        "The Singleton Data Fetching Layer being introduced in Nuxt4 is a new architecture that fundamentally solves the problems of traditional useFetch/useAsyncData. In this Lightning Talk, I'll explain in 5 minutes the new features that dramatically improve performance and developer experience, including reduced memory usage, reactive key support, and automatic data cleanup.",
    },
  },
  {
    id: "2nofa11",
    avatarUrl: "/images/avatars/tsuno.jpeg",
    color: "orange",
    talkSchedule: "16:25 - 17:25",
    talkTrack: "mates",
    socialUrls: {
      github: "https://github.com/2nofa11",
      x: "https://x.com/2nofa11",
    },
    slide: "https://speakerdeck.com/bengo4com/20251025-cloudsign-vuefesjapan2025-lt",
    ja: {
      name: "ツノ",
      affiliation: "弁護士ドットコム株式会社",
      title: "フロントエンジニア",
      talkTitle: "アウトプットから始めるOSSコントリビューション\n〜eslint-plugin-vueの場合〜",
      talkOverview:
        "開発者の中には、「OSSに貢献したいけど難しそう」と感じている方が多いと思います（私もそうです）。\n\nTSKaigi 2025 にて、Anthony Fu 氏が登壇し、eslint-typegen というライブラリを紹介していました。\neslint-typegen に興味を持ち、学習した内容を社外に向けて登壇という形でアウトプットしました。\nこの経験がきっかけとなり、eslint-plugin-vue に eslint-typegen を追加する機会をいただきました。\n\n本LTでは上記を振り返りながら、「OSSの世界は意外と身近である」ことを伝えます。\n具体的には下記の内容を想定しています。\n\n1. 小さな発表やアウトプットが、OSS貢献のきっかけとなったプロセスについて\n2. OSSへの貢献を通じて、技術的に成長できたこと\n3. Vueエコシステムのコミュニティに、OSS参加を歓迎する文化があること",
    },
    en: {
      name: "2nofa11",
      affiliation: "Bengo4.com, Inc.",
      title: "Frontend Engineer",
      talkTitle:
        "Getting Started with OSS Contribution Through Output: A Case Study on eslint-plugin-vue",
      talkOverview:
        "Many developers feel that contributing to open source is something they'd like to do—but it seems intimidating. I've felt the same.\n\nAt TSKaigi 2025, Anthony Fu introduced a library called `eslint-typegen`. His talk sparked my interest, so I decided to learn more about it and share what I learned in a public talk outside my company. That small act of output led to an unexpected opportunity: contributing `eslint-typegen` support to `eslint-plugin-vue`.\n\nIn this lightning talk, I'll reflect on that journey to show that *open source is closer than you think*. I'll cover:\n\n1. How a small talk and public output became the gateway to OSS contribution\n2. The technical growth I experienced through contributing\n3. The welcoming and open culture of the Vue ecosystem's OSS community\n\nI hope this story encourages more developers to take that first small step into the world of open source.",
    },
  },
  {
    id: "rinchoku",
    avatarUrl: "/images/avatars/rinchoku.jpg",
    color: "navy",
    talkSchedule: "16:25 - 17:25",
    talkTrack: "mates",
    socialUrls: {
      github: "https://github.com/rinchoku",
      x: "https://x.com/stupid_owl",
    },
    slide: "https://speakerdeck.com/rinchoku/zhi-jue-todezain",
    ja: {
      name: "Rinchoku",
      title: "エンジニア",
      talkTitle: "知覚とデザイン short version",
      talkOverview:
        "現在では「UI/UX」はありきたりの言葉になりました。\nユーザーストーリーを考慮した導線設計、デザインスタイルガイドを作成することでユーザーに見せるデザインの統一性・アクションをわかりやすくしています。\n\n人間が目から取得した情報を脳がどのように処理するかを理解することで、普段のデザインの見方に対して新しい所見を与えられればと思います。",
    },
    en: {
      name: "Rinchoku",
      title: "Engineer",
      talkTitle: "Perception and Design (Short Version)",
      talkOverview:
        'Today, "UI/UX" has become a buzzword we hear all the time.\n\nBy designing user flows based on user stories and creating consistent design style guides, we aim to present a unified look and make actions clear for users.\n\nIn this talk, I hope to offer a fresh perspective on how we approach everyday design—by understanding how the human brain processes the information it receives through the eyes.',
    },
  },
  {
    id: "noriyuki-shimizu",
    avatarUrl: "/images/avatars/shiminori.jpg",
    color: "default",
    talkSchedule: "16:25 - 17:25",
    talkTrack: "mates",
    socialUrls: {
      github: "https://github.com/noriyuki-shimizu",
      x: "https://x.com/@smnr14785228",
    },
    slide: "https://gamma.app/docs/Nuxt-Cookie--3tmj2du5ltzn66z",
    ja: {
      name: "shiminori",
      affiliation: "フリーランス",
      title: "フロントエンジニア",
      talkTitle: "Nuxt 認証基盤作成における Cookie 状態管理のポイント",
      talkOverview:
        "Nuxt において独自の認証基盤を構築する際の、Cookie を用いた状態管理のポイントについて共有させていただきます。\n\n現時点では、Nuxt におけるメールアドレスおよびパスワードによる認証に関して、安定して利用できるサードパーティ製のソリューションが存在しません。\n\nそのため、独自に認証機構を実装した際の工夫点や注意点についてお伝えいたします。  \n特に、`useCookie` コンポーザブルを使用するだけでは期待通りに動作しなかった背景についても説明できればと考えております。\n",
    },
    en: {
      name: "shiminori",
      affiliation: "Sole proprietorship",
      title: "Front Engineer",
      talkTitle: "The Key to Cookie-Based State Management in Nuxt Authentication",
      talkOverview:
        "In this session, I'll share key considerations for managing authentication state using cookies when building a custom auth system in Nuxt.\n\nAs of now, there are no stable third-party solutions for email and password-based authentication in Nuxt, which has led us to implement our own.\n\nI'll walk you through the challenges we faced and the practical workarounds we found—especially around why simply using the `useCookie` composable didn't behave as expected, and what we did to address it.",
    },
  },
  {
    id: "Crayfisher-zari",
    avatarUrl: "/images/avatars/crayfisher_zari.jpg",
    color: "purple",
    talkSchedule: "16:25 - 17:25",
    talkTrack: "mates",
    socialUrls: {
      github: "https://github.com/Crayfisher-zari",
      x: "https://x.com/@crayfisher_zari",
      bluesky: "https://bsky.app/profile/crayfisher-zari.bsky.social",
    },
    slide:
      "https://speakerdeck.com/nishiharatsubasa/ge-ren-dedezitaruting-no-dezainsisutemuwovue-dot-jsde-zuo-tuteiruhua",
    ja: {
      name: "にしはら",
      affiliation: "株式会社ICS",
      title: "フロントエンドエンジニア",
      talkTitle: "個人でデジタル庁のデザインシステムをVue.jsで作っている話",
      talkOverview:
        "デジタル庁が公開しているデザインシステムをVue.jsで実装した話について発表します。デザインシステムを作っていく中で感じた強力なv-modelやcomputedの魅力などをお伝えします。",
    },
    en: {
      name: "Nishihara",
      affiliation: "ICS inc",
      title: "Frontend Engineer",
      talkTitle: "Building Japan's Digital Agency Design System in Vue.js as a Solo Developer",
      talkOverview:
        "In this talk, I'll share our experience implementing the Digital Agency's public design system using Vue.js. Along the way, I'll highlight some of the key strengths we discovered—particularly the power of `v-model` and `computed`—as we built out the system.",
    },
  },
  {
    id: "yut0naga1",
    avatarUrl: "/images/avatars/yut0naga1.jpg",
    color: "orange",
    talkSchedule: "16:25 - 17:25",
    talkTrack: "mates",
    socialUrls: {
      x: "https://x.com/yut0naga1",
    },
    slide:
      "https://speakerdeck.com/yut0naga1_fa/react-nativenaranu-vue-native-gashi-xian-surukamo-xin-shi-dai-marutipuratutohuomukai-fa-huremuwakunolynxtolynxnovue-dot-jsdui-ying-wozhui-tutemiyou-vue-lynx",
    ja: {
      name: "永井優斗",
      affiliation: "フューチャーアーキテクト株式会社",
      title: "シニアコンサルタント",
      talkTitle:
        'React Nativeならぬ"Vue Native"が実現するかも？\n新世代マルチプラットフォーム開発フレームワークのLynxとLynxのVue.js対応を追ってみよう',
      talkOverview:
        "2025年3月、TikTokやCapCutなどを運営していることで有名なByteDance社が、新世代のモバイル向けマルチプラットフォーム開発フレームワークであるLynxを公開、OSSとして発表しました。\nこのLynx、Vue.jsに対応しようとしているそうです。ReactユーザーにとってのReact Nativeのように、Vue.jsのユーザーがキャッチアップ工数少なくモバイルネイティブアプリ開発ができるようになるかもしれません。\n\n実際、LynxのVue.jsの対応（以下Vue+Lynxと表現します）に向けてはVueクリエイターのEvan You氏がLynxのVue+Lynxを支援することをXで表明したり、VueコミュニティのRahul Vashishtha氏がVue+LynxのプロトタイプをGithub上で公開したりといった動きがあります。\n\nまだLynx自体公開されてから期間も短いこともあり、Vue+Lynxとなるとなかなか情報が少ないですし、日本語文献はもっと少ない（といいますかCfP書いてる時点で日本語での情報を少なくとも私は見つけられていない…）こともあり、なかなかこの話題が盛り上がっていないどころかほとんど見聞きしません。\n\nVashishtha氏のプロトタイプなどにも触れながら、Vue+LynxについてVueFes参加者のみなさんとワクワクを共有できたら幸いです。\n",
    },
    en: {
      name: "Yuto NAGAI",
      affiliation: "Future Architect, Inc.",
      title: "Senior Consultant",
      talkTitle:
        'Could "Vue Native" the Vue Version of React Native Become a Reality?\nLet\'s Take a Look at Lynx, a Next-Generation Cross-Platform Framework, and Its Vue.js Support',
      talkOverview:
        "In March 2025, ByteDance—the company behind TikTok and CapCut—announced a new open-source, next-generation mobile cross-platform development framework called **Lynx**.\n\nLynx is now aiming to support **Vue.js**, potentially offering Vue developers a mobile-native development experience with minimal learning curve—much like what React Native does for React users.\n\nThere's already exciting momentum: Vue creator **Evan You** has publicly expressed support for Vue+Lynx on X (formerly Twitter), and Vue community member **Rahul Vashishtha** has even shared a working prototype on GitHub.\n\nGiven how new Lynx is, there's still very little documentation available—especially in Japanese—and it hasn't yet gained much attention in Vue circles.\n\nIn this talk, I'd love to introduce Vue+Lynx, highlight what's already happening (including Vashishtha's prototype), and share the excitement and possibilities this could bring to the Vue community. Let's explore what the future of Vue-powered native app development might look like—together.",
    },
  },
  {
    id: "kaede-kato",
    avatarUrl: "/images/avatars/kaede-kato.png",
    color: "navy",
    talkSchedule: "16:25 - 17:25",
    talkTrack: "mates",
    socialUrls: {},
    ja: {
      name: "Kaede Kato",
      affiliation: "RIZAPテクノロジーズ株式会社",
      title: "フロントエンドエンジニア",
      talkTitle: "chocoZAPサービス予約システムをNuxtで内製化した話",
      talkOverview: `chocoZAPではこれまでセルフエステやセルフ脱毛などのサービス予約に外部サービスを利用していましたが、
この度サービス予約システムをNuxtで内製化しました。

これにより開発チームが主体的にシステムを設計・改善できるようになり、
API通信や認証も含めて自社で柔軟に改善できる体制を整えました。

本LTでは、その技術構成と工夫したポイントをご紹介します。`,
    },
    en: {
      name: "Kaede Kato",
      affiliation: "RIZAP TECHNOLOGIES,Inc.",
      title: "Frontend Engineer",
      talkTitle: "Building the chocoZAP Service Reservation System In-House with Nuxt",
      talkOverview: `At chocoZAP, we had been using external services for booking self-esthetic and self-hair removal services.
This time, we have developed our own reservation system in Nuxt.

As a result, the development team can now independently design and improve the system,
and we have built a structure that allows us to flexibly enhance API communication and authentication in-house.

In this LT, we will introduce the technical architecture and the key points we focused on.`,
    },
  },
];

export const PANEL_DISCUSSION_SPEAKERS: SpeakerData[] = [
  evan,
  {
    id: "gaearon",
    avatarUrl: "/images/avatars/dan_abramov.png",
    color: "purple",
    attendedIndex: 2,
    socialUrls: {
      github: "https://github.com/gaearon",
      bluesky: "https://bsky.app/profile/danabra.mov",
    },
    ja: {
      name: "Dan Abramov",
      affiliation: "React、Bluesky（以前）",
    },
    en: {
      name: "Dan Abramov",
      affiliation: "Previously: React, Bluesky",
    },
  },
  {
    id: "dominikg",
    avatarUrl: "/images/avatars/dominikg.png",
    color: "orange",
    attendedIndex: 3,
    socialUrls: {
      github: "https://github.com/dominikg",
      bluesky: "https://bsky.app/profile/dominikg.dev",
      mastodon: "https://elk.zone/m.webtoo.ls/@dominikg",
    },
    ja: {
      name: "dominikg",
      title: " Svelte、Vite コアチームメンバー",
    },
    en: {
      name: "dominikg",
      affiliation: "Svelte & Vite core team member",
    },
  },
  {
    id: "kiaking",
    avatarUrl: "/images/avatars/kiaking.png",
    color: "navy",
    socialUrls: {
      github: "https://github.com/kiaking",
      x: "https://x.com/KiaKing85",
    },
    ja: {
      name: "Kia King Ishii",
      affiliation: "Global Brain",
      title: "Vue.js コアチームメンバー",
    },
    en: {
      name: "Kia King Ishii",
      affiliation: "Global Brain",
      title: "Vue.js core team member",
    },
  },
];

export const STUDENT_SUPPORT_SPEAKERS: StudentSupportSpeakerData[] = [
  {
    avatarUrl: "/images/avatars/kazupon.png",
    ja: {
      name: "kazupon",
      affiliation: "株式会社プレイド",
      title: "Vue.js コアチームメンバー",
    },
    en: {
      name: "kazupon",
      affiliation: "Plaid Inc.",
      title: "Vue.js core team member",
    },
  },
  {
    avatarUrl: "/images/avatars/ubugeeei.png",
    ja: {
      name: "ubugeeei",
      affiliation: "株式会社メイツ",
      title: "Vue.js メンバー",
    },
    en: {
      name: "ubugeeei",
      affiliation: "mates Inc.",
      title: "Vue.js member",
    },
  },
  {
    avatarUrl: "/images/avatars/antfu.png",
    ja: {
      name: "Anthony Fu",
      affiliation: "NuxtLabs / Vercel",
      title: "Vue・Nuxt・Vite コアチーム",
    },
    en: {
      name: "Anthony Fu",
      affiliation: "NuxtLabs / Vercel",
      title: "Vue・Nuxt・Vite core team",
    },
  },
  {
    avatarUrl: "/images/avatars/naokihaba.png",
    ja: {
      name: "Naoki Haba",
      affiliation: "株式会社コドモン",
      title: "ソフトウェアエンジニア",
    },
    en: {
      name: "Naoki Haba",
      affiliation: "codmon inc",
      title: "software engineer",
    },
  },
];
