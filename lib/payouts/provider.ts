export interface PayoutProvider {
  name: "razorpayx" | "cashfree" | "manual";
  enabled: boolean;

  createContact(params: CreateContactParams): Promise<CreateContactResult>;
  createFundAccount(contactId: string, params: CreateFundAccountParams): Promise<CreateFundAccountResult>;
  createPayout(params: CreatePayoutParams): Promise<CreatePayoutResult>;
  verifyWebhookSignature(body: string, signature: string, secret: string): boolean;
}

export interface CreateContactParams {
  name: string;
  email?: string;
  phone?: string;
  referenceId: string;
}

export interface CreateContactResult {
  success: boolean;
  providerContactId?: string;
  error?: string;
}

export interface CreateFundAccountParams {
  paymentMethod: "upi" | "bank_transfer";
  upiId?: string;
  bankAccount?: {
    accountNumber: string;
    ifsc: string;
    accountHolderName: string;
  };
}

export interface CreateFundAccountResult {
  success: boolean;
  providerFundAccountId?: string;
  error?: string;
}

export interface CreatePayoutParams {
  fundAccountId: string;
  amount: number;
  currency?: string;
  referenceId: string;
  purpose?: "refund" | "payout";
  narration?: string;
  idempotencyKey: string;
}

export interface CreatePayoutResult {
  success: boolean;
  providerPayoutId?: string;
  status: "queued" | "processing" | "processed" | "failed" | "manual_required";
  error?: string;
}

export interface PayoutConfig {
  provider: "razorpayx" | "cashfree" | "manual";
  enabled: boolean;
  razorpayxKeyId?: string;
  razorpayxKeySecret?: string;
  razorpayxAccountNumber?: string;
  razorpayxWebhookSecret?: string;
}

export function getPayoutConfig(): PayoutConfig {
  return {
    provider: (process.env.PAYOUT_PROVIDER as PayoutConfig["provider"]) || "manual",
    enabled: process.env.PAYOUTS_ENABLED === "true",
    razorpayxKeyId: process.env.RAZORPAYX_KEY_ID,
    razorpayxKeySecret: process.env.RAZORPAYX_KEY_SECRET,
    razorpayxAccountNumber: process.env.RAZORPAYX_ACCOUNT_NUMBER,
    razorpayxWebhookSecret: process.env.RAZORPAYX_WEBHOOK_SECRET,
  };
}

export function getPayoutProvider(): PayoutProvider {
  const config = getPayoutConfig();
  if (config.provider === "razorpayx") {
    const { RazorpayXProvider } = require("./razorpayx");
    return new RazorpayXProvider(config);
  }
  const { ManualPayoutProvider } = require("./manual");
  return new ManualPayoutProvider(config);
}
