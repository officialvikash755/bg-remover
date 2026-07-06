import { useCallback, useEffect, useRef, useState } from 'react'

export default function ImagePreview({ originalUrl, resultUrl, isLoading = false }) {
  const containerRef = useRef(null)
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)

  const updateSlider = useCallback((clientX) => {
    const container = containerRef.current
    if (!container) return

    const rect = container.getBoundingClientRect()
    const next = ((clientX - rect.left) / rect.width) * 100
    setSliderPosition(Math.min(100, Math.max(0, next)))
  }, [])

  useEffect(() => {
    if (!isDragging) return undefined

    const handleMove = (event) => {
      const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX
      updateSlider(clientX)
    }

    const handleUp = () => setIsDragging(false)

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleUp)
    window.addEventListener('touchmove', handleMove, { passive: true })
    window.addEventListener('touchend', handleUp)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleUp)
      window.removeEventListener('touchmove', handleMove)
      window.removeEventListener('touchend', handleUp)
    }
  }, [isDragging, updateSlider])

  return (
    <section className="w-full">
      <div className="mb-3 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-slate-900">Preview</h2>
        <p className="text-sm text-slate-500">Drag the slider to compare original and result</p>
      </div>

      <div
        ref={containerRef}
        className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:aspect-[16/10]"
      >
        <div className="absolute inset-0 checkerboard">
          {resultUrl ? (
            <img
              src={resultUrl}
              alt="Background removed result"
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-500">
              {isLoading ? 'Cleaning up background...' : 'Waiting for result...'}
            </div>
          )}
        </div>

        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <img
            src={originalUrl}
            alt="Original uploaded image"
            className="h-full w-full object-contain bg-white"
          />
        </div>

        <div
          className="absolute inset-y-0 z-10 w-1 -translate-x-1/2 cursor-ew-resize bg-white shadow-[0_0_12px_rgba(0,0,0,0.25)]"
          style={{ left: `${sliderPosition}%` }}
          onMouseDown={() => setIsDragging(true)}
          onTouchStart={() => setIsDragging(true)}
          role="slider"
          aria-label="Compare original and result"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(sliderPosition)}
        >
          <div className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-slate-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8M10 9l-3 3 3 3M14 9l3 3-3 3" />
            </svg>
          </div>
        </div>

        <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
          Original
        </span>
        <span className="absolute right-4 top-4 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
          Result
        </span>
      </div>
    </section>
  )
}
