import { useState } from 'react'
import { MAX_FILE_SIZE_MB } from '../constants/app.js'

const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']

export default function UploadZone({ onUpload, disabled, error }) {
  const [isDragging, setIsDragging] = useState(false)
  const [localError, setLocalError] = useState('')

  const validateAndUpload = (file) => {
    setLocalError('')

    if (!file) return

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setLocalError('Please upload a JPG, PNG, or WebP image.')
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      setLocalError(`Image must be smaller than ${MAX_FILE_SIZE_MB} MB.`)
      return
    }

    onUpload(file)
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setIsDragging(false)
    if (disabled) return
    validateAndUpload(event.dataTransfer.files?.[0])
  }

  const handleChange = (event) => {
    validateAndUpload(event.target.files?.[0])
    event.target.value = ''
  }

  const displayError = localError || error

  return (
    <section className="mx-auto w-full max-w-3xl text-center">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        Remove Background from Image
      </h1>
      <p className="mx-auto mt-3 max-w-xl text-base text-slate-600 sm:text-lg">
        Upload a photo and get a transparent PNG in seconds. Everything runs locally in your browser.
      </p>

      <div
        onDragEnter={(event) => {
          event.preventDefault()
          if (!disabled) setIsDragging(true)
        }}
        onDragOver={(event) => {
          event.preventDefault()
          if (!disabled) setIsDragging(true)
        }}
        onDragLeave={(event) => {
          event.preventDefault()
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setIsDragging(false)
          }
        }}
        onDrop={handleDrop}
        className={[
          'mt-8 rounded-2xl border-2 border-dashed px-6 py-14 transition-colors sm:px-10 sm:py-16',
          disabled ? 'opacity-60' : '',
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-slate-300 bg-white',
        ].join(' ')}
      >
        <input
          id="image-upload"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          disabled={disabled}
          onChange={handleChange}
        />

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8" aria-hidden="true">
            <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 011.06 0l4.5 4.5a.75.75 0 01-1.06 1.06l-3.22-3.22V16.5a.75.75 0 01-1.5 0V4.81L8.03 8.03a.75.75 0 01-1.06-1.06l4.5-4.5zM3 15.75a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
          </svg>
        </div>

        <p className="mt-5 text-lg font-medium text-slate-900">
          {isDragging ? 'Drop your image here' : 'Drag & drop an image here'}
        </p>
        <p className="mt-2 text-sm text-slate-500">or click the button below to browse</p>

        <label
          htmlFor="image-upload"
          className={[
            'mt-6 inline-flex cursor-pointer items-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-blue-600',
            disabled ? 'pointer-events-none cursor-not-allowed opacity-60' : '',
          ].join(' ')}
        >
          Upload Image
        </label>

        <p className="mt-4 text-xs text-slate-400">
          Supports JPG, PNG, WebP up to {MAX_FILE_SIZE_MB} MB
        </p>
      </div>

      {displayError ? (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {displayError}
        </p>
      ) : null}
    </section>
  )
}
