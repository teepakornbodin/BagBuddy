// app/api/login/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const identifier = String(body?.identifier ?? "").trim();
    const password = String(body?.password ?? "").trim();

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "กรอกชื่อผู้ใช้/อีเมล และรหัสผ่าน" },
        { status: 400 }
      );
    }

    const TABLE = "accounts"; // ✅ ให้ตรงกับ /api/register ของคุณ

    let { data, error } = await supabaseAdmin
      .from(TABLE)
      .select("accountId, role, password")
      .eq("user_name", identifier)
      .maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    if (!data) {
      const r2 = await supabaseAdmin
        .from(TABLE)
        .select("accountId, role, password")
        .eq("email", identifier)
        .maybeSingle();
      if (r2.error) return NextResponse.json({ error: r2.error.message }, { status: 500 });
      data = r2.data;
    }

    if (!data) return NextResponse.json({ error: "ไม่พบผู้ใช้" }, { status: 404 });
    if (data.password !== password) {
      return NextResponse.json({ error: "รหัสผ่านไม่ถูกต้อง" }, { status: 401 });
    }

    await supabaseAdmin
      .from(TABLE)
      .update({ last_login: new Date().toISOString() })
      .eq("accountId", data.accountId);

    return NextResponse.json(
      { message: "ok", account: { accountId: data.accountId, role: data.role } },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Login error" }, { status: 500 });
  }
}
