import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { formatNaira, productEmoji } from '../lib/helpers'
import type { Product } from '../lib/types'
import QuantityStepper from './QuantityStepper'

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  function handleAdd() {
    addItem(product, quantity)
    setAdded(true)
    setQuantity(1)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <article className="card flex flex-col overflow-hidden">
      <div className="grid aspect-square place-items-center bg-leaf-50">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-5xl" aria-hidden>
            {productEmoji(product.name)}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3">
        <h3 className="font-semibold leading-tight text-leaf-900">{product.name}</h3>
        <p className="mt-0.5 text-xs text-leaf-500">per {product.unit}</p>

        <p className="mt-2 font-display text-xl font-bold text-leaf-700">
          {formatNaira(product.price)}
        </p>

        {product.in_stock ? (
          <div className="mt-3 flex items-center justify-between gap-2">
            <QuantityStepper value={quantity} onChange={setQuantity} />
            <button type="button" onClick={handleAdd} className="btn-primary px-4 py-2">
              {added ? 'Added' : 'Add'}
            </button>
          </div>
        ) : (
          <p className="mt-3 rounded-xl bg-leaf-50 px-3 py-2 text-center text-sm text-leaf-500">
            Out of stock
          </p>
        )}
      </div>
    </article>
  )
}
