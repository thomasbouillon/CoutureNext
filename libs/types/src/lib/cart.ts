export type Cart = {
  userId: string;
  items: CartItem[];
  totalTaxExcluded: number;
  totalTaxIncluded: number;
  totalWeight: number;
  taxes: Record<string, number>;
  paymentId?: string;
  draftOrderId?: string;
};

export type CartItemBase = {
  articleId: string;
  description: string;
  skuId: string;
  customizations: Record<string, unknown>;
  image: {
    url: string;
    uid: string;
    placeholderDataUrl?: string;
  };
  totalTaxExcluded: number;
  totalTaxIncluded: number;
  weight: number;
  taxes: Record<string, number>;
};

export type CartItemCustomized = CartItemBase & {
  type: 'customized';
};

export type CartItemInStock = CartItemBase & {
  type: 'inStock';
};

export type CartItem = CartItemInStock | CartItemCustomized;

export type NewCustomizedCartItem = {
  articleId: string;
  skuId: string;
  customizations: Record<string, unknown>;
  imageDataUrl: string;
};

export type NewInStockCartItem = {
  articleId: string;
  stockUid: string;
  customizations: Record<string, unknown>;
  imageDataUrl?: string;
};
