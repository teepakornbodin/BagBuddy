"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  GoogleMap,
  Marker,
  StandaloneSearchBox,
  useLoadScript,
} from "@react-google-maps/api";
import { IoIosSearch } from "react-icons/io";

type Store = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category?: string;
  address?: string;
  image?: string;
  rating?: number;
  phone?: string;
  pricePerHour?: number;
  deposit?: number;
};

type BookingForm = {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  itemDescription: string;
  depositAmount: number;
  startDate: string;
  endDate: string;
  notes: string;
};

// Booking Form Component
const BookingFormComponent = ({ 
  store, 
  onClose, 
  onSubmit 
}: { 
  store: Store; 
  onClose: () => void; 
  onSubmit: (formData: BookingForm) => void;
}) => {
  const [formData, setFormData] = useState<BookingForm>({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    itemDescription: "",
    depositAmount: store.deposit || 0,
    startDate: "",
    endDate: "",
    notes: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'depositAmount' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="p-4 h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onClose}
          className="text-blue-600 font-medium"
        >
          ← ย้อนกลับ
        </button>
        <h3 className="text-lg font-semibold">จองฝากสินค้า</h3>
        <div></div>
      </div>

      {/* Store Info */}
      <div className="bg-gray-50 rounded-lg p-3 mb-4">
        <div className="flex gap-3">
          <img
            src={store.image || "https://placehold.co/100x100"}
            alt={store.name}
            className="w-12 h-12 rounded object-cover"
          />
          <div>
            <p className="font-medium">{store.name}</p>
            <p className="text-sm text-gray-600">{store.address}</p>
          </div>
        </div>
      </div>

      {/* Booking Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Customer Information */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">ข้อมูลผู้ใช้บริการ</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ชื่อ-นามสกุล *
            </label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="กรุณากรอกชื่อ-นามสกุล"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              เบอร์โทรศัพท์ *
            </label>
            <input
              type="tel"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="08x-xxx-xxxx"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              อีเมล
            </label>
            <input
              type="email"
              name="customerEmail"
              value={formData.customerEmail}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="example@email.com"
            />
          </div>
        </div>

        {/* Item Information */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">รายละเอียดสินค้า</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              รายละเอียดสินค้าที่ต้องการฝาก *
            </label>
            <textarea
              name="itemDescription"
              value={formData.itemDescription}
              onChange={handleInputChange}
              required
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              placeholder="อธิบายสินค้าที่ต้องการฝาก เช่น กระเป๋าเดินทาง, กล่องเอกสาร, ฯลฯ"
            />
          </div>
        </div>

        {/* Booking Details */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">รายละเอียดการจอง</h4>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                วันที่เริ่มฝาก *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                วันที่รับคืน *
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              จำนวนเงินมัดจำ (บาท)
            </label>
            <input
              type="number"
              name="depositAmount"
              value={formData.depositAmount}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              หมายเหตุเพิ่มเติม
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={2}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              placeholder="ข้อมูลเพิ่มเติม (ถ้ามี)"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            ยืนยันการจอง
          </button>
        </div>
      </form>
    </div>
  );
};

export default function HomePage() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey:
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
      process.env.GOOGLE_MAPS_API_KEY!,
    libraries: ["places"],
  });

  const [stores, setStores] = useState<Store[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selected, setSelected] = useState<Store | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const mapRef = useRef<google.maps.Map | null>(null);
  const searchBoxRef = useRef<StandaloneSearchBox | null>(null);

  // โหลดร้าน
  useEffect(() => {
    fetch("/api/stores", { cache: "no-store" })
      .then((res) => res.json())
      .then((data: Store[]) => setStores(data))
      .catch(console.error);
  }, []);

  console.log(stores);

  // ศูนย์กลางสำรอง: ขอนแก่น
  const fallbackCenter = useMemo(
    () => ({ lat: 16.4419, lng: 102.835 }),
    []
  );

  const fitToStores = () => {
    if (!mapRef.current || stores.length === 0) return;
    const bounds = new google.maps.LatLngBounds();
    stores.forEach((s) => bounds.extend({ lat: s.lat, lng: s.lng }));
    mapRef.current.fitBounds(bounds, 32);
  };

  const onMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    if (stores.length > 0) {
      fitToStores();
    } else {
      map.setCenter(fallbackCenter);
      map.setZoom(13);
    }
  };

  useEffect(() => {
    if (isLoaded && mapRef.current && stores.length > 0) {
      fitToStores();
    }
  }, [isLoaded, stores]);

  // ป้องกัน scroll body เมื่อเปิด bottom sheet
  useEffect(() => {
    if (selected) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [selected]);

  const handleStoreSelect = (store: Store) => {
    setSelected(store);
    setSheetOpen(false);
    setShowBookingForm(false); // Reset booking form state
  };

  const onPlacesChanged = () => {
    const places = searchBoxRef.current?.getPlaces();
    if (!places || places.length === 0) return;

    const place = places[0];
    if (!place.geometry || !place.geometry.location) return;

    const location = place.geometry.location;
    mapRef.current?.panTo(location);
    mapRef.current?.setZoom(15);

    setSelected({
      id: place.place_id || "search",
      name: place.name || "Unknown",
      lat: location.lat(),
      lng: location.lng(),
      address: place.formatted_address,
    });
    setShowBookingForm(false); // Reset booking form state
  };

  const closeSheet = () => {
    setSelected(null);
    setSheetOpen(false);
    setShowBookingForm(false);
  };

  const handleMarkerClick = (store: Store) => {
    setSelected(store);
    setSheetOpen(false);
    setShowBookingForm(false); // Reset booking form state
  };

  // Handle booking button click
  const handleBookingClick = () => {
    setShowBookingForm(true);
  };

  // Handle booking form submission
  const handleBookingSubmit = (formData: BookingForm) => {
    console.log("Booking submitted:", formData);
    // Here you would typically send the data to your API
    alert("การจองสำเร็จ! เราจะติดต่อกลับเร็วๆ นี้");
    setShowBookingForm(false);
    closeSheet();
  };

  // Handle back from booking form
  const handleBackFromBooking = () => {
    setShowBookingForm(false);
  };

  if (loadError)
    return <div className="p-6 text-red-600">โหลดแผนที่ไม่สำเร็จ</div>;
  if (!isLoaded)
    return <div className="p-6 animate-pulse">กำลังโหลดแผนที่…</div>;

  return (
    <main className="fixed inset-0">
      <GoogleMap
        onLoad={onMapLoad}
        mapContainerStyle={{ width: "100vw", height: "100dvh" }}
        options={{
          gestureHandling: "greedy",
          clickableIcons: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          zoomControl: false,
        }}
      >
        {/* Search Bar */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[80%] max-w-md z-50">
          <StandaloneSearchBox
            onLoad={(ref) => (searchBoxRef.current = ref)}
            onPlacesChanged={onPlacesChanged}
          >
            <div className="flex items-center bg-white rounded-xl shadow-md border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500">
              <IoIosSearch size={24} className="ml-3 fill-blue-600" />
              <input
                type="text"
                placeholder="ค้นหาสถานที่..."
                className="flex-1 p-3 rounded-lg outline-none bg-transparent placeholder:text-gray-400"
              />
            </div>
          </StandaloneSearchBox>
        </div>

        {stores.map((s) => (
          <Marker
            key={s.id}
            position={{ lat: s.lat, lng: s.lng }}
            title={s.name}
            onClick={() => handleMarkerClick(s)}
            icon={{
              url: s.image || "https://placehold.co/50x50",
              scaledSize: new google.maps.Size(35, 35),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(25, 50),
            }}
          />
        ))}

        {/* Bottom Sheet */}
        {selected && (
          <div
            className="fixed left-0 right-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl transition-transform duration-300"
            style={{
              height: "80vh",
              transform: `translateY(${sheetOpen && !showBookingForm ? "0%" : "40%"})`,
            }}
            onTouchStart={(e) => {
              // Disable drag when booking form is open
              if (showBookingForm) return;
              
              const sheet = e.currentTarget as HTMLElement;
              const startY = e.touches[0].clientY;
              let currentY = startY;
              let isDragging = false;

              const handleMove = (moveEvent: TouchEvent) => {
                isDragging = true;
                currentY = moveEvent.touches[0].clientY;
                const diff = currentY - startY;

                const newY = sheetOpen ? diff : 0.6 * window.innerHeight + diff;
                sheet.style.transform = `translateY(${Math.max(0, newY)}px)`;
              };

              const handleEnd = () => {
                const diff = currentY - startY;

                if (diff > 200) {
                  closeSheet();
                } else if (diff > 100) {
                  setSheetOpen(false);
                } else if (diff < -100) {
                  setSheetOpen(true);
                }

                sheet.style.transform = `translateY(${sheetOpen ? "0%" : "40%"})`;

                document.removeEventListener("touchmove", handleMove);
                document.removeEventListener("touchend", handleEnd);
              };

              document.addEventListener("touchmove", handleMove, { passive: false });
              document.addEventListener("touchend", handleEnd);
            }}
          >
            {/* Close button - only show when not in booking form */}
            {!showBookingForm && (
              <button
                onClick={closeSheet}
                className="absolute top-4 right-4 z-10 w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-gray-600"
              >
                ×
              </button>
            )}

            {/* Booking Form */}
            {showBookingForm ? (
              <BookingFormComponent
                store={selected}
                onClose={handleBackFromBooking}
                onSubmit={handleBookingSubmit}
              />
            ) : (
              <div className="p-4 h-full overflow-y-auto">
                {/* drag handle */}
                <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />

                {/* collapsed view → selected store */}
                {!sheetOpen && (
                  <div>
                    <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                      <img
                        src={selected.image || "https://placehold.co/800x400"}
                        alt={selected.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-semibold">{selected.name}</h3>
                    {selected.address && (
                      <p className="text-sm text-gray-600">{selected.address}</p>
                    )}
                    {selected.phone && (
                      <p className="text-sm text-gray-600">โทร: {selected.phone}</p>
                    )}
                    <div className="flex gap-3 mt-4">
                      <button 
                        onClick={handleBookingClick}
                        className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      >
                        ฝาก
                      </button>
                      <button className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                        รายละเอียด
                      </button>
                    </div>
                  </div>
                )}

                {/* expanded view → all stores */}
                {sheetOpen && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold">ร้านใกล้เคียง</h4>
                    {stores.map((s) => (
                      <div
                        key={s.id}
                        className="flex gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleStoreSelect(s)}
                      >
                        <img
                          src={s.image || "https://placehold.co/100x100"}
                          alt={s.name}
                          className="w-16 h-16 rounded object-cover"
                        />
                        <div>
                          <p className="font-medium">{s.name}</p>
                          {s.address && (
                            <p className="text-sm text-gray-500">{s.address}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </GoogleMap>
    </main>
  );
}