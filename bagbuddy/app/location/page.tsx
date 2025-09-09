"use client";
import React, { useState } from "react";
import { Search, Filter, MapPin, Star, Navigation } from "lucide-react";

const LocationInterface: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDetails, setShowDetails] = useState(true);

  const locationData = {
    name: "พอใจฟู๊ด",
    rating: 5.0,
    reviewCount: 10,
    distance: "0.5 km",
    image: "https://via.placeholder.com/400x200/1F41BB/ffffff?text=Shop+Image",
  };

  return (
    <div
      className="min-h-screen bg-[#f5f7fb] flex flex-col"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      {/* Search Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหา"
            className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F41BB] focus:border-transparent text-gray-900 bg-[#f5f7fb]"
            style={{ fontFamily: "Poppins, sans-serif" }}
          />
          <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#1F41BB] w-5 h-5 cursor-pointer" />
        </div>
      </div>

      {/* Map Section */}
      <div className="flex-1 relative bg-gradient-to-br from-[#eaf0fa] to-[#cfd8f6]">
        {/* Map Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" className="w-full h-full">
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="#ddd"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Street Labels */}
        <div className="absolute top-4 left-4 text-xs text-gray-600 bg-white/80 px-2 py-1 rounded">
          ซ. หลังบ่อ 9
        </div>
        <div className="absolute top-16 right-4 text-xs text-gray-600 bg-white/80 px-2 py-1 rounded">
          ย. หลังบ่อ 9
        </div>
        <div className="absolute bottom-20 left-4 text-xs text-gray-600 bg-white/80 px-2 py-1 rounded">
          ถ. หลังบ่อ
        </div>

        {/* Location Markers */}
        <div className="absolute top-1/4 right-1/4">
          <div className="relative">
            <div className="bg-[#1F41BB] text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg">
              Constant Café Khon Kaen หลังบ่องอนแก้ม
              <div className="absolute -bottom-2 left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[#1F41BB]"></div>
            </div>
          </div>
        </div>

        <div className="absolute top-1/2 right-1/3">
          <div className="w-12 h-12 bg-[#1F41BB] rounded-full flex items-center justify-center shadow-lg">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-[#1F41BB] rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Current Location */}
        <div className="absolute bottom-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          <div className="w-4 h-4 bg-[#1F41BB] rounded-full shadow-lg border-2 border-white"></div>
        </div>
      </div>

      {/* Bottom Details Panel */}
      {showDetails && (
        <div className="bg-white rounded-t-3xl shadow-2xl">
          <div className="p-1">
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>
          </div>
          <div className="px-4 pb-4">
            {/* Restaurant Image */}
            <div className="w-full h-40 bg-gray-100 rounded-xl mb-4 overflow-hidden flex items-center justify-center">
              <img
                src={locationData.image}
                alt={locationData.name}
                className="w-full h-full object-cover"
                onError={(e) =>
                  (e.currentTarget.src =
                    "https://via.placeholder.com/400x200/1F41BB/ffffff?text=No+Image")
                }
              />
            </div>
            {/* Restaurant Info */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2
                  className="text-xl font-bold text-gray-900"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {locationData.name}
                </h2>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  เปิด
                </span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{locationData.rating}</span>
                  <span>({locationData.reviewCount})</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4 text-[#1F41BB]" />
                  <span>{locationData.distance}</span>
                </div>
              </div>
              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button className="flex-1 bg-[#1F41BB] text-white py-3 rounded-lg font-medium hover:bg-[#17337e] transition-colors shadow">
                  ผ่าน
                </button>
                <button className="flex-1 border border-[#1F41BB] text-[#1F41BB] py-3 rounded-lg font-medium hover:bg-[#eaf0fa] transition-colors shadow">
                  รายละเอียด
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Button */}
      <button className="fixed bottom-32 right-4 w-12 h-12 bg-[#1F41BB] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#17337e] transition-colors">
        <Navigation className="w-5 h-5" />
      </button>
    </div>
  );
};

export default LocationInterface;
