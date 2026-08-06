export type Product = {
  id: string
  name: string
  price: number
  unit: string
  category: string | null
  image_url: string | null
  in_stock: boolean
  created_at?: string
}

export type OrderStatus = 'pending' | 'paid' | 'almost_ready' | 'ready' | 'completed'

export type Order = {
  id: string
  order_number: string
  customer_name: string
  phone: string
  total: number
  status: OrderStatus
  payment_reference: string | null
  receipt_url: string | null
  shopping_list_url: string | null
  note: string | null
  created_at: string
  order_items?: OrderItem[]
}

export type OrderItem = {
  id: string
  order_id: string
  product_id: string | null
  product_name: string
  unit: string
  unit_price: number
  quantity: number
}

export type CartItem = {
  product: Product
  quantity: number
}
