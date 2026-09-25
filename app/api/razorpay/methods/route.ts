import { NextResponse } from "next/server";
// @ts-ignore
import icons from "payments-icons-library";

// Bank code to Payments Icons Library alias mapping
const BANK_ALIASES: Record<string, string> = {
  UTIB: "axis",
  HDFC: "hdfc",
  HDFC_DC: "hdfc",
  ICIC: "icici",
  SBIN: "sbi",
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
};

const BANK_NAMES: Record<string, string> = {
  UTIB: "Axis Bank",
  HDFC: "HDFC Bank",
  HDFC_DC: "HDFC Bank (Debit Card)",
  ICIC: "ICICI Bank",
  SBIN: "State Bank of India (SBI)",
  KKBK: "Kotak Mahindra Bank",
  BARB: "Bank of Baroda",
  BARB_R: "Bank of Baroda",
  AMEX: "American Express",
  YESB: "Yes Bank",
  IDFB: "IDFC FIRST Bank",
  INDB: "IndusInd Bank",
  RATN: "RBL Bank",
  FDRL: "Federal Bank",
  HSBC: "HSBC Bank",
  SCBL: "Standard Chartered Bank",
  AUBL: "AU Small Finance Bank",
  onecard: "OneCard",
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
  type: "credit" | "debit" | "both";
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

  // Fallback to official Cashfree CDN image
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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const priceParam = searchParams.get("price");
    const totalPrice = priceParam ? Math.max(1, parseInt(priceParam, 10)) : 44991;

    const key_id = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    if (!key_id) {
      return NextResponse.json({ error: "Razorpay Key ID not configured" }, { status: 500 });
    }

    // Fetch live methods from Razorpay
    const rzpRes = await fetch(`https://api.razorpay.com/v1/methods?key_id=${key_id}`, {
      next: { revalidate: 300 }, // 5 min Next.js caching
    });

    if (!rzpRes.ok) {
      throw new Error(`Razorpay Methods API returned status ${rzpRes.status}`);
    }

    const rawMethods: any = await rzpRes.json();

    // 1. Process Netbanking Banks (Only enabled banks from user's account)
    const POPULAR_CANDIDATES = [
      "HDFC", "ICIC", "SBIN", "UTIB", "KKBK", 
      "BARB_R", "BARB", "INDB", "IDFB", "YESB", 
      "CNRB", "PUNB_R", "UBIN", "BKID", "RATN", "AUBL"
    ];
    
    // Find the top 6 available popular banks from candidates
    const availablePopularCodes = POPULAR_CANDIDATES.filter(code => rawMethods.netbanking && rawMethods.netbanking[code]).slice(0, 6);

    const netbankingList: NetbankingBankItem[] = Object.entries(rawMethods.netbanking || {}).map(
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

    // Sort: Popular banks first in candidate order, then alphabetically
    netbankingList.sort((a, b) => {
      if (a.isPopular && b.isPopular) {
        return availablePopularCodes.indexOf(a.code) - availablePopularCodes.indexOf(b.code);
      }
      if (a.isPopular) return -1;
      if (b.isPopular) return 1;
      return a.shortName.localeCompare(b.shortName);
    });

    // 2. Process EMI Banks & Live Plans (Only banks enabled in user's Razorpay account)
    const emiBanks: EmiBankItem[] = [];
    const emiPlans = rawMethods.emi_plans || {};
    const debitProviders = rawMethods.debit_emi_providers || {};

    for (const [code, planObj] of Object.entries<any>(emiPlans)) {
      const isDebit = code.endsWith("_DC");
      const baseCode = code.replace("_DC", "");
      const bankName =
        BANK_NAMES[code] ||
        BANK_NAMES[baseCode] ||
        rawMethods.netbanking?.[baseCode] ||
        code;
      const minAmountInr = (planObj.min_amount || 0) / 100;

      // Build live plans
      const plans: EmiPlan[] = Object.entries<any>(planObj.plans || {})
        .map(([durationStr, interestRateVal]) => {
          const months = parseInt(durationStr, 10);
          const interestRate = typeof interestRateVal === "number" ? interestRateVal : parseFloat(interestRateVal);
          const monthlyAmount = calculateEmi(totalPrice, interestRate, months);
          const totalPayable = monthlyAmount * months;
          return {
            months,
            interestRate,
            monthlyAmount,
            totalPayable,
            isNoCost: interestRate === 0 || code === "UTIB" || code === "HDFC" || code === "ICIC" || code === "AMEX",
          };
        })
        .sort((a, b) => a.months - b.months);

      // Starting monthly EMI (usually longest tenure plan e.g. 24 or 12 months)
      const startingEmi =
        plans.length > 0 ? plans[plans.length - 1].monthlyAmount : Math.round(totalPrice / 12);

      const hasNoCost =
        plans.some((p) => p.isNoCost) ||
        code === "UTIB" ||
        code === "HDFC" ||
        code === "ICIC" ||
        code === "AMEX";

      emiBanks.push({
        id: code.toLowerCase(),
        code,
        name: bankName,
        logo: getBankLogoUrl(baseCode),
        type: isDebit ? "debit" : debitProviders[code] === 1 ? "both" : "credit",
        isNoCost: hasNoCost,
        hasOffer: code === "HDFC" || code === "HDFC_DC",
        offerText: code === "HDFC" || code === "HDFC_DC" ? "10% Instant Discount" : "",
        minAmount: minAmountInr,
        startingEmi,
        plans,
      });
    }

    // Sort EMI banks by popularity
    const EMI_PRIORITY = ["hdfc", "icic", "utib", "amex", "kkbk", "idfb", "indb", "aubl", "barb", "fdrl", "hsbc", "onecard", "ratn", "scbl", "yesb"];
    emiBanks.sort((a, b) => {
      const aIdx = EMI_PRIORITY.indexOf(a.id);
      const bIdx = EMI_PRIORITY.indexOf(b.id);
      if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
      if (aIdx !== -1) return -1;
      if (bIdx !== -1) return 1;
      return a.name.localeCompare(b.name);
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
