export interface Shop {
  id: string
  name: string
  category: string
  address: string
  coordinates: {
    lat: number
    lng: number
  }
  rating: number
  reviewCount: number
  images: string[]
  operatingHours: OperatingHours[]
  amenities: Amenity[]
  storageOptions: StorageOption[]
  pricePerHour: number
  isActive: boolean
  isFavorite?: boolean
}

export interface OperatingHours {
  day: string
  hours: string
  isOpen: boolean
}

export interface Amenity {
  id: string
  name: string
  icon: string
  available: boolean
  description?: string
}

export interface StorageOption {
  id: string
  size: 'small' | 'medium' | 'large'
  name: string
  description: string
  pricePerHour: number
  availableSlots: number
  maxSlots: number
  dimensions?: {
    width: number
    height: number
    depth: number
  }
}

export interface Review {
  id: string
  userId: string
  userName: string
  userAvatar: string
  rating: number
  comment: string
  date: string
  images?: string[]
  helpful: number
  shopResponse?: {
    message: string
    date: string
  }
}

export interface RatingBreakdown {
  overall: number
  cleanliness: number
  safety: number
  service: number
  convenience: number
  distribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
}

export interface BookingAvailability {
  date: string
  timeSlots: TimeSlot[]
}

export interface TimeSlot {
  startTime: string
  endTime: string
  available: boolean
  price: number
  storageOption: string
}