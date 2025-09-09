import { StorageOption, OperatingHours } from './types'

export const formatPrice = (price: number): string => {
  return `${price.toLocaleString()} ฿`
}

export const formatRating = (rating: number): string => {
  return rating.toFixed(1)
}

export const getStorageOptionColor = (size: 'small' | 'medium' | 'large'): string => {
  const colors = {
    small: 'bg-green-50 border-green-200 text-green-700',
    medium: 'bg-blue-50 border-blue-200 text-blue-700', 
    large: 'bg-orange-50 border-orange-200 text-orange-700'
  }
  return colors[size]
}

export const getAvailabilityStatus = (availableSlots: number, maxSlots: number) => {
  const percentage = (availableSlots / maxSlots) * 100
  
  if (percentage === 0) {
    return { status: 'full', color: 'text-red-600', message: 'เต็มแล้ว' }
  } else if (percentage <= 20) {
    return { status: 'low', color: 'text-orange-600', message: 'เหลือน้อย' }
  } else {
    return { status: 'available', color: 'text-green-600', message: 'ว่าง' }
  }
}

export const isShopOpen = (operatingHours: OperatingHours[]): boolean => {
  const now = new Date()
  const currentDay = now.toLocaleDateString('th-TH', { weekday: 'long' })
  const currentTime = now.toTimeString().slice(0, 5)
  
  const todayHours = operatingHours.find(schedule => 
    schedule.day.includes(currentDay) || 
    (schedule.day.includes('จันทร์ - ศุกร์') && ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์'].includes(currentDay)) ||
    (schedule.day.includes('เสาร์ - อาทิตย์') && ['เสาร์', 'อาทิตย์'].includes(currentDay))
  )
  
  if (!todayHours) return false
  
  const [openTime, closeTime] = todayHours.hours.split(' - ')
  return currentTime >= openTime && currentTime <= closeTime
}

export const calculateDiscountPrice = (originalPrice: number, discountPercent: number): number => {
  return originalPrice * (1 - discountPercent / 100)
}

export const getTimeUntilOpen = (operatingHours: OperatingHours[]): string | null => {
  if (isShopOpen(operatingHours)) return null
  
  const now = new Date()
  const currentDay = now.toLocaleDateString('th-TH', { weekday: 'long' })
  
  const todayHours = operatingHours.find(schedule => 
    schedule.day.includes(currentDay)
  )
  
  if (todayHours) {
    const [openTime] = todayHours.hours.split(' - ')
    const [hours, minutes] = openTime.split(':').map(Number)
    const openDateTime = new Date()
    openDateTime.setHours(hours, minutes, 0, 0)
    
    if (openDateTime > now) {
      const diff = openDateTime.getTime() - now.getTime()
      const diffHours = Math.floor(diff / (1000 * 60 * 60))
      const diffMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      
      if (diffHours > 0) {
        return `เปิดในอีก ${diffHours} ชั่วโมง ${diffMinutes} นาที`
      } else {
        return `เปิดในอีก ${diffMinutes} นาที`
      }
    }
  }
  
  return 'เปิดพรุ่งนี้'
}

export const shareShop = async (shopName: string, shopId: string) => {
  const shareData = {
    title: shopName,
    text: `ตรวจสอบบริการฝากกระเป๋าที่ ${shopName}`,
    url: `${window.location.origin}/shop/${shopId}`
  }
  
  if (navigator.share && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData)
    } catch (error) {
      // Fallback to clipboard
      await navigator.clipboard.writeText(shareData.url)
      return 'คัดลอกลิงก์แล้ว'
    }
  } else {
    // Fallback to clipboard
    await navigator.clipboard.writeText(shareData.url)
    return 'คัดลอกลิงก์แล้ว'
  }
}

export const generateImagePlaceholder = (width: number, height: number, text?: string): string => {
  return `https://via.placeholder.com/${width}x${height}/f1f5f9/64748b?text=${encodeURIComponent(text || 'Image')}`
}