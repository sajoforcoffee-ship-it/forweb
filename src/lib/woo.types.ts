export interface WooUrun {
  id: number;
  name: string;
  slug: string;
  permalink?: string;
  description: string;
  short_description: string;
  price: string;
  regular_price: string;
  sale_price: string;
  images: Array<{ src: string; alt: string }>;
  categories: Array<{ id: number; name: string; slug: string }>;
  attributes: Array<{ id: number; name: string; options: string[] }>;
  in_stock?: boolean;
  stock_status?: string;
  stock_quantity: number | null;
  related_ids: number[];
}

export interface WooKategori {
  id: number;
  name: string;
  slug: string;
  image?: { src: string };
  count: number;
}
