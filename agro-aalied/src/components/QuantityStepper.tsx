type Props = {
  value: number
  onChange: (value: number) => void
  min?: number
}

export default function QuantityStepper({ value, onChange, min = 1 }: Props) {
  return (
    <div className="inline-flex items-center rounded-full border border-leaf-200">
      <button
        type="button"
        aria-label="Reduce quantity"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="h-9 w-9 rounded-l-full text-lg font-bold text-leaf-700 hover:bg-leaf-50"
      >
        −
      </button>
      <span className="w-8 text-center text-sm font-semibold">{value}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(value + 1)}
        className="h-9 w-9 rounded-r-full text-lg font-bold text-leaf-700 hover:bg-leaf-50"
      >
        +
      </button>
    </div>
  )
}
