import { Link } from 'react-router-dom'
import QuantityStepper from '../components/QuantityStepper'
import { useCart } from '../context/CartContext'
import { formatNaira, productEmoji } from '../lib/helpers'

export default function Cart() {
  const { items, setQuantity, removeItem, total } = useCart()

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="font-display text-3xl font-bold text-leaf-800">Your cart is empty</h1>
        <p className="mt-2 text-leaf-600">Add items from the shelf and they will show up here.</p>
        <Link to="/shop" className="btn-primary mt-6">Start shopping</Link>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-display text-3xl font-bold text-leaf-800">Your cart</h1>

      <ul className="mt-6 space-y-3">
        {items.map(({ product, quantity }) => (
          <li key={product.id} className="card flex items-center gap-3 p-3">
            <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl bg-leaf-50">
              {product.image_url ? (
                <img src={product.image_url} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="text-2xl" aria-hidden>{productEmoji(product.name)}</span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-leaf-900">{product.name}</p>
              <p className="text-sm text-leaf-500">
                {formatNaira(product.price)} per {product.unit}
              </p>
              <button
                type="button"
                onClick={() => removeItem(product.id)}
                className="mt-1 text-sm text-red-600 underline"
              >
                Remove
              </button>
            </div>

            <div className="text-right">
              <QuantityStepper
                value={quantity}
                onChange={(next) => setQuantity(product.id, next)}
              />
              <p className="mt-2 font-semibold text-leaf-700">
                {formatNaira(product.price * quantity)}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div className="card mt-6 flex items-center justify-between p-5">
        <span className="text-leaf-600">Total to pay</span>
        <span className="font-display text-2xl font-bold text-leaf-800">{formatNaira(total)}</span>
      </div>

      <Link to="/checkout" className="btn-primary mt-4 w-full">Continue to checkout</Link>
      <Link to="/shop" className="btn-outline mt-3 w-full">Keep shopping</Link>
    </section>
  )
}
