import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { BUSINESS } from '../lib/config'

const links = [
  { to: '/shop', label: 'Shop' },
  { to: '/upload-list', label: 'Shopping list' },
  { to: '/track', label: 'Track order' },
]

export default function Navbar() {
  const { itemCount } = useCart()

  return (
    <header className="sticky top-0 z-40 border-b border-leaf-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-leaf-600 font-display text-lg font-bold text-white">
            AF
          </span>
          <span className="leading-tight">
            <span className="block font-display text-base font-bold text-leaf-800">
              {BUSINESS.shortName}
            </span>
            <span className="block text-[11px] text-leaf-500">UNILAG · Jaja Complex</span>
          </span>
        </Link>

        <nav className="ml-auto hidden gap-1 sm:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-full px-3 py-2 text-sm font-medium ${
                  isActive ? 'bg-leaf-50 text-leaf-700' : 'text-leaf-600 hover:bg-leaf-50'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <Link
          to="/cart"
          className="relative ml-auto rounded-full bg-leaf-600 px-4 py-2 text-sm font-semibold text-white sm:ml-0"
        >
          Cart
          {itemCount > 0 && (
            <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-white text-[11px] font-bold text-leaf-700 ring-2 ring-leaf-600">
              {itemCount}
            </span>
          )}
        </Link>
      </div>

      {/* Mobile nav */}
      <nav className="flex gap-1 overflow-x-auto border-t border-leaf-50 px-4 py-2 sm:hidden">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium ${
                isActive ? 'bg-leaf-50 text-leaf-700' : 'text-leaf-600'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
