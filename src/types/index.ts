export type Category =
  | 'furniture'
  | 'kitchen'
  | 'electronics'
  | 'bedding'
  | 'books'
  | 'clothes'
  | 'other'

export type Condition = 'like_new' | 'good' | 'fair'

export interface BundleItem {
  name: string
  price: number
}

export interface Listing {
  id: string
  created_at: string
  title: string
  description: string
  price: number
  category: Category
  condition: Condition
  image_url: string | null
  seller_name: string
  seller_email: string
  seller_country: string
  university: string
  leaving_date: string | null
  is_urgent: boolean
  is_sold: boolean
  user_id: string | null
  is_bundle: boolean
  bundle_items: BundleItem[]
  pickup_lat: number | null
  pickup_lng: number | null
  pickup_address: string | null
}

export interface Message {
  id: string
  created_at: string
  listing_id: string
  sender_name: string
  sender_email: string
  message: string
}

export interface Favorite {
  id: string
  created_at: string
  user_id: string
  listing_id: string
}

export interface Conversation {
  id: string
  created_at: string
  listing_id: string
  buyer_email: string
  buyer_name: string
}

export interface ChatMessage {
  id: string
  created_at: string
  conversation_id: string
  sender_email: string
  sender_name: string
  content: string
}
