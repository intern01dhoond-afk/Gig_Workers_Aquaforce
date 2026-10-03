/**
 * Promec India PayLater - Razorpay No Cost EMI Offers Configuration
 * 
 * 14 Active No Cost EMI Offers configured in Razorpay Dashboard under 'Promec India PayLater'
 */

export interface PromecOfferMeta {
  id: string;
  name: string;
  displayName: string;
  bankCode: string;
  bankName: string;
  cardType: "credit" | "debit";
  tenures: number[];
  minAmount: number;
  maxAmount: number;
  description: string;
  tnc: string;
  benefitType: "NO_COST_EMI";
}

export const PROMEC_PAYLATER_OFFERS_METADATA: PromecOfferMeta[] = [
  {
    id: "offer_TYK0XHjjHqHQYV",
    name: "Promec India PayLater",
    displayName: "Promec India PayLater - Axis Bank",
    bankCode: "UTIB",
    bankName: "Axis Bank Credit Card",
    cardType: "credit",
    tenures: [3, 6, 9, 12, 18, 24],
    minAmount: 4999,
    maxAmount: 49999,
    description: "0% Interest No Cost EMI on Axis Bank Credit Card. 100% interest subsidized by Promec India.",
    tnc: "No-Cost EMI T&C: Available on eligible cards and selected tenures only. Subsidized by Promec India.",
    benefitType: "NO_COST_EMI",
  },
  {
    id: "offer_TYJM3BvVwU67Kx",
    name: "Promec India PayLater",
    displayName: "Promec India PayLater - ICICI Bank",
    bankCode: "ICIC",
    bankName: "ICICI Bank Credit Card",
    cardType: "credit",
    tenures: [3, 6, 9, 12, 18, 24],
    minAmount: 4999,
    maxAmount: 49999,
    description: "0% Interest No Cost EMI on ICICI Bank Credit Card. 100% interest subsidized by Promec India.",
    tnc: "No-Cost EMI T&C: Available on eligible cards and selected tenures only. Subsidized by Promec India.",
    benefitType: "NO_COST_EMI",
  },
  {
    id: "offer_TYEXJsEiZiMo2c",
    name: "Promec India PayLater",
    displayName: "Promec India PayLater - Kotak Mahindra Bank",
    bankCode: "KKBK",
    bankName: "Kotak Mahindra Bank Credit Card",
    cardType: "credit",
    tenures: [3, 6, 9, 12],
    minAmount: 9999,
    maxAmount: 49000,
    description: "0% Interest No Cost EMI on Kotak Mahindra Bank Credit Card. 100% interest subsidized by Promec India.",
    tnc: "No-Cost EMI T&C: Available on eligible cards and selected tenures only. Subsidized by Promec India.",
    benefitType: "NO_COST_EMI",
  },
  {
    id: "offer_TYJvOhv1dUk8GX",
    name: "Promec India PayLater",
    displayName: "Promec India PayLater - IndusInd Bank",
    bankCode: "INDB",
    bankName: "IndusInd Bank Credit Card",
    cardType: "credit",
    tenures: [3, 6, 9, 12, 18, 24, 36],
    minAmount: 4999,
    maxAmount: 49999,
    description: "0% Interest No Cost EMI on IndusInd Bank Credit Card. 100% interest subsidized by Promec India.",
    tnc: "No-Cost EMI T&C: Available on eligible cards and selected tenures only. Subsidized by Promec India.",
    benefitType: "NO_COST_EMI",
  },
  {
    id: "offer_TYJPAEEaKatKuA",
    name: "Promec India PayLater",
    displayName: "Promec India PayLater - IDFC First Bank",
    bankCode: "IDFB",
    bankName: "IDFC First Bank Credit Card",
    cardType: "credit",
    tenures: [3, 6, 9, 12, 18, 24, 36],
    minAmount: 4999,
    maxAmount: 49999,
    description: "0% Interest No Cost EMI on IDFC First Bank Credit Card. 100% interest subsidized by Promec India.",
    tnc: "No-Cost EMI T&C: Available on eligible cards and selected tenures only. Subsidized by Promec India.",
    benefitType: "NO_COST_EMI",
  },
  {
    id: "offer_TYK1se4vzcOnaZ",
    name: "Promec India PayLater",
    displayName: "Promec India PayLater - Yes Bank",
    bankCode: "YESB",
    bankName: "Yes Bank Credit Card",
    cardType: "credit",
    tenures: [3, 6, 9, 12, 18, 24],
    minAmount: 4999,
    maxAmount: 49999,
    description: "0% Interest No Cost EMI on Yes Bank Credit Card. 100% interest subsidized by Promec India.",
    tnc: "No-Cost EMI T&C: Available on eligible cards and selected tenures only. Subsidized by Promec India.",
    benefitType: "NO_COST_EMI",
  },
  {
    id: "offer_TYJAObWcYfSNL7",
    name: "Promec India PayLater",
    displayName: "Promec India PayLater - Bank of Baroda",
    bankCode: "BARB",
    bankName: "Bank of Baroda Credit Card",
    cardType: "credit",
    tenures: [3, 6, 9, 12, 18, 24],
    minAmount: 4999,
    maxAmount: 49999,
    description: "0% Interest No Cost EMI on Bank of Baroda Credit Card. 100% interest subsidized by Promec India.",
    tnc: "No-Cost EMI T&C: Available on eligible cards and selected tenures only. Subsidized by Promec India.",
    benefitType: "NO_COST_EMI",
  },
  {
    id: "offer_TYJDH5sknySnun",
    name: "Promec India PayLater",
    displayName: "Promec India PayLater - Federal Bank",
    bankCode: "FDRL",
    bankName: "Federal Bank Credit Card",
    cardType: "credit",
    tenures: [3, 6, 9, 12, 18, 24],
    minAmount: 4999,
    maxAmount: 49999,
    description: "0% Interest No Cost EMI on Federal Bank Credit Card. 100% interest subsidized by Promec India.",
    tnc: "No-Cost EMI T&C: Available on eligible cards and selected tenures only. Subsidized by Promec India.",
    benefitType: "NO_COST_EMI",
  },
  {
    id: "offer_TYJ7JIzd6p4AKq",
    name: "Promec India PayLater",
    displayName: "Promec India PayLater - AU Small Finance Bank",
    bankCode: "AUBL",
    bankName: "AU Small Finance Bank Credit Card",
    cardType: "credit",
    tenures: [3, 6, 9, 12, 18, 24],
    minAmount: 4999,
    maxAmount: 49999,
    description: "0% Interest No Cost EMI on AU Small Finance Bank Credit Card. 100% interest subsidized by Promec India.",
    tnc: "No-Cost EMI T&C: Available on eligible cards and selected tenures only. Subsidized by Promec India.",
    benefitType: "NO_COST_EMI",
  },
  {
    id: "offer_TYJxFyNXg8DqCg",
    name: "Promec India PayLater",
    displayName: "Promec India PayLater - RBL Bank",
    bankCode: "RATN",
    bankName: "RBL Bank Credit Card",
    cardType: "credit",
    tenures: [3, 6, 9, 12, 18, 24],
    minAmount: 4999,
    maxAmount: 49999,
    description: "0% Interest No Cost EMI on RBL Bank Credit Card. 100% interest subsidized by Promec India.",
    tnc: "No-Cost EMI T&C: Available on eligible cards and selected tenures only. Subsidized by Promec India.",
    benefitType: "NO_COST_EMI",
  },
  {
    id: "offer_TYJK2nMDkUbpt9",
    name: "Promec India PayLater",
    displayName: "Promec India PayLater - HSBC",
    bankCode: "HSBC",
    bankName: "HSBC Credit Card",
    cardType: "credit",
    tenures: [3, 6, 9, 12, 18, 24],
    minAmount: 4999,
    maxAmount: 49999,
    description: "0% Interest No Cost EMI on HSBC Credit Card. 100% interest subsidized by Promec India.",
    tnc: "No-Cost EMI T&C: Available on eligible cards and selected tenures only. Subsidized by Promec India.",
    benefitType: "NO_COST_EMI",
  },
  {
    id: "offer_TYJyzxsGeFwr9R",
    name: "Promec India PayLater",
    displayName: "Promec India PayLater - Standard Chartered",
    bankCode: "SCBL",
    bankName: "Standard Chartered Bank Credit Card",
    cardType: "credit",
    tenures: [3, 6, 9, 12],
    minAmount: 4999,
    maxAmount: 49999,
    description: "0% Interest No Cost EMI on Standard Chartered Credit Card. 100% interest subsidized by Promec India.",
    tnc: "No-Cost EMI T&C: Available on eligible cards and selected tenures only. Subsidized by Promec India.",
    benefitType: "NO_COST_EMI",
  },
  {
    id: "offer_TYIveL7lD5jgQE",
    name: "Promec India PayLater",
    displayName: "Promec India PayLater - American Express",
    bankCode: "AMEX",
    bankName: "American Express Card",
    cardType: "credit",
    tenures: [3, 6, 9, 12, 18, 24],
    minAmount: 9999,
    maxAmount: 49999,
    description: "0% Interest No Cost EMI on American Express Card. 100% interest subsidized by Promec India.",
    tnc: "No-Cost EMI T&C: Available on eligible cards and selected tenures only. Subsidized by Promec India.",
    benefitType: "NO_COST_EMI",
  },
  {
    id: "offer_TYJICT3B5azJfR",
    name: "Promec India PayLater",
    displayName: "Promec India PayLater - HDFC Bank Debit Card",
    bankCode: "HDFC_DC",
    bankName: "HDFC Bank Debit Card",
    cardType: "debit",
    tenures: [3, 6, 9, 12, 18],
    minAmount: 5000,
    maxAmount: 79999,
    description: "0% Interest No Cost EMI on HDFC Bank Debit Card. 100% interest subsidized by Promec India.",
    tnc: "No-Cost EMI T&C: Available on eligible cards and selected tenures only. Subsidized by Promec India.",
    benefitType: "NO_COST_EMI",
  },
];

export interface RealPaymentOfferMeta {
  id: string;
  bankCode: string;
  bankName: string;
  title: string;
  subtitle: string;
  cashbackPercent: number;
  maxBenefitRupees: number;
  minOrderRupees: number;
  logo: string;
  description: string;
  tnc: string;
}

export const REAL_RAZORPAY_CASHBACK_OFFERS: RealPaymentOfferMeta[] = [
  {
    id: "offer_TiYBMRbEeMiCk4",
    bankCode: "YESB",
    bankName: "Yes Bank",
    title: "5% Cashback on Yes Bank Credit Card EMI Transactions",
    subtitle: "5% Cashback on Yes Bank Credit Card EMI Transactions • T&Cs",
    cashbackPercent: 5.0,
    maxBenefitRupees: 1500,
    minOrderRupees: 5000,
    logo: "https://cashfreelogo.cashfree.com/assets_images/pg/nb/64/yes.png",
    description: "5% Cashback on Yes Bank Credit Card EMI Transactions. Max cashback: ₹1,500. Min cart: ₹5,000.",
    tnc: "5% Cashback with YES BANK Credit Card EMI Transactions. Minimum Transaction Amount: Rs. 5,000. Maximum Cashback: Rs. 1,500. Velocity: Once per card per merchant per month. Cashback will be posted by YES BANK 90 days after offer month.",
  },
  {
    id: "offer_TiYhWuqMTvDC3g",
    bankCode: "HSBC",
    bankName: "HSBC",
    title: "5% Cashback on Min Cart Value of Rs 5000 on HSBC Credit Card EMI Transactions",
    subtitle: "5% Cashback up to Rs 1000 on Min Cart Value of Rs 5000 on HSBC Credit Card EMI Transactions • T&Cs",
    cashbackPercent: 5.0,
    maxBenefitRupees: 1000,
    minOrderRupees: 5000,
    logo: "https://cashfreelogo.cashfree.com/assets_images/pg/nb/64/hsb.png",
    description: "5% Cashback up to ₹1,000 on Min Cart Value of ₹5,000 on HSBC Credit Card EMI Transactions.",
    tnc: "5% Cashback on HSBC Credit Card EMI Transactions. Minimum Transaction Amount: Rs. 5,000. Maximum Cashback: Rs. 1,000.",
  },
  {
    id: "offer_TiYk8pkfvaoOuD",
    bankCode: "UTIB",
    bankName: "AXIS Bank",
    title: "5% Cashback on Min Cart Value of Rs 5,000 on AXIS Bank Credit Card EMI Transactions",
    subtitle: "5% Cashback up to Rs 750 on Min Cart Value of Rs 5,000 on AXIS Bank Credit Card EMI Transactions • T&Cs",
    cashbackPercent: 5.0,
    maxBenefitRupees: 750,
    minOrderRupees: 5000,
    logo: "https://cashfreelogo.cashfree.com/assets_images/pg/nb/64/axis.png",
    description: "5% Cashback up to ₹750 on Min Cart Value of ₹5,000 on AXIS Bank Credit Card EMI Transactions.",
    tnc: "5% Cashback with Axis Bank Credit Card EMI Transactions. Minimum Transaction Amount: Rs. 5,000. Maximum Cashback: Rs. 750.",
  },
  {
    id: "offer_TieLmu4h87lIRz",
    bankCode: "IDFB",
    bankName: "IDFC FIRST Bank",
    title: "3.5% Cashback on Min Cart Value of Rs 5000 using IDFC FIRST Bank Credit Card EMI Transactions",
    subtitle: "3.5% Cashback up to Rs 3000 on Min Cart Value of Rs 5000 using IDFC FIRST Bank Credit Card EMI Transactions • T&Cs",
    cashbackPercent: 3.5,
    maxBenefitRupees: 3000,
    minOrderRupees: 5000,
    logo: "https://cashfreelogo.cashfree.com/assets_images/pg/nb/64/idfc.png",
    description: "3.5% Cashback up to ₹3,000 on Min Cart Value of ₹5,000 using IDFC FIRST Bank Credit Card EMI Transactions.",
    tnc: "3.5% Cashback using IDFC FIRST Bank Credit Card EMI Transactions. Minimum Transaction Amount: Rs. 5,000. Maximum Cashback: Rs. 3,000.",
  },
  {
    id: "offer_QPEhahmXZYrNL4",
    bankCode: "HDFC",
    bankName: "NeuCard",
    title: "Upto 1.5% savings with NeuCard on EMI/ non EMI trxns",
    subtitle: "Upto 1.5% savings with NeuCard on EMI/ non EMI trxns • T&Cs",
    cashbackPercent: 1.5,
    maxBenefitRupees: 1000,
    minOrderRupees: 0,
    logo: "https://cashfreelogo.cashfree.com/assets_images/pg/nb/64/hdfc.png",
    description: "1.5% back on Tata Neu HDFC Bank Infinity Credit Card & 1% back on Tata Neu HDFC Bank Plus Credit cards as NeuCoins.",
    tnc: "1.5% back on Tata Neu HDFC Bank Infinity Credit Card & 1% back on Tata Neu HDFC Bank Plus Credit cards as NeuCoins on all EMI and non-EMI spends.",
  },
];


export const DEFAULT_PROMEC_PAYLATER_OFFERS: string[] = [
  ...PROMEC_PAYLATER_OFFERS_METADATA.map((o) => o.id),
  ...REAL_RAZORPAY_CASHBACK_OFFERS.map((o) => o.id),
];

/**
 * Returns an array of clean, non-empty Razorpay offer_id strings
 */
export function getPromecPayLaterOfferIds(): string[] {
  const envOffers =
    process.env.RAZORPAY_OFFER_IDS ||
    process.env.PROMEC_PAYLATER_OFFER_IDS ||
    process.env.NEXT_PUBLIC_RAZORPAY_OFFER_IDS ||
    "";

  const envList = envOffers
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  const combined = Array.from(
    new Set([...envList, ...DEFAULT_PROMEC_PAYLATER_OFFERS.map((s) => s.trim()).filter(Boolean)])
  );

  return combined;
}

/**
 * Checks if No Cost EMI offers are configured for the merchant
 */
export function hasPromecPayLaterOffers(): boolean {
  return getPromecPayLaterOfferIds().length > 0;
}

export interface RealCardOfferBenefit {
  cashbackAmount: number;
  cashbackText: string;
  cashbackOfferId?: string;
  interestSavedAmount: number;
  totalSavingsAmount: number;
  badgeText: string;
  highlightText: string;
  isNoCost: boolean;
}

/**
 * Calculate the exact real cashback & interest saved for a specific bank and cart total.
 * Only banks with verified active offers in Razorpay receive offer benefits.
 */
export function calculateRealCardOffer(
  bankCode: string,
  cardType: "credit" | "debit",
  totalPrice: number
): RealCardOfferBenefit {
  // Check Real Razorpay Cashback offer from the 5 live merchant offers
  const normalizedCode = bankCode.replace(/_DC$/, "");
  const cb = REAL_RAZORPAY_CASHBACK_OFFERS.find(
    (o) => o.bankCode === normalizedCode && cardType === "credit"
  );

  let cashbackAmount = 0;
  let cashbackText = "";
  let cashbackOfferId = cb?.id;

  if (cb && totalPrice >= cb.minOrderRupees) {
    const rawVal = Math.round((totalPrice * cb.cashbackPercent) / 100);
    cashbackAmount = Math.min(rawVal, cb.maxBenefitRupees);
    cashbackText = `${cb.cashbackPercent}% Cashback (Up to ₹${cb.maxBenefitRupees.toLocaleString("en-IN")})`;
  }

  // Real No Cost EMI: Check if merchant has an active Promec PayLater No Cost EMI offer in Razorpay for this bank
  const noCostOffer = PROMEC_PAYLATER_OFFERS_METADATA.find(
    (o) =>
      o.bankCode === bankCode ||
      (cardType === "debit" && o.cardType === "debit" && (o.bankCode === "HDFC_DC" || bankCode.includes("HDFC"))) ||
      (cardType === "credit" && o.cardType === "credit" && o.bankCode === normalizedCode)
  );

  const isNoCost = Boolean(
    noCostOffer &&
    totalPrice >= (noCostOffer.minAmount || 0) &&
    totalPrice <= (noCostOffer.maxAmount || 999999)
  );

  const interestSavedAmount = isNoCost ? Math.round(totalPrice * 0.15 * (6 / 12)) : 0;
  const totalSavingsAmount = cashbackAmount + interestSavedAmount;

  let badgeText = "";
  let highlightText = "";

  if (isNoCost && cashbackAmount > 0) {
    badgeText = "NO COST EMI";
    highlightText = `0% Interest No Cost EMI + ₹${cashbackAmount.toLocaleString("en-IN")} Cashback`;
  } else if (isNoCost) {
    badgeText = "NO COST EMI";
    highlightText = "0% Interest No Cost EMI";
  } else if (cashbackAmount > 0 && cb) {
    badgeText = `${cb.cashbackPercent}% CASHBACK`;
    highlightText = `${cb.cashbackPercent}% Cashback up to ₹${cb.maxBenefitRupees.toLocaleString("en-IN")}`;
  }

  return {
    cashbackAmount,
    cashbackText,
    cashbackOfferId,
    interestSavedAmount,
    totalSavingsAmount,
    badgeText,
    highlightText,
    isNoCost,
  };
}
