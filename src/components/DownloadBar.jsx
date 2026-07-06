export default function DownloadBar({ onDownload, onReset }) {
  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row">
      <button
        type="button"
        onClick={onDownload}
        className="inline-flex flex-1 items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        Download PNG
      </button>
      <button
        type="button"
        onClick={onReset}
        className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        New Image
      </button>
    </section>
  )
}
