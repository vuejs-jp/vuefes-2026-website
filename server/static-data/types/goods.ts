export interface GoodsLocaleFields {
  name: string;
  description: string;
}

export interface GoodsSpecsLocaleFields {
  color?: string;
  material?: string;
  size?: string;
}

export interface GoodsSpecsData {
  capacity?: string;
  size?: string;
  ja: GoodsSpecsLocaleFields;
  en: GoodsSpecsLocaleFields;
}

export interface GoodsData {
  id: string;
  src: string;
  price: number;
  specs: GoodsSpecsData;
  ja: GoodsLocaleFields;
  en: GoodsLocaleFields;
}

export interface Goods {
  id: string;
  src: string;
  name: string;
  price: number;
  description: string;
  specs: {
    color?: string;
    material?: string;
    capacity?: string;
    size?: string;
  };
}
