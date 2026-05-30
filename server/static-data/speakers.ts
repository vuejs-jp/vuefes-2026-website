import type { SpeakerData, StudentSupportSpeakerData } from "./types/speaker";

const EVAN_YOU: SpeakerData = {
  id: "yyx990803",
  avatarUrl: "/images/avatars/evan-you.jpeg",
  color: "default",
  attendedIndex: 1,
  sponsorId: undefined,
  slide: "",
  talkSchedule: "",
  talkTrack: undefined,
  socialUrls: {
    x: "https://x.com/youyuxi",
    bluesky: "https://bsky.app/profile/evan.me",
    github: "https://github.com/yyx990803",
  },
  ja: {
    name: "Evan You",
    title: "CEO",
    affiliation: "VoidZero",
    talkTitle: "",
    talkOverview: "",
    bio: "Vue.jsとViteの作者。VoidZeroのCEOとして、JavaScriptツールチェーンの開発に取り組む。",
  },
  en: {
    name: "Evan You",
    title: "CEO",
    affiliation: "VoidZero",
    talkTitle: "",
    talkOverview: "",
    bio: "Creator of Vue.js and Vite. As CEO of VoidZero, he works on the JavaScript toolchain.",
  },
};

const EDUARDO_SAN_MARTIN_MOROTE: SpeakerData = {
  id: "posva",
  avatarUrl: "/images/avatars/eduardo-san-martin-morote.png",
  color: "default",
  attendedIndex: 2,
  sponsorId: undefined,
  slide: "",
  talkSchedule: "",
  talkTrack: undefined,
  socialUrls: {
    x: "https://x.com/posva",
    bluesky: "https://bsky.app/profile/esm.dev",
    github: "https://github.com/posva",
  },
  ja: {
    name: "Eduardo San Martin Morote (Posva)",
    title: "Vue.js Core Team",
    affiliation: "Vercel",
    talkTitle: "",
    talkOverview: "",
    bio: "オープンソースへの情熱を持つフロントエンドエンジニア。Vue.js Core Teamの一員としてVueエコシステムに携わる。",
  },
  en: {
    name: "Eduardo San Martin Morote",
    title: "Vue.js Core Team",
    affiliation: "Vercel",
    talkTitle: "",
    talkOverview: "",
    bio: "Frontend nerd with a passion for Open Source, working as part of the Vue.js Core Team.",
  },
};

const POOYA_PARSA: SpeakerData = {
  id: "pi0",
  avatarUrl: "/images/avatars/pooya-parsa.png",
  color: "default",
  attendedIndex: 3,
  sponsorId: undefined,
  slide: "",
  talkSchedule: "",
  talkTrack: undefined,
  socialUrls: {
    x: "https://x.com/_pi0_",
    bluesky: "https://bsky.app/profile/pi0.io",
    github: "https://github.com/pi0",
  },
  ja: {
    name: "Pooya Parsa",
    title: "Nitro、UnJS、H3作者",
    affiliation: "Vercel",
    talkTitle: "",
    talkOverview: "",
    bio: "2014年からオープンソースに貢献し、現在はVercelとスポンサーの支援を受けてフルタイムでOSSに取り組む。\n\nNitro、H3、UnJSの作者・メンテナーであり、2017年からNuxtにも貢献。JavaScript向けのユニバーサルでランタイム非依存なソリューション構築に注力。",
  },
  en: {
    name: "Pooya Parsa",
    title: "Creator of Nitro, UnJS and H3",
    affiliation: "Vercel",
    talkTitle: "",
    talkOverview: "",
    bio: "I’ve been contributing to open source since 2014 and now work on it full-time with support from Vercel and my sponsors.\n\nI’m the creator and maintainer of Nitro, H3, and UnJS, and have been contributing to Nuxt since 2017. My focus is building universal, runtime-agnostic solutions for JavaScript.",
  },
};

const CHARLES_WANG: SpeakerData = {
  id: "wan9chi",
  avatarUrl: "/images/avatars/charles-wang.png",
  color: "default",
  attendedIndex: 4,
  sponsorId: undefined,
  slide: "",
  talkSchedule: "",
  talkTrack: undefined,
  socialUrls: {
    x: "https://x.com/wan9chi",
    bluesky: "https://bsky.app/profile/wan9chi",
    github: "https://github.com/wan9chi",
  },
  ja: {
    name: "Charles Wang",
    title: "ソフトウェアエンジニア",
    affiliation: "VoidZero",
    talkTitle: "",
    talkOverview: "",
    bio: "Vite+のコアチームメンバーで、Vite Taskに取り組む。",
  },
  en: {
    name: "Charles Wang",
    title: "Software Engineer",
    affiliation: "VoidZero",
    talkTitle: "",
    talkOverview: "",
    bio: "Vite+ core team member. Working on Vite Task.",
  },
};

const UBUGEEEI: SpeakerData = {
  id: "ubugeeei",
  avatarUrl: "/images/avatars/ubugeeei.jpeg",
  color: "default",
  attendedIndex: 5,
  sponsorId: undefined,
  slide: "",
  talkSchedule: "",
  talkTrack: undefined,
  socialUrls: {
    x: "https://x.com/ubugeeei",
    github: "https://github.com/ubugeeei",
  },
  ja: {
    name: "ubugeeei",
    title: "Vize、chibivue作者",
    affiliation: "Vite+、Vue.js、株式会社メイツ",
    talkTitle: "",
    talkOverview: "",
    bio: "東京を拠点に活動するソフトウェアエンジニア。株式会社メイツでチーフエンジニアを務めながら、フロントエンド設計、開発体験、パフォーマンス改善に取り組む。\n\nVue.js Core Team、Vite+ core contributorとして活動し、Vue Vaporやコミュニティ活動にも関わる。Vizeでは、Rust製のVue.jsツールチェーンとしてcompiler、linter、typechecker、formatter、story system、LSPまでを横断し、Vue開発の未来の基盤を研究している。",
  },
  en: {
    name: "ubugeeei",
    title: "Creator of Vize and chibivue",
    affiliation: "Vite+, Vue.js, Mates Inc.",
    talkTitle: "",
    talkOverview: "",
    bio: "Tokyo-based software engineer and chief engineer at Mates Inc. working on frontend architecture, developer experience, and performance.\n\nAlso active as a Vue.js Core Team member and Vite+ core contributor, with work around Vue Vapor and the broader Vue community. With Vize, a Rust-based Vue.js toolchain spanning compiler, linter, typechecker, formatter, story system, and LSP, he is exploring what the next foundation for Vue development could look like.",
  },
};

const MISAKI_NAKANO: SpeakerData = {
  id: "mnmxmx",
  avatarUrl: "/images/avatars/misaki-nakano.png",
  color: "default",
  attendedIndex: 6,
  sponsorId: undefined,
  slide: "",
  talkSchedule: "",
  talkTrack: undefined,
  socialUrls: {
    x: "https://x.com/misaki_mofujp",
    github: "https://github.com/mnmxmx",
  },
  ja: {
    name: "中野 美咲",
    title: "WebGL Developer",
    affiliation: "",
    talkTitle: "",
    talkOverview: "",
    bio: "中野美咲は2016年からWebGL開発者として活動しており、企業のブランディングサイト、シミュレーション、データビジュアライゼーションにおけるWebGLの実装を担当。現在はGitHubのブランディングチームに所属。",
  },
  en: {
    name: "Misaki Nakano",
    title: "WebGL Developer",
    affiliation: "",
    talkTitle: "",
    talkOverview: "",
    bio: "Misaki Nakano has worked as a WebGL developer since 2016, implementing WebGL for corporate branding sites, simulations, and data visualizations. She currently works on GitHub’s brand team.",
  },
};

const LEO_KETTMEIR: SpeakerData = {
  id: "crowlKats",
  avatarUrl: "/images/avatars/leo-kettmeir.jpeg",
  color: "default",
  attendedIndex: 7,
  sponsorId: undefined,
  slide: "",
  talkSchedule: "",
  talkTrack: undefined,
  socialUrls: {
    x: "https://x.com/crowlKats",
    github: "https://github.com/crowlKats",
  },
  ja: {
    name: "Leo Kettmeir",
    title: "",
    affiliation: "Denoland",
    talkTitle: "",
    talkOverview: "",
    bio: "Denoのソフトウェアエンジニアとして、WebSocket、WebGPU、Web Storageなどの主要なWeb APIやランタイム機能の実装に携わる。\n\n開発者体験の向上に向けたツールやドキュメントにも注力し、npmのモダンな代替であるjsr.ioのメンテナーとして、ドキュメントツールやレジストリ基盤をリード。",
  },
  en: {
    name: "Leo Kettmeir",
    title: "",
    affiliation: "Denoland",
    talkTitle: "",
    talkOverview: "",
    bio: "I am a software engineer at Deno, where I've implemented key Web APIs—including WebSocket, WebGPU, and Web Storage—and contributed to core runtime features.\n\nI focus on improving developer experience through tooling and documentation. Additionally, I am a maintainer to jsr.io, a modern alternative to npm, where I lead work on documentation tooling and registry infrastructure.",
  },
};

const ALISTAIR_SMITH: SpeakerData = {
  id: "alii",
  avatarUrl: "/images/avatars/alistair-smith.png",
  color: "default",
  attendedIndex: 8,
  sponsorId: undefined,
  slide: "",
  talkSchedule: "",
  talkTrack: undefined,
  socialUrls: {
    x: "https://x.com/alistaiir",
    github: "https://github.com/alii",
  },
  ja: {
    name: "Alistair Smith",
    title: "Member of Technical Staff",
    affiliation: "Anthropic",
    talkTitle: "",
    talkOverview: "",
    bio: "言語設計と分散システムに関心を持つエンジニア。AnthropicでClaude CodeとBunに取り組む。",
  },
  en: {
    name: "Alistair Smith",
    title: "Member of Technical Staff",
    affiliation: "Anthropic",
    talkTitle: "",
    talkOverview: "",
    bio: "Interested in language design and distributed systems. Working on Claude Code and Bun at Anthropic.",
  },
};

const KONGKEIT_KHUNPANITCHOT: SpeakerData = {
  id: "SaltyAom",
  avatarUrl: "/images/avatars/kongkeit-khunpanitchot.jpeg",
  color: "default",
  attendedIndex: 9,
  sponsorId: undefined,
  slide: "",
  talkSchedule: "",
  talkTrack: undefined,
  socialUrls: {
    x: "https://x.com/saltyaom",
    github: "https://github.com/SaltyAom",
  },
  ja: {
    name: "Kongkeit Khunpanitchot (aka saltyaom)",
    title: "Software Engineer",
    affiliation: "Creatorsgarten",
    talkTitle: "",
    talkOverview: "",
    bio: "Elysiaなどの作者。",
  },
  en: {
    name: "Kongkeit Khunpanitchot (aka saltyaom)",
    title: "Software Engineer",
    affiliation: "Creatorsgarten",
    talkTitle: "",
    talkOverview: "",
    bio: "I made Elysia and stuff.",
  },
};

const YUSUKE_WADA: SpeakerData = {
  id: "yusukebe",
  avatarUrl: "/images/avatars/yusuke-wada.jpeg",
  color: "default",
  attendedIndex: 10,
  sponsorId: undefined,
  slide: "",
  talkSchedule: "",
  talkTrack: undefined,
  socialUrls: {
    x: "https://x.com/yusukebe",
    bluesky: "https://bsky.app/profile/yusukebe",
    github: "https://github.com/yusukebe",
  },
  ja: {
    name: "Yusuke Wada",
    title: "Developer Advocate",
    affiliation: "Cloudflare, Inc.",
    talkTitle: "",
    talkOverview: "",
    bio: "Cloudflare, Inc.のDeveloper Advocate。Honoの作者。",
  },
  en: {
    name: "Yusuke Wada",
    title: "Developer Advocate",
    affiliation: "Cloudflare, Inc.",
    talkTitle: "",
    talkOverview: "",
    bio: "Developer Advocate at Cloudflare, Inc. Creator of Hono.",
  },
};

const YOSUKE_FURUKAWA: SpeakerData = {
  id: "yosuke-furukawa",
  avatarUrl: "/images/avatars/yosuke-furukawa.jpeg",
  color: "default",
  attendedIndex: 11,
  sponsorId: undefined,
  slide: "",
  talkSchedule: "",
  talkTrack: undefined,
  socialUrls: {
    x: "https://x.com/yosuke_furukawa",
    bluesky: "https://bsky.app/profile/yosuke-furukawa.bsky.social",
    github: "https://github.com/yosuke-furukawa",
  },
  ja: {
    name: "古川 陽介",
    title: "グループマネージャー / Japan Node.js Association代表理事",
    affiliation: "株式会社リクルート / 株式会社ニジボックス（デベロップメント室 室長）",
    talkTitle: "",
    talkOverview: "",
    bio: "Japan Node.js Association代表理事。JSConf JPオーガナイザー。株式会社リクルートでフロントエンド領域のグループマネージャーを務め、ニジボックスではデベロップメント室室長を兼務。複合機メーカー、ゲーム会社を経て2016年にリクルート入社。ブラウザからOSS開発まで幅広く活動している。",
  },
  en: {
    name: "Yosuke Furukawa",
    title: "Group Manager / Representative Director, Japan Node.js Association",
    affiliation: "Recruit Co., Ltd. / Nijibox Co., Ltd. (Head of Development Office)",
    talkTitle: "",
    talkOverview: "",
    bio: "Representative Director of the Japan Node.js Association and organizer of JSConf JP. At Recruit, he serves as group manager for the frontend area and also leads the Development Office at Nijibox. After working at a multifunction printer manufacturer and a game company, he joined Recruit in 2016 and works broadly from browsers to OSS development.",
  },
};

export const SESSION_SPEAKERS: SpeakerData[] = [
  EVAN_YOU,
  EDUARDO_SAN_MARTIN_MOROTE,
  CHARLES_WANG,
  UBUGEEEI,
  MISAKI_NAKANO,
];

export const LT_SPEAKERS: SpeakerData[] = [];

export const PANEL_DISCUSSION_SPEAKERS: SpeakerData[] = [
  EVAN_YOU,
  POOYA_PARSA,
  LEO_KETTMEIR,
  ALISTAIR_SMITH,
  KONGKEIT_KHUNPANITCHOT,
  YUSUKE_WADA,
  YOSUKE_FURUKAWA,
];

// TODO: 2026 年度の学生支援スピーカー情報を追加する
export const STUDENT_SUPPORT_SPEAKERS: StudentSupportSpeakerData[] = [];
