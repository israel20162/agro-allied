import { useEffect, useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import FileInput from '../../components/FileInput'
import { BUCKETS, CATEGORIES } from '../../lib/config'
import { formatNaira, productEmoji, uploadFile } from '../../lib/helpers'
import { supabase } from '../../lib/supabase'
import type { Product } from '../../lib/types'
import AdminLayout from './AdminLayout'

const schema = Yup.object({
  name: Yup.string().trim().required('Name is required'),
  price: Yup.number().min(0, 'Price cannot be negative').required('Price is required'),
  unit: Yup.string().trim().required('Unit is required'),
})

const blank = { name: '', price: 0, unit: 'paint', category: 'Grains', in_stock: true }

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [editing, setEditing] = useState<Product | null>(null)
  const [image, setImage] = useState<File | null>(null)
  const [failure, setFailure] = useState('')

  async function loadProducts() {
    const { data } = await supabase.from('products').select('*').order('name')
    setProducts(data ?? [])
  }

  useEffect(() => {
    loadProducts()
  }, [])

  async function removeProduct(product: Product) {
    if (!confirm(`Remove ${product.name} from the shop?`)) return
    const { error } = await supabase.from('products').delete().eq('id', product.id)
    if (error) return alert('Could not remove that item.')
    loadProducts()
  }

  async function toggleStock(product: Product) {
    await supabase.from('products').update({ in_stock: !product.in_stock }).eq('id', product.id)
    loadProducts()
  }

  return (
    <AdminLayout>
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        {/* Add / edit form */}
        <div className="card h-fit p-5">
          <h2 className="font-display text-xl font-bold text-leaf-800">
            {editing ? `Edit ${editing.name}` : 'Add a product'}
          </h2>

          <Formik
            enableReinitialize
            initialValues={editing ? { ...editing } : blank}
            validationSchema={schema}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              setFailure('')
              try {
                const uploadedUrl = await uploadFile(image, BUCKETS.productImages, 'products')
                const payload = {
                  name: values.name.trim(),
                  price: Number(values.price),
                  unit: values.unit.trim(),
                  category: values.category,
                  in_stock: values.in_stock,
                  image_url: uploadedUrl ?? (editing?.image_url ?? null),
                }

                const { error } = editing
                  ? await supabase.from('products').update(payload).eq('id', editing.id)
                  : await supabase.from('products').insert(payload)
                if (error) throw error

                resetForm({ values: blank })
                setEditing(null)
                setImage(null)
                loadProducts()
              } catch (error) {
                console.error(error)
                setFailure('Could not save that product. Try again.')
              } finally {
                setSubmitting(false)
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form className="mt-4 space-y-4">
                <div>
                  <label className="label" htmlFor="name">Product name</label>
                  <Field id="name" name="name" className="input" placeholder="Rice (long grain)" />
                  <ErrorMessage name="name" component="p" className="error" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label" htmlFor="price">Price (₦)</label>
                    <Field id="price" name="price" type="number" className="input" />
                    <ErrorMessage name="price" component="p" className="error" />
                  </div>
                  <div>
                    <label className="label" htmlFor="unit">Unit</label>
                    <Field id="unit" name="unit" className="input" placeholder="paint, kg, crate" />
                    <ErrorMessage name="unit" component="p" className="error" />
                  </div>
                </div>

                <div>
                  <label className="label" htmlFor="category">Category</label>
                  <Field id="category" name="category" as="select" className="input">
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </Field>
                </div>

                <FileInput
                  name="image"
                  label="Product photo"
                  hint={editing?.image_url ? 'Leave empty to keep the current photo.' : undefined}
                  onFile={setImage}
                />

                <label className="flex items-center gap-2 text-sm font-medium text-leaf-800">
                  <Field type="checkbox" name="in_stock" className="h-4 w-4" />
                  In stock
                </label>

                {failure && <p className="error">{failure}</p>}

                <div className="flex gap-2">
                  <button type="submit" disabled={isSubmitting} className="btn-primary flex-1">
                    {isSubmitting ? 'Saving…' : editing ? 'Save changes' : 'Add product'}
                  </button>
                  {editing && (
                    <button
                      type="button"
                      onClick={() => { setEditing(null); setImage(null) }}
                      className="btn-outline"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </div>

        {/* Product list */}
        <div>
          <h2 className="font-display text-xl font-bold text-leaf-800">
            {products.length} products
          </h2>

          <ul className="mt-4 space-y-2">
            {products.map((product) => (
              <li key={product.id} className="card flex items-center gap-3 p-3">
                <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-leaf-50">
                  {product.image_url ? (
                    <img src={product.image_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-xl" aria-hidden>{productEmoji(product.name)}</span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-leaf-900">{product.name}</p>
                  <p className="text-sm text-leaf-500">
                    {formatNaira(product.price)} per {product.unit} · {product.category}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => toggleStock(product)}
                  className={`badge ${product.in_stock ? 'bg-leaf-100 text-leaf-700' : 'bg-leaf-50 text-leaf-400'}`}
                >
                  {product.in_stock ? 'In stock' : 'Out of stock'}
                </button>
                <button
                  type="button"
                  onClick={() => { setEditing(product); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                  className="text-sm font-semibold text-leaf-600 underline"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => removeProduct(product)}
                  className="text-sm font-semibold text-red-600 underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AdminLayout>
  )
}
