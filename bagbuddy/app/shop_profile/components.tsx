import { Star, Clock, MapPin, Users } from "lucide-react";
import { Review, StorageOption, OperatingHours, Shop } from "./types";
import {
  formatPrice,
  formatRating,
  isShopOpen,
  getTimeUntilOpen,
} from "./utils";

// --- StarRating ---
interface StarRatingProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  showNumber?: boolean;
}
export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  size = "md",
  showNumber = false,
}) => {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`${sizeClasses[size]} ${
            i < Math.round(rating)
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300"
          }`}
          fill={i < Math.round(rating) ? "currentColor" : "none"}
        />
      ))}
      {showNumber && (
        <span className="ml-1 text-sm text-gray-700">
          {formatRating(rating)}
        </span>
      )}
    </div>
  );
};

// --- ShopInfo ---
interface ShopInfoProps {
  shop: Shop;
}
export const ShopInfo: React.FC<ShopInfoProps> = ({ shop }) => (
  <div className="mb-4">
    <h2 className="text-2xl font-bold mb-1">{shop.name}</h2>
    <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
      <MapPin className="w-4 h-4" />
      <span>{shop.address}</span>
    </div>
    <div className="flex items-center gap-4">
      <StarRating rating={shop.rating} showNumber />
      <span className="text-gray-500 text-sm">({shop.reviewCount} รีวิว)</span>
      <span
        className={`ml-2 text-xs px-2 py-1 rounded ${
          shop.isActive
            ? "bg-green-100 text-green-700"
            : "bg-gray-200 text-gray-500"
        }`}
      >
        {shop.isActive ? "เปิดให้บริการ" : "ปิดชั่วคราว"}
      </span>
    </div>
  </div>
);

// --- StorageOptions ---
interface StorageOptionsProps {
  options: StorageOption[];
}
export const StorageOptions: React.FC<StorageOptionsProps> = ({ options }) => (
  <div className="mb-6">
    <h3 className="font-semibold mb-2">ตัวเลือกฝากของ</h3>
    <div className="grid gap-3">
      {options.map((option) => (
        <div
          key={option.id}
          className="border rounded p-3 flex flex-col sm:flex-row sm:items-center gap-2"
        >
          <div className="font-medium">{option.name}</div>
          <div className="text-xs text-gray-500">{option.description}</div>
          <div className="ml-auto font-semibold">
            {formatPrice(option.pricePerHour)}/ชม.
          </div>
          <div className="text-xs text-gray-500">
            เหลือ {option.availableSlots}/{option.maxSlots}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// --- OperatingHours ---
interface OperatingHoursProps {
  hours: OperatingHours[];
}
export const OperatingHoursView: React.FC<OperatingHoursProps> = ({
  hours,
}) => (
  <div className="mb-6">
    <h3 className="font-semibold mb-2">เวลาเปิด-ปิด</h3>
    <ul className="text-sm text-gray-700">
      {hours.map((h, idx) => (
        <li key={idx} className={h.isOpen ? "" : "text-gray-400"}>
          {h.day}: {h.hours} {h.isOpen ? "" : "(ปิด)"}
        </li>
      ))}
    </ul>
  </div>
);

// --- Reviews ---
interface ReviewsProps {
  reviews: Review[];
}
export const Reviews: React.FC<ReviewsProps> = ({ reviews }) => (
  <div>
    <h3 className="font-semibold mb-2">รีวิว</h3>
    <div className="space-y-4">
      {reviews.map((r) => (
        <div key={r.id} className="border rounded p-3">
          <div className="flex items-center gap-2 mb-1">
            <img
              src={r.userAvatar}
              alt={r.userName}
              className="w-8 h-8 rounded-full"
            />
            <span className="font-medium">{r.userName}</span>
            <StarRating rating={r.rating} size="sm" />
            <span className="text-xs text-gray-400 ml-auto">{r.date}</span>
          </div>
          <div className="text-gray-700">{r.comment}</div>
        </div>
      ))}
    </div>
  </div>
);
