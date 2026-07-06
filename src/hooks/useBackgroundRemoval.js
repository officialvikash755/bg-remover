import { useCallback, useEffect, useRef, useState } from 'react'

const INITIAL_STATE = {
  status: 'idle',
  progress: 0,
  progressKey: '',
  error: null,
  resultBlob: null,
}

export function useBackgroundRemoval() {
  const workerRef = useRef(null)
  const requestIdRef = useRef(0)
  const [state, setState] = useState(INITIAL_STATE)

  const initWorker = useCallback(() => {
    const worker = new Worker(
      new URL('../workers/backgroundRemoval.worker.js', import.meta.url),
      { type: 'module' },
    )

    worker.onmessage = (event) => {
      const { type, payload, requestId } = event.data
      if (requestId !== requestIdRef.current) return

      switch (type) {
        case 'PROGRESS':
          setState((prev) => ({
            ...prev,
            status: payload.key?.includes('fetch') ? 'downloading' : 'processing',
            progress: payload.percent,
            progressKey: payload.key ?? '',
            error: null,
          }))
          break
        case 'STATUS':
          setState((prev) => ({
            ...prev,
            status: payload.status,
            error: null,
          }))
          break
        case 'SUCCESS':
          setState((prev) => ({
            ...prev,
            status: 'done',
            progress: 100,
            error: null,
            resultBlob: payload.blob,
          }))
          break
        case 'ERROR':
          setState((prev) => ({
            ...prev,
            status: 'error',
            error: payload.message,
          }))
          break
        default:
          break
      }
    }

    worker.onerror = () => {
      setState((prev) => ({
        ...prev,
        status: 'error',
        error: 'Background removal worker failed',
      }))
    }

    return worker
  }, [])

  useEffect(() => {
    workerRef.current = initWorker()
    return () => {
      workerRef.current?.terminate()
      workerRef.current = null
    }
  }, [initWorker])

  const processImage = useCallback((file) => {
    if (!workerRef.current) {
      return Promise.reject(new Error('Worker is not ready'))
    }

    requestIdRef.current += 1
    const requestId = requestIdRef.current

    setState({
      status: 'downloading',
      progress: 0,
      progressKey: '',
      error: null,
      resultBlob: null,
    })

    return new Promise((resolve, reject) => {
      const handleMessage = (event) => {
        const { type, payload, requestId: messageRequestId } = event.data
        if (messageRequestId !== requestId) return

        if (type === 'SUCCESS') {
          workerRef.current?.removeEventListener('message', handleMessage)
          resolve({ rawBlob: payload.rawBlob })
        }

        if (type === 'ERROR') {
          workerRef.current?.removeEventListener('message', handleMessage)
          reject(new Error(payload.message))
        }
      }

      workerRef.current.addEventListener('message', handleMessage)
      workerRef.current.postMessage({
        type: 'PROCESS',
        requestId,
        imageBlob: file,
      })
    })
  }, [])

  const cancel = useCallback(() => {
    requestIdRef.current += 1
    workerRef.current?.terminate()
    workerRef.current = initWorker()
    setState(INITIAL_STATE)
  }, [initWorker])

  const reset = useCallback(() => {
    requestIdRef.current += 1
    setState(INITIAL_STATE)
  }, [])

  return {
    ...state,
    processImage,
    cancel,
    reset,
    isBusy: state.status === 'downloading' || state.status === 'processing',
  }
}
