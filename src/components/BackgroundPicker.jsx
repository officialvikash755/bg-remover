import { useRef, useState } from 'react'

const PRESET_COLORS = [
  { id: 'transparent', label: 'Transparent', value: 'transparent', className: 'checkerboard' },
  { id: 'white', label: 'White', value: '#ffffff', className: 'bg-white' },
  { id: 'black', label: 'Black', value: '#000000', className: 'bg-black' },
  { id: 'blue', label: 'Blue', value: '#2563eb', className: 'bg-blue-600' },
  { id: 'green', label: 'Green', value: '#16a34a', className: 'bg-green-600' },
  { id: 'pink', label: 'Pink', value: '#db2777', className: 'bg-pink-600' },
]

export default function BackgroundPicker({ background, onChange, disabled = false }) {
  const fileInputRef = useRef(null)
  const [localError, setLocalError] = useState('')

  const handleColorSelect = (preset) => {
    if (disabled) return
    setLocalError('')

    if (preset.id === 'transparent') {
      onChange('transparent')
      return
    }

    onChange({ type: 'color', value: preset.value })
  }

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return

    if (!file.type.startsWith('image/')) {
      setLocalError('Please upload a valid image file for the background.')
      return
    }

    setLocalError('')
    onChange({
      type: 'image',
      file,
      url: URL.createObjectURL(file),
    })
  }

  const isSelected = (preset) => {
    if (preset.id === 'transparent') return background === 'transparent'
    return background?.type === 'color' && background.value === preset.value
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">Replace Background</h3>
      <p className="mt-1 text-sm text-slate-500">Choose a color or upload your own background image.</p>

      <div className="mt-4 flex flex-wrap gap-3">
        {PRESET_COLORS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            disabled={disabled}
            onClick={() => handleColorSelect(preset)}
            className={[
              'flex h-12 w-12 items-center justify-center rounded-xl border-2 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600',
              preset.className,
              isSelected(preset) ? 'border-blue-600 ring-2 ring-blue-200' : 'border-slate-200 hover:border-slate-300',
              disabled ? 'cursor-not-allowed opacity-60' : '',
            ].join(' ')}
            aria-label={preset.label}
            title={preset.label}
          />
        ))}

        <button
          type="button"
          disabled={disabled}
          onClick={() => fileInputRef.current?.click()}
          className={[
            'flex h-12 min-w-[3rem] items-center justify-center rounded-xl border-2 px-3 text-xs font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600',
            background?.type === 'image'
              ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-200'
              : 'border-dashed border-slate-300 text-slate-600 hover:border-blue-400 hover:text-blue-600',
            disabled ? 'cursor-not-allowed opacity-60' : '',
          ].join(' ')}
        >
          + Image
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        disabled={disabled}
        onChange={handleImageUpload}
      />

      {localError ? (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {localError}
        </p>
      ) : null}
    </section>
  )
}
