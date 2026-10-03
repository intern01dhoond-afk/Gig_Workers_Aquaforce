import { NextResponse } from "next/server";
// @ts-ignore
import icons from "payments-icons-library";
import {
  hasPromecPayLaterOffers,
  PROMEC_PAYLATER_OFFERS_METADATA,
  PromecOfferMeta,
  REAL_RAZORPAY_CASHBACK_OFFERS,
  calculateRealCardOffer,
} from "@/lib/razorpayOffers";

// Bank code to Payments Icons Library alias mapping
const BANK_ALIASES: Record<string, string> = {
  UTIB: "axis",
  HDFC: "hdfc",
  HDFC_DC: "hdfc",
  ICIC: "icici",
  ICIC_DC: "icici",
  SBIN: "sbi",
  SBIN_DC: "sbi",
  KKBK: "kotak",
  BARB: "bob",
  BARB_R: "bob",
  AMEX: "amex",
  YESB: "yes",
  IDFB: "idfc",
  INDB: "indusind",
  RATN: "rbl",
  FDRL: "federal",
  HSBC: "hsbc",
  SCBL: "scb",
  AUBL: "au",
  onecard: "onecard",
  AIRP: "airtel",
  CBIN: "cbi",
  CNRB: "canara",
  UBIN: "union",
  PUNB_R: "pnb",
  IBKL: "idbi",
  MAHB: "bom",
  IOBA: "iob",
  BKID: "boi",
  BKID_C: "boi",
  CSBK: "csb",
  DCBL: "dcb",
  DEUT: "deutsche",
  DLXB: "dhanlaxmi",
  ESFB: "equitas",
  FSFB: "fincare",
  IDIB: "indian",
  JAKA: "jk",
  JSFB: "jana",
  KARB: "karnataka",
  KVBL: "kvb",
  LAVB_R: "lvb",
  NSPB: "nsdl",
  ORBC: "obc",
  PSIB: "psb",
  SIBL: "sib",
  SRCB: "saraswat",
  SVCB: "svc",
  TMBL: "tmb",
  UCBA: "uco",
  UJVN: "ujjivan",
  UTBI: "ubi",
  VIJB: "vijaya",
  DBSS: "dbs",
  BAJAJ: "bajaj",
};

const BANK_NAMES: Record<string, string> = {
  UTIB: "AXIS Bank",
  HDFC: "HDFC Bank",
  HDFC_DC: "HDFC Bank Debit Card",
  ICIC: "ICICI Bank",
  ICIC_DC: "ICICI Bank Debit Card",
  SBIN: "State Bank of India",
  SBIN_DC: "State Bank of India Debit Card",
  KKBK: "Kotak Mahindra Bank",
  BARB: "Bank of Baroda",
  BARB_R: "Bank of Baroda",
  AMEX: "American Express Bank",
  YESB: "Yes Bank",
  IDFB: "IDFC First Bank",
  INDB: "Indus Ind Bank",
  RATN: "RBL Bank",
  FDRL: "Federal Bank",
  HSBC: "HSBC",
  SCBL: "Standard Chartered Bank",
  AUBL: "AU Small Finance Bank",
  onecard: "One Card",
  IBKL: "IDBI Bank",
  CNRB: "Canara Bank",
  DBSS: "DBS Bank",
  BAJAJ: "Bajaj Finserv",
};

export interface EmiPlan {
  months: number;
  interestRate: number;
  monthlyAmount: number;
  totalPayable: number;
  isNoCost: boolean;
  offerId?: string;
  discountAmount?: number;
}

export interface EmiBankItem {
  id: string;
  code: string;
  name: string;
  logo: string;
  type: "credit" | "debit" | "both" | "cardless";
  isNoCost: boolean;
  hasOffer: boolean;
  offerText: string;
  offerId?: string;
  minAmount: number;
  startingEmi: number;
  plans: EmiPlan[];
  cashbackAmount?: number;
  cashbackText?: string;
  cashbackOfferId?: string;
  interestSavedAmount?: number;
  totalSavingsAmount?: number;
  badgeText?: string;
}

export interface RazorpayOfferDisplayItem {
  id: string;
  name: string;
  displayName: string;
  bankCode: string;
  bankName: string;
  bankLogo: string;
  cardType: "credit" | "debit" | "cardless";
  tenures: number[];
  minAmount: number;
  maxAmount: number;
  monthlyAmountForCurrentPrice: number;
  interestRate: number;
  status: string;
  description: string;
  tnc: string;
  benefits: string[];
  cashbackAmount?: number;
  cashbackText?: string;
  cashbackOfferId?: string;
  interestSavedAmount?: number;
  totalSavingsAmount?: number;
  badgeText?: string;
  highlightText?: string;
}

export interface NetbankingBankItem {
  code: string;
  name: string;
  shortName: string;
  logo: string;
  isPopular: boolean;
}

// Master EMI banks list (19 Credit Cards + 4 Debit Cards + 1 Bajaj Finserv)
// Matches user reference images media_1790418313960.png and media_1790418307016.png
interface MasterEmiConfig {
  id: string;
  code: string;
  name: string;
  type: "credit" | "debit" | "both" | "cardless";
  isNoCost: boolean;
  hasOffer: boolean;
  offerText: string;
  minAmount: number;
  logo: string;
}

const MASTER_EMI_BANKS: MasterEmiConfig[] = [
  // 14 Real Credit Cards Enabled in Razorpay
  {
    id: "axis",
    code: "UTIB",
    name: "AXIS Bank",
    type: "credit",
    isNoCost: true,
    hasOffer: true,
    offerText: "5% Cashback (Up to ₹750)",
    minAmount: 5000,
    logo: "https://cashfreelogo.cashfree.com/assets_images/pg/nb/64/axis.png",
  },
  {
    id: "icic",
    code: "ICIC",
    name: "ICICI Bank",
    type: "credit",
    isNoCost: true,
    hasOffer: false,
    offerText: "",
    minAmount: 1500,
    logo: "https://cashfreelogo.cashfree.com/assets_images/pg/nb/64/icici.png",
  },
  {
    id: "amex",
    code: "AMEX",
    name: "American Express Bank",
    type: "credit",
    isNoCost: true,
    hasOffer: false,
    offerText: "",
    minAmount: 5000,
    logo: "https://cashfreelogo.cashfree.com/assets_images/pg/card/64/amex.png",
  },
  {
    id: "yesb",
    code: "YESB",
    name: "Yes Bank",
    type: "credit",
    isNoCost: true,
    hasOffer: true,
    offerText: "5% Cashback (Up to ₹1,500)",
    minAmount: 5000,
    logo: "https://cashfreelogo.cashfree.com/assets_images/pg/nb/64/yes.png",
  },
  {
    id: "hsbc",
    code: "HSBC",
    name: "HSBC",
    type: "credit",
    isNoCost: false,
    hasOffer: true,
    offerText: "5% Cashback (Up to ₹1,000)",
    minAmount: 5000,
    logo: "https://cashfreelogo.cashfree.com/assets_images/pg/nb/64/hsb.png",
  },
  {
    id: "scbl",
    code: "SCBL",
    name: "Standard Chartered Bank",
    type: "credit",
    isNoCost: true,
    hasOffer: false,
    offerText: "",
    minAmount: 2500,
    logo: "https://cashfreelogo.cashfree.com/assets_images/pg/nb/64/scb.png",
  },
  {
    id: "indb",
    code: "INDB",
    name: "Indus Ind Bank",
    type: "credit",
    isNoCost: true,
    hasOffer: false,
    offerText: "",
    minAmount: 2000,
    logo: "https://cashfreelogo.cashfree.com/assets_images/pg/nb/64/indusind.png",
  },
  {
    id: "barb",
    code: "BARB",
    name: "Bank of Baroda",
    type: "credit",
    isNoCost: true,
    hasOffer: false,
    offerText: "",
    minAmount: 2500,
    logo: "https://cashfreelogo.cashfree.com/assets_images/pg/nb/64/bobc.png",
  },
  {
    id: "fdrl",
    code: "FDRL",
    name: "Federal Bank",
    type: "credit",
    isNoCost: true,
    hasOffer: false,
    offerText: "",
    minAmount: 2500,
    logo: "https://cashfreelogo.cashfree.com/assets_images/pg/nb/64/federal.png",
  },
  {
    id: "onecard",
    code: "onecard",
    name: "One Card",
    type: "credit",
    isNoCost: false,
    hasOffer: false,
    offerText: "",
    minAmount: 2500,
    logo: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'><circle cx='32' cy='32' r='30' fill='black'/><text x='32' y='42' font-size='30' font-weight='900' font-family='Arial,sans-serif' fill='white' text-anchor='middle'>1</text></svg>",
  },
  {
    id: "aubl",
    code: "AUBL",
    name: "AU Small Finance Bank",
    type: "credit",
    isNoCost: true,
    hasOffer: false,
    offerText: "",
    minAmount: 2000,
    logo: "https://cashfreelogo.cashfree.com/assets_images/pg/nb/64/aus.png",
  },
  {
    id: "idfb",
    code: "IDFB",
    name: "IDFC First Bank",
    type: "credit",
    isNoCost: true,
    hasOffer: true,
    offerText: "3.5% Cashback (Up to ₹3,000)",
    minAmount: 5000,
    logo: "https://cashfreelogo.cashfree.com/assets_images/pg/nb/64/idfc.png",
  },
  {
    id: "kkbk",
    code: "KKBK",
    name: "Kotak Mahindra Bank",
    type: "credit",
    isNoCost: true,
    hasOffer: false,
    offerText: "",
    minAmount: 2500,
    logo: "https://cashfreelogo.cashfree.com/assets_images/pg/paylater/64/kotak.png",
  },
  {
    id: "ratn",
    code: "RATN",
    name: "RBL Bank",
    type: "credit",
    isNoCost: true,
    hasOffer: false,
    offerText: "",
    minAmount: 2000,
    logo: "https://cashfreelogo.cashfree.com/assets_images/pg/nb/64/rbl.png",
  },

  // 1 Real Debit Card Enabled in Razorpay (HDFC Bank Debit Card)
  {
    id: "hdfc_dc",
    code: "HDFC_DC",
    name: "HDFC Bank Debit Card",
    type: "debit",
    isNoCost: true,
    hasOffer: false,
    offerText: "",
    minAmount: 3000,
    logo: "https://cashfreelogo.cashfree.com/assets_images/pg/nb/64/hdfc.png",
  },
];

function getBankLogoUrl(code: string): string {
  const alias = BANK_ALIASES[code] || code.toLowerCase();
  try {
    const iconObj = icons && typeof icons.getIcon === "function" ? icons.getIcon(alias, "md") : null;
    if (iconObj && iconObj.icon_url && !iconObj.icon_url.includes("default.svg")) {
      return iconObj.icon_url;
    }
  } catch (e) {}

  if (code.toLowerCase() === "onecard") {
    return "https://getonecard.app/images/onecard-logo.svg";
  }

  return `https://cashfreelogo.cashfree.com/assets_images/pg/nb/64/${alias}.png`;
}

function calculateEmi(principal: number, annualRatePercent: number, months: number): number {
  if (annualRatePercent === 0 || !annualRatePercent) {
    return Math.round(principal / months);
  }
  const monthlyRate = annualRatePercent / 12 / 100;
  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);
  return Math.round(emi);
}

function generateDynamicPlans(
  bankCode: string,
  totalAmount: number,
  matchingOffer?: RazorpayOfferDisplayItem | PromecOfferMeta | null
): EmiPlan[] {
  const isDebit = bankCode.endsWith("_DC");
  const isHdfc = bankCode.startsWith("HDFC");
  const isIndus = bankCode === "INDB";
  const isBajaj = bankCode === "BAJAJ";

  const discount = isHdfc && isDebit ? Math.min(Math.round(totalAmount * 0.1), 2500) : 0;
  const principal = totalAmount - discount;

  const tenures = isBajaj
    ? [3, 6]
    : isHdfc && !isDebit
    ? [3, 6, 9, 12, 18, 24, 36, 48]
    : isIndus
    ? [3, 6, 9, 12, 18, 24, 36]
    : isDebit
    ? [3, 6, 9, 12, 18]
    : [3, 6, 9, 12, 18, 24];

  const offerTenures = new Set<number>(matchingOffer?.tenures || []);
  const isOfferEligibleForCart = Boolean(
    matchingOffer &&
    (!matchingOffer.minAmount || totalAmount >= matchingOffer.minAmount) &&
    (!matchingOffer.maxAmount || totalAmount <= matchingOffer.maxAmount)
  );

  const hasNoCostBenefit = Boolean(
    (matchingOffer && "benefits" in matchingOffer && (matchingOffer as any).benefits?.includes("NO_COST_EMI")) ||
    (matchingOffer && "benefitType" in matchingOffer && (matchingOffer as any).benefitType === "NO_COST_EMI")
  );

  return tenures.map((months) => {
    const isPlanNoCost = Boolean(
      isOfferEligibleForCart &&
      offerTenures.has(months) &&
      hasNoCostBenefit
    );

    if (isPlanNoCost) {
      const rate = 0;
      const monthlyAmount = Math.round(principal / months);
      const totalPayable = principal;
      return {
        months,
        interestRate: rate,
        monthlyAmount,
        totalPayable,
        isNoCost: true,
        offerId: matchingOffer?.id,
        discountAmount: Math.round(principal * 0.15 * (months / 12)),
      };
    } else {
      const rate = bankCode === "UTIB" ? 17 : bankCode === "onecard" ? 16 : bankCode === "KKBK" ? 16 : 15;
      const monthlyAmount = calculateEmi(principal, rate, months);
      const totalPayable = monthlyAmount * months;
      return {
        months,
        interestRate: rate,
        monthlyAmount,
        totalPayable,
        isNoCost: false,
      };
    }
  });
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const priceParam = searchParams.get("price");
    const totalPrice = priceParam ? Math.max(1, parseInt(priceParam, 10)) : 37999;

    const key_id = (
      process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || ""
    ).trim();
    const key_secret = (process.env.RAZORPAY_KEY_SECRET || "").trim();

    let rawMethods: any = {};
    let rawOffers: any[] = [];

    if (key_id) {
      try {
        const rzpRes = await fetch(`https://api.razorpay.com/v1/methods?key_id=${key_id}`, {
          next: { revalidate: 300 }, // 5 min Next.js caching
        });
        if (rzpRes.ok) {
          rawMethods = await rzpRes.json();
        }
      } catch (e) {
        console.warn("[Razorpay Methods API] Failed to fetch upstream methods, using fallback", e);
      }
    }

    // Fetch live active offers directly from Razorpay Offers API
    if (key_id && key_secret) {
      try {
        const authHeader = "Basic " + Buffer.from(`${key_id}:${key_secret}`).toString("base64");
        const offersRes = await fetch("https://api.razorpay.com/v1/offers?count=100", {
          headers: { Authorization: authHeader },
          next: { revalidate: 300 },
        });
        if (offersRes.ok) {
          const offersData = await offersRes.json();
          if (Array.isArray(offersData.items)) {
            rawOffers = offersData.items.filter((o: any) => o.status === "ACTIVE");
          }
        }
      } catch (offersErr) {
        console.warn("[Razorpay Methods API] Failed to fetch live offers from Razorpay:", offersErr);
      }
    }

    // Filter No Cost EMI offers from rawOffers (or use metadata fallback)
    const rawNoCostOffers = rawOffers.filter(
      (o: any) =>
        o.name?.toLowerCase().includes("promec") ||
        o.display_name?.toLowerCase().includes("promec") ||
        (Array.isArray(o.benefits_types) && o.benefits_types.includes("NO_COST_EMI"))
    );

    // Filter Live Cashback offers from rawOffers
    const rawCashbackOffers = rawOffers.filter(
      (o: any) => Array.isArray(o.benefits_types) && o.benefits_types.includes("CASHBACK")
    );

    // 1. Process Netbanking Banks
    const POPULAR_CANDIDATES = [
      "HDFC", "ICIC", "SBIN", "UTIB", "KKBK", 
      "BARB_R", "BARB", "INDB", "IDFB", "YESB", 
      "CNRB", "PUNB_R", "UBIN", "BKID", "RATN", "AUBL"
    ];
    
    const rawNb = rawMethods.netbanking || {};
    const availablePopularCodes = POPULAR_CANDIDATES.filter(code => rawNb[code]).slice(0, 6);

    let netbankingList: NetbankingBankItem[] = Object.entries(rawNb).map(
      ([code, name]) => {
        let shortName = String(name)
          .replace(" - Retail Banking", "")
          .replace(" - Corporate Banking", "")
          .replace(/ \(Erstwhile.*?\)/, "")
          .trim();

        if (code === "UTIB") shortName = "Axis Bank";
        if (code === "SBIN") shortName = "SBI";
        if (code === "ICIC") shortName = "ICICI Bank";
        if (code === "KKBK") shortName = "Kotak Bank";
        if (code === "BARB_R" || code === "BARB") shortName = "Bank of Baroda";
        if (code === "INDB") shortName = "IndusInd Bank";
        if (code === "IDFB") shortName = "IDFC FIRST Bank";
        if (code === "YESB") shortName = "Yes Bank";
        if (code === "CNRB") shortName = "Canara Bank";
        if (code === "PUNB_R") shortName = "PNB";
        if (code === "UBIN") shortName = "Union Bank";
        if (code === "BKID" || code === "BKID_C") shortName = "Bank of India";
        if (code === "RATN") shortName = "RBL Bank";
        if (code === "AUBL") shortName = "AU Bank";

        return {
          code,
          name: String(name),
          shortName,
          logo: getBankLogoUrl(code),
          isPopular: availablePopularCodes.includes(code),
        };
      }
    );

    if (netbankingList.length === 0) {
      // Default fallback netbanking list
      netbankingList = [
        { code: "SBIN", name: "State Bank of India", shortName: "SBI", logo: "https://cashfreelogo.cashfree.com/assets_images/pg/nb/64/sbi.png", isPopular: true },
        { code: "HDFC", name: "HDFC Bank", shortName: "HDFC Bank", logo: "https://cashfreelogo.cashfree.com/assets_images/pg/nb/64/hdfc.png", isPopular: true },
        { code: "ICIC", name: "ICICI Bank", shortName: "ICICI Bank", logo: "https://cashfreelogo.cashfree.com/assets_images/pg/nb/64/icici.png", isPopular: true },
        { code: "UTIB", name: "Axis Bank", shortName: "Axis Bank", logo: "https://cashfreelogo.cashfree.com/assets_images/pg/nb/64/axis.png", isPopular: true },
        { code: "KKBK", name: "Kotak Mahindra Bank", shortName: "Kotak Bank", logo: "https://cashfreelogo.cashfree.com/assets_images/pg/nb/64/kotak.png", isPopular: true },
        { code: "PUNB_R", name: "Punjab National Bank", shortName: "PNB", logo: "https://cashfreelogo.cashfree.com/assets_images/pg/nb/64/pnb.png", isPopular: true },
      ];
    } else {
      netbankingList.sort((a, b) => {
        if (a.isPopular && b.isPopular) {
          return availablePopularCodes.indexOf(a.code) - availablePopularCodes.indexOf(b.code);
        }
        if (a.isPopular) return -1;
        if (b.isPopular) return 1;
        return a.shortName.localeCompare(b.shortName);
      });
    }

    // 2. Process Offers: Strictly return ONLY the 5 real payment offers active on the merchant's Razorpay account
    // (Matches the exact "Save more with payment offers" widget on the user's other website)
    const displayOffers: RazorpayOfferDisplayItem[] = REAL_RAZORPAY_CASHBACK_OFFERS.map((meta) => {
      const liveMatch = rawOffers.find((ro: any) => ro.id === meta.id);
      const isEligible = totalPrice >= meta.minOrderRupees;
      const rawCashback = Math.round((totalPrice * meta.cashbackPercent) / 100);
      const effectiveCashback = isEligible ? Math.min(rawCashback, meta.maxBenefitRupees) : 0;
      const monthlyAmountForCurrentPrice = Math.round(totalPrice / 6);

      return {
        id: meta.id,
        name: liveMatch?.name || meta.title,
        displayName: meta.title,
        bankCode: meta.bankCode,
        bankName: meta.bankName,
        bankLogo: meta.logo,
        cardType: "credit",
        tenures: [3, 6, 9, 12, 18, 24],
        minAmount: meta.minOrderRupees,
        maxAmount: 1000000,
        monthlyAmountForCurrentPrice,
        interestRate: 15,
        status: liveMatch?.status || "ACTIVE",
        description: meta.description,
        tnc: meta.tnc,
        benefits: ["CASHBACK"],
        cashbackAmount: effectiveCashback,
        cashbackText: `${meta.cashbackPercent}% Cashback (Up to ₹${meta.maxBenefitRupees.toLocaleString("en-IN")})`,
        cashbackOfferId: meta.id,
        interestSavedAmount: 0,
        totalSavingsAmount: effectiveCashback,
        badgeText: `${meta.cashbackPercent}% CASHBACK`,
        highlightText: `${meta.cashbackPercent}% Cashback up to ₹${meta.maxBenefitRupees.toLocaleString("en-IN")}`,
      };
    });

    // 3. Process EMI Banks — only show banks actually enabled on Razorpay or covered by Promec India PayLater offers
    const emiPlans = rawMethods.emi_plans || {};
    const hasLiveEmiData = Object.keys(emiPlans).length > 0;
    const offerBankCodes = new Set(displayOffers.map((o) => o.bankCode).filter(Boolean));

    const eligibleBanks = hasLiveEmiData
      ? MASTER_EMI_BANKS.filter((cfg) => Boolean(emiPlans[cfg.code]))
      : MASTER_EMI_BANKS;

    const emiBanks: EmiBankItem[] = eligibleBanks.map((cfg) => {
      const livePlanObj = emiPlans[cfg.code];
      const matchingCashbackOffer = displayOffers.find((doff) => {
        if (cfg.type === "debit") {
          return doff.cardType === "debit" && (cfg.code === doff.bankCode || cfg.code.startsWith(doff.bankCode));
        }
        return doff.cardType === "credit" && (cfg.code === doff.bankCode || doff.bankCode === cfg.code);
      });

      const matchingNoCostMeta = PROMEC_PAYLATER_OFFERS_METADATA.find(
        (m) =>
          m.bankCode === cfg.code ||
          (cfg.type === "debit" && m.cardType === "debit" && (m.bankCode === "HDFC_DC" || cfg.code.includes("HDFC"))) ||
          (cfg.type === "credit" && m.cardType === "credit" && m.bankCode === cfg.code)
      );

      const offerTenures = new Set<number>(matchingNoCostMeta?.tenures || []);
      const isOfferEligibleForCart = Boolean(
        matchingNoCostMeta &&
        (!matchingNoCostMeta.minAmount || totalPrice >= matchingNoCostMeta.minAmount) &&
        (!matchingNoCostMeta.maxAmount || totalPrice <= matchingNoCostMeta.maxAmount)
      );

      let plans: EmiPlan[] = [];

      if (livePlanObj && livePlanObj.plans && Object.keys(livePlanObj.plans).length > 0) {
        plans = Object.entries<any>(livePlanObj.plans)
          .map(([durationStr, rawRate]) => {
            const months = parseInt(durationStr, 10);
            const liveRate = typeof rawRate === "number" ? rawRate : parseFloat(rawRate) || 15;
            const isPlanNoCost = Boolean(
              isOfferEligibleForCart &&
              offerTenures.has(months)
            );

            if (isPlanNoCost) {
              const interestRate = 0;
              const monthlyAmount = Math.round(totalPrice / months);
              const totalPayable = totalPrice;
              return {
                months,
                interestRate,
                monthlyAmount,
                totalPayable,
                isNoCost: true,
                offerId: matchingNoCostMeta?.id,
                discountAmount: Math.round(totalPrice * (liveRate / 100) * (months / 12)),
              };
            } else {
              const interestRate = liveRate;
              const monthlyAmount = calculateEmi(totalPrice, interestRate, months);
              const totalPayable = monthlyAmount * months;
              return {
                months,
                interestRate,
                monthlyAmount,
                totalPayable,
                isNoCost: false,
              };
            }
          })
          .sort((a, b) => a.months - b.months);
      } else {
        plans = generateDynamicPlans(cfg.code, totalPrice, matchingNoCostMeta);
      }

      const hasNoCostPlan = plans.some((p) => p.isNoCost);
      const isNoCost = Boolean(isOfferEligibleForCart && hasNoCostPlan) || cfg.isNoCost;

      // Calculate starting monthly EMI: 6-month plan or lowest monthly amount
      const plan6 = plans.find((p) => p.months === 6);
      const startingEmi = plan6 ? plan6.monthlyAmount : plans[0]?.monthlyAmount || Math.round(totalPrice / 6);

      const hasRealCashback = Boolean(matchingCashbackOffer && matchingCashbackOffer.cashbackAmount && matchingCashbackOffer.cashbackAmount > 0);

      return {
        id: cfg.id,
        code: cfg.code,
        name: cfg.name,
        logo: cfg.logo,
        type: cfg.type,
        isNoCost,
        hasOffer: hasRealCashback || cfg.hasOffer,
        offerText: matchingCashbackOffer?.cashbackText || cfg.offerText || "",
        offerId: matchingCashbackOffer?.id || matchingNoCostMeta?.id,
        minAmount: matchingNoCostMeta?.minAmount || cfg.minAmount,
        startingEmi,
        plans,
        cashbackAmount: matchingCashbackOffer?.cashbackAmount,
        cashbackText: matchingCashbackOffer?.cashbackText,
        cashbackOfferId: matchingCashbackOffer?.cashbackOfferId,
        interestSavedAmount: 0,
        totalSavingsAmount: matchingCashbackOffer?.cashbackAmount || 0,
        badgeText: matchingCashbackOffer?.badgeText || (isNoCost ? "NO COST EMI" : undefined),
      };
    });

    return NextResponse.json({
      success: true,
      totalPrice,
      netbanking: netbankingList,
      emi: emiBanks,
      offers: displayOffers,
      offersCount: displayOffers.length,
    });
  } catch (err: any) {
    console.error("[Razorpay Methods API] Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch Razorpay methods" },
      { status: 500 }
    );
  }
}
