export default function ErrorAlert({ message, onDismiss }) {
  if (!message) return null

  return (
    <div
      className="flex items-start justify-between gap-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
      role="alert"
    >
      <p className="flex-1">{message}</p>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 rounded-md px-2 py-1 text-xs font-medium text-red-700 transition hover:bg-red-100"
          aria-label="Dismiss error"
        >
          Dismiss
        </button>
      ) : null}
    </div>
  )
}
