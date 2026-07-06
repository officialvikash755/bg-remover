export default function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
            BG
          </div>
          <span className="text-lg font-semibold tracking-tight">BG Remover</span>
        </div>
        <p className="hidden text-sm text-slate-500 sm:block">
          Free background removal in your browser
        </p>
      </div>
    </header>
  )
}
