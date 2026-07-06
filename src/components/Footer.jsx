import { DEVELOPER, APP_NAME } from '../constants/app.js'

const currentYear = new Date().getFullYear()

function EmailIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 shrink-0" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 shrink-0" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  )
}

export default function Footer() {
  const phoneDisplay = `+${DEVELOPER.countryCode} ${DEVELOPER.phone}`

  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:justify-between sm:text-left">
          <div className="max-w-md space-y-2">
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white">
                BG
              </div>
              <span className="text-base font-semibold text-slate-900">{APP_NAME}</span>
            </div>
            <p className="text-sm text-slate-500">
              Free AI background removal powered by client-side processing.
            </p>
            <p className="text-sm text-slate-500">
              Processed locally in your browser — images never leave your device.
            </p>
          </div>

          <div className="flex flex-col items-center gap-1.5 sm:items-start">
            <p className="text-sm text-slate-600">
              Developed by{' '}
              <span className="font-semibold text-slate-900">{DEVELOPER.name}</span>
            </p>
            <a
              href={`mailto:${DEVELOPER.email}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition hover:text-blue-700 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              aria-label={`Email ${DEVELOPER.name}`}
            >
              <EmailIcon />
              {DEVELOPER.email}
            </a>
            <a
              href={`tel:+${DEVELOPER.countryCode}${DEVELOPER.phone}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition hover:text-blue-700 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              aria-label={`Call ${DEVELOPER.name}`}
            >
              <PhoneIcon />
              {phoneDisplay}
            </a>
          </div>
        </div>

        <div className="mt-6 border-t border-slate-100 pt-6 text-center text-xs text-slate-400 sm:text-left">
          © {currentYear} {APP_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
