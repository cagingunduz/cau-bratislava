export type Category =
  | 'furniture'
  | 'kitchen'
  | 'electronics'
  | 'bedding'
  | 'books'
  | 'clothes'
  | 'other'

export type Condition = 'like_new' | 'good' | 'fair'

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
}

export interface Message {
  id: string
  created_at: string
  listing_id: string
  sender_name: string
  sender_email: string
  message: string
}
