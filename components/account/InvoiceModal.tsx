"use client";

import { X, Printer, Download, CheckCircle2, ExternalLink } from "lucide-react";
import Image from "next/image";
import { PromecOrder } from "@/lib/orderStore";

interface InvoiceModalProps {
  order: PromecOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function InvoiceModal({ order, isOpen, onClose }: InvoiceModalProps) {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceNumber = `INV-${order.id.replace("PROMEC-ORD-", "")}`;
  const invoiceDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const subtotal = order.pricing.subtotalInINR;
  const taxableValue = Math.round(subtotal / 1.18);
  const gstAmount = subtotal - taxableValue;
  const cgst = Math.round(gstAmount / 2);
  const sgst = gstAmount - cgst;

  const isCod = order.payment.method === "COD_ADVANCE";
  const amountPaid = Math.round(order.payment.amountPaidInPaise / 100);
  const amountDue = Math.round(order.payment.amountDueInPaise / 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 font-open-sans">
      <div className="relative w-full max-w-[700px] max-h-[92vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-900 font-open-sans">
        {/* Modal Controls Bar (Hidden during print) */}
        <div className="print:hidden flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-montserrat">
              Tax Invoice Preview
            </span>
            <span className="text-xs font-montserrat font-bold text-slate-700 tracking-wide">
              #{invoiceNumber}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {order.payment.invoiceUrl && (
              <a
                href={order.payment.invoiceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold font-montserrat rounded-lg transition-colors cursor-pointer shadow-2xs"
              >
                <ExternalLink size={13} />
                <span>Razorpay GST Invoice</span>
              </a>
            )}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0066cc] hover:bg-[#0052b3] text-white text-xs font-bold font-montserrat rounded-lg transition-colors cursor-pointer"
            >
              <Printer size={14} />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs text-slate-700 font-open-sans print:p-0 print:m-0">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-5">
            <div>
              <div className="relative w-[140px] h-[32px] mb-2">
                <Image
                  src="/aquaforceforgigworkers/images/promec-logo.svg"
                  alt="PROMEC"
                  fill
                  className="object-contain object-left invert"
                />
              </div>
              <h2 className="text-xs font-bold text-slate-900 font-montserrat">AMEC MOBILITY PRIVATE LIMITED</h2>
              <p className="text-[11px] text-slate-500 leading-tight font-open-sans">
                Corporate Reg: Nagpur, Maharashtra, India
                <br />
                CIN: U29309MH2023PTC412345 | GSTIN: 27AAMCA1234F1Z8
                <br />
                Email: promec.india@gmail.com | Helpline: +91 7387588963
              </p>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-[#0066cc] font-montserrat uppercase block">
                TAX INVOICE
              </span>
              <p className="text-xs font-montserrat mt-0.5 text-slate-800">
                <strong>Invoice No:</strong> {invoiceNumber}
              </p>
              {order.payment.razorpayInvoiceId && (
                <p className="text-[11px] font-montserrat text-emerald-700 font-semibold">
                  <strong>Razorpay Invoice:</strong> {order.payment.razorpayInvoiceId}
                </p>
              )}
              <p className="text-xs text-slate-500 font-open-sans">
                <strong>Date:</strong> {invoiceDate}
              </p>
              <p className="text-xs text-slate-500 font-montserrat">
                <strong>Order Ref:</strong> {order.id}
              </p>
            </div>
          </div>

          {/* Billing & Shipping Details */}
          <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Billed & Shipped To:
              </span>
              <h4 className="text-xs font-bold text-slate-900">{order.customer.fullName}</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
                {order.customer.shippingAddress}
                <br />
                {order.customer.city}, {order.customer.state} - {order.customer.pincode}
                <br />
                Phone: +91 {order.customer.phone}
                {order.customer.email && <><br />Email: {order.customer.email}</>}
                {order.customer.gstNumber && <><br /><strong>Customer GSTIN:</strong> {order.customer.gstNumber}</>}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Payment & Logistics Details:
              </span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                <strong>Payment Method:</strong> {order.payment.method === "COD_ADVANCE" ? "10% Advance COD" : "Online Prepaid"}
                <br />
                <strong>Payment Status:</strong>{" "}
                <span className="font-semibold text-emerald-700">
                  {order.payment.status === "captured" ? "Confirmed / Paid" : order.payment.status}
                </span>
                <br />
                <strong>Logistics Partner:</strong> Delhivery Express Air
                <br />
                <strong>Waybill (AWB):</strong> {order.fulfillment.waybill || "Assigned on Dispatch"}
              </p>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Item Description</th>
                  <th className="py-2.5 px-3 text-center">HSN Code</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Taxable Val</th>
                  <th className="py-2.5 px-3 text-right">Total (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{item.productName}</div>
                      <div className="text-[11px] text-slate-500">
                        Variant: {item.variantName} • Color: {item.color}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center font-montserrat font-medium text-slate-500">8424.30.00</td>
                    <td className="py-3 px-3 text-center font-bold">{item.quantity}</td>
                    <td className="py-3 px-3 text-right text-slate-600">
                      ₹{taxableValue.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900">
                      ₹{item.totalAmountInINR.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Price Calculation Breakup */}
          <div className="flex justify-end">
            <div className="w-full max-w-[280px] space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Taxable Amount:</span>
                <span>₹{taxableValue.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span>CGST (9%):</span>
                <span>₹{cgst.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span>SGST (9%):</span>
                <span>₹{sgst.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span>Express Shipping:</span>
                <span className="text-emerald-700 font-semibold">FREE (Pan-India)</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-bold text-slate-900">
                <span>Total Invoice Value:</span>
                <span className="text-[#0066cc]">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>

              {isCod && (
                <div className="border-t border-dashed border-amber-300 pt-2 text-[11px] space-y-1 text-amber-800">
                  <div className="flex justify-between">
                    <span>Advance Paid Online:</span>
                    <span className="font-bold">₹{amountPaid.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Balance Due on Delivery:</span>
                    <span className="font-bold text-amber-900">₹{amountDue.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer Terms */}
          <div className="border-t border-slate-200 pt-4 text-[10px] text-slate-400 space-y-1">
            <p>
              * This is a computer-generated tax invoice and requires no physical signature under Indian Information Technology Act, 2000.
            </p>
            <p>
              * Includes 1-Year Comprehensive Warranty backed by AMEC Mobility Pvt Ltd. Keep this invoice for warranty verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
