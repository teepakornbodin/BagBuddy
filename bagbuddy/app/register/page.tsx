"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

type Role = "shop" | "user";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    user_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "shop" as Role, // ค่าเริ่มต้น
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setApiSuccess(null);

    // validate ฝั่ง client ให้ครบตาม API
    if (!formData.user_name.trim() || !formData.password.trim() || !formData.role) {
      setApiError("กรอก user_name, password และ role ให้ครบ");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setApiError("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }
    if (formData.role !== "shop" && formData.role !== "user") {
      setApiError("role ต้องเป็น 'shop' หรือ 'user'");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_name: formData.user_name.trim(),
          email: formData.email.trim() || undefined, // API รองรับว่างได้
          password: formData.password.trim(),
          role: formData.role,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setApiError(json?.error || "สมัครไม่สำเร็จ");
        return;
      }

      // สำเร็จ
      setApiSuccess("สมัครสมาชิกสำเร็จ!");
      // TODO: จะ redirect ไปหน้า login หรือหน้าโปรไฟล์ก็ได้
      // router.push("/login");
    } catch (err: any) {
      setApiError(err?.message || "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eaf0fa] to-[#e3e8f6] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="px-6 pt-8 pb-6 text-center">
            <h1 className="text-2xl font-bold" style={{ color: "#1F41BB" }}>
              สมัครสมาชิกร้านค้า / ผู้ใช้
            </h1>
            <p className="text-gray-600 text-sm">สมัครสมาชิก</p>
            <p className="text-gray-500 text-xs">
              สร้างบัญชีเพื่อใช้งานระบบของเรา
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 pb-8 space-y-4">
            {/* แจ้งเตือน */}
            {apiError && (
              <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
                {apiError}
              </div>
            )}
            {apiSuccess && (
              <div className="p-3 rounded-lg bg-green-50 text-green-700 text-sm">
                {apiSuccess}
              </div>
            )}

            {/* Username -> user_name */}
            <div className="space-y-2">
              <input
                type="text"
                name="user_name"
                value={formData.user_name}
                onChange={handleInputChange}
                placeholder="ชื่อผู้ใช้ (user_name)"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none transition-colors duration-200 text-gray-800 placeholder-gray-500"
                required
              />
            </div>

            {/* Email (ไม่บังคับ แต่ API รองรับ) */}
            <div className="space-y-2">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="อีเมล (ถ้ามี)"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none transition-colors duration-200 text-gray-800 placeholder-gray-500"
              />
            </div>

            {/* Role */}
            <div className="space-y-2">
              <label className="block text-sm text-gray-700">บทบาท (role)</label>
              <div className="flex items-center gap-4">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="role"
                    value="shop"
                    checked={formData.role === "shop"}
                    onChange={handleInputChange}
                    className="accent-[#1F41BB]"
                  />
                  <span className="text-gray-700 text-sm">shop</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={formData.role === "user"}
                    onChange={handleInputChange}
                    className="accent-[#1F41BB]"
                  />
                  <span className="text-gray-700 text-sm">user</span>
                </label>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2 relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="รหัสผ่าน"
                className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none transition-colors duration-200 text-gray-800 placeholder-gray-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Confirm Password (เช็กแค่ฝั่ง client ไม่ส่งให้ API) */}
            <div className="space-y-2 relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="ยืนยันรหัสผ่าน"
                className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none transition-colors duration-200 text-gray-800 placeholder-gray-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#1F41BB] focus:ring-offset-2 mt-4 disabled:opacity-60"
              style={{ backgroundColor: "#1F41BB", borderColor: "#1F41BB" }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  กำลังสมัคร...
                </div>
              ) : (
                "สมัครสมาชิก"
              )}
            </button>

            {/* Login Link */}
            <div className="text-center mt-6 pt-4 border-t border-gray-100">
              <p className="text-gray-600 text-sm">
                เป็นสมาชิกอยู่แล้ว?{" "}
                <Link
                  href="/login"
                  className="font-medium hover:underline transition-colors duration-200"
                  style={{ color: "#1F41BB" }}
                >
                  เข้าสู่ระบบ
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* หมายเหตุด้านความปลอดภัย */}
        <p className="text-[11px] text-gray-500 mt-3">
          * ฝั่งเซิร์ฟเวอร์ของคุณตอนนี้เก็บรหัสผ่านแบบไม่เข้ารหัส (เพื่อ DEV เท่านั้น) —
          แนะนำให้เปลี่ยนไปใช้การแฮชรหัสผ่าน (เช่น bcrypt) หรือระบบ auth ของ Supabase ก่อนขึ้นจริง
        </p>
      </div>
    </div>
  );
}
