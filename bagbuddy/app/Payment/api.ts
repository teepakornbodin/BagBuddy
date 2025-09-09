// api.ts - ฟังก์ชันติดต่อ API สำหรับ Payment
import type { PaymentRequest, PaymentResponse } from "./types";

export async function pay(request: PaymentRequest): Promise<PaymentResponse> {
  // ตัวอย่าง: เรียก API จริงควรเปลี่ยน URL ให้ตรง backend
  const res = await fetch("/api/payment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  if (!res.ok) throw new Error("Payment failed");
  return res.json();
}
