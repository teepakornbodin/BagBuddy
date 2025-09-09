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

export default function HomePage() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey:
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
      process.env.GOOGLE_MAPS_API_KEY!,
    libraries: ["places"], // ✅ required for StandaloneSearchBox
  });

  const [stores, setStores] = useState<Store[]>([]);
  const [selected, setSelected] = useState<Store | null>(null);

  const mapRef = useRef<google.maps.Map | null>(null);
  const searchBoxRef = useRef<StandaloneSearchBox | null>(null);

  // โหลดร้าน
  useEffect(() => {
    fetch("/api/stores", { cache: "no-store" })
      .then((res) => res.json())
      .then((data: Store[]) => setStores(data))
      .catch(console.error);
  }, []);

  // ศูนย์กลางสำรอง: ขอนแก่น
  const fallbackCenter = useMemo(
    () => ({ lat: 16.4419, lng: 102.835 }),
    []
  );

  const fitToStores = () => {
    if (!mapRef.current || stores.length === 0) return;
    const bounds = new google.maps.LatLngBounds();
    stores.forEach((s) => bounds.extend({ lat: s.lat, lng: s.lng }));
    mapRef.current.fitBounds(bounds, 32); // padding 32px
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

  const onPlacesChanged = () => {
    const places = searchBoxRef.current?.getPlaces();
    if (!places || places.length === 0) return;

    const place = places[0];
    if (!place.geometry || !place.geometry.location) return;

    const location = place.geometry.location;
    mapRef.current?.panTo(location);
    mapRef.current?.setZoom(15);

    // ✅ Optional: add searched place as "selected"
    setSelected({
      id: place.place_id || "search",
      name: place.name || "Unknown",
      lat: location.lat(),
      lng: location.lng(),
      address: place.formatted_address,
    });
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
        {/* ✅ Search Bar */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[80%] max-w-md z-50">
          <StandaloneSearchBox
            onLoad={(ref) => (searchBoxRef.current = ref)}
            onPlacesChanged={onPlacesChanged}
          >
            {/* Wrap icon + input in one div */}
            <div className="flex items-center bg-white rounded-xl shadow-md border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500">
              <IoIosSearch size={24} className="ml-3 fill-blue-600" />
              <input
                type="text"
                placeholder="ค้นหาสถานที่..."
                className="flex-1 p-3 rounded-lg outline-none bg-transparent placeholder:text-gray-400 "
              />
            </div>
          </StandaloneSearchBox>
        </div>

        {/* ร้าน markers */}
        {stores.map((s) => (
          <Marker
            key={s.id}
            position={{ lat: s.lat, lng: s.lng }}
            title={s.name}
            onClick={() => setSelected(s)}
          />
        ))}

        {/* Bottom Sheet */}
        {selected && (
          <div
            className="fixed left-0 right-0 bottom-0 z-50 rounded-t-2xl shadow-2xl bg-white"
            style={{
              paddingBottom: "max(16px, env(safe-area-inset-bottom))",
            }}
          >
            <div className="p-4 relative">
              {/* handle bar */}
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />

              {/* ภาพร้าน */}
              <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                <img
                  src={selected.image || "https://placehold.co/800x400"}
                  alt={selected.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* ข้อมูลร้าน */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-semibold">{selected.name}</h3>
                  <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded">
                    อนุมัติ
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-700 mb-2">
                  {typeof selected.rating === "number" && (
                    <>
                      <span>★</span>
                      <span className="font-medium">
                        {selected.rating.toFixed(1)}
                      </span>
                    </>
                  )}
                  {selected.category && <span>• {selected.category}</span>}
                  {selected.pricePerHour != null && (
                    <span>• {selected.pricePerHour} บาท/ชม.</span>
                  )}
                  {selected.deposit != null && (
                    <span>• มัดจำ {selected.deposit} บาท</span>
                  )}
                </div>

                {selected.address && (
                  <p className="text-sm text-gray-600">{selected.address}</p>
                )}
                {selected.phone && (
                  <p className="text-sm text-gray-600 mt-1">
                    โทร: {selected.phone}
                  </p>
                )}
              </div>

              {/* ปุ่ม */}
              <div className="flex gap-3">
                <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium">
                  ฝาก
                </button>
                <button className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium">
                  รายละเอียด
                </button>
              </div>

              {/* ปิด */}
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
                aria-label="ปิด"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </GoogleMap>
    </main>
  );
}
