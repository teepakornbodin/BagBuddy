// app/register/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const BUCKET = "shop-images";

// ✅ ใช้ accountId ที่มีอยู่จริงใน public.account (ของคุณ: role=shop)
const DEV_ACCOUNT_ID = "03c4ac41-3531-4007-b1b1-a05d80b5c5d8";

export default function Page() {
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // form state
  const [shop_name, setShopName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("");              // enum shop_status
  const [shop_type, setShopType] = useState<string>(""); // enum (nullable)
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [rating, setRating] = useState("0");
  const [deposit, setDeposit] = useState("0");
  const [pricePerHour, setPricePerHour] = useState("0");
  const [contact_email, setContactEmail] = useState("");
  const [full_address, setFullAddress] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [statusOptions, setStatusOptions] = useState<string[]>([]);
  const [typeOptions, setTypeOptions] = useState<string[]>([]);

  // โหลด enum จาก views ถ้ามี; ถ้าไม่มีให้ fallback เป็นค่าที่ DB คุณใช้อยู่จริง
  useEffect(() => {
    (async () => {
      const { data: st } = await supabase.from("v_enum_shop_status").select("value");
      const stVals = (st?.map((x: any) => x.value) ?? []) as string[];
      const stFinal = stVals.length ? stVals : ["approve"];   // 👈 fallback
      setStatusOptions(stFinal);
      setStatus(stFinal[0]);

      const { data: tp } = await supabase.from("v_enum_shop_type").select("value");
      const tpVals = (tp?.map((x: any) => x.value) ?? []) as string[];
      const tpFinal = tpVals.length ? tpVals : ["Shop"];      // 👈 fallback
      setTypeOptions(tpFinal);
      setShopType(tpFinal[0]);
    })();
  }, []);

  // กัน key invalid (ไทย/ช่องว่าง/สัญลักษณ์)
  function asciiKey(s: string) {
    return (s || "file")
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "file";
  }
  const num = (v: string, fb = 0) => (Number.isNaN(Number(v)) ? fb : Number(v));

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);

    // ตรวจจำเป็น
    if (!shop_name || !phone || !status || !longitude) {
      setMsg("กรอก shop_name, phone, status, longitude ให้ครบ");
      return;
    }
    if (!imageFile) {
      setMsg("กรุณาเลือกไฟล์รูป (image เป็น NOT NULL)");
      return;
    }

    const longitudeNum = Number(longitude);
    if (Number.isNaN(longitudeNum)) return setMsg("longitude ต้องเป็นตัวเลข");
    const latitudeNum = latitude ? Number(latitude) : null;
    if (latitude && Number.isNaN(latitudeNum)) return setMsg("latitude ต้องเป็นตัวเลข");

    setLoading(true);
    try {
      // 1) อัปโหลดรูป (ใช้ key ที่เป็น ASCII)
      const ext = imageFile.name.split(".").pop() || "jpg";
      const base = asciiKey(shop_name || full_address || "shop");
      const filePath = `shops/${base}-${Date.now()}.${ext}`;
      const up = await supabase.storage.from(BUCKET).upload(filePath, imageFile, {
        upsert: false,
        contentType: imageFile.type || "image/*",
      });
      if (up.error) throw up.error;

      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
      const imageUrl = pub.publicUrl;
      if (!imageUrl) throw new Error("ได้ URL รูปว่าง");

      // 2) insert ครบทุก NOT NULL + ใช้ DEV_ACCOUNT_ID โดยตรง (ไม่เช็คตาราง account)
      const payload = {
        shop_name,
        phone,
        contact_email: contact_email || null,
        full_address: full_address || null,
        description: description || null,
        longitude: longitudeNum,              // NOT NULL
        latitude: latitudeNum,                // NULL ok
        rating: num(rating, 0),               // NOT NULL
        deposit: num(deposit, 0),             // NOT NULL
        price_per_hour: num(pricePerHour, 0), // NOT NULL
        status,                               // enum (ต้องตรง DB; fallback = 'approve')
        shop_type: shop_type || null,         // enum/nullable (fallback = 'Shop')
        accountId: DEV_ACCOUNT_ID,            // ✅ FK ไป public.account(accountId)
        image: imageUrl,                      // NOT NULL
      };

      const { error: insErr } = await supabase.from("shops").insert(payload);
      if (insErr) throw insErr;

      setMsg("บันทึกสำเร็จ!");
      (e.target as HTMLFormElement).reset();
      setShopName(""); setPhone(""); setContactEmail(""); setFullAddress("");
      setDescription(""); setLongitude(""); setLatitude("");
      setRating("0"); setDeposit("0"); setPricePerHour("0");
      if (fileRef.current) fileRef.current.value = "";
    } catch (err: any) {
      console.error(err);
      setMsg(`เกิดข้อผิดพลาด: ${err?.message || String(err)}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl p-6 space-y-6">
        <h1 className="text-2xl font-bold">ลงทะเบียนร้าน (DEV mode ไม่ต้องล็อกอิน)</h1>

        <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm">ชื่อร้าน *</label>
              <input className="w-full rounded border px-3 py-2" onChange={e=>setShopName(e.target.value)} required />
            </div>
            <div>
              <label className="text-sm">โทรศัพท์ *</label>
              <input className="w-full rounded border px-3 py-2" onChange={e=>setPhone(e.target.value)} required />
            </div>
            <div>
              <label className="text-sm">สถานะ (enum) *</label>
              <select className="w-full rounded border px-3 py-2 bg-white" value={status} onChange={e=>setStatus(e.target.value)} required>
                {statusOptions.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
              <p className="text-xs text-gray-500">ถ้าไม่เห็นตัวเลือก แปลว่า view/สิทธิ์อ่านยังไม่พร้อม — ฟอร์มจะ fallback เป็น 'approve'</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm">ประเภทร้าน (enum)</label>
              <select className="w-full rounded border px-3 py-2 bg-white" value={shop_type} onChange={e=>setShopType(e.target.value)}>
                <option value="">(เว้นว่างได้)</option>
                {typeOptions.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
              <p className="text-xs text-gray-500">fallback = 'Shop'</p>
            </div>
            <div>
              <label className="text-sm">ลองจิจูด *</label>
              <input type="number" step="0.000001" className="w-full rounded border px-3 py-2" onChange={e=>setLongitude(e.target.value)} required />
            </div>
            <div>
              <label className="text-sm">ละติจูด</label>
              <input type="number" step="0.000001" className="w-full rounded border px-3 py-2" onChange={e=>setLatitude(e.target.value)} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm">rating *</label>
              <input type="number" step="0.1" min="0" max="5" className="w-full rounded border px-3 py-2" defaultValue="0" onChange={e=>setRating(e.target.value)} required />
            </div>
            <div>
              <label className="text-sm">deposit *</label>
              <input type="number" step="0.01" min="0" className="w-full rounded border px-3 py-2" defaultValue="0" onChange={e=>setDeposit(e.target.value)} required />
            </div>
            <div>
              <label className="text-sm">price_per_hour *</label>
              <input type="number" step="0.01" min="0" className="w-full rounded border px-3 py-2" defaultValue="0" onChange={e=>setPricePerHour(e.target.value)} required />
            </div>
          </div>

          <div>
            <label className="text-sm">อีเมลร้าน</label>
            <input type="email" className="w-full rounded border px-3 py-2" onChange={e=>setContactEmail(e.target.value)} />
          </div>
          <div>
            <label className="text-sm">ที่อยู่เต็ม</label>
            <input className="w-full rounded border px-3 py-2" onChange={e=>setFullAddress(e.target.value)} />
          </div>
          <div>
            <label className="text-sm">คำอธิบาย</label>
            <input className="w-full rounded border px-3 py-2" onChange={e=>setDescription(e.target.value)} />
          </div>

          <div>
            <label className="text-sm">รูปภาพร้าน *</label>
            <input ref={fileRef} type="file" accept="image/*" className="w-full rounded border px-3 py-2" onChange={(e)=>setImageFile(e.target.files?.[0] ?? null)} required />
            <p className="text-xs text-gray-500">อัปโหลดไป bucket "{BUCKET}" (ชื่อไฟล์จะถูกแปลงเป็น ASCII)</p>
          </div>

          <button disabled={loading} className="w-full rounded bg-black px-4 py-2 text-white disabled:opacity-50">
            {loading ? "กำลังบันทึก…" : "บันทึก"}
          </button>

          {msg && <div className="rounded bg-gray-50 p-3 text-sm">{msg}</div>}
        </form>
      </div>
    </main>
  );
}
