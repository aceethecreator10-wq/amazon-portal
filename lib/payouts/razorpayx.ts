import type { PayoutProvider, PayoutConfig, CreateContactParams, CreateContactResult, CreateFundAccountParams, CreateFundAccountResult, CreatePayoutParams, CreatePayoutResult } from "./provider";

export class RazorpayXProvider implements PayoutProvider {
  name = "razorpayx" as const;
  enabled: boolean;
  private config: PayoutConfig;

  constructor(config: PayoutConfig) {
    this.config = config;
    this.enabled = config.enabled && !!config.razorpayxKeyId && !!config.razorpayxKeySecret;
  }

  private getAuthHeader(): string {
    const key = this.config.razorpayxKeyId || "";
    const secret = this.config.razorpayxKeySecret || "";
    return "Basic " + Buffer.from(`${key}:${secret}`).toString("base64");
  }

  private async apiPost(path: string, body: Record<string, unknown>): Promise<any> {
    const res = await fetch(`https://api.razorpay.com${path}`, {
      method: "POST",
      headers: {
        Authorization: this.getAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`RazorpayX API error ${res.status}: ${err}`);
    }
    return res.json();
  }

  async createContact(params: CreateContactParams): Promise<CreateContactResult> {
    try {
      const data = await this.apiPost("/v1/contacts", {
        name: params.name,
        email: params.email,
        contact: params.phone,
        reference_id: params.referenceId,
        type: "customer",
      });
      return { success: true, providerContactId: data.id };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  async createFundAccount(contactId: string, params: CreateFundAccountParams): Promise<CreateFundAccountResult> {
    try {
      let body: Record<string, unknown>;
      if (params.paymentMethod === "upi") {
        body = {
          contact_id: contactId,
          account_type: "vpa",
          vpa: { address: params.upiId },
        };
      } else {
        body = {
          contact_id: contactId,
          account_type: "bank_account",
          bank_account: {
            name: params.bankAccount?.accountHolderName,
            ifsc: params.bankAccount?.ifsc,
            account_number: params.bankAccount?.accountNumber,
          },
        };
      }
      const data = await this.apiPost("/v1/fund_accounts", body);
      return { success: true, providerFundAccountId: data.id };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  async createPayout(params: CreatePayoutParams): Promise<CreatePayoutResult> {
    try {
      const data = await this.apiPost("/v1/payouts", {
        fund_account_id: params.fundAccountId,
        amount: params.amount,
        currency: params.currency || "INR",
        mode: "IMPS",
        purpose: params.purpose || "refund",
        narration: params.narration || "DealFlow refund payout",
        reference_id: params.referenceId,
        queue_if_low_balance: true,
      });
      return {
        success: true,
        providerPayoutId: data.id,
        status: data.status === "processed" ? "processed" : data.status === "queued" ? "queued" : "processing",
      };
    } catch (err: any) {
      return { success: false, status: "failed", error: err.message };
    }
  }

  verifyWebhookSignature(body: string, signature: string, secret: string): boolean {
    const crypto = require("crypto");
    const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  }
}
