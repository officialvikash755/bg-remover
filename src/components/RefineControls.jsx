export default function RefineControls({ threshold, onChange }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Cleanup Strength</h3>
          <p className="mt-1 text-sm text-slate-500">
            Increase if background remnants remain around edges or hair.
          </p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
          {threshold}
        </span>
      </div>

      <input
        type="range"
        min={10}
        max={90}
        step={5}
        value={threshold}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-blue-600"
        aria-label="Background cleanup strength"
      />

      <div className="mt-2 flex justify-between text-xs text-slate-400">
        <span>Keep fine details</span>
        <span>Remove more background</span>
      </div>
    </section>
  )
}
