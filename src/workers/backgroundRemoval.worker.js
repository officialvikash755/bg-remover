import { removeBackground } from '@imgly/background-removal'

async function removeWithConfig(imageBlob, config) {
  return removeBackground(imageBlob, config)
}

self.onmessage = async (event) => {
  const { type, imageBlob, requestId } = event.data

  if (type !== 'PROCESS') return

  const baseConfig = {
    model: 'isnet',
    rescale: true,
    output: {
      format: 'image/png',
      type: 'foreground',
      quality: 1,
    },
    progress: (key, current, total) => {
      self.postMessage({
        type: 'PROGRESS',
        requestId,
        payload: {
          key,
          current,
          total,
          percent: total > 0 ? Math.round((current / total) * 100) : 0,
        },
      })
    },
  }

  try {
    self.postMessage({
      type: 'STATUS',
      requestId,
      payload: { status: 'processing' },
    })

    let rawBlob

    try {
      rawBlob = await removeWithConfig(imageBlob, { ...baseConfig, device: 'gpu' })
    } catch {
      rawBlob = await removeWithConfig(imageBlob, { ...baseConfig, device: 'cpu' })
    }

    self.postMessage({
      type: 'SUCCESS',
      requestId,
      payload: { rawBlob },
    })
  } catch (error) {
    self.postMessage({
      type: 'ERROR',
      requestId,
      payload: {
        message: error instanceof Error ? error.message : 'Background removal failed',
      },
    })
  }
}
