// Re-export webhook POST handler so both /api/webhooks/razorpay and /api/payments/razorpay/webhook are live
export { POST } from "@/app/api/payments/razorpay/webhook/route";
