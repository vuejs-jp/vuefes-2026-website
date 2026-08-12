import type { GoodsData } from "./types/goods";

export const GOODS: GoodsData[] = [
  {
    id: "goods01",
    src: "/images/store/t-shirt.webp",
    price: 2500,
    specs: {
      size: "S / M / L / XL",
      ja: {
        color: "ブラック",
        material: "綿100%",
      },
      en: {
        color: "Black",
        material: "100% cotton",
      },
    },
    ja: {
      name: "Tシャツ",
      description:
        "左胸にロゴを刺繍であしらった、シンプルで普段使いもしやすいTシャツです。型崩れしにくく、洗濯で伸び縮みしにくい生地です。",
    },
    en: {
      name: "T-shirt",
      description:
        "A simple, everyday T-shirt with an embroidered logo on the left chest. The fabric is designed to retain its shape and resist shrinking or stretching in the wash.",
    },
  },
  {
    id: "goods02",
    src: "/images/store/hoodie.webp",
    price: 6300,
    specs: {
      size: "S / M / L / XL",
      ja: {
        color: "オリーブ",
        material: "綿100%",
      },
      en: {
        color: "Olive",
        material: "100% cotton",
      },
    },
    ja: {
      name: "パーカー",
      description:
        "左胸にシルバーでロゴをシンプルに配置した前開きパーカーです。ほどよい厚みなので、アウターの一枚内側に着たりオフィスで羽織ったりしてお使いいただけます。",
    },
    en: {
      name: "Zip hoodie",
      description:
        "A zip-up hoodie with a simple silver logo on the left chest. Its medium-weight fabric makes it easy to layer under an outer jacket or throw on at the office.",
    },
  },
  {
    id: "goods03",
    src: "/images/store/sticker.webp",
    price: 300,
    specs: {
      size: "210mm×148mm",
      ja: {
        material: "片面PP貼（ツヤなし加工）",
      },
      en: {
        material: "Single-sided PP lamination (matte finish)",
      },
    },
    ja: {
      name: "ステッカー",
      description:
        "今年のステッカーは大判、フチなしのVue Fes Japanロゴをご用意しました。シール全体はツヤなしのマット加工です。",
    },
    en: {
      name: "Sticker sheet",
      description:
        "This year's sticker sheet features large Vue Fes Japan logos without borders. The entire sheet has a non-glossy matte finish.",
    },
  },
  {
    id: "goods04",
    src: "/images/store/magsafe.webp",
    price: 1400,
    specs: {
      ja: {
        material: "マグネットシート",
        size: "外径58mm / 内径41mm / 厚み1mm",
      },
      en: {
        material: "Magnetic sheet",
        size: "Outer diameter 58mm / Inner diameter 41mm / Thickness 1mm",
      },
    },
    ja: {
      name: "MagSafeシール",
      description:
        "スマートフォンケースに貼ることで、MagSafe対応アクセサリーが使えるようになるマグネットシールです。ツヤのあるUV印刷により、鮮やかな色合いに仕上げています。",
    },
    en: {
      name: "MagSafe sticker",
      description:
        "A magnetic sticker that enables the use of MagSafe-compatible accessories when applied to a smartphone case. Glossy UV printing gives it a vivid finish.",
    },
  },
  {
    id: "goods05",
    src: "/images/store/magnet-sheet.webp",
    price: 200,
    specs: {
      ja: {
        material: "PP + マグネットシート",
        size: "縦48mm／横55mm／厚み0.3mm",
      },
      en: {
        material: "PP + magnetic sheet",
        size: "H48mm × W55mm / Thickness 0.3mm",
      },
    },
    ja: {
      name: "マグネットシート",
      description:
        "Vue.jsのロゴを大判のマグネットシートにしました。家の冷蔵庫に印刷物をmountしてあげましょう。きっとreactiveにstateをwatchできるはずです。",
    },
    en: {
      name: "Magnet sheet",
      description:
        "A large magnet sheet featuring the Vue.js logo. Use it to mount printed materials on your refrigerator at home. You might just be able to watch their state reactively.",
    },
  },
  {
    id: "goods06",
    src: "/images/store/tumbler.webp",
    price: 2200,
    specs: {
      capacity: "350ml",
      ja: {
        material: "ステンレス",
        size: "約φ81mm×H96mm",
      },
      en: {
        material: "Stainless steel",
        size: "Approx. φ81mm × H96mm",
      },
    },
    ja: {
      name: "タンブラー",
      description:
        "真空二重構造でしっかり保冷できるタンブラーです。シックで重厚感があり、がっしりホールドできる持ちやすい大きさです。幅の広い口径で飲みやすく、大きな氷もすんなり入れられます。",
    },
    en: {
      name: "Tumbler",
      description:
        "A vacuum-insulated tumbler that keeps drinks cold. Its chic, substantial design is easy to hold, while the wide mouth makes it comfortable to drink from and large enough for ice cubes.",
    },
  },
  {
    id: "goods07",
    src: "/images/store/marker-charms.webp",
    price: 400,
    specs: {
      size: "50×50mm",
      ja: {
        material: "アクリル板3mm厚",
      },
      en: {
        material: "3mm acrylic sheet",
      },
    },
    ja: {
      name: "めじるしチャーム（各種）",
      description:
        "傘やペットボトル、ポーチなどに取り付けて、自分の持ち物の目印としてお使いいただけます。Vue.js、Vite、Piniaを日常でも楽しめます。\n※セットではなく単品での販売になります。",
    },
    en: {
      name: "Marker charm (various designs)",
      description:
        "Attach these charms to umbrellas, bottles, pouches, and more to mark your belongings. Enjoy Vue.js, Vite, and Pinia in everyday life.\n* Each charm is sold separately, not as a set.",
    },
  },
  {
    id: "goods08",
    src: "/images/store/cable-band.webp",
    price: 800,
    specs: {
      ja: {
        material: "PVC（ポリ塩化ビニル）",
        size: "横2cm×縦7cm×厚さ0.2cm",
      },
      en: {
        material: "PVC (polyvinyl chloride)",
        size: "W2cm × H7cm × D0.2cm",
      },
    },
    ja: {
      name: "ケーブルバンド",
      description:
        "コードをすっきりまとめられるPVCケーブルホルダーです。スナップボタンを留めるだけでイヤホンや充電ケーブルの絡まりを防止できます。",
    },
    en: {
      name: "Cable band",
      description:
        "A PVC cable holder that keeps cords neatly bundled. Simply fasten the snap button to prevent earphones and charging cables from getting tangled.",
    },
  },
];
