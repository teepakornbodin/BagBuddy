// app/login/api.ts
import type { LoginForm, LoginSuccess } from "./types";

export async function loginApi(form: LoginForm): Promise<LoginSuccess> {
  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // identifier จะส่งเป็น username หรือ email ก็ได้
    body: JSON.stringify({ identifier: form.username, password: form.password }),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json?.error || "เกิดข้อผิดพลาด");
  }

  // เก็บ session ง่าย ๆ (DEV)
  if (typeof window !== "undefined") {
    localStorage.setItem("accountId", json.account.accountId);
    localStorage.setItem("role", json.account.role);
  }

  return json as LoginSuccess;
}
