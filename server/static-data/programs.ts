import type { ProgramData } from "./types/program";

type ProgramDefinition<TId extends string> = ProgramData & { id: TId };

function definePrograms<const TId extends string>(
  programs: ProgramDefinition<TId>[],
): ProgramDefinition<TId>[] {
  return programs;
}

export const SESSION_PROGRAMS = definePrograms([
  {
    id: "opening",
    type: "session",
    speakerIds: [],
    start: "10:00",
    end: "10:10",
    tracks: ["track1", "track2"],
    ja: { title: "オープニング" },
    en: { title: "Opening" },
  },
  {
    id: "keynote",
    url: "",
    type: "session",
    speakerIds: ["yyx990803"],
    start: "10:10",
    end: "10:50",
    tracks: ["track1", "track2"],
    ja: { title: "キーノート", overview: "" },
    en: { title: "Keynote", overview: "" },
  },
  {
    id: "platinum-sponsor-session-1",
    type: "session",
    speakerIds: [],
    tracks: ["track1"],
    start: "10:55",
    end: "11:05",
    ja: { title: "TBD" },
    en: { title: "TBD" },
  },
  {
    id: "platinum-sponsor-session-2",
    type: "session",
    speakerIds: [],
    tracks: ["track2"],
    start: "10:55",
    end: "11:05",
    ja: { title: "TBD" },
    en: { title: "TBD" },
  },
  {
    id: "platinum-sponsor-session-3",
    type: "session",
    speakerIds: [],
    tracks: ["track1"],
    start: "11:05",
    end: "11:15",
    ja: { title: "TBD" },
    en: { title: "TBD" },
  },
  {
    id: "platinum-sponsor-session-4",
    type: "session",
    speakerIds: [],
    tracks: ["track2"],
    start: "11:05",
    end: "11:15",
    ja: { title: "TBD" },
    en: { title: "TBD" },
  },
  {
    id: "platinum-sponsor-session-5",
    type: "session",
    speakerIds: [],
    tracks: ["track1"],
    start: "11:15",
    end: "11:25",
    ja: { title: "TBD" },
    en: { title: "TBD" },
  },
  {
    id: "platinum-sponsor-session-6",
    type: "session",
    speakerIds: [],
    tracks: ["track2"],
    start: "11:15",
    end: "11:25",
    ja: { title: "TBD" },
    en: { title: "TBD" },
  },
  {
    id: "student-support-sponsor-session",
    type: "session",
    speakerIds: [],
    tracks: ["track4"],
    start: "11:30",
    end: "12:00",
    ja: { title: "TBD" },
    en: { title: "TBD" },
  },
  {
    id: "session-1",
    url: "/speaker/posva",
    type: "session",
    speakerIds: ["posva"],
    tracks: ["track1"],
    start: "12:50",
    end: "13:20",
    ja: {
      title: "Type-Safe URLs",
      overview:
        "Vue Routerの次期バージョンでは、URLを完全に型付けされた状態（state）として扱います。本セッションでは、パス、クエリ文字列、ハッシュからパラメータを抽出・変換・バリデーションし、生の文字列を数値やオブジェクトなど、アプリケーションが必要とするあらゆる形へと変える方法を紹介します。",
    },
    en: {
      title: "Type-Safe URLs",
      overview:
        "Vue Router's next version treats your URL as fully typed state. Learn how to extract, transform, and validate parameters from paths, query strings, and hashes, turning raw strings into numbers, objects, or anything your app needs.",
    },
  },
  {
    id: "session-2",
    url: "/speaker/jp-knj",
    type: "session",
    speakerIds: ["jp-knj"],
    tracks: ["track2"],
    start: "12:50",
    end: "13:20",
    ja: {
      title: "AstroとRustで考えるフロントエンドツールチェーンの今",
      overview:
        "Astro 7では、compilerがGoからRustへ移行しました。その理由は、単純にRustのほうが速いからなのでしょうか。\n\nAstroの開発基盤には、Build、Editor、Linter、Formatterなど、同じコードに異なる形で関わるツールがあります。それぞれが必要とする情報も、正しさの基準も異なります。\n\nではAstroは、Rustによって、どのような開発基盤を作ろうとしているのでしょうか。\n\n本発表では、AstroのcompilerとMarkdown、MDX pipelineの変化を手がかりに、この問いを考えます。あわせて、私自身がMarkdownとMDXのcompilerを提案し、試作し、メンバーと話すなかで、自分の前提を改めた経験も紹介します。\n\nAstroの技術的な変化と、未完成の案を人と一緒に考える面白さ。その両方をお話しします。",
    },
    en: {
      title: "The Present State of the Frontend Toolchain, Seen Through Astro and Rust",
      overview:
        "In Astro 7, the compiler moved from Go to Rust.\n\nWas it simply because Rust is faster?\n\nAstro’s tooling includes build tools, editors, linters, and formatters. They all work with the same source code, but they need different information and do not always agree on what “correct” means.\n\nSo what kind of foundation is Astro trying to build with Rust?\n\nIn this talk, I explore that question through the changes to Astro’s compiler and its Markdown and MDX pipelines. I also share my experience proposing a compiler for Markdown and MDX, building prototypes, and rethinking some of my assumptions through conversations with other members.\n\nI want to share both what I found in Astro’s tooling and what it was like to explore an unfinished idea with other people.",
    },
  },
  {
    id: "session-3",
    url: "/speaker/ics-ikeda",
    type: "session",
    speakerIds: ["ics-ikeda"],
    tracks: ["track3"],
    start: "12:50",
    end: "13:20",
    ja: {
      title: "JSがこんなに減る！ HTML・CSS最新技術2026",
      overview:
        "従来はJavaScriptライブラリに頼っていたUIの一部が、今は生のHTMLとCSSで書けるようになってきました。新しいHTMLとCSSを使うことで、少ないコードでシンプルに書ける場面が増えています。本セッションでは、次の機能を紹介します。\n\n・dialog、popover、カスタマイズ可能なselect、CSSカルーセル\n・command / commandfor属性\n・@starting-style、transition-behavior: allow-discrete\n・sibling-index()、attr()\n・target-current疑似クラス\n・アンカーポジショニング\n・スクロール駆動アニメーション\n\nJavaScriptで自前実装すると、アクセシビリティー、連打防止、フォーカス管理、開閉中の状態など、ケアすべきことが多くなります。ブラウザ標準の機能を使うことで、こうした処理の一部をHTML/CSSに任せられることが利点です。\n\n■題材を選んだ理由\n\n筆者は、ICS MEDIAというオウンドメディアでウェブの最新機能を取り上げ、解説記事を公開してきました。記事用のオリジナルデモを作るなかで、昔（2018年頃）はVue.jsの<TransitionGroup>などで四苦八苦していたモーダルUIの開発が、今はdialog要素、command属性、@starting-styleなどで素直に書けることに驚きました。この体験が、本セッションの出発点です。\n\n■具体例\nハンバーガーメニューを題材とし、dialog要素を中心とした実装方法を紹介します。\nhttps://ics.media/entry/260527/\nよく見かけるUIでも、新しい技術が複合的に役立つことを解説します。\n\n■参加者が持ち帰れる知見\n\n・最新HTML/CSSで作れるUIの範囲\n・JavaScriptを書かずに済む部分、書くべき部分の見極め\n・Vue.jsやReactなどの状態管理と組み合わせるときの注意点\n",
    },
    en: {
      title: "JS Is Shrinking This Much! The Latest HTML & CSS Techniques for 2026",
      overview:
        "Parts of the UI that used to rely on JavaScript libraries can now be written in plain HTML and CSS. Using the newer HTML and CSS features, there are more and more situations where you can write simpler code with less of it. This session will introduce the following features:\n\n- dialog, popover, customizable select, CSS carousel\n- the command / commandfor attributes\n- @starting-style, transition-behavior: allow-discrete\n- sibling-index(), attr()\n- the :target-current pseudo-class\n- anchor positioning\n- scroll-driven animation\n\nWhen you build these things yourself in JavaScript, there's a lot to take care of — accessibility, preventing double-clicks, focus management, open/close state, and so on. The benefit of using browser-standard features is that you can offload some of that handling to HTML/CSS.\n\n■ Why I chose this topic\nI've been covering the web's latest features and publishing explainer articles on the owned media site ICS MEDIA. While building original demos for these articles, I was struck by how modal UI development — which used to be a real struggle with things like Vue.js's `<TransitionGroup>` back around 2018 — can now be written straightforwardly using the dialog element, the command attribute, @starting-style, and more. That experience is the starting point for this session.\n\n■ Concrete example\nUsing a hamburger menu as the subject, I'll introduce an implementation approach centered on the dialog element.\nhttps://ics.media/entry/260527/\nI'll explain how, even for UI patterns you see all the time, these new technologies can work together to help.\n\n■ What attendees will take away\n- The range of UI you can now build with the latest HTML/CSS\n- How to judge which parts you can skip writing JavaScript for, and which parts you still should\n- Things to watch out for when combining this with state management in Vue.js, React, and similar frameworks",
    },
  },
  {
    id: "session-4",
    url: "/speaker/ykoizumi0903",
    type: "session",
    speakerIds: ["ykoizumi0903"],
    tracks: ["track1"],
    start: "13:35",
    end: "14:05",
    ja: {
      title: "Nuxt ContentからOxContentへ、1000ページ超のブログ基盤刷新への挑戦",
      overview:
        "Nuxt ContentとNuxtHubを用いて1000ページ以上のブログサイトを運用する中で、ドキュメント数の増加に伴うパフォーマンスやメンテナンス性の悪化が大きな課題となっていました。この課題を打破するために、Rust製の次世代ツールであるOx ContentをNuxt 4サイトに導入しました。\n本セッションでは、元のNuxt 4サイトの技術構成を紹介し、そこにOx Contentを導入することで得られた成果を紹介します。また、SSRからSSGへの移行や、Nuxtから別のフレームワークへの切り替えなど、採用に至らなかったアプローチにも触れながら、技術選定の観点をお話しする予定です。\n大規模な静的コンテンツ配信における、パフォーマンスと開発体験を両立させるための試行錯誤を共有しながら、新しい技術を気軽に試せる個人開発の魅力についても伝えられればと思います。",
    },
    en: {
      title: "From Nuxt Content to OxContent: Taking on a Blog Platform Overhaul for 1,000+ Pages",
      overview:
        "While operating a blog site with more than 1,000 pages using Nuxt Content and NuxtHub, worsening performance and maintainability as the number of documents grew became a major challenge. To break through this issue, I introduced Ox Content, a next-generation Rust-based tool, into our Nuxt 4 site.\nIn this session, I'll first explain the original technical architecture of the Nuxt 4 site and then share the outcomes we gained by introducing Ox Content. I'll also cover approaches we considered but did not adopt—such as moving from SSR to SSG and switching from Nuxt to another framework—through the lens of technology selection.\nBy sharing the trial-and-error behind balancing performance and developer experience in large-scale static content delivery, I also hope to highlight the appeal of personal development, where you can try new technologies with ease.",
    },
  },
  {
    id: "session-5",
    url: "/speaker/wan9chi",
    type: "session",
    speakerIds: ["wan9chi"],
    tracks: ["track2"],
    start: "13:35",
    end: "14:05",
    ja: {
      title: "Vite Task’s Cache Magic",
      overview:
        "従来のタスクキャッシュでは、開発者が入力と出力を手作業で宣言する必要があり、その宣言を正しく保ち続けるのは面倒な作業です。\n\nVite Task（Vite+のタスクランナー）は、こうした手作業を減らし、キャッシュを魔法のように正確に保つことを目指しています。本セッションでは、そのキャッシュシステムを支える考え方を解説し、その使いやすさと正確さをライブデモでお見せします。",
    },
    en: {
      title: "Vite Task’s Cache Magic",
      overview:
        "With traditional task caching, developers declare inputs and outputs by hand. Keeping those declarations correct is tedious.\n\nVite Task (the task runner in Vite+) tries to reduce that manual work and magically keep the cache accurate. In this talk, I will explain the ideas behind its caching system and show live demos to show its ease of use and accuracy.",
    },
  },
  {
    id: "session-6",
    url: "/speaker/ktsn",
    type: "session",
    speakerIds: ["ktsn"],
    tracks: ["track3"],
    start: "13:35",
    end: "14:05",
    ja: {
      title: "なぜその UI アニメーションは気持ちいいのか？",
      overview:
        "UI にアニメーションをつけたいけど、どうすれば気持ちいいアニメーションになるかがわからない。そんな経験はありませんか？\n\n洗練されたアニメーションを標準で備えているモバイルアプリと比べて、Web のアニメーションは自分で実装しなければならない部分が多く、クオリティを高めるのは簡単ではありません。近年は View Transition API などの便利な API も追加されていますが、まだ「どのように動かすのか」はほとんど実装者にゆだねられており、センスと知識が試されます。\n\n本セッションでは UI アニメーションの「気持ちよさ」とはどういった要因から生まれるのかを分析し、それを実装に落とし込む方法を発表します。また、モバイルアプリで頻出の UI などを Vue.js で実装したものをお見せし、気持ちよさの要因を実際の UI から体感していただきます。みなさんがアニメーション実装に挑戦するきっかけとなり、いざ実装するときの手札が増えることを目指します。",
    },
    en: {
      title: "Why Does That UI Animation Feel So Satisfying?",
      overview:
        'Have you ever wanted to add animation to a UI, but had no idea how to make it actually feel good?\n\nCompared to mobile apps, which come with polished animations built in as standard, the web requires you to implement much more of the animation yourself, and it\'s not easy to get the quality up to a high standard. In recent years, convenient APIs like the View Transition API have been added, but "how" something should move is still left almost entirely up to the implementer, putting both taste and knowledge to the test.\n\nIn this session, I\'ll analyze what factors give rise to that "satisfying" feeling in UI animation, and present ways to translate that into actual implementation. I\'ll also show UI patterns commonly seen in mobile apps, implemented in Vue.js, so you can experience firsthand, through real UI, what factors create that sense of satisfaction. My goal is for this to be a catalyst for you to take on animation implementation yourselves, and to give you more tools in hand for when you do.',
    },
  },
  {
    id: "session-7",
    url: "/speaker/naokihaba",
    type: "session",
    speakerIds: ["naokihaba"],
    tracks: ["track1"],
    start: "14:20",
    end: "14:50",
    ja: {
      title: "Vite+への貢献と、Team Memberになって見えてきた風景",
      overview:
        "2026年4月からVite+のTeam Memberとして活動を続けています。これまでは、Node.jsのバージョン管理の移行支援をはじめ、tsdown関連のマイグレーションやTypeScript設定の自動変換、VueやAstro向けの型サポートの追加といった、幅広い改善に取り組んできました。\n\n開発の現場では、migratorの実装を深く読み込み、寄せられたIssueの問題を一つひとつ再現しては挙動を追いかける。そんな地道な調査の繰り返しを通じて、少しずつプロジェクトへの理解を深めてきました。現在はTeam Memberとして、世界中のユーザーから届くIssueのトリアージや、Pull Requestのレビューも日常的に行っています。\n\n外部コントリビューターだった頃には想像もしていなかったような、OSS運営ならではの難しさや面白さ、そしてそこにあるコミュニティの熱量を、役割が変わったことでより肌で感じるようになりました。\n\nこのセッションでは、Vite+での具体的な事例を交えながら、1人のコントリビューターがTeam Memberになるまでの道のりと、その過程で得た気づきを共有します。また、AIの普及で「コードを書くこと」自体のハードルが下がっている今だからこそ、あえて立ち止まって「深く理解すること」の価値についても考えてみたいと思います。\n\nOSSへの貢献に興味がある方はもちろん、これから何らかの形で関わってみたいと考えている方に向けて、単にコードを書くだけではない、OSSとのより豊かな関わり方についてお話しします。",
    },
    en: {
      title: "Contributing to Vite+, and the View from Becoming a Team Member",
      overview:
        "Since April 2026, I've been continuing my work as a Team Member of Vite+. Over that time, I've worked on a wide range of improvements, including supporting the migration of Node.js version management, tsdown-related migrations, automatic conversion of TypeScript configurations, and adding type support for Vue and Astro.\n\nIn the day-to-day work, I've deepened my understanding of the project bit by bit through steady, hands-on investigation: reading deeply into the migrator's implementation, and reproducing and tracing the behavior behind each Issue that comes in, one by one. Now, as a Team Member, triaging Issues from users around the world and reviewing Pull Requests has become part of my daily routine.\n\nTaking on this new role has let me feel, firsthand, the particular difficulties and joys of running an OSS project, along with the energy of its community, in ways I never imagined back when I was just an outside contributor.\n\nIn this session, drawing on concrete examples from Vite+, I'll share the journey from being a single contributor to becoming a Team Member, along with what I learned along the way. I'd also like to take a moment to reflect on the value of deliberately pausing to \"understand deeply,\" at a time when AI is lowering the barrier to \"writing code\" itself.\n\nThis talk is for anyone interested in contributing to OSS, as well as those thinking about getting involved in some form going forward. I'll talk about richer ways of engaging with OSS that go beyond simply writing code.",
    },
  },
  {
    id: "session-8",
    url: "/speaker/hiranuma",
    type: "session",
    speakerIds: ["hiranuma"],
    tracks: ["track2"],
    start: "14:20",
    end: "14:50",
    ja: {
      title:
        "Vue で書く 空間コンピューティング、TresJS と WebXR を使ったXR デバイスのフロントエンド開発",
      overview:
        "Vue + TresJS + WebXR で、Meta Quest 3 や Samsung Galaxy XR などで動く空間コンピューティングアプリが書けることをご存知でしょうか。\n新しいフレームワークを覚え直すことなく、Vue Composition API の知識のまま XR デバイス向けのフロントエンドを実装できます。\n\nApple Vision Pro と Meta Quest 3 が空間コンピューティングを身近なものにし、2026 年秋には XREAL Project Aura や Snap Specs などのグラス型デバイスも順次発売されます。\nヘッドセットからグラスまで XR デバイスの選択肢が広がり、空間コンピューティングは実用領域に入りました。\n本セッションでは、Vue + TresJS + WebXR で実際に動く空間コンピューティングアプリの基礎として、視線とジェスチャーによる操作、宣言的なシーン構築、ハンドトラッキングとコントローラの両対応、物理エンジンの統合など、XR デバイス向けフロントエンド開発の実装パターンを共有します。\n",
    },
    en: {
      title:
        "Spatial Computing with Vue: Frontend Development for XR Devices Using TresJS and WebXR",
      overview:
        "Did you know that you can build spatial computing apps that run on devices like the Meta Quest 3 and Samsung Galaxy XR using Vue, TresJS, and WebXR?\nWithout having to learn a whole new framework, you can implement frontends for XR devices using nothing more than your existing knowledge of the Vue Composition API.\n\nApple Vision Pro and Meta Quest 3 have brought spatial computing into the mainstream, and in fall 2026, glasses-type devices like XREAL Project Aura and Snap Specs are also set to launch one after another.\nWith XR device options now ranging from headsets to glasses, spatial computing has entered practical, everyday use.\nIn this session, as a foundation for building spatial computing apps that actually run with Vue + TresJS + WebXR, I'll share implementation patterns for XR device frontend development, including gaze- and gesture-based interaction, declarative scene construction, support for both hand tracking and controllers, and physics engine integration.",
    },
  },
  {
    id: "session-9",
    url: "/speaker/yamanoku",
    type: "session",
    speakerIds: ["yamanoku"],
    tracks: ["track3"],
    start: "14:20",
    end: "14:50",
    ja: {
      title: "Vue SFCから見直す正しいHTMLの守り方",
      overview:
        "VueのSFCにはtemplateブロックにてHTMLを記述できる構文が備わっていることは周知の事実だと思いますが、Vue.jsを使った開発をするときにどのように「HTMLの正しさ」を検証しているか皆さんは説明できますでしょうか？\nVueのSFCにおけるtemplate内ではHTMLの要素間のネスト違反があっても、開発時に警告してきますが明確にコンパイルエラーにはなりません。HTMLの字句的・構文的ルールについても検出されますが、具体的なHTML要素の使い方に関しては関与していません。\n本セッションでは、Vue SFCのtemplateブロックで書かれたHTMLの内容をコンパイラがどのように解釈しているかについてを仕組みから紐解き、DOMのコンパイラだけでは保てないHTMLの正しさについてをLinterといった静的解析エコシステム（ESLint、Markuplint、Biome、OxC、Vizeなど）たちによって今現在どのように守れるかについてを紹介します。\nHTMLの仕様はLiving Standardとして今なお更新されています。そんなHTMLと正しく向き合いながら、Vue.jsで堅牢なマークアップとHTMLによるアクセシブルなアウトプットを実現する知見を提供します。",
    },
    en: {
      title: "The Right Way to Protect Your HTML, Revisited from Vue SFC",
      overview:
        "I think it's common knowledge that Vue SFC come with syntax that lets you write HTML in the template block. But can you actually explain how you verify \"HTML correctness\" when developing with Vue.js?\nWithin the template of a Vue SFC, nesting violations between HTML elements will trigger a warning during development, but they won't clearly result in a compile error. Lexical and syntactic HTML rules are detected, but the compiler doesn't concern itself with the correct usage of specific HTML elements.\nIn this session, I'll unpack, from first principles, how the compiler interprets the HTML content written in a Vue SFC's template block, and introduce how the aspects of HTML correctness that a DOM compiler alone can't guarantee are currently being protected by the static analysis ecosystem of linters (ESLint, Markuplint, Biome, OxC, Vize, and others).\nThe HTML spec continues to be updated even now, as a Living Standard. By engaging correctly with HTML in that spirit, this talk aims to give you insights for achieving robust markup and accessible output through HTML in Vue.js.",
    },
  },
  {
    id: "session-10",
    url: "/speaker/ubugeeei",
    type: "session",
    speakerIds: ["ubugeeei"],
    tracks: ["track1"],
    start: "15:05",
    end: "15:35",
    ja: {
      title: "The Vue Toolchain, Reimagined",
      overview:
        "Vueの開発体験は、多くの優れたツールによって支えられています。\n\nVizeは、高速なVueツールチェーン全体をゼロから構築することを目指しているオープンソースプロジェクトです。コンパイラやリンターをはじめとするさまざまなツールを開発する中で、ツールチェーン全体を見渡すからこそ見えてくる課題や、新しい可能性がありました。\n\nこのセッションでは、Vizeの取り組みを紹介しながら、Vueツールチェーンの現在とこれからについてお話しします。",
    },
    en: {
      title: "The Vue Toolchain, Reimagined",
      overview:
        "Vue development is powered by a rich ecosystem of tools.\n\nVize is an open source project that aims to build a blazing-fast Vue toolchain from the ground up. As the project has grown to include compilers, linters, and other developer tools, it has revealed new challenges and opportunities that only become visible when building an entire toolchain.\n\nIn this session, I'll introduce Vize, share the lessons learned from building a Vue toolchain, and explore where Vue tooling could go next.",
    },
  },
  {
    id: "session-11",
    url: "/speaker/Hal-Spidernight",
    type: "session",
    speakerIds: ["Hal-Spidernight"],
    tracks: ["track2"],
    start: "15:05",
    end: "15:35",
    ja: {
      title: "Vue.jsで作る空間解析アプリとCapacitorプラグインのData Bridge",
      overview:
        "みなさんはVue.jsでネイティブアプリを作ったことがありますか？\n昨今Vue3をサポートしたLynxの登場や、WebViewベースでありながらネイティブレイヤーのサポートが手厚いCapacitorなど、Webアプリの経験を活かせるネイティブフレームワークの発展によりWebエンジニアのモバイルアプリ開発を始めるハードルは大きく下がっています。\n\n一方でAVCaptureDeviceやARKitのような特定のネイティブAPIへアクセスする機能が十分でないことも事実です。\n\nでは諦めてFlutterやSwift/Kotlinを使うしかないのか？\n\nいえ、ネイティブレイヤーへアクセスするプラグインを作ってしまいましょう。\n\nとはいえネイティブレイヤーで扱うデータは膨大になることがあります。\n例えばLiDARを用いて収集した3Dスキャンの点群データはJavaScript< — >ネイティブのバイナリ転送量が大きく、効率的な通信を行われなければ実用性に欠けてしまいます。\n\nこのセッションではARやLiDAR等を用いた空間解析アプリを主軸にJS< — >ネイティブ間の転送効率化、およびWebフレームワークで効率よくネイティブAPIを扱うためのプラグイン設計についてお話します。",
    },
    en: {
      title:
        "Building Spatial Analysis Apps with Vue.js, and the Data Bridge for Capacitor Plugins",
      overview:
        "Have any of you ever built a native app with Vue.js?\nWith the recent emergence of Lynx supporting Vue 3, and Capacitor — which, despite being WebView-based, offers robust native-layer support — the bar for web engineers to get started with mobile app development has dropped significantly, thanks to the advance of native frameworks that let you leverage your existing web app experience.\n\nAt the same time, it's also true that support for accessing certain native APIs, like AVCaptureDevice or ARKit, often isn't sufficient.\n\nSo does that mean we have no choice but to give up and use Flutter or Swift/Kotlin?\n\nNo — let's just build a plugin that accesses the native layer ourselves.\n\nThat said, the data handled at the native layer can sometimes be massive. For example, with 3D scan point cloud data collected using LiDAR, the volume of binary data transferred between JavaScript and native is large, and without efficient communication, the whole thing falls short of being practical.\n\nIn this session, centered on spatial analysis apps using AR and LiDAR, I'll talk about making JS↔native transfers more efficient, and about plugin design for handling native APIs efficiently from a web framework.",
    },
  },
  {
    id: "session-12",
    url: "/speaker/is78-dev",
    type: "session",
    speakerIds: ["is78-dev"],
    tracks: ["track3"],
    start: "15:05",
    end: "15:35",
    ja: {
      title: "TanStack Query VueとPinia Coladaから学ぶ非同期状態の型設計",
      overview:
        "TanStack Query VueとPinia Coladaでは、非同期データ取得の状態を扱うAPIに違いがあります。たとえば、queryの状態判定後もTypeScript上ではdataがundefinedを含む型として扱われる場合があります。本セッションでは、2つのデータ取得ライブラリのAPI設計を出発点に、型の見え方がどのように決まるのかを整理します。TanStack Query VueのuseQueryとreactiveによる型絞り込み、Pinia Coladaのstate設計を具体例として、Vueのref、toRefs、reactive、TypeScriptのdiscriminated unionの関係を見ていきます。ライブラリ比較を通じて、Vue composableで非同期状態を型安全に扱うための設計観点を共有します。",
    },
    en: {
      title: "What TanStack Query Vue and Pinia Colada Teach Us About Typing Async State",
      overview:
        "TanStack Query Vue and Pinia Colada differ in how their APIs handle the state of asynchronous data fetching. For example, there are cases where, even after checking a query's status, `data` is still typed in TypeScript as potentially `undefined`. In this session, taking the API designs of these two data-fetching libraries as a starting point, I'll organize how the way types appear ends up being determined. Using TanStack Query Vue `useQuery` combined with type narrowing via `reactive`, and Pinia Colada's state design, as concrete examples, I'll look at the relationship between Vue `ref`, `toRefs`, `reactive`, and TypeScript's discriminated unions. Through this library comparison, I'll share design perspectives for handling async state in a type-safe way within Vue composables.",
    },
  },
  {
    id: "session-13",
    url: "/speaker/t0daaay",
    type: "session",
    speakerIds: ["t0daaay"],
    tracks: ["track4"],
    start: "15:05",
    end: "15:35",
    ja: {
      title: "決定的なフロントエンドアーキテクチャがいい",
      overview:
        "「xxx ディレクトリに設置しませんか？」「utils に切り出しませんか？」「composable 化しませんか？」「watch を使わないで computed で書けませんか？」\nこれらはフロントエンド開発の設計観点から度々発生する議論です。\n生成AIで開発速度が高速化されていく中、これらの判断を1つずつすることは現実的でしょうか？\n私がフロントエンドエンジニアとして関わる新規プロダクトでは、Nuxt を採用する中、ファイルや関数の設置場所や命名、API の使い方など、可能な限り決定的に取り決め、リンターによるガードレールを設定しています。\nその結果、殆どのPRが数分でレビューし終わる状態を実現できたり、フロントエンドに詳しくなくても開発可能な体制を整えることに成功し、堅牢かつ高速な開発環境を実現しました。\n本セッションでは、開発中の Nuxt プロジェクトのアーキテクチャを例に、実際の現場でどのような決定的な判断ルールを取り決め、迷わないアーキテクチャを構築しているかについて紹介します。",
    },
    en: {
      title: "Deterministic Frontend Architecture Is the Way to Go",
      overview:
        '"Should we put this in the xxx directory?" "Should we extract this into utils?" "Should we turn this into a composable?" "Can we write this with computed instead of watch?"\nThese are the kinds of design discussions that come up again and again in frontend development.\nAs generative AI keeps accelerating development speed, is it really realistic to keep making these judgment calls one by one?\nIn a new product I\'m involved with as a frontend engineer, built on Nuxt, we\'ve decided as deterministically as possible where files and functions should go, how things should be named, and how APIs should be used, and backed all of it with linter guardrails.\nAs a result, we\'ve reached a point where most PRs can be reviewed in just a few minutes, and we\'ve built a setup where people can develop productively even without deep frontend expertise, giving us a development environment that\'s both robust and fast.\nIn this session, using the architecture of a Nuxt project currently in development as an example, I\'ll introduce the concrete decision rules we\'ve established in the field to build an architecture that leaves no room for hesitation.',
    },
  },
  {
    id: "session-14",
    url: "/speaker/themarcba",
    type: "session",
    speakerIds: ["themarcba"],
    tracks: ["track3"],
    start: "15:50",
    end: "16:20",
    ja: {
      title: "The Backend is Reactive: ブラウザの枠を超える Vue",
      overview:
        "このトークは、Vueのリアクティビティをブラウザ上で実装してみせることで、その仕組みのベールを剥がすものです。プロダクション品質を目指すというより、コードで遊ぶことそのものを楽しんでいただく内容です。\n\n「もしVueのリアクティビティシステムが、ブラウザの中だけにとどまらなかったとしたら？」 このトークでは、バックエンドで @vue/reactivity を使って何百台ものスマートフォンをリアルタイムで統率し、会場全体を同期したリアクティブなライトショーに変えてみせます。\n\nこのトークで最も伝えたいのは、Vueのリアクティビティの力がフロントエンドをはるかに超えて及ぶ、ということです。UIの状態を管理するのと同じくらい効果的に、バックエンドのロジックも統率できるのです。リアクティブなデータを単一の信頼できる情報源（source of truth）として扱うことで、最小限の接着コードで複数のクライアントを駆動できます。さらに、算出されたプロジェクション（computed projections）はリアクティブな考え方を取り入れる助けとなり、副作用・スケジューリング・クリーンアップを明示的で予測可能な、理解しやすいものにしてくれます。",
    },
    en: {
      title: "The Backend is Reactive: Vue Beyond the Browser",
      overview:
        'This is a talk that de-mystifies Vue reactivity by implementing it in the browser. Rather than production-ready, we are going to have some FUN WITH CODE.\n\n"What if Vue’s reactivity system didn’t stop at the browser?" In this talk, I’ll turn the entire audience into a synchronized, reactive lightshow—using @vue/reactivity on the backend to orchestrate hundreds of phones in real time.\n\nThe key takeaway is that Vue’s reactivity is powerful far beyond the frontend—it can orchestrate backend logic just as effectively as it manages UI state. By treating reactive data as a single source of truth, you can drive multiple clients with minimal glue code. Computed projections make adopting a reactive mindset and helps make side effects, scheduling, and cleanup explicit, predictable, and easier to reason about.',
    },
  },
  {
    id: "session-15",
    url: "/speaker/alvarosabu",
    type: "session",
    speakerIds: ["alvarosabu"],
    tracks: ["track4"],
    start: "15:50",
    end: "16:20",
    ja: {
      title: "Vue Fes Japan 2025 の Web サイトを TresJS と TSL（WebGPU）で再現する",
      overview:
        "このトークでは、Vue Fes Japan 2025のウェブサイトのヒーローイメージを、VueとTresJS、そしてWebGPU上で動くThree.js Shading Language（TSL）を使って再現した過程を共有します。オリジナルのシーンは素のThree.js r178で動作しており、V字型のコーン（Vueを表現）と、日本の国旗の日の丸にインスパイアされた球体を組み合わせ、日本の伝統技法である墨流し（すみながし）を再現するカスタムシェーダーでマスクをかけています。\n\nこのセットアップをTresJSのコンポーネントを使ってVueに移植した方法、シーンを宣言的に構成した方法、そして元のGLSLシェーダーのロジックを、Vueアプリの中で自然に感じられる形でTSLへと移行した方法を解説していきます。墨流しのエフェクトが、歪んだベクトル場を流れるFBMノイズからどのように構築されているか、アニメーションが時間経過とともに複数のカラーパレットをどのように循環しているか、そして従来のWebGLパイプラインの代わりにWebGPU APIを活用することで何が変わるのかを見ていきます。\n\nセッションの終わりまでに、参加者は既存のThree.jsのシーンをTresJSでVueに移植する際の考え方、複雑なシェーダーエフェクトをコンポーネント駆動のアーキテクチャの中で整理する方法、そしてVueを使って美しいビジュアル体験を作り出す方法を理解できるようになります。\n\nライブデモ：https://lab.tresjs.org/experiments/vuefes-japan-2025\nTresJS：https://tresjs.org/",
    },
    en: {
      title: "How I recreated Vue Fes Japan 2025 website using TresJS and TSL (WebGPU)",
      overview:
        "In this talk I’ll share how I recreated the Vue Fes Japan 2025 website hero using Vue, TresJS and Three.js Shading Language (TSL) on top of WebGPU. The original scene runs on raw Three.js r178 and combines a V‑shaped cone (for Vue) with a sphere inspired by the Japanese flag’s Hinomaru, masked with a custom suminagashi shader that simulates Japanese ink‑marbling.\n\nI’ll walk through how I ported that setup into Vue using TresJS components, how I structured the scene declaratively, and how I moved the original GLSL shader logic over to TSL in a way that feels natural inside a Vue app. We’ll look at how the ink‑marbling effect is built from FBM noise flowing through warped vector fields, how the animation cycles through several color palettes over time, and what changes when you take advantage of the WebGPU API instead of the classic WebGL pipeline.\n\nBy the end of the session, participants will understand how to approach porting an existing Three.js scene into Vue with TresJS, how to organize complex shader effects in a component‑driven architecture and how to create beautiful visual experiences using Vue.\n\nLive demo https://lab.tresjs.org/experiments/vuefes-japan-2025\nTresJS https://tresjs.org/",
    },
  },
  {
    id: "session-16",
    url: "/speaker/yut0naga1",
    type: "session",
    speakerIds: ["yut0naga1"],
    tracks: ["track4"],
    start: "16:35",
    end: "17:05",
    ja: {
      title: "Vue.jsのGitHubから学ぶ意思決定",
      overview:
        "Vue.jsは10年以上にわたり進化を続けています。その裏側には、数え切れないほどのIssue、Pull Request、RFCでの議論があります。\n\n本セッションでは、vuejs/vue、vuejs/core、vuejs/rfcs に蓄積された約10年分のIssue・PR・RFCをAIで横断的に整理し、Vue.jsがどのような課題に向き合い、どのような意思決定を積み重ねてきたのかを読み解きます。\n\n本セッションでは、コミッターではなく、一人のVueユーザーとしてGitHubに残された公開資料を読み解きます。 リリースノートや公式ドキュメントだけでは見えない議論をたどることで、Composition APIや<script setup>といった機能が「なぜその形になったのか」を理解することを目指します。\n\nまた、このセッションで紹介したいのはVue.jsの歴史そのものではありません。GitHubに残された議論を読み解くことで、OSSの設計や意思決定を学ぶという、新しい学び方です。\n\nAIによって膨大な開発履歴を扱えるようになった今だからこそ、OSSは「使うもの」から「学ぶもの」としても活用できると考えています。\n\nVue.jsをより理解したい方、OSSから設計や意思決定を学びたい方に、新しい視点を持ち帰っていただければ幸いです。",
    },
    en: {
      title: "Learning Decision-Making from the Vue.js GitHub",
      overview:
        "Vue.js has continued to evolve for over a decade. Behind that evolution lie countless discussions in Issues, Pull Requests, and RFCs.\n\nIn this session, we'll use AI to comprehensively organize roughly a decade's worth of Issues, PRs, and RFCs accumulated in vuejs/vue, vuejs/core, and vuejs/rfcs, in order to understand what challenges Vue.js has faced and what decisions it has made along the way.\n\nIn this session, I'll be reading through the public records left on GitHub not as a committer, but simply as a Vue user. By tracing discussions that you can't see from release notes or official documentation alone, I aim to understand \"why\" features like the Composition API and <script setup> ended up taking the shape they did.\n\nWhat I want to introduce in this session isn't the history of Vue.js itself. It's a new way of learning — learning about OSS design and decision-making by reading through the discussions left on GitHub.\n\nNow that AI lets us work with massive volumes of development history, I believe OSS can be leveraged not just as something to \"use,\" but as something to \"learn from.\"\n\nI hope that those who want to understand Vue.js more deeply, and those who want to learn about design and decision-making from OSS, will walk away with a new perspective.",
    },
  },
  {
    id: "session-17",
    url: "/speaker/mnmxmx",
    type: "session",
    speakerIds: ["mnmxmx"],
    tracks: ["track2"],
    start: "16:55",
    end: "17:25",
    ja: {
      title: "ブランドのためのWebGLアニメーション（仮）",
      overview:
        "WebGLアニメーションは、Webサイトを華やかにするだけでなく、ブランドの個性や世界観を視覚的に伝えるための手段でもあります。\n\n本トークでは、WebGL Developerとしてこれまで約10年間携わってきたプロジェクトの事例を紹介しながら、ブランドのためのWebGLアニメーションがどのように作られるのかをお話しします。\n\nデザイナーが描くコンセプトや抽象的なイメージを理解し、それを形、色、動き、インタラクションへと落とし込む過程。デザイナーが調整できる範囲と、開発者が管理する範囲の設計。そして、実際のWebサイトとして成立させるために、表現の品質とパフォーマンスの境界をどのように判断するか。実制作で考えてきたことを、事例とともに紹介します。\n\nこちらのセッションの内容は当日までに変わる可能性があります。",
    },
    en: {
      title: "WebGL Animation for Brands (Tentative)",
      overview:
        "WebGL animation isn't just about making websites look impressive — it's also a means of visually communicating a brand's personality and worldview.\n\nIn this talk, drawing on examples from projects I've worked on over roughly a decade as a WebGL developer, I'll share how WebGL animation for brands actually gets made.\n\nThe process of understanding a designer's concepts and abstract imagery, and translating them into shape, color, motion, and interaction. Designing the boundary between what designers can adjust and what developers manage. And how to judge the line between expressive quality and performance in order to make it all work as a real website. I'll introduce what I've thought through in actual production work, together with concrete examples.\n\nThe content of this session is subject to change before the day of the event.",
    },
  },
  {
    id: "session-18",
    url: "/speaker/ushironoko",
    type: "session",
    speakerIds: ["ushironoko"],
    tracks: ["track4"],
    start: "17:20",
    end: "17:50",
    ja: {
      title: "型なし、テストなし、1万行のドメインロジックがあるVuexをPiniaへ移行する",
      overview:
        "Studioでは、10年に及ぶ開発で蓄積したVue.jsコードの資産があります。これらはStudioのホットパスを今でも支え続けていますが、新しいコードを追加するたびに古いコード、特にVuexが抱えるドメインロジックがまるで炎症のように痛んでいました。2026年になり、コーディングエージェントが当たり前の時代になっても手をつけられておらず、社歴の長い人ほど手をつけられるものではないという認識になっていました。今回は、入社3ヶ月(当時)の私がこの課題にどう向き合い、完遂したかを話します。Vuex/Piniaに関する話と、コーディングエージェントをうまく使う話、課題に対してのマインドの話を3:4:3くらいの割合で話します。マイグレーション後に行った、さらに広範囲のモジュール依存やドメインモデリング改善へPinia化がどう好影響をもたらしたかについても触れます。",
    },
    en: {
      title: "Migrating 10,000 Lines of Untyped, Untested Domain Logic from Vuex to Pinia",
      overview:
        "At Studio, we have a decade's worth of accumulated Vue.js code assets from our development history. While this code still supports Studio's hot paths today, every time new code was added, the old code — especially the domain logic held within Vuex — ached like an inflamed wound. Even now, in 2026, in an era where coding agents have become the norm, this problem had gone untouched, and there was a shared understanding that the longer someone's tenure, the less likely they were to be the one to take it on. In this talk, I'll share how I, just three months into the job at the time, confronted this challenge and saw it through to completion. I'll cover the Vuex/Pinia migration itself, how to make effective use of coding agents, and the mindset needed to tackle a challenge like this, in roughly a 3:4:3 ratio. I'll also touch on the positive impact the move to Pinia had on broader efforts afterward, including improving module dependencies and domain modeling across a wider scope.",
    },
  },
]);

export const LIGHTNING_TALK_PROGRAMS = definePrograms([
  {
    id: "lunch-sponsor-lt-1",
    type: "lightningTalk",
    speakerIds: [],
    tracks: ["track3"],
    start: "11:40",
    end: "11:45",
    ja: { title: "TBD" },
    en: { title: "TBD" },
  },
  // {
  //   id: "lunch-sponsor-lt-2",
  //   type: "lightningTalk",
  //   speakerIds: [],
  //   tracks: ["track3"],
  //   start: "11:50",
  //   end: "11:55",
  //   ja: { title: "TBD" },
  //   en: { title: "TBD" },
  // },
  // {
  //   id: "lunch-sponsor-lt-3",
  //   type: "lightningTalk",
  //   speakerIds: [],
  //   tracks: ["track3"],
  //   start: "12:00",
  //   end: "12:05",
  //   ja: { title: "TBD" },
  //   en: { title: "TBD" },
  // },
  // {
  //   id: "lunch-sponsor-lt-4",
  //   type: "lightningTalk",
  //   speakerIds: [],
  //   tracks: ["track3"],
  //   start: "12:10",
  //   end: "12:15",
  //   ja: { title: "TBD" },
  //   en: { title: "TBD" },
  // },
  {
    id: "lightning-talk-1",
    url: "/speaker/Shigeyuki-fukuda",
    type: "lightningTalk",
    speakerIds: ["Shigeyuki-fukuda"],
    tracks: ["track3"],
    start: "16:35",
    end: "17:50",
    ja: {
      title: "Vapor Modeでアクセシビリティは壊れないか検証した話",
      overview:
        "Vue 3.6で登場したVapor ModeはVNodeを経由せず直接DOMを操作する新しいコンパイル戦略ですが、語られるのは性能の話ばかりで、支援技術への影響はまだほとんど検証されていません。\nlive regionの読み上げ、フォーカス管理、動的なaria属性の更新は従来モードと同じように動くのか。\nこれは既存アプリへの部分導入を検討するうえで避けて通れない課題だと考え、このテーマを選びました。\n本発表では、同一のコンポーネントを従来モードとVapor Modeの2系統でビルドし、PlaywrightのariaSnapshotによるアクセシビリティツリーの差分比較と、VoiceOverによる実際の読み上げ確認という2つの観点で検証した結果を報告します。\n差分が出た項目と出なかった項目を一覧で示し、Vapor Mode移行時にアクセシビリティ観点で確認すべきチェックリストとして持ち帰っていただけます。",
    },
    en: {
      title: "Verifying Whether Vapor Mode Breaks Accessibility",
      overview:
        "Vapor Mode, introduced in Vue 3.6, is a new compilation strategy that manipulates the DOM directly without going through VNodes. But discussion of it has focused almost entirely on performance, and its impact on assistive technology has barely been examined.\nDoes live region announcement, focus management, and dynamic aria attribute updates behave the same way as in the conventional mode? I chose this topic because I see it as an unavoidable question when considering partial adoption of Vapor Mode in an existing app.\nIn this talk, I'll report on results from building the same component under both the conventional mode and Vapor Mode, and verifying them from two angles: comparing differences in the accessibility tree using Playwright's ariaSnapshot, and checking actual screen-reader announcements with VoiceOver.\nI'll present a list of which items showed differences and which didn't, so you can take it home as a checklist of accessibility considerations to check when migrating to Vapor Mode.",
    },
  },
  {
    id: "lightning-talk-2",
    url: "/speaker/HasutoSasaki",
    type: "lightningTalk",
    speakerIds: ["HasutoSasaki"],
    tracks: ["track3"],
    start: "16:35",
    end: "17:50",
    ja: {
      title: "あなたの await、OS まで届いてる？ strace で覗く JavaScript の非同期",
      overview:
        "普段当たり前のように async / await を書きますが、「待っている間に OS は何をしているの？」 と聞かれると、曖昧な答えしか言えずモヤモヤしました。そこで本 LT では、Node.js のコードを strace でシステムコールレベルまで覗いて、JavaScript の await の正体を実際に確かめていきます。まず Promise.resolve() と fetch() を比べると、await には「OS まで降りるもの」と「降りないもの」があることが見えてきます。次に複数の fetch を「直列」と「Promise.all」で実行し、syscall のログを並べてみます。すると、並列にしているのは Promise.all そのものではなく、その効果は epoll_wait の往復をまとめている点にある、ということが分かってきます。最後に、この視点を Nuxt の useAsyncData / useFetch が直列になって遅くなるケースに繋げて、「なぜ束ねると速いのか」を OS の言葉で説明できるようになって帰っていただけたらと思います。",
    },
    en: {
      title: "Does Your await Actually Reach the OS? Peeking at JavaScript's Async with strace",
      overview:
        "We write async/await as a matter of course, but when asked \"what is the OS actually doing while you're waiting?\", I could only give a vague answer, and it bothered me. So in this lightning talk, I'll dig into Node.js code down to the system call level using strace, to see what await really is under the hood.\nFirst, comparing Promise.resolve() and fetch() reveals that there are two kinds of await: ones that actually descend to the OS, and ones that don't. Next, I'll run multiple fetch calls both \"sequentially\" and via Promise.all, and line up the syscall logs side by side. This reveals that what makes things parallel isn't Promise.all itself — its real effect is in consolidating the round trips of epoll_wait.\nFinally, I'll connect this perspective to cases where Nuxt's useAsyncData/useFetch end up running sequentially and becoming slow, so that you can walk away able to explain, in the OS's own terms, \"why bundling requests together makes things faster.\"",
    },
  },
  {
    id: "lightning-talk-3",
    url: "/speaker/northprint",
    type: "lightningTalk",
    speakerIds: ["northprint"],
    tracks: ["track3"],
    start: "16:35",
    end: "17:50",
    ja: {
      title: "v-ifとフラグ地獄からの脱出 — Pinia で作る画面遷移ステートマシン",
      overview:
        "「送信ボタンを2回押されて二重登録」「演出の途中で操作されて画面が壊れる」こういうバグは、たいてい「いま画面がどのフェーズか」をフラグの寄せ集めで持ってるのが原因だと思っています。\nフラグが N 個あれば状態は 2^N 通りになり、バグの元になりやすいです。\n\nこのLTでやるのは、フラグを増やすのをやめて、画面の状態を 「今どこにいるか」1個＋「どこへ行けるか」の道順表 にまとめること。いわゆるステートマシンです（目新しい概念ではなく、昔からある考え方です）。\nこれだけで連打・二重送信・非同期処理中の暴発が解決できることを、自作デモで見せます。defineStore に道順表と、状態を切り替える唯一の関数を置くだけのものです。\n\n回答ボタンの連打や演出中のタイムアップ割り込みを実際に起こし、ステートマシンで弾く様子を見せます。\n持ち帰れるのはウィザード/決済/アップロードなど 「非同期 ＋ ユーザーがボタンを押す」UI 全般に有用です。\n\nなお、ステートマシンライブラリといえばXStateが定番（公式の@xstate/vue ）。\n本トークはXStateを入れずPinia直書きで、さらに非同期処理中の意図しない動作を状態の再チェックで消せる方法になります。\n（XState作者自身も「ステートマシンにライブラリは必須ではない」と述べており、本トークはその“ライブラリ無し版”の実演にあたります）。\nhttps://dev.to/davidkpiano/you-don-t-need-a-library-for-state-machines-k7h\n\n「ならXStateで良いのでは」への答えも用意します、今回話すのは「1フェーズ＋ガード遷移」だけなので、XStateの主役機能（階層・並行状態・アクター・SCXML・visualizer）は使いません。\n状態が階層化・並行化したり、非同期をアクターで宣言的に扱いたくなったらXStateが必要になる、その線引きまで示します。",
    },
    en: {
      title: "Escaping v-if and Flag Hell — Building a Screen-Transition State Machine with Pinia",
      overview:
        '"The submit button got pressed twice, causing a duplicate registration." "The screen broke because someone interacted with it mid-animation." I think bugs like these almost always come down to holding "what phase the screen is currently in" as a scattered collection of flags.\nWith N flags, you end up with 2^N possible states, which is a breeding ground for bugs.\n\nWhat this lightning talk proposes is: stop adding more flags, and instead consolidate the screen\'s state into just one "where am I right now" value plus a map of "where can I go from here." In other words, a state machine (not a novel concept — this is an old idea).\nI\'ll show, with a self-built demo, how this alone solves rapid double-clicking, duplicate submissions, and misfires during async processing. It\'s nothing more than putting a transition map and a single state-switching function inside a defineStore.\n\nI\'ll actually trigger rapid clicks on an answer button and a timeout interrupt mid-animation, and show how the state machine blocks them.\nWhat you\'ll take home applies broadly to any UI involving "async processing + the user pressing a button" — wizards, checkout flows, uploads, and the like.\n\nNow, when it comes to state machine libraries, XState (with its official @xstate/vue) is the standard choice. This talk, however, writes things directly in Pinia without bringing in XState, and shows a way to eliminate unintended behavior during async processing by re-checking state.\n(XState\'s own creator has said that a library isn\'t strictly necessary for state machines — this talk is essentially a live demonstration of that "library-free" approach.)\nhttps://dev.to/davidkpiano/you-don-t-need-a-library-for-state-machines-k7h\n\nI\'ll also address the "then why not just use XState?" question head-on: what I\'m covering here is just "single phase + guarded transitions," so I won\'t be using XState\'s headline features (hierarchical states, parallel states, actors, SCXML, the visualizer). I\'ll also draw the line showing when you actually do need XState — once your states become hierarchical or parallel, or once you want to handle async work declaratively via actors.',
    },
  },
  {
    id: "lightning-talk-4",
    url: "/speaker/Koutaro-Hanabusa",
    type: "lightningTalk",
    speakerIds: ["Koutaro-Hanabusa"],
    tracks: ["track3"],
    start: "16:35",
    end: "17:50",
    ja: {
      title: "Vite+を爆速で社内のデザインシステムに導入してみた",
      overview:
        "他の言語では、ツールチェインが最初から統合されているのが当たり前です。Go や Rust では、ビルドもテストもフォーマットも、ひとつの世界の中にまとまっています。一方で JavaScript はテストランナー、リンター、フォーマッター、タスクランナーが別々に存在し、組み合わせるのも保守するのも自分たちの仕事でした。\n\n2026年3月13日に公開された vite+ は、その断片化を解決しようとする統合ツールチェインです。テスト、lint、フォーマット、タスク実行、Node の管理までを vp ひとつに束ねます。\n\n公開されたばかりの、しかもまだα版のこの vite+ を、社内のデザインシステムに爆速で導入しました。α版を本番の資産に入れるのは、普通なら避ける判断です。「α版をもう本番に入れたの？」と思うかもしれません。それでも入れた理由と、入れてみて実際どうだったのかを、このトークで正直に共有します。\n\n移行して良かったところもあれば、まずかったところもありました。どこまで畳めたのか、どこで詰まったのか、そしてなぜα版を本番に入れる判断をしたのか。具体は登壇でお見せします。\n\n参考: https://viteplus.dev/\n",
    },
    en: {
      title: "We Tried Adopting Vite+ Into Our In-House Design System at Breakneck Speed",
      overview:
        "In other languages, having an integrated toolchain from day one is taken for granted. In Go and Rust, building, testing, and formatting all live together within a single, unified world. In JavaScript, on the other hand, the test runner, linter, formatter, and task runner have existed as separate tools, and combining and maintaining them has always been our own job.\n\nReleased on March 13, 2026, vite+ is an integrated toolchain aiming to solve that fragmentation. It bundles testing, linting, formatting, task execution, and even Node management, all into a single `vp` command.\n\nWe adopted this vite+, freshly released and still in alpha, into our in-house design system at breakneck speed. Bringing an alpha release into production assets is normally a decision you'd avoid. You might be thinking, \"wait, you already put an alpha release into production?\" Even so, in this talk I'll honestly share why we made that call, and how it actually went once we did.\n\nThere were things that went well with the migration, and things that didn't go so smoothly. How much complexity were we able to fold away, where did we get stuck, and why did we decide to put an alpha release into production? I'll show the specifics on stage.\n\nReference: https://viteplus.dev/",
    },
  },
  {
    id: "lightning-talk-5",
    url: "/speaker/hakshu25",
    type: "lightningTalk",
    speakerIds: ["hakshu25"],
    tracks: ["track3"],
    start: "16:35",
    end: "17:50",
    ja: {
      title: "Vite+のちょっとした改善から学ぶ、OSSコントリビューションの始め方",
      overview:
        "私たちは毎日、Vueを取り巻く多くのOSSに助けられて開発しています。そんな中「OSSに貢献したいけど難しそう」と感じる人は多いはず。\n使っていて気づく利用者の「ここ改善したい」は、実はあなたの手で直せます。\n私はVite+のvp migrateで「なぜこのファイルの移行が必要か情報が少なくて分かりにくい」という1ユーザーの声に、PRで応えました。\n\n本LTではVite+を軸に、StorybookやOxcなど他のOSSへのPRの実例も交えながら、コントリビューション対象の見つけ方と「変更を1つに絞る」「issueを紐づける」「PRの書き方」といったOSSへの小さなPRの作法を紹介します。合わせて、AIエージェント（Claude Code等）に任せる部分と自分が責任を持つ部分の線引きにも触れます。\n\nこれらはAIの活用も含めて普段の業務と変わらず、特別なスキルはいりません。次の誰かのために最初の一歩を踏み出す方法を持ち帰ってください。",
    },
    en: {
      title:
        "What a Small Improvement to Vite+ Teaches Us About Getting Started with OSS Contribution",
      overview:
        "Every day, our development relies on the help of the many OSS projects that surround Vue. I'm sure a lot of people feel like \"I want to contribute to OSS, but it seems hard.\"\nBut those little \"I wish this were improved\" moments you notice as a user? You can actually fix them yourself, with your own hands.\nI responded, via a PR, to one user's voice about Vite+'s `vp migrate`: \"it's hard to tell why this file needs to be migrated, because there's so little information.\"\n\nIn this lightning talk, centered on Vite+, and drawing on real examples of PRs I've sent to other OSS projects like Storybook and Oxc as well, I'll introduce how to find things worth contributing to, along with the etiquette of small OSS PRs — keeping each change scoped to one thing, linking it to an issue, and how to write the PR itself. I'll also touch on where to draw the line between what you hand off to an AI agent (like Claude Code) and what you take responsibility for yourself.\n\nAll of this, including making use of AI, isn't any different from your everyday work — no special skills required. Take home a way to take that first step, for the sake of the next person after you.",
    },
  },
  {
    id: "lightning-talk-6",
    url: "/speaker/Eluwing",
    type: "lightningTalk",
    speakerIds: ["Eluwing"],
    tracks: ["track3"],
    start: "16:35",
    end: "17:50",
    ja: {
      title: "外国人エンジニアがVueプロトタイプで仕様を合わせている話",
      overview:
        "外国人エンジニアとして日本のフロントエンドチームで 9 年働いてきました。仕様確認や進捗共有で、お互い「わかったつもり」になって後からズレが発覚することが何度もありました。日本語が母語でない自分にとって、これは特に大きな壁でした。\n\n最近は AI でプロトタイプを作るハードルが下がり、文章で説明する代わりに、動く Vue コンポーネントを見せて合意を取る場面が増えています。画面共有で実際に触れる形にすると、認識のズレが早く見つかります。具体的なものを見せながら進めること自体が、チームの信頼にもつながっていきました。\n\nこの LT では、Vue / Nuxt の開発で、言葉に頼らず「動くもの」で認識を合わせていく工夫を、外国人エンジニアの視点から共有します。",
    },
    en: {
      title: "How a Foreign Engineer Uses Vue Prototypes to Align on Specs",
      overview:
        "I've worked as a foreign engineer on a Japanese frontend team for 9 years. Time and again, in spec confirmations and progress updates, we'd both think we \"understood each other,\" only to discover a mismatch later on. As someone who isn't a native Japanese speaker, this was a particularly big wall for me.\n\nRecently, the barrier to building prototypes with AI has come down, and there are more and more situations where, instead of explaining things in writing, we reach agreement by showing a working Vue component. When you make something people can actually touch through screen sharing, misalignments in understanding surface much faster. The act of moving forward while showing something concrete has also helped build trust within the team.\n\nIn this lightning talk, I'll share, from a foreign engineer's perspective, techniques for aligning understanding through \"something that works\" rather than relying on words, in Vue/Nuxt development.",
    },
  },
  {
    id: "lightning-talk-7",
    url: "/speaker/drumath2237",
    type: "lightningTalk",
    speakerIds: ["drumath2237"],
    tracks: ["track3"],
    start: "16:35",
    end: "17:50",
    ja: {
      title: "Web3Dライブラリを作ってVue Custom Rendererの仕組みを理解しよう",
      overview:
        "Custom Rendererは、DOM以外のものをレンダリング（表現）するのためにVueのSFCを使うことができる強力な機能です。\nしかし、公式ドキュメントや有志の記事を含めてあまり情報がなく、学習するのに少し難しい機能にも思えます。\n\n本セッションでは、Web3DライブラリであるBabylon.jsのラッパーライブラリを開発する過程でVueのcustom rendererがどのように使えたのかをご紹介します。",
    },
    en: {
      title: "Understanding How Vue Custom Renderer Works by Building a Web3D Library",
      overview:
        "Custom Renderer is a powerful feature that lets you use Vue SFC to render things other than the DOM.\nHowever, there isn't much information out there about it, including in the official docs and articles written by the community, so it can seem like a somewhat difficult feature to learn.\n\nIn this session, I'll introduce how I was able to make use of Vue Custom Renderer while developing a wrapper library for Babylon.js, a Web3D library.",
    },
  },
  {
    id: "lightning-talk-8",
    url: "/speaker/ryuhei373",
    type: "lightningTalk",
    speakerIds: ["ryuhei373"],
    tracks: ["track3"],
    start: "16:35",
    end: "17:50",
    ja: {
      title: "結局Nuxt Layersって何ができて何が嬉しいの？",
      overview:
        "Nuxt LayersはNuxt 3から導入されている機能ですが、日本語圏では情報が少なく、「モノレポ関連の何か」くらいのイメージで止まっている方が多いと思います。実際私もその一人でしたが、Nuxtのエコシステムには興味がありつつ、Layersには手を出せていなかったので、今回改めて検証しました。\n\nLayersの正体は、Nuxtプロジェクトの構成要素を別ソースからまるごと合成する仕組みです。モノレポ内の機能分離だけでなく、複数サイト間のUI共通化や環境別の機能切替、テーマの差し替えにも使えます。検証で得た具体例とともに、Layersという機能の本質と活用パターンを紹介します。",
    },
    en: {
      title: "At the End of the Day, What Can Nuxt Layers Actually Do, and Why Is It Great?",
      overview:
        "Nuxt Layers has been available since Nuxt 3, but there isn't much information about it in Japanese, and I think a lot of people's understanding stops at something like \"it's some kind of monorepo-related thing.\" I was actually one of those people myself — I was interested in the Nuxt ecosystem but had never gotten around to trying Layers, so this time I took a fresh look and verified it firsthand.\n\nWhat Layers really is, at its core, is a mechanism for composing the building blocks of a Nuxt project together, wholesale, from separate sources. Beyond just separating concerns within a monorepo, it can also be used to share UI across multiple sites, switch features on and off per environment, and swap out themes. Along with concrete examples from my own investigation, I'll introduce the essential nature of the Layers feature and patterns for putting it to use.",
    },
  },
  {
    id: "lightning-talk-9",
    url: "/speaker/koki_m",
    type: "lightningTalk",
    speakerIds: ["koki_m"],
    tracks: ["track3"],
    start: "16:35",
    end: "17:50",
    ja: {
      title: "SFCで実現する病院・医療システムの動的組み立て式UI",
      overview:
        "病院では、同じ患者を見ていても、医師・看護師・薬剤師・臨床工学技士など職種ごとに必要な情報は異なります。さらに、外来・病棟・ICU・手術室・救急など、診療の場面によっても求められる情報は変化します。本LTでは、画面を小さなVueコンポーネント（ウィジェット）の集合として設計し、利用者自身が自由に配置・保存できる仕組みを紹介します。病院・医療システムならではのUI設計の考え方と、実際に画面を組み替えるデモをお見せします。",
    },
    en: {
      title: "Dynamic, Composable UI for Hospital and Medical Systems Built with SFC",
      overview:
        "In hospitals, even when looking at the same patient, the information needed differs by role — doctors, nurses, pharmacists, clinical engineers, and so on. What's needed also shifts depending on the clinical setting: outpatient, ward, ICU, operating room, emergency department. In this lightning talk, I'll introduce a mechanism where the screen is designed as a collection of small Vue components (widgets) that users themselves can freely arrange and save. I'll share the thinking behind UI design specific to hospital and medical systems, along with a live demo of actually rearranging the screen.",
    },
  },
  {
    id: "lightning-talk-10",
    url: "/speaker/CrafterKina",
    type: "lightningTalk",
    speakerIds: ["CrafterKina"],
    tracks: ["track3"],
    start: "16:35",
    end: "17:50",
    ja: {
      title: "便利で危険なDeep Reactivityとの付き合い方",
      overview:
        "VueはProxyを使って、一般的なデータ構造に対するミューテーションに対してリアクティビティを提供しています。\nこれは便利である一方で、defineModelやwritable computed、果てはpropsまでもが、暗黙的なミューテーションによるデータフローの混乱をもたらす源泉となりうる危険な機能でもあります。\n例えば、propsにオブジェクトを渡したとき、その渡された子コンポーネントは誰にも怒られることなくそのオプジェクトをミューテーションすることができます。\nこのLTでは実体験から、Deep Reactiveのよくあるデータフロー混乱パターンを紹介し、どのような回避手段があるかを検討します。",
    },
    en: {
      title: "How to Live With Deep Reactivity — Convenient, and Dangerous",
      overview:
        "Vue uses Proxy to provide reactivity for mutations on ordinary data structures.\nWhile this is convenient, it's also a dangerous feature: things like `defineModel`, writable computed, and even props themselves can become a source of confused data flow through implicit mutation.\nFor example, when you pass an object as a prop, the child component it's passed to can mutate that object without anyone stopping it or raising a complaint.\nIn this lightning talk, drawing on real experience, I'll introduce common patterns of data-flow confusion caused by deep reactivity, and consider what countermeasures are available.",
    },
  },
]);

export const PANEL_DISCUSSION_PROGRAMS = definePrograms([
  {
    id: "panel-discussion-1",
    type: "panelDiscussion",
    speakerIds: [],
    start: "15:50",
    end: "16:50",
    tracks: ["track1"],
    ja: { title: "TBD" },
    en: { title: "TBD" },
  },
  {
    id: "panel-discussion-2",
    type: "panelDiscussion",
    speakerIds: [],
    start: "15:50",
    end: "16:50",
    tracks: ["track2"],
    ja: { title: "TBD" },
    en: { title: "TBD" },
  },
]);

export const EVENT_PROGRAMS = definePrograms([
  {
    id: "hands-on",
    type: "event",
    speakerIds: [],
    start: "12:50",
    end: "14:50",
    tracks: ["track4"],
    // url: "/event?session=hands-on#hands-on",
    ja: { title: "TBD" },
    en: { title: "TBD" },
  },
  {
    id: "student-support-contents",
    type: "event",
    speakerIds: [],
    start: "12:00",
    end: "12:30",
    tracks: ["track4"],
    url: "/event?session=student-support-contents#student-support-contents",
    ja: { title: "学生支援限定ランチ会" },
    en: { title: "Student Support Lunch Meetup" },
  },
]);

export const PROGRAMS = [
  ...SESSION_PROGRAMS,
  ...LIGHTNING_TALK_PROGRAMS,
  ...PANEL_DISCUSSION_PROGRAMS,
  ...EVENT_PROGRAMS,
];

export type ProgramId = (typeof PROGRAMS)[number]["id"];
