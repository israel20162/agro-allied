import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import StatusBadge from '../components/StatusBadge'
import { BUSINESS } from '../lib/config'
import { formatNaira } from '../lib/helpers'
import { supabase } from '../lib/supabase'
import type { OrderStatus } from '../lib/types';
import { useClipboard } from '../lib/helpers'
import CopyButton from '../components/CopyButton'
import toast from 'react-hot-toast'

type Summary = { order_number: string; status: OrderStatus; total: number; created_at: string }

export default function OrderConfirmation() {
  const { orderNumber = '' } = useParams()
  const [order, setOrder] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true);
  const { copy } = useClipboard()

  useEffect(() => {
    let active = true

    async function load() {
      // Security-definer function: returns status only, never other people's details.
      const { data } = await supabase.rpc('get_order_status', { p_order_number: orderNumber })
      if (active) {
        setOrder(data?.[0] ?? null)
        setLoading(false)
      }
    }

    load()
    const timer = setInterval(load, 20000) // simple polling until push notifications land
    return () => {
      active = false
      clearInterval(timer)
    }
  }, [orderNumber]);
  const handleCopy = (text: string) => {
    copy(text);
    toast.success("copied!")
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-10">
      <div className="card p-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-leaf-500">
          Order received
        </p>
        <div className="mt-2 font-display text-4xl font-bold text-leaf-800 flex gap-4 justify-center">
         <span>{orderNumber}</span> 
          <CopyButton className='!text-leaf-800' onClick={() => handleCopy(orderNumber)} />
        </div>
        <p className="mt-2 text-leaf-600">
          Save this number. Show it at {BUSINESS.address} when you arrive.
        </p>

        <div className="mt-5">
          {loading ? (
            <span className="text-leaf-500">Checking status…</span>
          ) : order ? (
            <StatusBadge status={order.status} />
          ) : (
            <span className="text-leaf-500">Order not found yet. Refresh in a moment.</span>
          )}
        </div>

        {order && (
          <p className="mt-4 font-display text-2xl font-bold text-leaf-700">
            {formatNaira(order.total)}
          </p>
        )}

        <p className="mt-5 text-sm text-leaf-600">
          We confirm your payment, pack your items, and message you on WhatsApp. Usually about{' '}
          {BUSINESS.pickupMinutes} minutes.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a
            href={`https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(
              `Hello, I just placed order ${orderNumber}.`,
            )}`}
            target="_blank"
            rel="noreferrer"
            className="btn-primary"
          >
            Message the shop
          </a>
          <Link to="/shop" className="btn-outline">Order something else</Link>
        </div>
      </div>
    </section >
  )
}
