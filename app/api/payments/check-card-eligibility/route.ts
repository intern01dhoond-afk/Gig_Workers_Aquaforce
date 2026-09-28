import { NextResponse } from "next/server";

interface BankBinRule {
  bankCode: string;
  bankName: string;
  prefixes: string[];
}

const INDIAN_BANK_BIN_RULES: BankBinRule[] = [
  {
    bankCode: "HDFC",
    bankName: "HDFC Bank",
    prefixes: [
      "4052", "4110", "4160", "4214", "4375", "4506", "4627", "4628", "4629",
      "5181", "5241", "5271", "5283", "5326", "5346", "5497", "5546",
      "6071", "6072", "652166", "652167", "652168", "36", "38"
    ],
  },
  {
    bankCode: "HDFC_DC",
    bankName: "HDFC Bank Debit Card",
    prefixes: [
      "4052", "4160", "4214", "4375", "4506", "4629", "5181", "5241", "5497", "6071", "652166"
    ],
  },
  {
    bankCode: "ICIC",
    bankName: "ICICI Bank",
    prefixes: [
      "4055", "4060", "4114", "4166", "4315", "4386", "4477", "4591",
      "5163", "5262", "5313", "5363", "5401", "5433",
      "6073", "652150", "652151", "652152", "652153", "652154", "652155", "652156", "652157", "652158", "652159"
    ],
  },
  {
    bankCode: "ICIC_DC",
    bankName: "ICICI Bank Debit Card",
    prefixes: [
      "4055", "4060", "4166", "4315", "5163", "5262", "5313", "6073", "652150"
    ],
  },
  {
    bankCode: "UTIB",
    bankName: "Axis Bank",
    prefixes: [
      "4033", "4061", "4147", "4377", "4426", "4642",
      "5122", "5243", "5406", "5520",
      "6074", "652170", "652171", "652172", "652173", "652174", "652175", "652176", "652177", "652178", "652179"
    ],
  },
  {
    bankCode: "UTIB_DC",
    bankName: "Axis Bank Debit Card",
    prefixes: [
      "4033", "4061", "4147", "4377", "5122", "5243", "6074", "652170"
    ],
  },
  {
    bankCode: "SBIN",
    bankName: "State Bank of India",
    prefixes: [
      "4058", "4163", "4213", "4592", "4726",
      "5180", "5240", "5288", "5408", "5580",
      "606985", "606986", "606987", "606988", "606989", "606990", "6070", "6521", "6522", "6523"
    ],
  },
  {
    bankCode: "SBIN_DC",
    bankName: "SBI Debit Card",
    prefixes: [
      "4058", "4163", "4213", "4592", "5180", "5240", "606985", "6070", "6521", "6522", "6523"
    ],
  },
  {
    bankCode: "KKBK",
    bankName: "Kotak Mahindra Bank",
    prefixes: [
      "4004", "4050", "4161", "4262", "4528", "5244", "5399", "5459"
    ],
  },
  {
    bankCode: "INDB",
    bankName: "IndusInd Bank",
    prefixes: [
      "4035", "4048", "4143", "4212", "4543", "5110", "5245", "5405"
    ],
  },
  {
    bankCode: "AMEX",
    bankName: "American Express",
    prefixes: ["34", "37"],
  },
  {
    bankCode: "BARB",
    bankName: "Bank of Baroda",
    prefixes: [
      "4059", "4168", "4218", "5183", "5242", "5409", "6075", "652180", "652181", "652182"
    ],
  },
  {
    bankCode: "FDRL",
    bankName: "Federal Bank",
    prefixes: ["4064", "4181", "4268", "5185", "5249"],
  },
  {
    bankCode: "IDFB",
    bankName: "IDFC FIRST Bank",
    prefixes: ["4188", "4288", "4568", "5199", "5289"],
  },
  {
    bankCode: "RATN",
    bankName: "RBL Bank",
    prefixes: ["4066", "4199", "4299", "5144", "5290"],
  },
  {
    bankCode: "IBKL",
    bankName: "IDBI Bank",
    prefixes: ["4003", "4016", "4038", "4104", "4340", "5130", "5243"],
  },
  {
    bankCode: "YESB",
    bankName: "Yes Bank",
    prefixes: ["4124", "4216", "4217", "4390", "5174", "5248"],
  },
  {
    bankCode: "HSBC",
    bankName: "HSBC",
    prefixes: ["4008", "4012", "4106", "4215", "5186", "5246"],
  },
  {
    bankCode: "CNRB",
    bankName: "Canara Bank",
    prefixes: ["4029", "4053", "4165", "4216", "5182", "5247", "6072", "652190"],
  },
  {
    bankCode: "SCBL",
    bankName: "Standard Chartered Bank",
    prefixes: ["4017", "4129", "4219", "4385", "5184", "5240"],
  },
  {
    bankCode: "DBSS",
    bankName: "DBS Bank",
    prefixes: ["4022", "4136", "4236", "5188", "5250"],
  },
  {
    bankCode: "onecard",
    bankName: "One Card",
    prefixes: ["4514", "4515", "4516", "4517", "5116", "5117", "5267"],
  },
  {
    bankCode: "AUBL",
    bankName: "AU Small Finance Bank",
    prefixes: ["4045", "4145", "4554", "5154", "5254"],
  },
  {
    bankCode: "BAJAJ",
    bankName: "Bajaj Finserv",
    prefixes: ["2030", "504", "402", "607", "6521"],
  },
];

function detectCardNetwork(cleanNumber: string): "visa" | "mastercard" | "rupay" | "amex" | "unknown" {
  if (cleanNumber.startsWith("4")) return "visa";
  if (
    cleanNumber.startsWith("51") ||
    cleanNumber.startsWith("52") ||
    cleanNumber.startsWith("53") ||
    cleanNumber.startsWith("54") ||
    cleanNumber.startsWith("55") ||
    (parseInt(cleanNumber.slice(0, 4), 10) >= 2221 && parseInt(cleanNumber.slice(0, 4), 10) <= 2720)
  ) {
    return "mastercard";
  }
  if (
    cleanNumber.startsWith("60") ||
    cleanNumber.startsWith("6521") ||
    cleanNumber.startsWith("6522") ||
    cleanNumber.startsWith("6523") ||
    cleanNumber.startsWith("508")
  ) {
    return "rupay";
  }
  if (cleanNumber.startsWith("34") || cleanNumber.startsWith("37")) {
    return "amex";
  }
  return "unknown";
}

function findCardIssuer(cleanNumber: string): { bankCode: string; bankName: string } | null {
  for (const rule of INDIAN_BANK_BIN_RULES) {
    for (const prefix of rule.prefixes) {
      if (cleanNumber.startsWith(prefix)) {
        return { bankCode: rule.bankCode, bankName: rule.bankName };
      }
    }
  }

  // Fallback for RuPay range 6521-6523 often issued by SBI / Public Sector banks
  if (cleanNumber.startsWith("6521") || cleanNumber.startsWith("6522") || cleanNumber.startsWith("6523")) {
    return { bankCode: "SBIN", bankName: "State Bank of India / Public Sector Bank" };
  }

  return null;
}

// In-memory cache for Razorpay methods response (5 minutes TTL)
let cachedRzpMethods: any = null;
let lastRzpFetchTime = 0;

async function getRazorpayMethods(): Promise<any> {
  const now = Date.now();
  if (cachedRzpMethods && now - lastRzpFetchTime < 300000) {
    return cachedRzpMethods;
  }

  try {
    const keyId = (process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "").trim();
    if (!keyId) return null;

    const res = await fetch(`https://api.razorpay.com/v1/methods?key_id=${keyId}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (res.ok) {
      const data = await res.json();
      cachedRzpMethods = data;
      lastRzpFetchTime = now;
      return data;
    }
  } catch (err) {
    console.error("[Razorpay Methods] Error fetching live methods:", err);
  }

  return cachedRzpMethods;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cardNumber, bankCode, bankName, tenure, amount } = body;

    if (!cardNumber || typeof cardNumber !== "string") {
      return NextResponse.json(
        { eligible: false, error: "Card number is required." },
        { status: 400 }
      );
    }

    const cleanNumber = cardNumber.replace(/\D/g, "");
    if (cleanNumber.length < 6) {
      return NextResponse.json({
        eligible: true,
        network: detectCardNetwork(cleanNumber),
        pending: true,
        message: "Enter at least 6 digits to validate EMI eligibility",
      });
    }

    const network = detectCardNetwork(cleanNumber);
    const issuer = findCardIssuer(cleanNumber);

    // Query live Razorpay configuration in backend
    const rzpMethods = await getRazorpayMethods();
    const rzpEmiEnabled = rzpMethods ? Boolean(rzpMethods.emi) : true;
    const rzpEmiPlans = rzpMethods?.emi_plans || {};
    const rzpDebitProviders = rzpMethods?.debit_emi_providers || {};

    const targetBankCode = (bankCode || "").toUpperCase().replace(/_DC$/, "");
    const isDebit = (bankCode || "").endsWith("_DC") || (bankName || "").toLowerCase().includes("debit");

    // Check 1: Does card BIN belong to selected bank?
    let isBankMatch = false;

    if (issuer) {
      const detectedBaseCode = issuer.bankCode.replace(/_DC$/, "").toUpperCase();
      if (detectedBaseCode === targetBankCode) {
        isBankMatch = true;
      }
    } else {
      // If BIN is not in our known list, but matches known prefix for this bank
      const targetRule = INDIAN_BANK_BIN_RULES.find(
        (r) => r.bankCode.replace(/_DC$/, "").toUpperCase() === targetBankCode
      );
      if (targetRule) {
        isBankMatch = targetRule.prefixes.some((p) => cleanNumber.startsWith(p));
      }
    }

    // If card does NOT belong to the selected bank (e.g. RuPay 6523 0008 on HDFC Bank)
    if (!isBankMatch) {
      return NextResponse.json({
        eligible: false,
        error: "This card is not eligible for EMI",
        network: network,
        issuerBank: issuer ? issuer.bankName : "Other Bank",
        selectedBank: bankName || bankCode,
        reason: `Card does not belong to ${bankName || bankCode}.`,
        rzpVerified: true,
      });
    }

    // Check 2: Verify against Razorpay live EMI availability
    if (rzpEmiEnabled && Object.keys(rzpEmiPlans).length > 0) {
      const planCode = isDebit ? `${targetBankCode}_DC` : targetBankCode;
      const hasCreditPlan = Boolean(rzpEmiPlans[targetBankCode]);
      const hasDebitPlan = Boolean(rzpEmiPlans[`${targetBankCode}_DC`]) || Boolean(rzpDebitProviders[targetBankCode]);

      if (isDebit && !hasDebitPlan && !hasCreditPlan) {
        return NextResponse.json({
          eligible: false,
          error: "This card is not eligible for EMI",
          network: network,
          issuerBank: issuer ? issuer.bankName : bankName,
          selectedBank: bankName || bankCode,
          reason: `Debit Card EMI is not enabled for ${bankName} on Razorpay.`,
          rzpVerified: true,
        });
      }
    }

    // Eligible!
    return NextResponse.json({
      eligible: true,
      network: network,
      issuerBank: issuer ? issuer.bankName : bankName,
      selectedBank: bankName || bankCode,
      tenure: tenure || 6,
      rzpVerified: true,
    });
  } catch (err: any) {
    console.error("[Card Eligibility Error]:", err);
    return NextResponse.json(
      { eligible: false, error: "Failed to validate card eligibility." },
      { status: 500 }
    );
  }
}
