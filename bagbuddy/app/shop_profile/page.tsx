"use client"
import { useState } from 'react'
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  Star, 
  MapPin, 
  Clock, 
  Shield, 
  Camera,
  Wifi,
  AirVent,
  Lock,
  CreditCard,
  Phone,
  Car,
  Coffee,
  Zap,
  Users,
  Package,
  CheckCircle2,
  ChevronRight
} from 'lucide-react'

interface Review {
  id: number
  name: string
  rating: number
  date: string
  comment: string
  avatar: string
}

interface Amenity {
  icon: React.ReactNode
  name: string
  available: boolean
}

const ShopProfileOverview = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)

  const shopImages = [
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1497366411874-3415097a27e7?w=800&h=600&fit=crop"
  ]

  const reviews: Review[] = [
    {
      id: 1,
      name: "สมชาย ใจดี",
      rating: 5,
      date: "2 วันที่แล้ว",
      comment: "บริการดีมาก ปลอดภัย สะดวก อยู่ใกล้สถานีมาก เจ้าหน้าที่เป็นกันเอง จะกลับมาใช้บริการอีกแน่นอน",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "นางสาวอารีย์ สวยงาม",
      rating: 4,
      date: "1 สัปดาห์ที่แล้ว",
      comment: "สถานที่สะอาด กระบวนการฝากง่าย แต่ช่วงเวลาเร่งรีบจะแออัดหน่อย โดยรวมแล้วพอใจมาก",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616c2a01d8d?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "วิทยา เดินทาง",
      rating: 5,
      date: "2 สัปดาห์ที่แล้ว", 
      comment: "ฝากกระเป๋าไป 3 วัน ปลอดภัยดี มี CCTV ตลอด 24 ชม. ราคาสมเหตุสมผล แนะนำเลย",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    }
  ]

  const amenities: Amenity[] = [
    { icon: <Shield className="w-5 h-5" />, name: "ระบบรักษาความปลอดภัย 24/7", available: true },
    { icon: <Camera className="w-5 h-5" />, name: "กล้องวงจรปิด", available: true },
    { icon: <Lock className="w-5 h-5" />, name: "ล็อกเกอร์ส่วนตัว", available: true },
    { icon: <AirVent className="w-5 h-5" />, name: "ระบบปรับอากาศ", available: true },
    { icon: <Wifi className="w-5 h-5" />, name: "Wi-Fi ฟรี", available: true },
    { icon: <CreditCard className="w-5 h-5" />, name: "รับชำระด้วยบัตรเครดิต", available: true },
    { icon: <Phone className="w-5 h-5" />, name: "ติดต่อได้ตลอด 24 ชม.", available: true },
    { icon: <Car className="w-5 h-5" />, name: "ที่จอดรถ", available: false },
    { icon: <Coffee className="w-5 h-5" />, name: "เครื่องดื่ม", available: false },
    { icon: <Zap className="w-5 h-5" />, name: "ชาร์จโทรศัพท์", available: true }
  ]

  const operatingHours = [
    { day: "จันทร์ - ศุกร์", hours: "06:00 - 22:00" },
    { day: "เสาร์ - อาทิตย์", hours: "07:00 - 21:00" },
    { day: "วันหยุดนักขัตฤกษ์", hours: "07:00 - 20:00" }
  ]

  const storageOptions = [
    { 
      size: "กระเป๋าเล็ก", 
      description: "กระเป๋าเดินทาง ขนาด ≤ 20 นิ้ว", 
      price: "25 ฿/ชั่วโมง",
      available: 15 
    },
    { 
      size: "กระเป๋ากลาง", 
      description: "กระเป๋าเดินทาง 21-26 นิ้ว", 
      price: "30 ฿/ชั่วโมง",
      available: 8 
    },
    { 
      size: "กระเป๋าใหญ่", 
      description: "กระเป๋าเดินทาง ≥ 27 นิ้ว", 
      price: "35 ฿/ชั่วโมง",
      available: 3 
    }
  ]

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'BagBuddy - Central Station',
        text: 'บริการฝากกระเป๋าที่ปลอดภัยและสะดวก',
        url: window.location.href
      })
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
      />
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4">
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </button>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white transition-colors"
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-800'}`} />
          </button>
          <button 
            onClick={handleShare}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white transition-colors"
          >
            <Share2 className="w-5 h-5 text-gray-800" />
          </button>
        </div>
      </header>

      {/* Image Gallery */}
      <div className="relative h-80 sm:h-96 lg:h-[28rem] w-full">
        <div className="absolute inset-0 flex overflow-x-auto snap-x snap-mandatory [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {shopImages.map((image, index) => (
            <img 
              key={index}
              alt={`Shop view ${index + 1}`}
              className="h-full w-full flex-shrink-0 snap-center object-cover" 
              src={image}
              onLoad={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>
        {/* Image indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {shopImages.map((_, index) => (
            <div 
              key={index}
              className={`h-2 w-2 rounded-full transition-colors ${
                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="bg-white -mt-4 relative z-10 rounded-t-3xl pb-32">
        {/* Shop Info */}
        <div className="px-4 sm:px-6 pt-6 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                BagBuddy - Central Station
              </h1>
              <div className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 mb-3">
                บริการฝากกระเป๋า
              </div>
              <div className="flex items-start gap-2 text-gray-600 mb-3">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span className="text-sm">123 ถนนใหญ่ สถานีกลาง กรุงเทพมหานคร 10500</span>
              </div>
            </div>
            
            {/* Rating */}
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-bold text-lg text-gray-900">4.9</span>
              </div>
              <span className="text-gray-600 text-sm">(125 รีวิว)</span>
            </div>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="px-4 sm:px-6 py-6 border-y border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            เวลาทำการ
          </h2>
          <div className="space-y-2">
            {operatingHours.map((schedule, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-600">{schedule.day}</span>
                <span className="font-medium text-gray-900">{schedule.hours}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Storage Options */}
        <div className="px-4 sm:px-6 py-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            ตัวเลือกการฝาก
          </h2>
          <div className="space-y-3">
            {storageOptions.map((option, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{option.size}</h3>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-600">{option.price}</div>
                    <div className="text-xs text-gray-500">เหลือ {option.available} ช่อง</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div className="px-4 sm:px-6 py-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-blue-600" />
            สิ่งอำนวยความสะดวก
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {amenities.map((amenity, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  amenity.available ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  {amenity.icon}
                </div>
                <span className={`text-sm ${
                  amenity.available ? 'text-gray-900' : 'text-gray-400 line-through'
                }`}>
                  {amenity.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Review Snapshot */}
        <div className="px-4 sm:px-6 py-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">ภาพรวมคะแนน</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Rating Breakdown */}
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-12">{stars} ดาว</span>
                  <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 rounded-full transition-all duration-300" 
                      style={{ 
                        width: stars === 5 ? '90%' : stars === 4 ? '8%' : stars === 3 ? '2%' : '0%' 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Category Ratings */}
            <div className="space-y-3">
              {[
                { category: 'ความสะอาด', rating: 4.9 },
                { category: 'ความปลอดภัย', rating: 5.0 },
                { category: 'การบริการ', rating: 4.8 },
                { category: 'ความสะดวก', rating: 4.9 }
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{item.category}</span>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-sm text-gray-900">{item.rating}</span>
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="px-4 sm:px-6 py-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">รีวิวจากลูกค้า</h2>
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="flex gap-4">
                <img 
                  alt={`${review.name} profile`}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0" 
                  src={review.avatar}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{review.name}</h3>
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 flex-shrink-0">{review.date}</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-6 rounded-xl border border-blue-600 py-3 px-6 text-center font-medium text-blue-600 transition-colors hover:bg-blue-50 flex items-center justify-center gap-2">
            ดูรีวิวทั้งหมด (125)
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </main>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">30 ฿</p>
              <p className="text-sm text-gray-500">/ ชั่วโมง</p>
            </div>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg">
            ตรวจสอบความพร้อม
          </button>
        </div>
      </div>
    </div>
  )
}

export default ShopProfileOverview