import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="mx-auto max-w-xl px-4 py-20 text-center">
      <h1 className="font-display text-4xl font-bold text-leaf-800">Page not found</h1>
      <p className="mt-2 text-leaf-600">That link does not lead anywhere on this site.</p>
      <Link to="/" className="btn-primary mt-6">Go to the home page</Link>
    </section>
  )
}
