// page.tsx - หน้า login หลัก (entry point)
"use client";

import { useState } from "react";
import { loginApi } from "./api";
import type { LoginForm } from "./types";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const [form, setForm] = useState<LoginForm>({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await loginApi(form);
      // TODO: handle success (redirect, set token, etc.)
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm space-y-4">
        <h1
          className="text-2xl font-bold text-center mb-4"
          style={{ color: "#1F41BB", fontFamily: "Poppins, sans-serif" }}
        >
          เข้าสู่ระบบ
        </h1>

        {/* ปุ่ม Sign in with Google */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded font-medium bg-white hover:bg-gray-50 transition-colors text-gray-700"
          style={{ fontFamily: "Poppins, sans-serif" }}
          // TODO: ใส่ logic Google SSO ที่นี่
        >
          <FcGoogle className="w-5 h-5" />
          เข้าสู่ระบบด้วย Google
        </button>

        <div className="flex items-center my-2">
          <div className="flex-grow h-px bg-gray-200" />
          <span className="mx-2 text-gray-400 text-xs">หรือ</span>
          <div className="flex-grow h-px bg-gray-200" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="ชื่อผู้ใช้"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1F41BB]"
            required
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="รหัสผ่าน"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1F41BB]"
            required
          />
          <div className="flex justify-end">
            <Link
              href="/reset-password"
              className="text-xs text-[#1F41BB] hover:underline"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              ลืมรหัสผ่าน?
            </Link>
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 rounded bg-[#1F41BB] text-white font-semibold hover:bg-[#17337e] transition disabled:opacity-50"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>

        <div
          className="text-center mt-4 text-sm text-gray-600"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          ยังไม่มีบัญชี?{" "}
          <Link
            href="/register"
            className="text-[#1F41BB] font-semibold hover:underline"
          >
            สร้างบัญชีใหม่
          </Link>
        </div>
      </div>
    </div>
  );
}
