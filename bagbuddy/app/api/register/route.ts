// /app/api/register/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const { user_name="", email="", password="", role } = await req.json();

  if (!user_name.trim() || !password.trim() || !role) {
    return NextResponse.json({ error: "กรอก user_name, password และ role ให้ครบ" }, { status: 400 });
  }
  if (role !== "shop" && role !== "user") {
    return NextResponse.json({ error: "role ต้องเป็น 'shop' หรือ 'user'" }, { status: 400 });
  }

  const accountId = crypto.randomUUID();

  const TABLE = "accounts";

  const { data, error } = await supabaseAdmin
    .from(TABLE)
    .insert({
      accountId,
      user_name: user_name.trim(),
      password: password.trim(), // DEV เท่านั้น
      role,
      email: email.trim() || null,
      last_login: null,
    })
    .select("accountId, user_name, role")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ message: "registered", account: data }, { status: 201 });
}
