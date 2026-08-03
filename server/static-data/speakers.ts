import type { SpeakerData } from "./types/speaker";

const EVAN_YOU: SpeakerData = {
  id: "yyx990803",
  avatarUrl: "/images/avatars/evan-you.jpeg",
  color: "default",
  attendedIndex: 1,
  socialUrls: {
    x: "https://x.com/evanyou",
    bluesky: "https://bsky.app/profile/evanyou.me",
    github: "https://github.com/yyx990803",
  },
  ja: {
    name: "Evan You",
    title: "CEO",
    affiliation: "VoidZero",
    bio: "Vue.jsとViteの作者。VoidZeroのCEOとして、JavaScriptツールチェーンの開発に取り組む。",
  },
  en: {
    name: "Evan You",
    title: "CEO",
    affiliation: "VoidZero",
    bio: "Creator of Vue.js and Vite. As CEO of VoidZero, he works on the JavaScript toolchain.",
  },
};

const EDUARDO_SAN_MARTIN_MOROTE: SpeakerData = {
  id: "posva",
  avatarUrl: "/images/avatars/eduardo-san-martin-morote.png",
  color: "default",
  attendedIndex: 2,
  socialUrls: {
    x: "https://x.com/posva",
    bluesky: "https://bsky.app/profile/esm.dev",
    github: "https://github.com/posva",
  },
  ja: {
    name: "Eduardo San Martin Morote (Posva)",
    title: "Vue.js Core Team",
    affiliation: "Vercel",
    bio: "オープンソースへの情熱を持つフロントエンドエンジニア。Vue.js Core Teamの一員としてVueエコシステムに携わる。",
  },
  en: {
    name: "Eduardo San Martin Morote",
    title: "Vue.js Core Team",
    affiliation: "Vercel",
    bio: "Frontend nerd with a passion for Open Source, working as part of the Vue.js Core Team.",
  },
};

const POOYA_PARSA: SpeakerData = {
  id: "pi0",
  avatarUrl: "/images/avatars/pooya-parsa.png",
  color: "default",
  attendedIndex: 3,
  socialUrls: {
    x: "https://x.com/_pi0_",
    bluesky: "https://bsky.app/profile/pi0.io",
    github: "https://github.com/pi0",
  },
  ja: {
    name: "Pooya Parsa",
    title: "Nitro、UnJS、H3作者",
    affiliation: "Vercel",
    bio: "2014年からオープンソースに貢献し、現在はVercelとスポンサーの支援を受けてフルタイムでOSSに取り組む。\n\nNitro、H3、UnJSの作者・メンテナーであり、2017年からNuxtにも貢献。JavaScript向けのユニバーサルでランタイム非依存なソリューション構築に注力。",
  },
  en: {
    name: "Pooya Parsa",
    title: "Creator of Nitro, UnJS and H3",
    affiliation: "Vercel",
    bio: "I’ve been contributing to open source since 2014 and now work on it full-time with support from Vercel and my sponsors.\n\nI’m the creator and maintainer of Nitro, H3, and UnJS, and have been contributing to Nuxt since 2017. My focus is building universal, runtime-agnostic solutions for JavaScript.",
  },
};

const CHARLES_WANG: SpeakerData = {
  id: "wan9chi",
  avatarUrl: "/images/avatars/charles-wang.png",
  color: "default",
  attendedIndex: 4,
  socialUrls: {
    x: "https://x.com/wan9chi",
    bluesky: "https://bsky.app/profile/wan9chi.bsky.social",
    github: "https://github.com/wan9chi",
  },
  ja: {
    name: "Charles Wang",
    title: "ソフトウェアエンジニア",
    affiliation: "VoidZero",
    bio: "Vite+のコアチームメンバーで、Vite Taskに取り組む。",
  },
  en: {
    name: "Charles Wang",
    title: "Software Engineer",
    affiliation: "VoidZero",
    bio: "Vite+ core team member. Working on Vite Task.",
  },
};

const UBUGEEEI: SpeakerData = {
  id: "ubugeeei",
  avatarUrl: "/images/avatars/ubugeeei.jpeg",
  color: "default",
  attendedIndex: 5,
  socialUrls: {
    x: "https://x.com/ubugeeei",
    bluesky: "https://bsky.app/profile/ubugeeei.dev",
    github: "https://github.com/ubugeeei",
  },
  ja: {
    name: "ubugeeei",
    title: "Vize、chibivue作者",
    affiliation: "Vite+、Vue.js、株式会社メイツ",
    bio: "東京を拠点に活動するソフトウェアエンジニア。株式会社メイツでチーフエンジニアを務めながら、フロントエンド設計、開発体験、パフォーマンス改善に取り組む。\n\nVue.js Core Team、Vite+ core contributorとして活動し、Vue Vaporやコミュニティ活動にも関わる。Vizeでは、Rust製のVue.jsツールチェーンとしてcompiler、linter、typechecker、formatter、story system、LSPまでを横断し、Vue開発の未来の基盤を研究している。",
  },
  en: {
    name: "ubugeeei",
    title: "Creator of Vize and chibivue",
    affiliation: "Vite+, Vue.js, Mates Inc.",
    bio: "Tokyo-based software engineer and chief engineer at Mates Inc. working on frontend architecture, developer experience, and performance.\n\nAlso active as a Vue.js Core Team member and Vite+ core contributor, with work around Vue Vapor and the broader Vue community. With Vize, a Rust-based Vue.js toolchain spanning compiler, linter, typechecker, formatter, story system, and LSP, he is exploring what the next foundation for Vue development could look like.",
  },
};

const MISAKI_NAKANO: SpeakerData = {
  id: "mnmxmx",
  avatarUrl: "/images/avatars/misaki-nakano.png",
  color: "default",
  attendedIndex: 6,
  socialUrls: {
    x: "https://x.com/misaki_mofujp",
    github: "https://github.com/mnmxmx",
  },
  ja: {
    name: "中野 美咲",
    title: "WebGL Developer",
    affiliation: "",
    bio: "中野美咲は2016年からWebGL開発者として活動しており、企業のブランディングサイト、シミュレーション、データビジュアライゼーションにおけるWebGLの実装を担当。現在はGitHubのブランディングチームに所属。",
  },
  en: {
    name: "Misaki Nakano",
    title: "WebGL Developer",
    affiliation: "",
    bio: "Misaki Nakano has worked as a WebGL developer since 2016, implementing WebGL for corporate branding sites, simulations, and data visualizations. She currently works on GitHub’s brand team.",
  },
};

const LEO_KETTMEIR: SpeakerData = {
  id: "crowlKats",
  avatarUrl: "/images/avatars/leo-kettmeir.jpeg",
  color: "default",
  attendedIndex: 7,
  socialUrls: {
    x: "https://x.com/crowlKats",
    github: "https://github.com/crowlKats",
  },
  ja: {
    name: "Leo Kettmeir",
    title: "",
    affiliation: "Denoland",
    bio: "Denoのソフトウェアエンジニアとして、WebSocket、WebGPU、Web Storageなどの主要なWeb APIやランタイム機能の実装に携わる。\n\n開発者体験の向上に向けたツールやドキュメントにも注力し、npmのモダンな代替であるjsr.ioのメンテナーとして、ドキュメントツールやレジストリ基盤をリード。",
  },
  en: {
    name: "Leo Kettmeir",
    title: "",
    affiliation: "Denoland",
    bio: "I am a software engineer at Deno, where I've implemented key Web APIs—including WebSocket, WebGPU, and Web Storage—and contributed to core runtime features.\n\nI focus on improving developer experience through tooling and documentation. Additionally, I am a maintainer to jsr.io, a modern alternative to npm, where I lead work on documentation tooling and registry infrastructure.",
  },
};

const ALISTAIR_SMITH: SpeakerData = {
  id: "alii",
  avatarUrl: "/images/avatars/alistair-smith.png",
  color: "default",
  attendedIndex: 8,
  socialUrls: {
    x: "https://x.com/alistaiir",
    github: "https://github.com/alii",
  },
  ja: {
    name: "Alistair Smith",
    title: "Member of Technical Staff",
    affiliation: "Anthropic",
    bio: "言語設計と分散システムに関心を持つエンジニア。AnthropicでClaude CodeとBunに取り組む。",
  },
  en: {
    name: "Alistair Smith",
    title: "Member of Technical Staff",
    affiliation: "Anthropic",
    bio: "Interested in language design and distributed systems. Working on Claude Code and Bun at Anthropic.",
  },
};

const KONGKEIT_KHUNPANITCHOT: SpeakerData = {
  id: "SaltyAom",
  avatarUrl: "/images/avatars/kongkeit-khunpanitchot.jpeg",
  color: "default",
  attendedIndex: 9,
  socialUrls: {
    x: "https://x.com/saltyaom",
    github: "https://github.com/SaltyAom",
  },
  ja: {
    name: "Kongkeit Khunpanitchot (aka saltyaom)",
    title: "Software Engineer",
    affiliation: "Creatorsgarten",
    bio: "Elysiaなどの作者。",
  },
  en: {
    name: "Kongkeit Khunpanitchot (aka saltyaom)",
    title: "Software Engineer",
    affiliation: "Creatorsgarten",
    bio: "I made Elysia and stuff.",
  },
};

const YUSUKE_WADA: SpeakerData = {
  id: "yusukebe",
  avatarUrl: "/images/avatars/yusuke-wada.jpg",
  color: "default",
  attendedIndex: 10,
  socialUrls: {
    x: "https://x.com/yusukebe",
    bluesky: "https://bsky.app/profile/yusukebe.bsky.social",
    github: "https://github.com/yusukebe",
  },
  ja: {
    name: "Yusuke Wada",
    title: "Hono作者",
    affiliation: "Cloudflare",
    bio: "Cloudflare, Inc.のDeveloper Advocate。Honoの作者。",
  },
  en: {
    name: "Yusuke Wada",
    title: "Creator of Hono",
    affiliation: "Cloudflare",
    bio: "Developer Advocate at Cloudflare, Inc. Creator of Hono.",
  },
};

const YOSUKE_FURUKAWA: SpeakerData = {
  id: "yosuke-furukawa",
  avatarUrl: "/images/avatars/yosuke-furukawa.jpeg",
  color: "default",
  attendedIndex: 11,
  socialUrls: {
    x: "https://x.com/yosuke_furukawa",
    bluesky: "https://bsky.app/profile/yosuke-furukawa.bsky.social",
    github: "https://github.com/yosuke-furukawa",
  },
  ja: {
    name: "古川 陽介",
    title: "グループマネージャー / Japan Node.js Association代表理事",
    affiliation: "株式会社リクルート / 株式会社ニジボックス（デベロップメント室 室長）",
    bio: "Japan Node.js Association代表理事。JSConf JPオーガナイザー。株式会社リクルートでフロントエンド領域のグループマネージャーを務め、ニジボックスではデベロップメント室室長を兼務。複合機メーカー、ゲーム会社を経て2016年にリクルート入社。ブラウザからOSS開発まで幅広く活動している。",
  },
  en: {
    name: "Yosuke Furukawa",
    title: "Group Manager / Representative Director, Japan Node.js Association",
    affiliation: "Recruit Co., Ltd. / Nijibox Co., Ltd. (Head of Development Office)",
    bio: "Representative Director of the Japan Node.js Association and organizer of JSConf JP. At Recruit, he serves as group manager for the frontend area and also leads the Development Office at Nijibox. After working at a multifunction printer manufacturer and a game company, he joined Recruit in 2016 and works broadly from browsers to OSS development.",
  },
};

const CFP_SPEAKERS: SpeakerData[] = [
  {
    id: "naokihaba",
    avatarUrl: "/images/avatars/naokihaba.png",
    color: "default",
    socialUrls: {
      x: "https://x.com/naokihaba",
      bluesky: "https://bsky.app/profile/naokihaba.com",
      github: "https://github.com/naokihaba",
    },
    ja: {
      name: "Naoki Haba",
      title: "Vite+ チームメンバー",
      affiliation: "株式会社 アンドパッド",
    },
    en: {
      name: "Naoki Haba",
      title: "Vite+ Team Member",
      affiliation: "ANDPAD Inc.",
    },
  },
  {
    id: "themarcba",
    avatarUrl: "/images/avatars/themarcba.png",
    color: "default",
    socialUrls: {
      x: "https://x.com/marcba",
      github: "https://github.com/themarcba",
    },
    ja: {
      name: "Marc Backes",
      title: "Senior Software Engineer",
      affiliation: "Directus",
    },
    en: {
      name: "Marc Backes",
      title: "Senior Software Engineer",
      affiliation: "Directus",
    },
  },
  {
    id: "alvarosabu",
    avatarUrl: "/images/avatars/alvarosabu.png",
    color: "default",
    socialUrls: {
      x: "https://x.com/alvarosabu",
      bluesky: "https://bsky.app/profile/alvarosaburido.dev",
      github: "https://github.com/alvarosabu",
    },
    ja: {
      name: "Alvarosabu",
      title: "Creative Software Engineer",
      affiliation: "TresJS",
    },
    en: {
      name: "Alvarosabu",
      title: "Creative Software Engineer",
      affiliation: "TresJS",
    },
  },
  {
    id: "yut0naga1",
    avatarUrl: "/images/avatars/yut0naga1.png",
    color: "default",
    socialUrls: {
      x: "https://x.com/yut0naga1",
      github: "https://github.com/yut0naga1",
    },
    ja: {
      name: "永井優斗/Yuto NAGAI",
      title: "シニアコンサルタント",
      affiliation: "フューチャーアーキテクト株式会社",
    },
    en: {
      name: "Yuto NAGAI",
      title: "Senior Consultant",
      affiliation: "Future Architect, inc",
    },
  },
  {
    id: "ykoizumi0903",
    avatarUrl: "/images/avatars/ykoizumi0903.png",
    color: "default",
    socialUrls: {
      x: "https://x.com/ykoizumi0903",
    },
    ja: {
      name: "Yutaro Koizumi",
      title: "テックリード",
      affiliation: "株式会社アンドパッド",
    },
    en: {
      name: "Yutaro Koizumi",
      title: "TechLead",
      affiliation: "ANDPAD Inc.",
    },
  },
  {
    id: "hiranuma",
    avatarUrl: "/images/avatars/hiranuma.png",
    color: "default",
    socialUrls: {
      x: "https://x.com/mistorun",
      bluesky: "https://bsky.app/profile/mistorun.bsky.social",
      github: "https://github.com/hiranuma",
    },
    ja: {
      name: "平沼 真吾",
      title: "CTO",
      affiliation: "株式会社GENEROSITY",
    },
    en: {
      name: "Shingo Hiranuma",
      title: "CTO",
      affiliation: "GENEROSITY inc.",
    },
  },
  {
    id: "ushironoko",
    avatarUrl: "/images/avatars/ushironoko.png",
    color: "default",
    socialUrls: {
      x: "https://x.com/ushiro_noko",
      bluesky: "https://bsky.app/profile/ushironoko.work",
      github: "https://github.com/ushironoko",
    },
    ja: {
      name: "ushironoko",
      title: "フロントエンドエンジニア",
      affiliation: "Studio株式会社",
    },
    en: {
      name: "ushironoko",
      title: "Frontend Engineer",
      affiliation: "Studio, inc.",
    },
  },
  {
    id: "t0daaay",
    avatarUrl: "/images/avatars/t0daaay.png",
    color: "default",
    socialUrls: {
      x: "https://x.com/t0daaay",
      github: "https://github.com/t0daaay",
    },
    ja: {
      name: "辻佳佑",
      title: "ソフトウェアエンジニア",
      affiliation: "弁護士ドットコム株式会社",
    },
    en: {
      name: "Keisuke Tsuji",
      title: "Software Engineer",
      affiliation: "",
    },
  },
  {
    id: "jp-knj",
    avatarUrl: "/images/avatars/jp-knj.png",
    color: "default",
    socialUrls: {
      x: "https://x.com/jp_knj",
      bluesky: "https://bsky.app/profile/jp-knj.bsky.social",
      github: "https://github.com/jp-knj",
    },
    ja: {
      name: "jp-knj",
      title: "デザインエンジニア",
      affiliation: "Plaid, Inc.",
    },
    en: {
      name: "jp-knj",
      title: "Design Engineer",
      affiliation: "Plaid, Inc.",
    },
  },
  {
    id: "ics-ikeda",
    avatarUrl: "/images/avatars/ics-ikeda.png",
    color: "default",
    socialUrls: {
      x: "https://x.com/clockmaker",
      github: "https://github.com/ics-ikeda",
    },
    ja: {
      name: "池田 泰延",
      title: "フロントエンドエンジニア",
      affiliation: "株式会社ICS",
    },
    en: {
      name: "IKEDA Yasunobu",
      title: "Front-end Engineer",
      affiliation: "ICS INC.",
    },
  },
  {
    id: "ktsn",
    avatarUrl: "/images/avatars/ktsn.png",
    color: "default",
    socialUrls: {
      x: "https://x.com/ktsn",
      bluesky: "https://bsky.app/profile/ktsn.dev",
      github: "https://github.com/ktsn",
    },
    ja: {
      name: "Katashin",
      title: "CTO",
      affiliation: "kinew",
    },
    en: {
      name: "Katashin",
      title: "CTO",
      affiliation: "kinew",
    },
  },
  {
    id: "yamanoku",
    avatarUrl: "/images/avatars/yamanoku.png",
    color: "default",
    socialUrls: {
      x: "https://x.com/yamanoku",
      bluesky: "https://bsky.app/profile/yamanoku.net",
      github: "https://github.com/yamanoku",
    },
    ja: {
      name: "やまのく",
      title: "会社員",
      affiliation: "",
    },
    en: {
      name: "yamanoku",
      title: "Company Employee",
      affiliation: "",
    },
  },
  {
    id: "is78-dev",
    avatarUrl: "/images/avatars/is78-dev.png",
    color: "default",
    socialUrls: {
      x: "https://x.com/aoshi_78",
      github: "https://github.com/is78-dev",
    },
    ja: {
      name: "aoshi",
      title: "フロントエンドエンジニア",
      affiliation: "株式会社ヤプリ",
    },
    en: {
      name: "aoshi",
      title: "frontend engineer",
      affiliation: "Yappli, Inc.",
    },
  },
  {
    id: "Hal-Spidernight",
    avatarUrl: "/images/avatars/Hal-Spidernight.png",
    color: "default",
    socialUrls: {
      x: "https://x.com/hal_spidernight",
      github: "https://github.com/Hal-Spidernight",
    },
    ja: {
      name: "Hal",
      title: "アプリケーションエキスパート",
      affiliation: "株式会社LIXIL",
    },
    en: {
      name: "Hal",
      title: "Application Expert",
      affiliation: "LIXIL",
    },
  },
  {
    id: "Shigeyuki-fukuda",
    avatarUrl: "/images/avatars/Shigeyuki-fukuda.png",
    color: "default",
    socialUrls: {
      x: "https://x.com/uqda90",
      github: "https://github.com/Shigeyuki-fukuda",
    },
    ja: {
      name: "福田繁之",
      title: "Webエンジニア",
      affiliation: "株式会社mov",
    },
    en: {
      name: "Shigeyuki-fukuda",
      title: "Web Developer",
      affiliation: "mov inc.",
    },
  },
  {
    id: "HasutoSasaki",
    avatarUrl: "/images/avatars/HasutoSasaki.png",
    color: "default",
    socialUrls: {
      x: "https://x.com/hasuto00",
      github: "https://github.com/HasutoSasaki",
    },
    ja: {
      name: "Hasuto",
      title: "バックエンドエンジニア",
      affiliation: "クラスメソッド株式会社",
    },
    en: {
      name: "Hasuto",
      title: "Back-End Engineer",
      affiliation: "Classmethod, Inc.",
    },
  },
  {
    id: "northprint",
    avatarUrl: "/images/avatars/northprint.png",
    color: "default",
    socialUrls: {
      x: "https://x.com/northprint",
      bluesky: "https://bsky.app/profile/northprint",
      github: "https://github.com/northprint",
    },
    ja: {
      name: "northprint",
      title: "フロントエンドエンジニア",
      affiliation: "株式会社 ICS",
    },
    en: {
      name: "northprint",
      title: "Front-end Engineer",
      affiliation: "ICS INC.",
    },
  },
  {
    id: "Koutaro-Hanabusa",
    avatarUrl: "/images/avatars/Koutaro-Hanabusa.png",
    color: "default",
    socialUrls: {
      x: "https://x.com/burio_16",
      github: "https://github.com/Koutaro-Hanabusa",
    },
    ja: {
      name: "ぶりお",
      title: "フロントエンドエンジニア",
      affiliation: "",
    },
    en: {
      name: "burio",
      title: "frontend engineer",
      affiliation: "",
    },
  },
  {
    id: "hakshu25",
    avatarUrl: "/images/avatars/hakshu25.png",
    color: "default",
    socialUrls: {
      x: "https://x.com/hakshu25",
      github: "https://github.com/hakshu25",
    },
    ja: {
      name: "hakshu",
      title: "Webエンジニア",
      affiliation: "",
    },
    en: {
      name: "hakshu",
      title: "Web Engineer",
      affiliation: "",
    },
  },
  {
    id: "Eluwing",
    avatarUrl: "/images/avatars/Eluwing.png",
    color: "default",
    socialUrls: {
      github: "https://github.com/Eluwing",
    },
    ja: {
      name: "ノワン",
      title: "フロントエンドエンジニア",
      affiliation: "株式会社ヤプリ",
    },
    en: {
      name: "noh wan",
      title: "Frontend Engineer",
      affiliation: "Yappli, Inc.",
    },
  },
  {
    id: "drumath2237",
    avatarUrl: "/images/avatars/drumath2237.png",
    color: "default",
    socialUrls: {
      x: "https://x.com/ninisan_drumath",
      bluesky: "https://bsky.app/profile/drumath2237.bsky.social",
      github: "https://github.com/drumath2237",
    },
    ja: {
      name: "にー兄さん",
      title: "ソフトウェアエンジニア",
      affiliation: "株式会社ホロラボ",
    },
    en: {
      name: "Ninisan",
      title: "Software Engineer",
      affiliation: "HoloLab inc.",
    },
  },
  {
    id: "ryuhei373",
    avatarUrl: "/images/avatars/ryuhei373.png",
    color: "default",
    socialUrls: {
      x: "https://x.com/373_3",
      bluesky: "https://bsky.app/profile/ryuhei373.dev",
      github: "https://github.com/ryuhei373",
    },
    ja: {
      name: "ryuhei373",
      title: "エンジニア",
      affiliation: "株式会社ノーススター",
    },
    en: {
      name: "ryuhei373",
      title: "Engineer",
      affiliation: "north star Co.,Ltd.",
    },
  },
  {
    id: "koki_m",
    avatarUrl: "/images/avatars/koki_m.png",
    color: "default",
    socialUrls: {
      x: "https://x.com/koki_m",
    },
    ja: {
      name: "kouki.miura",
      title: "医療ITエンジニア",
      affiliation: "",
    },
    en: {
      name: "kouki.miura",
      title: "Healthcare IT Engineer",
      affiliation: "",
    },
  },
  {
    id: "CrafterKina",
    avatarUrl: "/images/avatars/CrafterKina.png",
    color: "default",
    socialUrls: {
      github: "https://github.com/CrafterKina",
    },
    ja: {
      name: "キナ",
      title: "プログラマ",
      affiliation: "",
    },
    en: {
      name: "Kina",
      title: "Programmer",
      affiliation: "",
    },
  },
];

export const SPEAKERS: SpeakerData[] = [
  EVAN_YOU,
  EDUARDO_SAN_MARTIN_MOROTE,
  POOYA_PARSA,
  CHARLES_WANG,
  UBUGEEEI,
  MISAKI_NAKANO,
  LEO_KETTMEIR,
  ALISTAIR_SMITH,
  KONGKEIT_KHUNPANITCHOT,
  YUSUKE_WADA,
  YOSUKE_FURUKAWA,
  ...CFP_SPEAKERS,
];
