"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Add your registration logic here
      console.log("Registration data:", formData);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error("Registration error:", error);
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
              สมัครสมาชิกร้านค้า
            </h1>
            <p className="text-gray-600 text-sm">สมัครสมาชิก</p>
            <p className="text-gray-500 text-xs">
              เพื่อเปลี่ยนพื้นที่วางของคุณให้เป็นรายได้ง่ายๆ
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 pb-8 space-y-4">
            {/* Name Input */}
            <div className="space-y-2">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="ชื่อจริง"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none transition-colors duration-200 text-gray-800 placeholder-gray-500"
                required
              />
            </div>

            {/* Username Input */}
            <div className="space-y-2">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="ชื่อผู้ใช้"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none transition-colors duration-200 text-gray-800 placeholder-gray-500"
                required
              />
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="อีเมล"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none transition-colors duration-200 text-gray-800 placeholder-gray-500"
                required
              />
            </div>

            {/* Phone Input */}
            <div className="space-y-2">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="เบอร์โทร"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none transition-colors duration-200 text-gray-800 placeholder-gray-500"
                required
              />
            </div>

            {/* Password Input */}
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
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Confirm Password Input */}
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
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#1F41BB] focus:ring-offset-2 mt-6"
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
      </div>
    </div>
  );
}
