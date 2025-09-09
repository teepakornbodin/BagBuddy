// api.ts - ฟังก์ชันติดต่อ API สำหรับ login
import type { LoginForm, LoginResponse } from "./types";

export async function loginApi(data: LoginForm): Promise<LoginResponse> {
  // ตัวอย่าง: เรียก API จริงควรเปลี่ยน URL ให้ตรง backend
  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
}
