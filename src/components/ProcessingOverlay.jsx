function getStatusText(status, progressKey) {
  if (status === 'downloading' || progressKey?.includes('fetch')) {
    return 'Downloading AI model...'
  }
  if (status === 'processing') {
    return 'Removing background...'
  }
  return 'Preparing...'
}

export default function ProcessingOverlay({ status, progress, progressKey, onCancel }) {
  const statusText = getStatusText(status, progressKey)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
          <div className="h-7 w-7 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
        </div>

        <h2 className="mt-5 text-center text-xl font-semibold text-slate-900">{statusText}</h2>
        <p className="mt-2 text-center text-sm text-slate-500">
          First run may take a minute while the AI model downloads and caches in your browser.
        </p>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="mt-6 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
