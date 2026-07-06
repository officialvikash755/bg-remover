import { useCallback, useEffect, useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import UploadZone from './components/UploadZone'
import ProcessingOverlay from './components/ProcessingOverlay'
import ImagePreview from './components/ImagePreview'
import BackgroundPicker from './components/BackgroundPicker'
import RefineControls from './components/RefineControls'
import DownloadBar from './components/DownloadBar'
import { useBackgroundRemoval } from './hooks/useBackgroundRemoval'
import { compositeBackground, isTransparentBackground } from './utils/compositeBackground'
import { downloadBlob } from './utils/downloadBlob'
import { refineAlpha } from './utils/refineAlpha'

const DEFAULT_THRESHOLD = 40

function revokeIfObjectUrl(url) {
  if (url?.startsWith('blob:')) {
    URL.revokeObjectURL(url)
  }
}

export default function App() {
  const {
    processImage,
    cancel,
    reset: resetWorker,
    isBusy,
    status,
    progress,
    progressKey,
    error: workerError,
  } = useBackgroundRemoval()

  const [originalFile, setOriginalFile] = useState(null)
  const [originalUrl, setOriginalUrl] = useState('')
  const [rawResultBlob, setRawResultBlob] = useState(null)
  const [resultBlob, setResultBlob] = useState(null)
  const [resultUrl, setResultUrl] = useState('')
  const [background, setBackground] = useState('transparent')
  const [previewUrl, setPreviewUrl] = useState('')
  const [downloadBlobState, setDownloadBlobState] = useState(null)
  const [uploadError, setUploadError] = useState('')
  const [refineThreshold, setRefineThreshold] = useState(DEFAULT_THRESHOLD)
  const [isRefining, setIsRefining] = useState(false)

  const hasResult = Boolean(originalUrl && rawResultBlob)

  const cleanupUrls = useCallback(() => {
    revokeIfObjectUrl(originalUrl)
    revokeIfObjectUrl(resultUrl)
    revokeIfObjectUrl(previewUrl)
    if (background?.type === 'image') {
      revokeIfObjectUrl(background.url)
    }
  }, [background, originalUrl, previewUrl, resultUrl])

  const resetAll = useCallback(() => {
    cleanupUrls()
    setOriginalFile(null)
    setOriginalUrl('')
    setRawResultBlob(null)
    setResultBlob(null)
    setResultUrl('')
    setBackground('transparent')
    setPreviewUrl('')
    setDownloadBlobState(null)
    setUploadError('')
    setRefineThreshold(DEFAULT_THRESHOLD)
    resetWorker()
  }, [cleanupUrls, resetWorker])

  const applyRefinedResult = useCallback((refinedBlob) => {
    setResultBlob(refinedBlob)
    setResultUrl((prev) => {
      revokeIfObjectUrl(prev)
      return URL.createObjectURL(refinedBlob)
    })
  }, [])

  useEffect(() => {
    if (!resultBlob) {
      setPreviewUrl('')
      setDownloadBlobState(null)
      return undefined
    }

    let cancelled = false

    const updateComposite = async () => {
      if (isTransparentBackground(background)) {
        const nextUrl = URL.createObjectURL(resultBlob)
        if (!cancelled) {
          setPreviewUrl((prev) => {
            revokeIfObjectUrl(prev)
            return nextUrl
          })
          setDownloadBlobState(resultBlob)
        } else {
          URL.revokeObjectURL(nextUrl)
        }
        return
      }

      try {
        const composite = await compositeBackground(resultBlob, background)
        const nextUrl = URL.createObjectURL(composite)
        if (!cancelled) {
          setPreviewUrl((prev) => {
            revokeIfObjectUrl(prev)
            return nextUrl
          })
          setDownloadBlobState(composite)
        } else {
          URL.revokeObjectURL(nextUrl)
        }
      } catch {
        if (!cancelled) {
          setUploadError('Failed to apply background. Try another option.')
        }
      }
    }

    updateComposite()

    return () => {
      cancelled = true
    }
  }, [background, resultBlob])

  useEffect(() => {
    if (!rawResultBlob || isBusy) return undefined

    let cancelled = false

    const rerunRefine = async () => {
      setIsRefining(true)
      try {
        const refined = await refineAlpha(rawResultBlob, refineThreshold)
        if (!cancelled) {
          applyRefinedResult(refined)
        }
      } catch {
        if (!cancelled) {
          setUploadError('Failed to refine the result. Try again.')
        }
      } finally {
        if (!cancelled) {
          setIsRefining(false)
        }
      }
    }

    rerunRefine()

    return () => {
      cancelled = true
    }
  }, [applyRefinedResult, isBusy, rawResultBlob, refineThreshold])

  const handleUpload = async (file) => {
    setUploadError('')
    cleanupUrls()
    resetWorker()

    const nextOriginalUrl = URL.createObjectURL(file)
    setOriginalFile(file)
    setOriginalUrl(nextOriginalUrl)
    setRawResultBlob(null)
    setResultBlob(null)
    setResultUrl('')
    setBackground('transparent')
    setRefineThreshold(DEFAULT_THRESHOLD)

    try {
      const { rawBlob } = await processImage(file)
      setRawResultBlob(rawBlob)
    } catch (error) {
      revokeIfObjectUrl(nextOriginalUrl)
      setOriginalFile(null)
      setOriginalUrl('')
      setUploadError(error instanceof Error ? error.message : 'Failed to remove background')
    }
  }

  const handleBackgroundChange = (nextBackground) => {
    if (background?.type === 'image' && background?.url) {
      revokeIfObjectUrl(background.url)
    }
    setBackground(nextBackground)
  }

  const handleDownload = () => {
    if (!downloadBlobState) return

    const baseName = originalFile?.name?.replace(/\.[^.]+$/, '') || 'removed-bg'
    downloadBlob(downloadBlobState, `${baseName}-no-bg.png`)
  }

  const handleCancel = () => {
    cancel()
    cleanupUrls()
    setOriginalFile(null)
    setOriginalUrl('')
    setRawResultBlob(null)
    setResultBlob(null)
    setResultUrl('')
    setBackground('transparent')
    setPreviewUrl('')
    setDownloadBlobState(null)
    setRefineThreshold(DEFAULT_THRESHOLD)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-12">
        {!hasResult ? (
          <UploadZone
            onUpload={handleUpload}
            disabled={isBusy}
            error={uploadError || workerError}
          />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <ImagePreview
              originalUrl={originalUrl}
              resultUrl={previewUrl || resultUrl}
              isLoading={isRefining && !resultUrl}
            />

            <div className="flex flex-col gap-4">
              <RefineControls threshold={refineThreshold} onChange={setRefineThreshold} />
              <BackgroundPicker background={background} onChange={handleBackgroundChange} />
              <DownloadBar onDownload={handleDownload} onReset={resetAll} />
              {isRefining ? (
                <p className="text-center text-sm text-slate-500">Updating cleanup...</p>
              ) : null}
            </div>
          </div>
        )}

        {(uploadError || workerError) && hasResult ? (
          <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {uploadError || workerError}
          </p>
        ) : null}
      </main>

      <Footer />

      {isBusy ? (
        <ProcessingOverlay
          status={status}
          progress={progress}
          progressKey={progressKey}
          onCancel={handleCancel}
        />
      ) : null}
    </div>
  )
}
