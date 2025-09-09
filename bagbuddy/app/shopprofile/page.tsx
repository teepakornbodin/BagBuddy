// app/shopprofile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Shop = {
  shopId: string;
  shop_name: string;
  rating: number;
  deposit: number;
  price_per_hour: number;
  phone: string;
  status: string;
  shop_type: string | null;
  longitude: number;
  latitude: number | null;
  description: string | null;
  contact_email: string | null;
  full_address: string | null;
  image: string;
  max_capacity: number | null;
  first_name: string | null;
  last_name: string | null;
  accountId: string;
};

export default function ShopProfilePage() {
  const router = useRouter();
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    const accId = typeof window !== "undefined" ? localStorage.getItem("accountId") : null;
    const role  = typeof window !== "undefined" ? localStorage.getItem("role") : null;

    // ไม่ได้ล็อกอิน
    if (!accId) {
      router.replace("/login");
      return;
    }
    // ไม่ใช่บทบาท shop
    if (role && role !== "shop") {
      router.replace("/home");
      return;
    }

    (async () => {
      setLoading(true);
      setMsg(null);
      const { data, error } = await supabase
        .from("shops")
        .select("shopId, shop_name, rating, deposit, price_per_hour, phone, status, shop_type, longitude, latitude, description, contact_email, full_address, image, max_capacity, first_name, last_name, accountId")
        .eq("accountId", accId);

      if (error) {
        setMsg(error.message);
        setShops([]);
      } else {
        setShops(data ?? []);
      }
      setLoading(false);
    })();
  }, [router]);

  function handleLogout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accountId");
      localStorage.removeItem("role");
    }
    router.push("/login");
  }

  return (
    <main>
      <h1>/shopprofile</h1>
      <button onClick={handleLogout}>Logout</button>

      {loading && <p>Loading...</p>}
      {msg && <p>{msg}</p>}

      {!loading && !msg && shops.length === 0 && <p>ยังไม่มีข้อมูลร้านสำหรับ account นี้</p>}

      {!loading && !msg && shops.length > 0 && (
        <div>
          {shops.map((s) => (
            <div key={s.shopId} style={{ border: "1px solid #ccc", padding: 8, marginBottom: 8 }}>
              <p><b>shopId:</b> {s.shopId}</p>
              <p><b>shop_name:</b> {s.shop_name}</p>
              <p><b>status:</b> {s.status}</p>
              <p><b>shop_type:</b> {s.shop_type}</p>
              <p><b>phone:</b> {s.phone}</p>
              <p><b>contact_email:</b> {s.contact_email}</p>
              <p><b>full_address:</b> {s.full_address}</p>
              <p><b>rating:</b> {s.rating}</p>
              <p><b>deposit:</b> {s.deposit}</p>
              <p><b>price_per_hour:</b> {s.price_per_hour}</p>
              <p><b>longitude:</b> {s.longitude}</p>
              <p><b>latitude:</b> {s.latitude}</p>
              <p><b>first_name:</b> {s.first_name}</p>
              <p><b>last_name:</b> {s.last_name}</p>
              <p><b>accountId:</b> {s.accountId}</p>
              {s.image && (
                <div>
                  <p><b>image:</b></p>
                  <img src={s.image} alt={s.shop_name} style={{ maxWidth: 320, height: "auto" }} />
                </div>
              )}
              {s.description && (
                <div>
                  <p><b>description:</b> {s.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
