import { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import FileInput from '../components/FileInput'
import { generateOrderNumber, uploadFile } from '../lib/helpers'
import { supabase } from '../lib/supabase'

const schema = Yup.object({
  customer_name: Yup.string().trim().min(2, 'Enter your full name').required('Name is required'),
  phone: Yup.string()
    .matches(/^[0-9+\s-]{10,15}$/, 'Enter a valid phone number')
    .required('Phone number is required'),
})

export default function UploadList() {
  const navigate = useNavigate()
  const [listPhoto, setListPhoto] = useState<File | null>(null)
  const [failure, setFailure] = useState('')

  return (
    <section className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="font-display text-3xl font-bold text-leaf-800">Send us your shopping list</h1>
      <p className="mt-1 text-leaf-600">
        Snap the list in your notebook or phone notes. We price it, message you the total on
        WhatsApp, and pack it once you pay.
      </p>

      <Formik
        initialValues={{ customer_name: '', phone: '', note: '' }}
        validationSchema={schema}
        onSubmit={async (values, { setSubmitting }) => {
          setFailure('')
          if (!listPhoto) {
            setFailure('Attach a photo of your shopping list.')
            setSubmitting(false)
            return
          }
          try {
            const listUrl = await uploadFile(listPhoto, 'uploads', 'shopping-lists')
            const orderNumber = generateOrderNumber()

            const { error } = await supabase.from('orders').insert({
              order_number: orderNumber,
              customer_name: values.customer_name.trim(),
              phone: values.phone.trim(),
              total: 0,
              status: 'pending',
              shopping_list_url: listUrl,
              note: values.note.trim() || null,
            })
            if (error) throw error

            navigate(`/order/${orderNumber}`)
          } catch (error) {
            console.error(error)
            setFailure('We could not send your list. Check your connection and try again.')
          } finally {
            setSubmitting(false)
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="card mt-6 space-y-5 p-5">
            <div>
              <label className="label" htmlFor="customer_name">Full name</label>
              <Field id="customer_name" name="customer_name" className="input" placeholder="Aisha Bello" />
              <ErrorMessage name="customer_name" component="p" className="error" />
            </div>

            <div>
              <label className="label" htmlFor="phone">Phone number</label>
              <Field id="phone" name="phone" type="tel" className="input" placeholder="0803 000 0000" />
              <ErrorMessage name="phone" component="p" className="error" />
            </div>

            <FileInput
              name="shopping_list"
              label="Photo of your shopping list"
              hint="Make sure the writing is readable."
              onFile={setListPhoto}
            />

            <div>
              <label className="label" htmlFor="note">Anything else? (optional)</label>
              <Field id="note" name="note" as="textarea" rows={3} className="input" placeholder="Budget is ₦10,000. Skip anything above it." />
            </div>

            {failure && <p className="error">{failure}</p>}

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
              {isSubmitting ? 'Sending…' : 'Send shopping list'}
            </button>
          </Form>
        )}
      </Formik>
    </section>
  )
}
