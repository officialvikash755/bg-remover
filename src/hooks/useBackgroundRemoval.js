import { useCallback, useEffect, useRef, useState } from 'react'

const INITIAL_STATE = {
  status: 'idle',
  progress: 0,
  progressKey: '',
  error: null,
}

export function useBackgroundRemoval() {
  const workerRef = useRef(null)
  const requestIdRef = useRef(0)
  const pendingRef = useRef(null)
  const [state, setState] = useState(INITIAL_STATE)

  const rejectPending = useCallback((message) => {
    if (!pendingRef.current) return
    pendingRef.current.reject(new Error(message))
    pendingRef.current = null
  }, [])

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
      rejectPending('Background removal worker failed')
    }

    return worker
  }, [rejectPending])

  useEffect(() => {
    workerRef.current = initWorker()
    return () => {
      rejectPending('Background removal cancelled')
      workerRef.current?.terminate()
      workerRef.current = null
    }
  }, [initWorker, rejectPending])

  const processImage = useCallback((file) => {
    if (!workerRef.current) {
      return Promise.reject(new Error('Worker is not ready'))
    }

    rejectPending('Background removal replaced by a new request')

    requestIdRef.current += 1
    const requestId = requestIdRef.current

    setState({
      status: 'downloading',
      progress: 0,
      progressKey: '',
      error: null,
    })

    return new Promise((resolve, reject) => {
      pendingRef.current = { resolve, reject, requestId }

      const handleMessage = (event) => {
        const { type, payload, requestId: messageRequestId } = event.data
        if (messageRequestId !== requestId) return

        if (type === 'SUCCESS') {
          workerRef.current?.removeEventListener('message', handleMessage)
          pendingRef.current = null
          resolve({ rawBlob: payload.rawBlob })
        }

        if (type === 'ERROR') {
          workerRef.current?.removeEventListener('message', handleMessage)
          pendingRef.current = null
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
  }, [rejectPending])

  const cancel = useCallback(() => {
    requestIdRef.current += 1
    rejectPending('Background removal cancelled')
    workerRef.current?.terminate()
    workerRef.current = initWorker()
    setState(INITIAL_STATE)
  }, [initWorker, rejectPending])

  const reset = useCallback(() => {
    requestIdRef.current += 1
    rejectPending('Background removal reset')
    setState(INITIAL_STATE)
  }, [rejectPending])

  return {
    ...state,
    processImage,
    cancel,
    reset,
    isBusy: state.status === 'downloading' || state.status === 'processing',
  }
}
