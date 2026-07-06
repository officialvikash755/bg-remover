export default function DownloadBar({ onDownload, onReset, downloadDisabled = false }) {
  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row">
      <button
        type="button"
        onClick={onDownload}
        disabled={downloadDisabled}
        className="inline-flex flex-1 items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Download PNG
      </button>
      <button
        type="button"
        onClick={onReset}
        className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        New Image
      </button>
    </section>
  )
}
