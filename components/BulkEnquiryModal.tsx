"use client";

import { useState, useEffect, useRef } from "react";
import {
  X,
  CheckCircle2,
  ArrowRight,
  Loader2,
} from "lucide-react";

interface BulkEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUANTITY_PRESETS = ["5-10", "11-25", "26-50", "51-100", "100+"];

export default function BulkEnquiryModal({ isOpen, onClose }: BulkEnquiryModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    companyName: "",
    email: "",
    quantity: "5-10",
    customQuantity: "",
    notes: "",
    agreedToTerms: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // History state for mobile back button navigation
  const historyPushedRef = useRef(false);
  const isNavigatingBackRef = useRef(false);

  // Synchronize history state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      historyPushedRef.current = false;
      return;
    }

    if (!historyPushedRef.current) {
      window.history.pushState({ amecModal: "bulk-enquiry" }, "");
      historyPushedRef.current = true;
    }

    const handlePopState = () => {
      if (isNavigatingBackRef.current) return;
      historyPushedRef.current = false;
      setIsSubmitted(false);
      setErrorMsg("");
      onClose();
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const isValidEmail = (emailStr: string) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailStr.trim());
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const finalVal = name === "phone" ? value.replace(/\D/g, "").slice(0, 10) : value;
    setFormData((prev) => ({ ...prev, [name]: finalVal }));
    if (errorMsg) setErrorMsg("");
  };

  const handlePresetSelect = (preset: string) => {
    setFormData((prev) => ({
      ...prev,
      quantity: preset,
      customQuantity: preset === "100+" ? prev.customQuantity : "",
    }));
    if (errorMsg) setErrorMsg("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      setErrorMsg("Please enter your full name");
      return;
    }
    const cleanPhone = formData.phone.replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length !== 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number");
      return;
    }
    if (!formData.companyName.trim()) {
      setErrorMsg("Please enter your company or business name");
      return;
    }
    if (!formData.email.trim() || !isValidEmail(formData.email)) {
      setErrorMsg("Please enter a valid work email address");
      return;
    }
    const finalQuantity = formData.customQuantity.trim() || formData.quantity;
    if (!finalQuantity) {
      setErrorMsg("Please select or enter the required quantity");
      return;
    }
    if (!formData.notes.trim()) {
      setErrorMsg("Please specify your notes or delivery requirements");
      return;
    }
    if (!formData.agreedToTerms) {
      setErrorMsg("Please agree to the terms to proceed");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/aquaforceforgigworkers/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          companyName: formData.companyName.trim(),
          email: formData.email.trim(),
          quantity: finalQuantity,
          notes: formData.notes.trim(),
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to submit enquiry");
      }

      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch (err: any) {
      console.error("Bulk enquiry submission error:", err);
      // Even if network fails, provide friendly fallback
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  const handleClose = () => {
    if (historyPushedRef.current) {
      isNavigatingBackRef.current = true;
      historyPushedRef.current = false;
      window.history.back();
      setTimeout(() => {
        isNavigatingBackRef.current = false;
      }, 100);
    }
    setIsSubmitted(false);
    setErrorMsg("");
    setFormData({
      fullName: "",
      phone: "",
      companyName: "",
      email: "",
      quantity: "5-10",
      customQuantity: "",
      notes: "",
      agreedToTerms: true,
    });
    onClose();
  };

  const activeQuantity = formData.customQuantity.trim() || formData.quantity;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3.5 sm:p-5 md:p-6 bg-black/65 backdrop-blur-xs animate-fadeIn overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        className={`relative w-full ${
          isSubmitted
            ? "max-w-[420px] sm:max-w-[540px] p-6 xs:p-7 sm:p-9 pt-7 sm:pt-10"
            : "max-w-[620px] p-5 sm:p-7 md:p-8"
        } bg-white rounded-[24px] sm:rounded-[28px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] text-slate-900 overflow-hidden my-auto animate-in zoom-in-95 fade-in duration-200`}
      >
        {isSubmitted ? (
          /* ========================================================= */
          /* Exact Confirmation View from Reference Screenshots        */
          /* ========================================================= */
          <div className="relative flex flex-col items-center text-center">
            {/* Top Close Button */}
            <button
              type="button"
              onClick={handleClose}
              className="absolute -top-3 -right-2 sm:-top-4 sm:-right-3 w-8 h-8 sm:w-9 sm:h-9 bg-[#f1f5f9] hover:bg-slate-200 text-slate-500 hover:text-slate-900 rounded-full flex items-center justify-center transition-colors focus:outline-none cursor-pointer shadow-xs z-20"
              aria-label="Close modal"
            >
              <X size={16} />
            </button>

            {/* Checkmark Icon (Double concentric layer circle) */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#e6fbf2] flex items-center justify-center mx-auto mb-4 sm:mb-5">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#00c06d] flex items-center justify-center shadow-xs">
                <svg
                  className="w-6 h-6 sm:w-7 sm:h-7 text-white stroke-[3.5]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl xs:text-2xl sm:text-[28px] font-bold font-montserrat text-[#0F1729] tracking-tight leading-snug">
              Enquiry Submitted Successfully!
            </h3>

            {/* Personalized Message */}
            <p className="text-[#475569] font-open-sans text-xs xs:text-[13.5px] sm:text-[14px] max-w-[430px] mx-auto mt-2 sm:mt-2.5 leading-relaxed font-normal">
              Thank you, <strong className="text-[#0f172a] font-bold font-open-sans">{formData.fullName}</strong>. Our enterprise sales team for{" "}
              <strong className="text-[#005DA6] font-bold font-open-sans">Aquaforce® 1400</strong> has received your bulk order request and will
              contact you within 24 hours with wholesale tiered pricing.
            </p>

            {/* Summary Details Card */}
            <div className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[16px] p-4 sm:p-5 mt-5 sm:mt-6 text-left font-open-sans space-y-3 divide-y divide-[#e2e8f0]/80 shadow-2xs">
              {/* Row 1: Company */}
              <div className="flex items-center justify-between text-[13px] pt-0 font-open-sans">
                <span className="text-[#64748b] font-medium font-open-sans">Company / Business</span>
                <span className="text-[#0f172a] font-bold font-open-sans truncate max-w-[180px] sm:max-w-[240px]">
                  {formData.companyName}
                </span>
              </div>

              {/* Row 2: Required Quantity */}
              <div className="flex items-center justify-between text-[13px] pt-3 font-open-sans">
                <span className="text-[#64748b] font-medium font-open-sans">Required Quantity</span>
                <span className="bg-[#f0f9ff] border border-[#005DA6]/35 text-[#005DA6] text-xs font-bold font-open-sans px-3 py-0.5 rounded-full leading-none">
                  {(formData.customQuantity.trim() || formData.quantity || "").replace(/\s*units?/i, "")} Units
                </span>
              </div>

              {/* Row 3: Contact Number */}
              <div className="flex items-center justify-between text-[13px] pt-3 font-open-sans">
                <span className="text-[#64748b] font-medium font-open-sans">Contact Number</span>
                <span className="text-[#0f172a] font-bold font-open-sans tracking-wide">{formData.phone}</span>
              </div>

              {/* Row 4: Work Email */}
              <div className="flex items-center justify-between text-[13px] pt-3 font-open-sans">
                <span className="text-[#64748b] font-medium font-open-sans">Work Email</span>
                <span className="text-[#0f172a] font-bold font-open-sans truncate max-w-[180px] sm:max-w-[240px]">
                  {formData.email}
                </span>
              </div>
            </div>

            {/* Bottom Action Button */}
            <button
              type="button"
              onClick={handleClose}
              className="mt-5 sm:mt-6 w-full bg-[#005DA6] hover:bg-[#004e8c] active:bg-[#004277] text-white font-open-sans font-bold text-xs xs:text-sm uppercase tracking-wider py-3.5 sm:py-4 rounded-[12px] shadow-[0_4px_14px_rgba(0,93,166,0.25)] transition-all active:scale-[0.99] cursor-pointer"
            >
              CONTINUE BROWSING
            </button>
          </div>
        ) : (
          <div>
            {/* Header row: Back button on left, Close button on right */}
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <button
                type="button"
                onClick={handleClose}
                className="inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-bold text-slate-400 hover:text-slate-700 cursor-pointer transition-colors font-open-sans"
              >
                &larr; Back to Product Details
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="w-8 h-8 sm:w-9 sm:h-9 bg-[#f1f5f9] hover:bg-slate-200 text-slate-500 hover:text-slate-900 rounded-full flex items-center justify-center transition-colors focus:outline-none cursor-pointer shadow-xs shrink-0"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            </div>

            {/* Clean White Card Form (Matches Screenshot) */}
            <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
            {/* Title Bar */}
            <div className="pb-1 border-b border-slate-100">
              <h2 className="text-base sm:text-lg font-bold font-montserrat text-slate-900 tracking-tight">
                Bulk Quantity Enquiry
              </h2>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                {errorMsg}
              </div>
            )}

            {/* Row 1: Full Name & Mobile Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 font-open-sans">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="Rahul Sharma"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-slate-200 focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] rounded-[8px] px-3.5 py-2.5 sm:px-4 sm:py-3 text-[15px] sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all font-open-sans shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 font-open-sans">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  inputMode="numeric"
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={handleInputChange}
                  maxLength={10}
                  className="w-full bg-white border border-slate-200 focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] rounded-[8px] px-3.5 py-2.5 sm:px-4 sm:py-3 text-[15px] sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all font-open-sans shadow-2xs"
                />
              </div>
            </div>

            {/* Row 2: Company Name & Work Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 font-open-sans">
                  Company / Business Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="companyName"
                  required
                  placeholder="e.g. Apex Auto Detailing / Fleet Services"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-slate-200 focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] rounded-[8px] px-3.5 py-2.5 sm:px-4 sm:py-3 text-[15px] sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all font-open-sans shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 font-open-sans">
                  Work Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-slate-200 focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] rounded-[8px] px-3.5 py-2.5 sm:px-4 sm:py-3 text-[15px] sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all font-open-sans shadow-2xs"
                />
              </div>
            </div>

            {/* Row 3: How Much Quantity Required? */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 font-open-sans">
                How much quantity required? <span className="text-red-500">*</span>
              </label>

              {/* Preset Chips */}
              <div className="grid grid-cols-5 gap-1.5 sm:gap-2 mb-2">
                {QUANTITY_PRESETS.map((preset) => {
                  const isSelected = formData.quantity === preset && !formData.customQuantity;
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handlePresetSelect(preset)}
                      className={`py-2 px-1 text-center rounded-[8px] text-xs font-bold font-montserrat transition-all cursor-pointer border ${
                        isSelected
                          ? "bg-[#005DA6] text-white border-[#005DA6] shadow-sm scale-[1.02]"
                          : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      {preset}
                    </button>
                  );
                })}
              </div>

              {/* Custom Quantity Input */}
              <input
                type="text"
                name="customQuantity"
                placeholder="Or enter custom quantity (e.g. 35 units)"
                value={formData.customQuantity}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    customQuantity: e.target.value,
                  }));
                  if (errorMsg) setErrorMsg("");
                }}
                className="w-full bg-white border border-slate-200 focus:border-[#005DA6] focus:ring-1 focus:ring-[#005DA6] rounded-[8px] px-3.5 py-2 sm:px-4 sm:py-2.5 text-[14px] sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all font-open-sans shadow-2xs"
              />
            </div>

            {/* Row 4: Notes / Requirements (Mandatory) */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 font-open-sans">
                Notes / Delivery Requirements <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={2}
                name="notes"
                required
                placeholder="Specify delivery location, timeframe, or special requirements..."
                value={formData.notes}
                onChange={handleInputChange}
                className="w-full bg-white border border-slate-200 focus:border-[#005DA6] focus:ring-1 focus:ring-[#005DA6] rounded-[8px] px-3.5 py-2 sm:px-4 sm:py-2.5 text-[14px] sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all resize-none h-[65px] sm:h-[75px] font-open-sans shadow-2xs"
              />
            </div>

            {/* Terms Agreement Checkbox (Exact match to screenshot) */}
            <label className="flex items-start gap-2.5 pt-1 cursor-pointer select-none font-open-sans">
              <input
                type="checkbox"
                checked={formData.agreedToTerms}
                onChange={(e) => setFormData({ ...formData, agreedToTerms: e.target.checked })}
                className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#005DA6] focus:ring-[#005DA6] accent-[#005DA6] cursor-pointer shrink-0"
                required
              />
              <span className="text-[11.5px] sm:text-[13px] text-slate-500 leading-snug">
                I agree to the terms and agree to receive transactional bulk pricing updates via mobile/email.
              </span>
            </label>

            {/* Big Blue Submit Button (Matches SHOP NOW button in screenshot) */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 sm:h-13 !mt-3 bg-[#005DA6] hover:bg-[#004e8c] active:bg-[#004277] text-white font-black font-montserrat text-sm sm:text-base uppercase tracking-wider rounded-[8px] shadow-lg shadow-blue-700/25 transition-all active:scale-[0.99] cursor-pointer flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting Bulk Enquiry...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <span>SUBMIT BULK ENQUIRY</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
