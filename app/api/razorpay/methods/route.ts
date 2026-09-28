import { NextResponse } from "next/server";
// @ts-ignore
import icons from "payments-icons-library";

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
  minAmount: number;
  startingEmi: number;
  plans: EmiPlan[];
}

export interface NetbankingBankItem {
  code: string;
  name: string;
  shortName: string;
  logo: string;
  isPopular: boolean;
}

// Master EMI banks list (19 Credit Cards + 4 Debit Cards + 1 Bajaj Finserv)
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
  // 19 Credit Cards
  {
    id: "axis",
    code: "UTIB",
    name: "AXIS Bank",
    type: "credit",
    isNoCost: true,
    hasOffer: false,
    offerText: "",
    minAmount: 2500,
    logo: "https://cashfreelogo.cashfree.com/assets_images/pg/nb/64/axis.png",
  },
  {
    id: "hdfc_cc",
    code: "HDFC",
    name: "HDFC Bank",
    type: "credit",
    isNoCost: true,
    hasOffer: true,
    offerText: "Instant Discount",
    minAmount: 3000,
    logo: "https://cashfreelogo.cashfree.com/assets_images/pg/nb/64/hdfc.png",
  },
  {
    id: "icic",
    code: "ICIC",
    name: "ICICI Bank",
    type: "credit",
    isNoCost: true,
    hasOffer: false,
    offerText: "",
    minAmount: 3000,
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
    id: "ibkl",
    code: "IBKL",
    name: "IDBI Bank",
    type: "credit",
    isNoCost: true,
    hasOffer: false,
    offerText: "",
    minAmount: 3000,
    logo: "https://cashfreelogo.cashfree.com/assets_images/pg/nb/64/idbi.png",
  },
  {
    id: "yesb",
    code: "YESB",
    name: "Yes Bank",
    type: "credit",
    isNoCost: true,
    hasOffer: false,
    offerText: "",
    minAmount: 3000,
    logo: "https://cashfreelogo.cashfree.com/assets_images/pg/nb/64/yes.png",
  },
  {
    id: "hsbc",
    code: "HSBC",
    name: "HSBC",
    type: "credit",
    isNoCost: true,
    hasOffer: false,
    offerText: "",
    minAmount: 3000,
    logo: "https://cashfreelogo.cashfree.com/assets_images/pg/nb/64/hsb.png",
  },
  {
    id: "cnrb",
    code: "CNRB",
    name: "Canara Bank",
    type: "credit",
    isNoCost: true,
    hasOffer: false,
    offerText: "",
    minAmount: 3000,
    logo: "https://cashfreelogo.cashfree.com/assets_images/pg/nb/64/canara.png",
  },
  {
    id: "scbl",
    code: "SCBL",
    name: "Standard Chartered Bank",
    type: "credit",
    isNoCost: true,
    hasOffer: false,
    offerText: "",
    minAmount: 3000,
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
    minAmount: 3000,
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
    minAmount: 3000,
    logo: "https://cashfreelogo.cashfree.com/assets_images/pg/nb/64/bobc.png",
  },
  {
    id: "dbss",
    code: "DBSS",
    name: "DBS Bank",
    type: "credit",
    isNoCost: true,
    hasOffer: false,
    offerText: "",
    minAmount: 3000,
    logo: "https://cashfreelogo.cashfree.com/assets_images/pg/nb/64/dbs.png",
  },
  {
    id: "fdrl",
    code: "FDRL",
    name: "Federal Bank",
    type: "credit",
    isNoCost: true,
    hasOffer: false,
    offerText: "",
    minAmount: 3000,
    logo: "https://cashfreelogo.cashfree.com/assets_images/pg/nb/64/federal.png",
  },
  {
    id: "onecard",
    code: "onecard",
    name: "One Card",
    type: "credit",
    isNoCost: true,
    hasOffer: false,
    offerText: "",
    minAmount: 2500,
    logo: "https://getonecard.app/images/onecard-logo.svg",
  },
  {
    id: "aubl",
    code: "AUBL",
    name: "AU Small Finance Bank",
    type: "credit",
    isNoCost: true,
    hasOffer: false,
    offerText: "",
    minAmount: 3000,
    logo: "https://cashfreelogo.cashfree.com/assets_images/pg/nb/64/aus.png",
  },
  {
    id: "idfb",
    code: "IDFB",
    name: "IDFC First Bank",
    type: "credit",
    isNoCost: true,
    hasOffer: false,
    offerText: "",
    minAmount: 3000,
    logo: "https://cashfreelogo.cashfree.com/assets_images/pg/nb/64/idfc.png",
  },
  {
    id: "sbin",
    code: "SBIN",
    name: "State Bank of India",
    type: "credit",
    isNoCost: true,
    hasOffer: false,
    offerText: "",
    minAmount: 3000,
    logo: "https://cashfreelogo.cashfree.com/assets_images/pg/nb/64/sbi.png",
  },
  {
    id: "kkbk",
    code: "KKBK",
    name: "Kotak Mahindra Bank",
    type: "credit",
    isNoCost: true,
    hasOffer: false,
    offerText: "",
    minAmount: 3000,
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
    minAmount: 3000,
    logo: "https://cashfreelogo.cashfree.com/assets_images/pg/nb/64/rbl.png",
  },

  // 4 Debit Cards
  {
    id: "hdfc_dc",
    code: "HDFC_DC",
    name: "HDFC Bank Debit Card",
    type: "debit",
    isNoCost: true,
    hasOffer: true,
    offerText: "Instant Discount",
    minAmount: 5000,
    logo: "https://cashfreelogo.cashfree.com/assets_images/pg/nb/64/hdfc.png",
  },
  {
    id: "icic_dc",
    code: "ICIC_DC",
    name: "ICICI Bank Debit Card",
    type: "debit",
    isNoCost: false,
    hasOffer: false,
    offerText: "",
    minAmount: 5000,
    logo: "https://cashfreelogo.cashfree.com/assets_images/pg/nb/64/icici.png",
  },
  {
    id: "axis_dc",
    code: "UTIB_DC",
    name: "Axis Bank Debit Card",
    type: "debit",
    isNoCost: false,
    hasOffer: false,
    offerText: "",
    minAmount: 5000,
    logo: "https://cashfreelogo.cashfree.com/assets_images/pg/nb/64/axis.png",
  },
  {
    id: "sbin_dc",
    code: "SBIN_DC",
    name: "State Bank of India Debit Card",
    type: "debit",
    isNoCost: false,
    hasOffer: false,
    offerText: "",
    minAmount: 5000,
    logo: "https://cashfreelogo.cashfree.com/assets_images/pg/nb/64/sbi.png",
  },

  // Bajaj Finserv
  {
    id: "bajaj",
    code: "BAJAJ",
    name: "Bajaj Finserv",
    type: "cardless",
    isNoCost: true,
    hasOffer: false,
    offerText: "",
    minAmount: 3000,
    logo: "https://cdn.razorpay.com/app/bajaj.png",
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

function generateDynamicPlans(bankCode: string, totalAmount: number): EmiPlan[] {
  const isHdfc = bankCode.startsWith("HDFC");
  const isIndus = bankCode === "INDB";
  const isBajaj = bankCode === "BAJAJ";

  const discount = isHdfc ? Math.min(Math.round(totalAmount * 0.1), 2500) : 0;
  const principal = totalAmount - discount;

  const tenures = isHdfc
    ? [3, 6, 9, 12, 18, 24, 36, 48]
    : isIndus
    ? [3, 6, 9, 12, 18, 24, 36]
    : isBajaj
    ? [3, 6]
    : [3, 6, 9, 12, 18, 24];

  return tenures.map((months) => {
    const isNoCost = isBajaj
      ? true
      : isHdfc
      ? months === 3 || months === 6 || months === 9 || months === 12
      : months === 3 || months === 6;

    const rate = isNoCost ? 0 : 16;
    const monthlyAmount = calculateEmi(principal, rate, months);
    const totalPayable = isNoCost ? principal : monthlyAmount * months;

    return {
      months,
      interestRate: rate,
      monthlyAmount,
      totalPayable,
      isNoCost,
    };
  });
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const priceParam = searchParams.get("price");
    const totalPrice = priceParam ? Math.max(1, parseInt(priceParam, 10)) : 44991;

    const key_id = (
      process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || ""
    ).trim();

    let rawMethods: any = {};
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

    // 2. Process EMI Banks — only show banks actually enabled on Razorpay
    const emiPlans = rawMethods.emi_plans || {};
    const hasLiveEmiData = Object.keys(emiPlans).length > 0;

    const eligibleBanks = hasLiveEmiData
      ? MASTER_EMI_BANKS.filter((cfg) => emiPlans[cfg.code])
      : MASTER_EMI_BANKS;

    const emiBanks: EmiBankItem[] = eligibleBanks.map((cfg) => {
      const livePlanObj = emiPlans[cfg.code];
      let plans: EmiPlan[] = [];

      if (livePlanObj && livePlanObj.plans && Object.keys(livePlanObj.plans).length > 0) {
        plans = Object.entries<any>(livePlanObj.plans)
          .map(([durationStr, interestRateVal]) => {
            const months = parseInt(durationStr, 10);
            const interestRate = typeof interestRateVal === "number" ? interestRateVal : parseFloat(interestRateVal);
            const monthlyAmount = calculateEmi(totalPrice, interestRate, months);
            const totalPayable = monthlyAmount * months;
            const isNoCost = cfg.isNoCost && (interestRate === 0 || months === 3 || months === 6 || cfg.code.startsWith("HDFC") || cfg.code === "BAJAJ");
            return {
              months,
              interestRate,
              monthlyAmount,
              totalPayable,
              isNoCost,
            };
          })
          .sort((a, b) => a.months - b.months);
      } else {
        plans = generateDynamicPlans(cfg.code, totalPrice);
      }

      const plan6 = plans.find((p) => p.months === 6);
      const startingEmi = plan6 ? plan6.monthlyAmount : plans[0]?.monthlyAmount || Math.round(totalPrice / 6);

      return {
        id: cfg.id,
        code: cfg.code,
        name: cfg.name,
        logo: cfg.logo,
        type: cfg.type,
        isNoCost: cfg.isNoCost,
        hasOffer: cfg.hasOffer,
        offerText: cfg.offerText,
        minAmount: cfg.minAmount,
        startingEmi,
        plans,
      };
    });

    return NextResponse.json({
      success: true,
      totalPrice,
      netbanking: netbankingList,
      emi: emiBanks,
    });
  } catch (err: any) {
    console.error("[Razorpay Methods API] Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch Razorpay methods" },
      { status: 500 }
    );
  }
}
