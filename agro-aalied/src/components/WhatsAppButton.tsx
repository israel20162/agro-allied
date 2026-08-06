import { BUSINESS } from '../lib/config'

/** Floating support button. Sits above the thumb on mobile. */
export default function WhatsAppButton() {
  const href = `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(
    `Hello ${BUSINESS.shortName}, I need help with my order.`,
  )}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-50 rounded-full bg-leaf-600 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-leaf-700"
    >
      Chat on WhatsApp
    </a>
  )
}
