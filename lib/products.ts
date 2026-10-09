export interface ProductVariant {
  id: "with-vacuum" | "without-vacuum";
  name: string;
  offerPriceInINR: number;
  mrpInINR: number;
}

export interface ProductColor {
  name: string;
  hex: string;
  inStock: boolean;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  variants: Record<string, ProductVariant>;
  colors: ProductColor[];
  defaultVariantId: string;
  shippingFeeInINR: number;
  handlingFeeInINR: number;
  codPolicy: {
    advancePercentage: number; // e.g. 10 for 10%
    codFeeInINR: number;
  };
}

export const CATALOG: Record<string, Product> = {
  "aquaforce-1400": {
    id: "aquaforce-1400",
    sku: "AMEC-AQUAFORCE-1400",
    name: "Cordless AquaForce® 1400 High-pressure Washer System (COMMERCIAL PRO KIT)",
    description:
      "The Aquaforce® 1400 is a powerful, battery-powered portable pressure washer. No cables, no power sockets, no fixed setup needed.",
    variants: {
      "with-vacuum": {
        id: "with-vacuum",
        name: "With Vacuum",
        offerPriceInINR: 44991,
        mrpInINR: 60799,
      },
      "without-vacuum": {
        id: "without-vacuum",
        name: "Without Vacuum",
        offerPriceInINR: 44991,
        mrpInINR: 60799,
      },
    },
    colors: [
      { name: "Yellow", hex: "#f5c518", inStock: true },
      { name: "Blue", hex: "#0066cc", inStock: false },
    ],
    defaultVariantId: "with-vacuum",
    shippingFeeInINR: 0,
    handlingFeeInINR: 0,
    codPolicy: {
      advancePercentage: 10,
      codFeeInINR: 0,
    },
  },
};

export function getProduct(productId: string = "aquaforce-1400"): Product | null {
  return CATALOG[productId] || null;
}
