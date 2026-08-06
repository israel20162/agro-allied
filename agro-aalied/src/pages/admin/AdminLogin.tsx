import { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

const schema = Yup.object({
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  password: Yup.string().min(6, 'At least 6 characters').required('Password is required'),
})

export default function AdminLogin() {
  const navigate = useNavigate()
  const [failure, setFailure] = useState('')

  return (
    <section className="mx-auto max-w-sm px-4 py-16">
      <h1 className="font-display text-3xl font-bold text-leaf-800">Staff login</h1>
      <p className="mt-1 text-leaf-600">For shop staff only.</p>

      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={schema}
        onSubmit={async (values, { setSubmitting }) => {
          setFailure('')
          const { error } = await supabase.auth.signInWithPassword(values)
          if (error) setFailure('Those details did not work. Try again.')
          else navigate('/admin')
          setSubmitting(false)
        }}
      >
        {({ isSubmitting }) => (
          <Form className="card mt-6 space-y-4 p-5">
            <div>
              <label className="label" htmlFor="email">Email</label>
              <Field id="email" name="email" type="email" className="input" />
              <ErrorMessage name="email" component="p" className="error" />
            </div>
            <div>
              <label className="label" htmlFor="password">Password</label>
              <Field id="password" name="password" type="password" className="input" />
              <ErrorMessage name="password" component="p" className="error" />
            </div>
            {failure && <p className="error">{failure}</p>}
            <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </button>
          </Form>
        )}
      </Formik>
    </section>
  )
}
