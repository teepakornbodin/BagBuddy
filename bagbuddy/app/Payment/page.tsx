"use client";
import { useState } from "react";
import type { PaymentRequest } from "./types";
import { pay } from "./api";

const paymentMethods = [
  { value: "credit_card", label: "บัตรเครดิต/เดบิต" },
  { value: "promptpay", label: "PromptPay" },
  { value: "bank_transfer", label: "โอนผ่านธนาคาร" },
];

export default function PaymentPage() {
  const [amount, setAmount] = useState(0);
  const [method, setMethod] = useState("credit_card");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const req: PaymentRequest = { amount, method: method as any };
      const res = await pay(req);
      setResult(res.success ? "ชำระเงินสำเร็จ" : res.message);
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-50"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-6"
      >
        <h1
          className="text-2xl font-bold text-center mb-4"
          style={{ color: "#1F41BB" }}
        >
          ชำระเงิน
        </h1>
        <div>
          <label className="block mb-1 font-medium">จำนวนเงิน (บาท)</label>
          <input
            type="number"
            min={1}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1F41BB]"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">ช่องทางการชำระเงิน</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1F41BB]"
          >
            {paymentMethods.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {result && <div className="text-green-600 text-sm">{result}</div>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 rounded bg-[#1F41BB] text-white font-semibold hover:bg-[#17337e] transition disabled:opacity-50"
        >
          {loading ? "กำลังดำเนินการ..." : "ชำระเงิน"}
        </button>
      </form>
    </div>
  );
}
