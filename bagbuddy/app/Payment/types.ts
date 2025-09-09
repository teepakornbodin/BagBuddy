// types.ts - ประกาศ type/interface สำหรับ Payment

export interface PaymentInfo {
  amount: number;
  method: "credit_card" | "promptpay" | "bank_transfer";
  status: "pending" | "success" | "failed";
  date: string;
  transactionId?: string;
}

export interface PaymentRequest {
  amount: number;
  method: "credit_card" | "promptpay" | "bank_transfer";
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  transactionId?: string;
}
