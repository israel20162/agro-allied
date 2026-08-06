import { STATUS_LABEL, STATUS_STYLE } from '../lib/helpers'
import type { OrderStatus } from '../lib/types'

export default function StatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`badge ${STATUS_STYLE[status]}`}>{STATUS_LABEL[status]}</span>
}
