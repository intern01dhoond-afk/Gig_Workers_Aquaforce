"use client";

import { useState, useEffect, useRef } from "react";
import { X, RotateCcw, AlertCircle, Loader2 } from "lucide-react";

interface MobileVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: (data: { fullName: string; phone: string }) => void;
}

const IndianFlagIcon = () => (
  <svg className="w-6 h-4 shrink-0 rounded-[2px] shadow-xs" viewBox="0 0 900 600">
    <rect width="900" height="200" fill="#FF9933" />
    <rect y="200" width="900" height="200" fill="#FFFFFF" />
    <rect y="400" width="900" height="200" fill="#138808" />
    <circle cx="450" cy="300" r="75" fill="none" stroke="#000080" strokeWidth="12" />
    <circle cx="450" cy="300" r="16" fill="#000080" />
    {[...Array(24)].map((_, i) => (
      <line
        key={i}
        x1="450"
        y1="300"
        x2={450 + 75 * Math.cos((i * 15 * Math.PI) / 180)}
        y2={300 + 75 * Math.sin((i * 15 * Math.PI) / 180)}
        stroke="#000080"
        strokeWidth="4"
      />
    ))}
  </svg>
);

const PhoneOutlineIcon = ({ className = "w-5 h-5 text-slate-400" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="5" y="2" width="14" height="20" rx="3" ry="3" />
    <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2.5" />
  </svg>
);

export default function MobileVerificationModal({
  isOpen,
  onClose,
  onVerified,
}: MobileVerificationModalProps) {
  const [step, setStep] = useState<"DETAILS" | "OTP">("DETAILS");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [devOtpNotice, setDevOtpNotice] = useState<string | null>(null);
  const [verificationToken, setVerificationToken] = useState<string>("");

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      setStep("DETAILS");
      setOtp(["", "", "", "", "", ""]);
      setError(null);
      setIsLoading(false);
      setDevOtpNotice(null);
    }
  }, [isOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === "OTP" && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  if (!isOpen) return null;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(digits);
    if (error) setError(null);
  };

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!fullName.trim() || fullName.trim().length < 2) {
      setError("Please enter your full name");
      return;
    }
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    setIsLoading(true);
    setError(null);
    setDevOtpNotice(null);

    try {
      const res = await fetch("/aquaforceforgigworkers/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phone: cleanPhone,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to send verification code. Please try again.");
      }

      setStep("OTP");
      setResendTimer(30);
      setCanResend(false);

      if (data.token) {
        setVerificationToken(data.token);
      }

      if (data.devOtp) {
        setDevOtpNotice(data.devOtp);
      }

      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 150);
    } catch (err: any) {
      setError(err.message || "Failed to connect to SMS service.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, val: string) => {
    const clean = val.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = clean;
    setOtp(newOtp);
    if (error) setError(null);

    if (clean && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    if (clean && index === 5 && newOtp.every((d) => d !== "")) {
      handleVerifyCode(newOtp.join(""));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);

    if (pasted.length === 6) {
      handleVerifyCode(pasted);
    } else {
      otpInputRefs.current[pasted.length]?.focus();
    }
  };

  const handleVerifyCode = async (codeToVerify?: string) => {
    const finalOtp = codeToVerify || otp.join("");
    if (finalOtp.length !== 6) {
      setError("Please enter all 6 digits of the OTP");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/aquaforceforgigworkers/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phone.replace(/\D/g, ""),
          otp: finalOtp,
          fullName: fullName.trim(),
          token: verificationToken,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Invalid verification code. Please try again.");
      }

      onVerified({
        fullName: fullName.trim(),
        phone: phone.replace(/\D/g, ""),
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Exact 480px Modal Card with Custom CSS */}
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          paddingTop: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          borderRadius: "16px",
          background: "#FFF",
          boxShadow: "0 8px 24px -2px rgba(0, 0, 0, 0.15)",
        }}
        className="relative overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Top Close Button (Exact Light Grey Circle in Top Right) */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#f1f5f9] hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer z-10"
          aria-label="Close"
        >
          <X size={15} strokeWidth={2.5} />
        </button>

        {/* Modal Header & Title */}
        <div className="w-full px-6 sm:px-7 pb-4">
          <h2 className="text-[22px] sm:text-[24px] font-bold font-montserrat text-[#0f172a] tracking-tight leading-snug">
            {step === "DETAILS" ? "Verify Mobile Number" : "Enter Verification Code"}
          </h2>
          <p className="text-[13px] sm:text-[14px] text-[#64748b] font-open-sans mt-0.5">
            {step === "DETAILS"
              ? "Required before proceeding to checkout"
              : `OTP sent to +91 ${phone ? `${phone.slice(0, 5)} ${phone.slice(5)}` : "98765 43210"}`}
          </p>
        </div>

        {/* Form Body */}
        <div className="w-full px-6 sm:px-7">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium flex items-start gap-2">
              <AlertCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {devOtpNotice && (
            <div className="mb-4 p-2.5 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 flex items-center justify-between">
              <span>
                Test OTP: <strong className="text-sm font-mono tracking-wider text-amber-950">{devOtpNotice}</strong>
              </span>
              <button
                type="button"
                onClick={() => {
                  const digits = devOtpNotice.split("");
                  setOtp(digits);
                  handleVerifyCode(devOtpNotice);
                }}
                className="text-[11px] font-bold text-[#005da6] underline hover:text-[#004780]"
              >
                Auto-fill & Submit
              </button>
            </div>
          )}

          {step === "DETAILS" ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              {/* Full Name Input */}
              <div>
                <label className="block text-[14px] font-semibold text-[#1e293b] mb-2 font-open-sans">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full h-12 px-4 bg-white border border-[#e2e8f0] focus:border-[#005da6] rounded-[10px] text-[15px] text-[#0f172a] placeholder:text-[#94a3b8] outline-none transition-all font-open-sans"
                  autoFocus
                />
              </div>

              {/* Mobile Number Input with Indian Flag and Phone Icon */}
              <div>
                <label className="block text-[14px] font-semibold text-[#1e293b] mb-2 font-open-sans">
                  Mobile Number
                </label>
                <div className="relative flex items-center w-full h-12 bg-white border border-[#e2e8f0] focus-within:border-[#005da6] rounded-[10px] px-3.5 transition-all">
                  {/* Left: Flag + +91 */}
                  <div className="flex items-center gap-2 pr-2.5 border-r border-slate-200 select-none">
                    <IndianFlagIcon />
                    <span className="text-[14px] font-medium text-[#0f172a] tracking-wide">+91</span>
                  </div>

                  {/* Input field */}
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="98765 43210"
                    maxLength={10}
                    className="w-full h-full pl-3 pr-2 bg-transparent text-[15px] text-[#0f172a] font-medium tracking-wide placeholder:text-[#94a3b8] outline-none font-open-sans"
                  />

                  {/* Right: Phone outline icon */}
                  <PhoneOutlineIcon className="w-5 h-5 text-[#94a3b8] shrink-0 pointer-events-none" />
                </div>

                <p className="text-[13px] text-[#94a3b8] mt-2 font-open-sans">
                  We will send a 6-digit OTP to verify your order details.
                </p>
              </div>

              {/* Bottom Border & Action Button */}
              <div className="pt-4 pb-6 mt-4 border-t border-[#f1f5f9] -mx-6 sm:-mx-7 px-6 sm:px-7">
                <button
                  type="submit"
                  disabled={isLoading || phone.length !== 10 || fullName.trim().length < 2}
                  className="w-full h-12 bg-[#005da6] hover:bg-[#004d8c] active:bg-[#003d73] disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold font-montserrat text-[13px] sm:text-[14px] tracking-wider uppercase rounded-[10px] shadow-[0_4px_14px_rgba(0,93,166,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed disabled:shadow-none"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>SENDING OTP...</span>
                    </>
                  ) : (
                    <span>VERIFY MOBILE NUMBER</span>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-[14px] font-semibold text-[#1e293b] mb-2.5 font-open-sans">
                  Enter 6-digit OTP
                </label>

                {/* 6 Individual OTP boxes with bullet placeholders */}
                <div className="flex items-center justify-between gap-2 pt-0.5">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        otpInputRefs.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      placeholder={digit ? "" : "•"}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      onPaste={handleOtpPaste}
                      className="w-13 h-14 sm:w-14 sm:h-15 text-center text-xl font-bold font-montserrat border border-[#e2e8f0] focus:border-[#005da6] rounded-[12px] outline-none transition-all bg-white text-[#0f172a] placeholder:text-slate-300 placeholder:text-2xl"
                    />
                  ))}
                </div>
              </div>

              {/* Resend Row with 00:30 Timer on the right */}
              <div className="flex items-center justify-between text-[13px] text-[#64748b] font-open-sans pt-1">
                <div>
                  <span>Didn't receive the code? </span>
                  {canResend ? (
                    <button
                      type="button"
                      onClick={() => handleSendOtp()}
                      disabled={isLoading}
                      className="text-[#005da6] font-bold hover:underline cursor-pointer inline-flex items-center gap-1"
                    >
                      <RotateCcw size={11} />
                      <span>Resend OTP</span>
                    </button>
                  ) : (
                    <span className="text-[#005da6] font-bold select-none">
                      Resend OTP
                    </span>
                  )}
                </div>

                <span className="font-mono text-[13px] text-[#64748b] font-medium tracking-wider select-none">
                  00:{resendTimer < 10 ? `0${resendTimer}` : resendTimer}
                </span>
              </div>

              {/* Bottom Border & VERIFY OTP Button */}
              <div className="pt-4 pb-6 mt-4 border-t border-[#f1f5f9] -mx-6 sm:-mx-7 px-6 sm:px-7">
                <button
                  type="button"
                  onClick={() => handleVerifyCode()}
                  disabled={isLoading || otp.some((d) => d === "")}
                  className="w-full h-12 bg-[#005da6] hover:bg-[#004d8c] active:bg-[#003d73] disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold font-montserrat text-[13px] sm:text-[14px] tracking-wider uppercase rounded-[10px] shadow-[0_4px_14px_rgba(0,93,166,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed disabled:shadow-none"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>VERIFYING...</span>
                    </>
                  ) : (
                    <span>VERIFY OTP</span>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
