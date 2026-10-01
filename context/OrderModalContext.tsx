"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import OrderModal from "@/components/OrderModal";
import MobileVerificationModal from "@/components/MobileVerificationModal";
import AccountLoginModal from "@/components/account/AccountLoginModal";

interface VerifiedUser {
  fullName: string;
  phone: string;
}

interface OrderModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  verifiedUser: VerifiedUser | null;
  logoutUser: () => void;
  openAccountModal: () => void;
  closeAccountModal: () => void;
  isAccountLoginOpen: boolean;
}

const OrderModalContext = createContext<OrderModalContextType>({
  isOpen: false,
  openModal: () => {},
  closeModal: () => {},
  verifiedUser: null,
  logoutUser: () => {},
  openAccountModal: () => {},
  closeAccountModal: () => {},
  isAccountLoginOpen: false,
});

export function OrderModalProvider({ children }: { children: React.ReactNode }) {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [isAccountLoginOpen, setIsAccountLoginOpen] = useState(false);
  const [verifiedUser, setVerifiedUser] = useState<VerifiedUser | null>(null);

  // Sync auth state across both keys (aquaforce_user and promec_verified_user)
  const syncFromStorage = () => {
    try {
      const saved =
        localStorage.getItem("aquaforce_user") ||
        localStorage.getItem("promec_verified_user");

      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.phone) {
          const userObj = {
            fullName: parsed.fullName || "Customer",
            phone: parsed.phone,
          };
          setVerifiedUser(userObj);
          // Keep both keys in sync
          localStorage.setItem("aquaforce_user", JSON.stringify(userObj));
          localStorage.setItem("promec_verified_user", JSON.stringify(userObj));
          return;
        }
      }
      setVerifiedUser(null);
    } catch (e) {
      console.error("Failed to read verified user from storage:", e);
      setVerifiedUser(null);
    }
  };

  // Initial load
  useEffect(() => {
    syncFromStorage();
  }, []);

  // Listen for storage events and cross-tab/cross-component auth changes
  useEffect(() => {
    const handleAuthChange = () => {
      syncFromStorage();
    };

    window.addEventListener("storage", handleAuthChange);
    window.addEventListener("aquaforce_auth_changed", handleAuthChange);
    return () => {
      window.removeEventListener("storage", handleAuthChange);
      window.removeEventListener("aquaforce_auth_changed", handleAuthChange);
    };
  }, []);

  const openModal = () => {
    if (!verifiedUser) {
      // Require Name & Mobile OTP verification first
      setIsVerificationOpen(true);
    } else {
      // Already verified -> proceed directly to product checkout modal
      setIsOrderModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsOrderModalOpen(false);
    setIsVerificationOpen(false);
  };

  const logoutUser = () => {
    setVerifiedUser(null);
    try {
      localStorage.removeItem("aquaforce_user");
      localStorage.removeItem("promec_verified_user");
      window.dispatchEvent(new Event("aquaforce_auth_changed"));
    } catch (e) {
      console.error("Failed to clear auth storage:", e);
    }
  };

  const handleVerified = (data: { fullName: string; phone: string }) => {
    setVerifiedUser(data);
    // Persist to unified keys so MY ACCOUNT and BUY NOW are both logged in
    try {
      localStorage.setItem("aquaforce_user", JSON.stringify(data));
      localStorage.setItem("promec_verified_user", JSON.stringify(data));
      window.dispatchEvent(new Event("aquaforce_auth_changed"));
    } catch (e) {
      console.error("Failed to save verified user to localStorage:", e);
    }
    setIsVerificationOpen(false);
    setIsOrderModalOpen(true);
  };

  const openAccountModal = () => {
    setIsAccountLoginOpen(true);
  };

  const closeAccountModal = () => {
    setIsAccountLoginOpen(false);
  };

  const handleAccountLoginSuccess = (userData: { phone: string; fullName: string }) => {
    setVerifiedUser(userData);
    try {
      localStorage.setItem("aquaforce_user", JSON.stringify(userData));
      localStorage.setItem("promec_verified_user", JSON.stringify(userData));
      window.dispatchEvent(new Event("aquaforce_auth_changed"));
    } catch (e) {
      console.error("Failed to save verified user to localStorage:", e);
    }
    setIsAccountLoginOpen(false);
    window.location.href = "/aquaforceforgigworkers/account";
  };

  return (
    <OrderModalContext.Provider
      value={{
        isOpen: isOrderModalOpen || isVerificationOpen || isAccountLoginOpen,
        openModal,
        closeModal,
        verifiedUser,
        logoutUser,
        openAccountModal,
        closeAccountModal,
        isAccountLoginOpen,
      }}
    >
      {children}

      {/* Instant VIP Account Login Modal */}
      {isAccountLoginOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAccountLoginOpen(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150"
        >
          <AccountLoginModal
            onSuccess={handleAccountLoginSuccess}
            onClose={() => setIsAccountLoginOpen(false)}
          />
        </div>
      )}

      {/* Step 1: Mobile Verification Modal */}
      <MobileVerificationModal
        isOpen={isVerificationOpen}
        onClose={() => setIsVerificationOpen(false)}
        onVerified={handleVerified}
      />

      {/* Step 2: Product & Checkout Modal */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        verifiedUser={verifiedUser}
        startAtCheckout={false}
      />
    </OrderModalContext.Provider>
  );
}

export function useOrderModal() {
  return useContext(OrderModalContext);
}
