"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const BUCKET = "shop-images";
const DEV_ACCOUNT_ID = "your-dev-account-id"; // Add your dev account ID here

export default function Page() {
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [shop_name, setShopName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("");
  const [shop_type, setShopType] = useState<string>(""); 
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

  useEffect(() => {
    (async () => {
      const { data: st } = await supabase.from("v_enum_shop_status").select("value");
      const stVals = (st?.map((x: any) => x.value) ?? []) as string[];
      const stFinal = stVals.length ? stVals : ["approve"];
      setStatusOptions(stFinal);
      setStatus(stFinal[0]);

      const { data: tp } = await supabase.from("v_enum_shop_type").select("value");
      const tpVals = (tp?.map((x: any) => x.value) ?? []) as string[];
      const tpFinal = tpVals.length ? tpVals : ["Shop"];
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
      const ext = imageFile.name.split(".").pop() || "jpg";
      const base = asciiKey(shop_name || full_address || "shop");
      const fileName = `${base}-${Date.now()}.${ext}`;

      const up = await supabase.storage
        .from(BUCKET)
        .upload(fileName, imageFile, {
          upsert: false,
          contentType: imageFile.type || "image/*",
        });
      if (up.error) throw up.error;

      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
      const imageUrl = pub.publicUrl;
      if (!imageUrl) throw new Error("ได้ URL รูปว่าง");

      const payload = {
        shop_name,
        phone,
        contact_email: contact_email || null,
        full_address: full_address || null,
        description: description || null,
        longitude: longitudeNum,
        latitude: latitudeNum,
        rating: num(rating, 0),
        deposit: num(deposit, 0),
        price_per_hour: num(pricePerHour, 0),
        status,
        shop_type: shop_type || null,
        accountId: DEV_ACCOUNT_ID,
        image: imageUrl,
      };

      const { error: upsertErr } = await supabase
        .from("shops")
        .upsert(payload, { onConflict: "accountId" });
      if (upsertErr) throw upsertErr;

      setMsg("บันทึก/อัปเดตร้านสำเร็จ!");

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
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="mx-auto max-w-4xl px-6">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: "#1F41BB" }}>
            ลงทะเบียนร้าน
          </h1>
          <p className="text-gray-500">
            กรอกข้อมูลร้านค้าของคุณเพื่อเริ่มต้นใช้งาน
          </p>
          <div className="inline-flex items-center gap-2 mt-3 px-3 py-1 bg-blue-50 rounded-full">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
           
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <h2 className="text-xl font-semibold text-white">ข้อมูลร้านค้า</h2>
            <p className="text-blue-100 text-sm mt-1">กรุณากรอกข้อมูลให้ครบถ้วน</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Basic Info Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white" style={{ backgroundColor: "#1F41BB" }}>
                  1
                </div>
                <h3 className="text-lg font-semibold" style={{ color: "#1F41BB" }}>ข้อมูลพื้นฐาน</h3>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">ชื่อร้าน *</label>
                  <input 
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                    placeholder="ชื่อร้านค้าของคุณ"
                    onChange={e=>setShopName(e.target.value)} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">โทรศัพท์ *</label>
                  <input 
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                    placeholder="0xx-xxx-xxxx"
                    onChange={e=>setPhone(e.target.value)} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">สถานะ *</label>
                  <select 
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                    value={status} 
                    onChange={e=>setStatus(e.target.value)} 
                    required
                  >
                    {statusOptions.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                  
                </div>
              </div>
            </div>

            {/* Location & Type Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white" style={{ backgroundColor: "#1F41BB" }}>
                  2
                </div>
                <h3 className="text-lg font-semibold" style={{ color: "#1F41BB" }}>ตำแหน่งและประเภท</h3>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">ประเภทร้าน</label>
                  <select 
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                    value={shop_type} 
                    onChange={e=>setShopType(e.target.value)}
                  >
                    <option value="">(เลือกประเภท)</option>
                    {typeOptions.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                  
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">ลองจิจูด *</label>
                  <input 
                    type="number" 
                    step="0.000001" 
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                    placeholder="100.523186"
                    onChange={e=>setLongitude(e.target.value)} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">ละติจูด</label>
                  <input 
                    type="number" 
                    step="0.000001" 
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                    placeholder="13.736717"
                    onChange={e=>setLatitude(e.target.value)} 
                  />
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white" style={{ backgroundColor: "#1F41BB" }}>
                  3
                </div>
                <h3 className="text-lg font-semibold" style={{ color: "#1F41BB" }}>ราคาและเรตติ้ง</h3>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">เรตติ้ง *</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    min="0" 
                    max="5" 
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                    defaultValue="0" 
                    onChange={e=>setRating(e.target.value)} 
                    required 
                  />
                  <p className="text-xs text-gray-500">0.0 - 5.0</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">เงินมัดจำ *</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                    defaultValue="0" 
                    placeholder="฿"
                    onChange={e=>setDeposit(e.target.value)} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">ราคาต่อชั่วโมง *</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                    defaultValue="0" 
                    placeholder="฿"
                    onChange={e=>setPricePerHour(e.target.value)} 
                    required 
                  />
                </div>
              </div>
            </div>

            {/* Contact & Details Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white" style={{ backgroundColor: "#1F41BB" }}>
                  4
                </div>
                <h3 className="text-lg font-semibold" style={{ color: "#1F41BB" }}>ข้อมูลติดต่อและรายละเอียด</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">อีเมลติดต่อ</label>
                  <input 
                    type="email" 
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                    placeholder="contact@yourshop.com"
                    onChange={e=>setContactEmail(e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">ที่อยู่เต็ม</label>
                  <input 
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                    placeholder="123 ถนน... แขวง... เขต... กรุงเทพฯ 10xxx"
                    onChange={e=>setFullAddress(e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">คำอธิบายร้าน</label>
                  <textarea 
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[100px]" 
                    placeholder="บอกเล่าเกี่ยวกับร้านของคุณ..."
                    onChange={e=>setDescription(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white" style={{ backgroundColor: "#1F41BB" }}>
                  5
                </div>
                <h3 className="text-lg font-semibold" style={{ color: "#1F41BB" }}>รูปภาพร้าน</h3>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">อัปโหลดรูปร้าน *</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-400 transition-colors duration-200">
                  <input 
                    ref={fileRef} 
                    type="file" 
                    accept="image/*" 
                    className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
                    onChange={(e)=>setImageFile(e.target.files?.[0] ?? null)} 
                    required 
                  />
                  <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>อัปโหลดไป bucket "{BUCKET}" (ชื่อไฟล์จะถูกแปลงเป็น ASCII)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <button 
                disabled={loading} 
                className="w-full rounded-xl px-6 py-4 text-white font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                style={{ 
                  backgroundColor: loading ? "#9CA3AF" : "#1F41BB",
                  backgroundImage: loading ? "none" : "linear-gradient(135deg, #1F41BB 0%, #3B82F6 100%)"
                }}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>กำลังบันทึก...</span>
                  </div>
                ) : (
                  "บันทึกข้อมูลร้าน"
                )}
              </button>
            </div>

            {/* Message Display */}
            {msg && (
              <div className={`rounded-xl p-4 text-sm border-l-4 ${
                msg.includes('สำเร็จ') 
                  ? 'bg-green-50 border-green-400 text-green-700' 
                  : 'bg-red-50 border-red-400 text-red-700'
              }`}>
                <div className="flex items-center gap-2">
                  {msg.includes('สำเร็จ') ? (
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span>{msg}</span>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}