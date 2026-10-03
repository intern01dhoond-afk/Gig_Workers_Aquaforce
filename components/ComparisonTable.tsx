"use client";

import ScrollReveal from "./ScrollReveal";
import { useBulkEnquiry } from "@/context/BulkEnquiryContext";
import { ArrowRight } from "lucide-react";

interface RowItem {
  feature: string;
  retail: string | boolean;
  commercial: string | boolean;
  isPrice?: boolean;
}

const COMPARISON_ROWS: RowItem[] = [
  {
    feature: "AquaForce System",
    retail: true,
    commercial: true,
  },
  {
    feature: "Standard Accessories",
    retail: true,
    commercial: true,
  },
  {
    feature: "6 Additional Accessories",
    retail: false,
    commercial: true,
  },
  {
    feature: "Heavy-Duty Commercial Bag",
    retail: false,
    commercial: true,
  },
  {
    feature: "Commercial Configuration",
    retail: false,
    commercial: true,
  },
  {
    feature: "Dedicated B2B Service Channel",
    retail: false,
    commercial: true,
  },
  {
    feature: "Priority Support",
    retail: false,
    commercial: true,
  },
  {
    feature: "Commercial Spare-Part Support",
    retail: "Standard",
    commercial: "Enhanced",
  },
  {
    feature: "Business Deployment Support",
    retail: false,
    commercial: true,
  },
  {
    feature: "Price incl. GST",
    retail: "₹37,999",
    commercial: "₹45,334",
    isPrice: true,
  },
];

export default function ComparisonTable() {
  const { openBulkModal } = useBulkEnquiry();

  return (
    <section id="b2b-comparison" className="py-12 sm:py-16 lg:py-20 bg-white w-full">
      {/* Top Header */}
      <ScrollReveal direction="up" className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Eyebrow Pill Badge */}
        <div className="inline-flex items-center px-4 py-1 rounded-full border border-sky-600/50 font-open-sans text-[10px] sm:text-[11px] font-bold tracking-[0.16em] uppercase text-slate-900 bg-transparent mb-4">
          UNRESTRICTED UTILITY
        </div>

        {/* Heading & Subtitle */}
        <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-medium font-montserrat text-[#0F1729] tracking-tight leading-tight">
          What Makes Aquaforce® Different?
        </h2>
        <p className="text-slate-600 font-open-sans max-w-2xl mx-auto mt-3 text-sm sm:text-base leading-relaxed">
          See how the Aquaforce® 1400 stacks up against a conventional pressure washer across every critical dimension.
        </p>
      </ScrollReveal>

      {/* Comparison Table Card */}
      <ScrollReveal direction="up" delay={0.1} className="max-w-4xl mx-auto px-4 sm:px-6 mt-8 sm:mt-12">
        <div className="w-full overflow-x-auto rounded-xl sm:rounded-2xl border border-slate-300 shadow-[0_10px_30px_-5px_rgba(15,23,42,0.06),0_2px_6px_rgba(15,23,42,0.03)] bg-white">
          <table className="w-full min-w-[560px] sm:min-w-[660px] border-collapse font-open-sans text-left">
            <thead>
              <tr className="bg-[#111827] text-white font-montserrat text-xs sm:text-sm">
                <th className="py-3.5 sm:py-4 px-4 sm:px-6 font-bold tracking-wide w-[46%] text-left">
                  Feature
                </th>
                <th className="py-3.5 sm:py-4 px-3 sm:px-6 font-bold tracking-wide w-[27%] text-center border-l border-slate-700">
                  Retail
                </th>
                <th className="py-3.5 sm:py-4 px-3 sm:px-6 font-bold tracking-wide w-[27%] text-center border-l border-slate-700">
                  Commercial B2B
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row, idx) => {
                if (row.isPrice) {
                  return (
                    <tr
                      key={row.feature}
                      className="bg-slate-100 sm:bg-[#e9ecef] border-t-2 border-slate-300 font-montserrat font-bold text-slate-900"
                    >
                      <td className="py-4 sm:py-4.5 px-4 sm:px-6 text-xs sm:text-sm tracking-wide">
                        {row.feature}
                      </td>
                      <td className="py-4 sm:py-4.5 px-3 sm:px-6 text-center text-xs sm:text-sm tracking-wide border-l border-slate-300">
                        {row.retail}
                      </td>
                      <td className="py-4 sm:py-4.5 px-3 sm:px-6 text-center text-xs sm:text-sm tracking-wide border-l border-slate-300 text-[#0066cc]">
                        {row.commercial}
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr
                    key={row.feature}
                    className={`border-t border-slate-200/90 hover:bg-slate-50/70 transition-colors ${
                      idx % 2 === 1 ? "bg-slate-50/40" : "bg-white"
                    }`}
                  >
                    {/* Feature Name */}
                    <td className="py-3 sm:py-3.5 px-4 sm:px-6 text-xs sm:text-sm text-slate-800 font-medium leading-snug">
                      {row.feature}
                    </td>

                    {/* Retail Cell */}
                    <td className="py-3 sm:py-3.5 px-3 sm:px-6 text-center border-l border-slate-200/90 text-xs sm:text-sm">
                      {typeof row.retail === "boolean" ? (
                        row.retail ? (
                          <span className="font-bold text-slate-900 text-sm sm:text-base">✓</span>
                        ) : (
                          <span className="text-slate-400 font-medium text-sm sm:text-base">—</span>
                        )
                      ) : (
                        <span className="text-slate-700 font-medium text-xs sm:text-sm">{row.retail}</span>
                      )}
                    </td>

                    {/* Commercial B2B Cell */}
                    <td className="py-3 sm:py-3.5 px-3 sm:px-6 text-center border-l border-slate-200/90 text-xs sm:text-sm">
                      {typeof row.commercial === "boolean" ? (
                        row.commercial ? (
                          <span className="font-bold text-slate-900 text-sm sm:text-base">✓</span>
                        ) : (
                          <span className="text-slate-400 font-medium text-sm sm:text-base">—</span>
                        )
                      ) : (
                        <span className="text-[#0066cc] font-semibold text-xs sm:text-sm">{row.commercial}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Bottom Callout & Action Card */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-5 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-sky-50/80 via-blue-50/40 to-slate-50 border border-sky-200/80 text-slate-800 shadow-2xs">
          <div className="space-y-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold font-montserrat uppercase tracking-wider text-[#0066cc]">
              <span>JUST ₹7,335 MORE THAN RETAIL (₹45,334)</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 font-open-sans leading-relaxed max-w-xl">
              For an additional ₹7,335, the business receives a more complete professional package designed around commercial operations, accessories, mobility and after-sales support.
            </p>
          </div>
          <button
            type="button"
            onClick={openBulkModal}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0066cc] hover:bg-[#0052b3] text-white text-xs sm:text-sm font-bold font-montserrat tracking-wide uppercase shadow-md shadow-blue-600/20 transition-all active:scale-[0.98] cursor-pointer shrink-0"
          >
            <span>Enquire Bulk Quantity</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </ScrollReveal>
    </section>
  );
}
