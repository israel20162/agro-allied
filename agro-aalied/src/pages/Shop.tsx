import { useEffect, useMemo, useState } from 'react'
import ProductCard from '../components/ProductCard'
import { supabase } from '../lib/supabase'
import type { Product } from '../lib/types'

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .order('name')
      .then(({ data }) => {
        setProducts(data ?? [])
        setLoading(false)
      })
  }, [])

  const categories = useMemo(() => {
    const found = products.map((product) => product.category).filter(Boolean) as string[]
    return ['All', ...Array.from(new Set(found))]
  }, [products])

  const visible = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category === 'All' || product.category === category
    return matchesSearch && matchesCategory
  })

  return (
    <section className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="font-display text-3xl font-bold text-leaf-800">Shop foodstuff</h1>
      <p className="mt-1 text-leaf-600">Prices update daily. Add what you need, then check out.</p>

      <input
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search rice, garri, oil…"
        className="input mt-5"
      />

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {categories.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => setCategory(name)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ${
              category === name ? 'bg-leaf-600 text-white' : 'bg-leaf-50 text-leaf-700'
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="mt-10 text-leaf-500">Loading the shelf…</p>
      ) : visible.length === 0 ? (
        <p className="mt-10 rounded-2xl bg-leaf-50 p-6 text-leaf-600">
          Nothing matches that search. Try a different word, or upload your shopping list and we
          will sort it out on WhatsApp.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {visible.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}
