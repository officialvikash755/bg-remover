const DEVELOPER = {
  name: 'Vikash kumar',
  email: 'officialvikash755@gmail.com',
}

const currentYear = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:justify-between sm:text-left">
          <div className="max-w-md space-y-2">
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white">
                BG
              </div>
              <span className="text-base font-semibold text-slate-900">BG Remover</span>
            </div>
            <p className="text-sm text-slate-500">
              Free AI background removal powered by client-side processing.
            </p>
            <p className="text-sm text-slate-500">
              Processed locally in your browser — images never leave your device.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-slate-600">
              Developed by{' '}
              <span className="font-semibold text-slate-900">{DEVELOPER.name}</span>
            </p>
            <a
              href={`mailto:${DEVELOPER.email}`}
              className="inline-block text-sm font-medium text-blue-600 transition hover:text-blue-700 hover:underline"
            >
              {DEVELOPER.email}
            </a>
          </div>
        </div>

        <div className="mt-6 border-t border-slate-100 pt-6 text-center text-xs text-slate-400 sm:text-left">
          © {currentYear} BG Remover. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
