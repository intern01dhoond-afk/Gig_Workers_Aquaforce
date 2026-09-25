"use client";

import { useState } from "react";
import { X, CheckCircle2, ShieldCheck, Zap, CreditCard, Sparkles, Building2, Smartphone } from "lucide-react";

interface EmiCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  price: number;
  onSelectEmiOption?: (method: string) => void;
}

export default function EmiCalculatorModal({
  isOpen,
  onClose,
  price = 44991,
  onSelectEmiOption,
}: EmiCalculatorModalProps) {
  const [activeTab, setActiveTab] = useState<"snapmint" | "credit" | "bajaj" | "debit">("snapmint");

  if (!isOpen) return null;

  // EMI Calculations for current price
  const emi3 = Math.round(price / 3);
  const emi6 = Math.round(price / 6);
  const emi9 = Math.round(price / 9);
  const emi12 = Math.round(price / 12);

  const handleSelectPlan = (method: string) => {
    if (onSelectEmiOption) {
      onSelectEmiOption(method);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-6 overflow-hidden overscroll-contain">
      {/* Dark Blur Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-[680px] max-h-[92vh] flex flex-col bg-white rounded-[24px] shadow-2xl border border-slate-100 z-10 overflow-hidden overscroll-contain animate-in zoom-in-95 fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 sm:py-5 border-b border-slate-100 bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-100 text-emerald-800 text-[10.5px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full font-montserrat">
                0% Interest
              </span>
              <span className="text-[11px] font-semibold text-slate-500 font-open-sans">
                No Hidden Charges
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold font-montserrat text-slate-900 mt-1">
              No-Cost EMI Options
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 bg-white hover:bg-slate-200 text-slate-500 hover:text-slate-900 rounded-full flex items-center justify-center transition-colors shadow-xs cursor-pointer"
            aria-label="Close modal"
          >
            <X size={17} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-5 no-scrollbar font-open-sans">
          {/* Price Snapshot Banner */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 shadow-md">
            <div>
              <p className="text-blue-200 text-xs font-medium">Order Value for AquaForce®</p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl sm:text-3xl font-black font-montserrat">
                  ₹{price.toLocaleString("en-IN")}
                </span>
                <span className="text-blue-300 line-through text-xs sm:text-sm">
                  ₹{(price + 13351).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-xs border border-white/20 px-3 py-1.5 rounded-xl text-right">
              <p className="text-[11px] text-blue-200 font-semibold uppercase tracking-wider">Starting From</p>
              <p className="text-lg sm:text-xl font-extrabold text-emerald-400 font-montserrat">
                ₹{emi6.toLocaleString("en-IN")}<span className="text-xs text-white/80 font-normal">/mo</span>
              </p>
            </div>
          </div>

          {/* Provider Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("snapmint")}
              className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                activeTab === "snapmint"
                  ? "border-[#0066cc] bg-blue-50/70 ring-1 ring-[#0066cc]"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <Smartphone size={16} className="text-[#0066cc]" />
                <span className="text-[9.5px] font-extrabold bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-montserrat">
                  POPULAR
                </span>
              </div>
              <span className="text-xs font-bold text-slate-900 mt-2 font-montserrat">Snapmint BNPL</span>
              <span className="text-[10px] text-slate-500 mt-0.5">No Credit Card</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("credit")}
              className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                activeTab === "credit"
                  ? "border-[#0066cc] bg-blue-50/70 ring-1 ring-[#0066cc]"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              <CreditCard size={16} className="text-[#0066cc]" />
              <span className="text-xs font-bold text-slate-900 mt-2 font-montserrat">Credit Cards</span>
              <span className="text-[10px] text-slate-500 mt-0.5">HDFC, ICICI, SBI &amp; More</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("bajaj")}
              className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                activeTab === "bajaj"
                  ? "border-[#0066cc] bg-blue-50/70 ring-1 ring-[#0066cc]"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              <Zap size={16} className="text-[#0066cc]" />
              <span className="text-xs font-bold text-slate-900 mt-2 font-montserrat">Bajaj Finserv</span>
              <span className="text-[10px] text-slate-500 mt-0.5">Insta EMI Card</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("debit")}
              className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                activeTab === "debit"
                  ? "border-[#0066cc] bg-blue-50/70 ring-1 ring-[#0066cc]"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              <Building2 size={16} className="text-[#0066cc]" />
              <span className="text-xs font-bold text-slate-900 mt-2 font-montserrat">Debit Card EMI</span>
              <span className="text-[10px] text-slate-500 mt-0.5">HDFC Bank Active</span>
            </button>
          </div>

          {/* Active Tab Panel */}
          {activeTab === "snapmint" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Feature Highlights */}
              <div className="bg-[#f0f9ff] border border-blue-200 rounded-xl p-3.5 text-xs text-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-[#0066cc] text-sm">
                  <Sparkles size={16} />
                  <span>Snapmint Cardless 0% Interest EMI</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11.5px]">
                  Split your payment into easy installments without needing a credit card. All you need is your mobile number and PAN/Aadhaar for instant 2-minute paperless approval.
                </p>
                <div className="flex flex-wrap gap-3 pt-1 text-[11px] font-semibold text-slate-700">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 size={13} className="text-emerald-600" /> ₹0 Down Payment
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 size={13} className="text-emerald-600" /> 0% Interest
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 size={13} className="text-emerald-600" /> Instant OTP Mandate
                  </span>
                </div>
              </div>

              {/* Plans Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3.5">Tenure</th>
                      <th className="py-2.5 px-3.5">Monthly EMI</th>
                      <th className="py-2.5 px-3.5">Interest</th>
                      <th className="py-2.5 px-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-open-sans">
                    <tr className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3.5 font-bold text-slate-900">
                        3 Months
                        <span className="block text-[10px] text-emerald-600 font-normal">No Cost EMI</span>
                      </td>
                      <td className="py-3 px-3.5 font-extrabold text-slate-900 text-sm">
                        ₹{emi3.toLocaleString("en-IN")}<span className="text-[10px] font-normal text-slate-500">/mo</span>
                      </td>
                      <td className="py-3 px-3.5 font-bold text-emerald-600">₹0 (0%)</td>
                      <td className="py-3 px-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => handleSelectPlan("SNAPMINT_EMI")}
                          className="bg-[#0066cc] hover:bg-[#0055b3] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-xs cursor-pointer"
                        >
                          Select
                        </button>
                      </td>
                    </tr>
                    <tr className="bg-blue-50/30 hover:bg-blue-50/60 transition-colors">
                      <td className="py-3 px-3.5 font-bold text-slate-900">
                        6 Months
                        <span className="block text-[10px] text-emerald-600 font-normal">Most Popular</span>
                      </td>
                      <td className="py-3 px-3.5 font-extrabold text-[#0066cc] text-sm">
                        ₹{emi6.toLocaleString("en-IN")}<span className="text-[10px] font-normal text-slate-500">/mo</span>
                      </td>
                      <td className="py-3 px-3.5 font-bold text-emerald-600">₹0 (0%)</td>
                      <td className="py-3 px-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => handleSelectPlan("SNAPMINT_EMI")}
                          className="bg-[#0066cc] hover:bg-[#0055b3] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-xs cursor-pointer"
                        >
                          Select
                        </button>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3.5 font-bold text-slate-900">
                        9 Months
                        <span className="block text-[10px] text-slate-400 font-normal">Standard EMI</span>
                      </td>
                      <td className="py-3 px-3.5 font-extrabold text-slate-900 text-sm">
                        ₹{emi9.toLocaleString("en-IN")}<span className="text-[10px] font-normal text-slate-500">/mo</span>
                      </td>
                      <td className="py-3 px-3.5 text-slate-600">Standard</td>
                      <td className="py-3 px-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => handleSelectPlan("SNAPMINT_EMI")}
                          className="bg-slate-800 hover:bg-slate-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-xs cursor-pointer"
                        >
                          Select
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "credit" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-xs text-slate-800">
                <div className="font-bold text-emerald-800 text-sm mb-1">
                  Supported Bank Credit Cards (No Cost EMI)
                </div>
                <p className="text-slate-600 text-[11.5px] leading-relaxed">
                  Available across <strong>HDFC Bank, ICICI Bank, SBI Card, Axis Bank, Kotak, American Express, IDFC First, Federal Bank</strong>, and more via Razorpay.
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3.5">Tenure</th>
                      <th className="py-2.5 px-3.5">Monthly EMI</th>
                      <th className="py-2.5 px-3.5">Total Interest</th>
                      <th className="py-2.5 px-3.5 text-right">Total Payable</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-3 px-3.5 font-bold text-slate-900">3 Months</td>
                      <td className="py-3 px-3.5 font-bold text-slate-900">₹{emi3.toLocaleString("en-IN")}/mo</td>
                      <td className="py-3 px-3.5 text-emerald-600 font-bold">₹0 (100% Discounted)</td>
                      <td className="py-3 px-3.5 text-right font-bold text-slate-900">₹{price.toLocaleString("en-IN")}</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3.5 font-bold text-slate-900">6 Months</td>
                      <td className="py-3 px-3.5 font-bold text-[#0066cc]">₹{emi6.toLocaleString("en-IN")}/mo</td>
                      <td className="py-3 px-3.5 text-emerald-600 font-bold">₹0 (100% Discounted)</td>
                      <td className="py-3 px-3.5 text-right font-bold text-slate-900">₹{price.toLocaleString("en-IN")}</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3.5 font-bold text-slate-900">9 Months</td>
                      <td className="py-3 px-3.5 font-bold text-slate-900">₹{emi9.toLocaleString("en-IN")}/mo</td>
                      <td className="py-3 px-3.5 text-slate-500">Bank Standard</td>
                      <td className="py-3 px-3.5 text-right text-slate-700 font-semibold">Standard</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3.5 font-bold text-slate-900">12 Months</td>
                      <td className="py-3 px-3.5 font-bold text-slate-900">₹{emi12.toLocaleString("en-IN")}/mo</td>
                      <td className="py-3 px-3.5 text-slate-500">Bank Standard</td>
                      <td className="py-3 px-3.5 text-right text-slate-700 font-semibold">Standard</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <button
                type="button"
                onClick={() => handleSelectPlan("BANK_EMI")}
                className="w-full bg-[#0066cc] hover:bg-[#0055b3] text-white font-bold py-3 rounded-xl shadow-sm text-xs uppercase tracking-wider font-montserrat cursor-pointer"
              >
                PAY WITH CREDIT CARD NO COST EMI
              </button>
            </div>
          )}

          {activeTab === "bajaj" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-slate-800">
                <div className="font-bold text-amber-900 text-sm mb-1">
                  Bajaj Finserv Insta EMI Card
                </div>
                <p className="text-slate-600 text-[11.5px] leading-relaxed">
                  Use your active 16-digit Bajaj Finserv Insta EMI card at checkout for instant zero-interest No Cost EMI with ₹0 down payment.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/50">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase">No Cost EMI</span>
                  <h4 className="text-sm font-bold text-slate-900 mt-0.5">3 Months Plan</h4>
                  <p className="text-base font-extrabold text-slate-900 mt-1 font-montserrat">
                    ₹{emi3.toLocaleString("en-IN")}<span className="text-xs font-normal text-slate-500">/month</span>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">₹0 Down Payment • 0% Interest</p>
                </div>

                <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/50">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase">Recommended</span>
                  <h4 className="text-sm font-bold text-slate-900 mt-0.5">6 Months Plan</h4>
                  <p className="text-base font-extrabold text-[#0066cc] mt-1 font-montserrat">
                    ₹{emi6.toLocaleString("en-IN")}<span className="text-xs font-normal text-slate-500">/month</span>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">₹0 Down Payment • 0% Interest</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSelectPlan("BANK_EMI")}
                className="w-full bg-[#0066cc] hover:bg-[#0055b3] text-white font-bold py-3 rounded-xl shadow-sm text-xs uppercase tracking-wider font-montserrat cursor-pointer"
              >
                PROCEED WITH BAJAJ / CARDLESS EMI
              </button>
            </div>
          )}

          {activeTab === "debit" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-3.5 text-xs text-slate-800">
                <div className="font-bold text-purple-900 text-sm mb-1">
                  Debit Card EMI (HDFC Bank &amp; Select Banks)
                </div>
                <p className="text-slate-600 text-[11.5px] leading-relaxed">
                  No credit card required. If you hold an active HDFC Bank debit card with pre-approved EMI eligibility, you can split your payment directly from your savings account.
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-3.5 text-xs text-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">3 Months Debit EMI</span>
                  <span className="font-bold text-slate-900">₹{emi3.toLocaleString("en-IN")}/mo</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">6 Months Debit EMI</span>
                  <span className="font-bold text-slate-900">₹{emi6.toLocaleString("en-IN")}/mo</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSelectPlan("BANK_EMI")}
                className="w-full bg-[#0066cc] hover:bg-[#0055b3] text-white font-bold py-3 rounded-xl shadow-sm text-xs uppercase tracking-wider font-montserrat cursor-pointer"
              >
                PROCEED WITH DEBIT CARD EMI
              </button>
            </div>
          )}

          {/* 3 Step Trust Guarantee Footer */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck size={14} className="text-emerald-600" /> 100% Secure Checkout
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 size={14} className="text-[#0066cc]" /> Instant Paperless Approval
            </span>
            <span className="flex items-center gap-1">
              <Zap size={14} className="text-amber-500" /> Express Shiprocket Dispatch
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
