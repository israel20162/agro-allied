import { useState } from 'react'
import StatusBadge from '../components/StatusBadge'
import { formatNaira } from '../lib/helpers'
import { supabase } from '../lib/supabase'
import type { OrderStatus } from '../lib/types'

type Summary = { order_number: string; status: OrderStatus; total: number; created_at: string }

export default function TrackOrder() {
  const [orderNumber, setOrderNumber] = useState('')
  const [order, setOrder] = useState<Summary | null>(null)
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSearch() {
    setLoading(true)
    const { data } = await supabase.rpc('get_order_status', {
      p_order_number: orderNumber.trim().toUpperCase(),
    })
    setOrder(data?.[0] ?? null)
    setSearched(true)
    setLoading(false)
  }

  return (
    <section className="mx-auto max-w-xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold text-leaf-800">Track your order</h1>
      <p className="mt-1 text-leaf-600">Enter the order number from your receipt page.</p>

      <div className="mt-6 flex gap-2">
        <input
          className="input"
          value={orderNumber}
          onChange={(event) => setOrderNumber(event.target.value)}
          placeholder="AF-1234-AB"
        />
        <button type="button" onClick={handleSearch} disabled={loading} className="btn-primary shrink-0">
          {loading ? 'Checking' : 'Check'}
        </button>
      </div>

      {searched && !order && (
        <p className="mt-6 rounded-2xl bg-leaf-50 p-5 text-leaf-600">
          No order with that number. Check the spelling, or message us on WhatsApp and we will find
          it by your phone number.
        </p>
      )}

      {order && (
        <div className="card mt-6 p-6 text-center">
          <p className="font-display text-3xl font-bold text-leaf-800">{order.order_number}</p>
          <p className="mt-2 font-semibold text-leaf-700">{formatNaira(order.total)}</p>
          <div className="mt-4"><StatusBadge status={order.status} /></div>
        </div>
      )}
    </section>
  )
}
