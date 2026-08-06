import { useState } from 'react'

type Props = {
  name: string
  label: string
  hint?: string
  onFile: (file: File | null) => void
}

/** Plain file picker with a preview. Photos only — students shoot lists on their phone. */
export default function FileInput({ name, label, hint, onFile }: Props) {
  const [preview, setPreview] = useState<string | null>(null)

  return (
    <div>
      <label className="label" htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type="file"
        accept="image/*"
        className="input file:mr-3 file:rounded-full file:border-0 file:bg-leaf-600 file:px-4 file:py-1.5 file:text-sm file:font-semibold file:text-white"
        onChange={(event) => {
          const file = event.currentTarget.files?.[0] ?? null
          onFile(file)
          setPreview(file ? URL.createObjectURL(file) : null)
        }}
      />
      {hint && <p className="mt-1 text-xs text-leaf-500">{hint}</p>}
      {preview && (
        <img src={preview} alt="Selected" className="mt-3 h-40 rounded-xl object-cover" />
      )}
    </div>
  )
}
