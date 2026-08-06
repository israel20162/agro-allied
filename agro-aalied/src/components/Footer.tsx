import { Link } from 'react-router-dom'
import { BUSINESS } from '../lib/config'

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-leaf-100 bg-leaf-50">
      <div className="mx-auto max-w-5xl px-4 py-10 text-sm text-leaf-700">
        <p className="font-display text-lg font-bold text-leaf-800">{BUSINESS.name}</p>
        <p className="mt-1">{BUSINESS.address}</p>
        <p className="mt-1">Open to all UNILAG students. Pay before pickup.</p>
        <div className="mt-6 flex flex-wrap gap-4 text-leaf-600">
          <Link to="/shop" className="underline">Shop</Link>
          <Link to="/track" className="underline">Track order</Link>
          <Link to="/admin" className="underline">Staff login</Link>
        </div>
        <p className="mt-6 text-xs text-leaf-500">
          © {new Date().getFullYear()} {BUSINESS.shortName} · {BUSINESS.domain}
        </p>
      </div>
    </footer>
  )
}
