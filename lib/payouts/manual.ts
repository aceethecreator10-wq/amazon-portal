import type { PayoutProvider, PayoutConfig, CreateContactParams, CreateContactResult, CreateFundAccountParams, CreateFundAccountResult, CreatePayoutParams, CreatePayoutResult } from "./provider";

export class ManualPayoutProvider implements PayoutProvider {
  name = "manual" as const;
  enabled: boolean;

  constructor(config: PayoutConfig) {
    this.enabled = config.enabled;
  }

  async createContact(_params: CreateContactParams): Promise<CreateContactResult> {
    return { success: true, providerContactId: `manual-${Date.now()}` };
  }

  async createFundAccount(_contactId: string, _params: CreateFundAccountParams): Promise<CreateFundAccountResult> {
    return { success: true, providerFundAccountId: `manual-fa-${Date.now()}` };
  }

  async createPayout(_params: CreatePayoutParams): Promise<CreatePayoutResult> {
    return {
      success: false,
      status: "manual_required",
      error: "Manual payout provider: no automated payout provider configured. An admin must process this payout manually.",
    };
  }

  verifyWebhookSignature(_body: string, _signature: string, _secret: string): boolean {
    return false;
  }
}
