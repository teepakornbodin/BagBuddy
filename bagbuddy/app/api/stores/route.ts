import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

type Row = {
  shopId: string;
  shop_name: string;
  rating: number | null;
  deposit: number | null;
  price_per_hour: number | null;
  phone: string | null;
  status: string;
  shop_type: string | null;
  longitude: number | null;
  latitude: number | null;
  description: string | null;
  contact_email: string | null;
  full_address: string | null;
  image: string | null;
  max_capacity: number | null;
  accountId: string;
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = Math.min(Number(searchParams.get("limit") || 200), 1000);

  // ใส่ชื่อคอลัมน์แบบมีเครื่องหมายคำพูดกับ camelCase
  const columns =
    `"shopId", shop_name, rating, deposit, price_per_hour, phone, status, shop_type, ` +
    `longitude, latitude, description, contact_email, full_address, image, max_capacity, "accountId"`;

  const { data, error } = await supabase
    .from("shops")
    .select(columns)
    .eq("status", "approve")
    .not("longitude", "is", null)
    .not("latitude", "is", null)
    .order("shop_name", { ascending: true })
    .limit(limit);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // แปลง Row -> Store (ตาม type หน้าบ้านของคุณ)
  const stores = (data as Row[]).map((r) => ({
    id: r.shopId,
    name: r.shop_name,
    lat: r.latitude!,
    lng: r.longitude!,
    category: r.shop_type ?? undefined,
    address: r.full_address ?? undefined,
    image: r.image ?? undefined,
    rating: r.rating ?? undefined,
    phone: r.phone ?? undefined,
    pricePerHour: r.price_per_hour ?? undefined,
    deposit: r.deposit ?? undefined,
  }));

  return NextResponse.json(stores);
}
