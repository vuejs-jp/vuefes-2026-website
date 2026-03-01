import type { GoodsData } from "./types/goods";

export const GOODS: GoodsData[] = [
  {
    id: "goods01",
    src: "/images/store/shirts.png",
    price: 3000,
    specs: {
      size: "S / M / L / XL",
      ja: {
        color: "スミ",
        material: "綿100%",
      },
      en: {
        color: "Charcoal",
        material: "100% Cotton",
      },
    },
    ja: {
      name: "Tシャツ",
      description:
        "今回のリブランディングを大胆にあしらったプリント。和をイメージした墨色Tシャツに白いプリントで、普段でも着用しやすい！　厚手の生地を選定。洗濯にも強く、安心して着ることができます！",
    },
    en: {
      name: "T-shirt",
      description:
        "A bold print featuring this rebranding design. A charcoal-colored T-shirt with white print inspired by Japanese aesthetics, perfect for everyday wear! Made with thick fabric that's durable and wash-resistant for worry-free wearing!",
    },
  },
  {
    id: "goods02",
    src: "/images/store/hoodie.png",
    price: 6000,
    specs: {
      size: "S / M / L / XL",
      ja: {
        color: "ブラック",
      },
      en: {
        color: "Black",
      },
    },
    ja: {
      name: "パーカー",
      description:
        "Vue Fes Japan ロゴを配したオリジナルパーカーです。程よい厚みのプルオーバータイプで、前面にポケットがついています。",
    },
    en: {
      name: "Hoodie",
      description:
        "An original hoodie featuring the Vue Fes Japan logo. This pullover-type hoodie has moderate thickness and includes a front pocket.",
    },
  },
  {
    id: "goods03",
    src: "/images/store/sticker.png",
    price: 300,
    specs: {
      size: "210mm×148mm",
      ja: {
        material: "片面PP貼（ツヤあり加工）",
      },
      en: {
        material: "Single-sided PP laminated (Glossy finish)",
      },
    },
    ja: {
      name: "ステッカー",
      description:
        "Vue Fes Japan のロゴを縦や横など様々な展開にしました。素材はツヤ感のある素材を使用しています。",
    },
    en: {
      name: "Sticker",
      description:
        "Vue Fes Japan logo in various orientations including vertical and horizontal layouts. Made with glossy material for a premium finish.",
    },
  },
  {
    id: "goods04",
    src: "/images/store/postcard.png",
    price: 300,
    specs: {
      size: "W100×H148mm",
      ja: {
        material: "マットコート紙",
      },
      en: {
        material: "Matte coated paper",
      },
    },
    ja: {
      name: "ポストカード",
      description:
        "4 種類のカラー展開をポストカードにしました。4 枚 1 セットで販売します。縦と横の 2 パターンの違いを楽しめます。",
    },
    en: {
      name: "Postcard",
      description:
        "Postcards featuring 4 different color variations. Sold as a set of 4 cards. Enjoy the differences between vertical and horizontal patterns.",
    },
  },
  {
    id: "goods05",
    src: "/images/store/keychain.png",
    price: 500,
    specs: {
      size: "W50×H30mm",
      ja: {
        material: "アクリル",
      },
      en: {
        material: "Acrylic",
      },
    },
    ja: {
      name: "アクリルキーホルダー（各種）",
      description:
        "イベントロゴのアクリルキーホルダーを 4 種ご用意しました。それぞれ異なるカラーパターンで、コレクション性も抜群！\u000A※セットではなく単品での販売になります。",
    },
    en: {
      name: "Acrylic Keychain (Various types)",
      description:
        "We have prepared 4 types of event logo acrylic keychains. Each features different color patterns, making them perfect for collecting!\u000A* Sold individually, not as a set.",
    },
  },
  {
    id: "goods06",
    src: "/images/store/band.png",
    price: 400,
    specs: {
      size: "W25×T2×C202mm",
      ja: {
        color: "マーブル",
        material: "シリコン",
      },
      en: {
        color: "Marble",
        material: "Silicone",
      },
    },
    ja: {
      name: "ラバーバンド",
      description:
        "いつものコーデにイベント感をプラスできるラバーバンドです。少し太めで細見えします。\u000A※マーブル模様は個体差があります。",
    },
    en: {
      name: "Rubber Band",
      description:
        "A rubber band that adds an event feel to your everyday outfit. Slightly thick design for a slimming effect.\u000A* Marble patterns may vary between individual items.",
    },
  },
  {
    id: "goods07",
    src: "/images/store/towel.png",
    price: 800,
    specs: {
      size: "W250×H250mm",
      ja: {
        material: "綿100%",
      },
      en: {
        material: "100% Cotton",
      },
    },
    ja: {
      name: "タオルハンカチ",
      description:
        "4 色のロゴをパターン柄にしたミニサイズのタオルハンカチです。素材は吸収性の良い綿素材を使用しています。",
    },
    en: {
      name: "Hand Towel",
      description:
        "A mini-sized hand towel featuring a pattern design with 4-color logos. Made with highly absorbent cotton material.",
    },
  },
  {
    id: "goods08",
    src: "/images/store/cushion.png",
    price: 3000,
    specs: {
      size: "W300×H300mm",
      ja: {},
      en: {},
    },
    ja: {
      name: "Vue Fes Japanクッション",
      description:
        "Vue Fes Japan のロゴを配置した、もちもち生地のビッグクッションです。\u000A※画像はイメージです",
    },
    en: {
      name: "Vue Fes Japan Cushion",
      description:
        "A big cushion with soft fabric featuring the Vue Fes Japan logo.\u000A* Image is for reference only",
    },
  },
];
