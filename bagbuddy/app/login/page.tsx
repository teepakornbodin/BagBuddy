// app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState(""); // username หรือ email
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);

    if (!identifier || !password) {
      setMsg("กรอกชื่อผู้ใช้/อีเมล และรหัสผ่าน");
      return;
    }

    setLoading(true);
    try {
      // ลองหาโดย user_name ก่อน
      let { data, error } = await supabase
        .from("account")
        .select("accountId, role, password")
        .eq("user_name", identifier)
        .maybeSingle();

      if (error) throw error;

      // ถ้าไม่พบ ลองหาโดย email
      if (!data) {
        const r2 = await supabase
          .from("account")
          .select("accountId, role, password")
          .eq("email", identifier)
          .maybeSingle();
        if (r2.error) throw r2.error;
        data = r2.data;
      }

      if (!data) {
        setMsg("ไม่พบผู้ใช้");
        return;
      }
      if (data.password !== password) {
        setMsg("รหัสผ่านไม่ถูกต้อง");
        return;
      }

      // เก็บ session แบบง่าย ๆ (dev เท่านั้น)
      if (typeof window !== "undefined") {
        localStorage.setItem("accountId", data.accountId);
        localStorage.setItem("role", data.role);
      }

      // redirect ตาม role
      if (data.role === "shop") {
        router.push("/shopprofile");
      } else if (data.role === "user") {
        router.push("/");
      } else {
        setMsg(`บทบาทไม่รองรับ: ${data.role}`);
      }
    } catch (err: any) {
      setMsg(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="border rounded border-black ">
          <label>Username or Email</label>
          <input
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
        </div>

        <div className="border rounded border-black ">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button disabled={loading}>{loading ? "..." : "Login"}</button>
      </form>

      {msg && <p>{msg}</p>}
    </main>
  );
}
