function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Failed to load image'))
    image.src = src
  })
}

export async function compositeBackground(foregroundBlob, background) {
  if (!background?.type) {
    throw new Error('Invalid background configuration')
  }

  const foregroundUrl = URL.createObjectURL(foregroundBlob)

  try {
    const foreground = await loadImage(foregroundUrl)
    const canvas = document.createElement('canvas')
    canvas.width = foreground.naturalWidth
    canvas.height = foreground.naturalHeight
    const context = canvas.getContext('2d')

    if (!context) {
      throw new Error('Canvas is not supported in this browser')
    }

    if (background.type === 'color') {
      context.fillStyle = background.value
      context.fillRect(0, 0, canvas.width, canvas.height)
    }

    if (background.type === 'image') {
      const backgroundImage = await loadImage(background.url)
      const scale = Math.max(
        canvas.width / backgroundImage.naturalWidth,
        canvas.height / backgroundImage.naturalHeight,
      )
      const width = backgroundImage.naturalWidth * scale
      const height = backgroundImage.naturalHeight * scale
      const x = (canvas.width - width) / 2
      const y = (canvas.height - height) / 2
      context.drawImage(backgroundImage, x, y, width, height)
    }

    context.drawImage(foreground, 0, 0)

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob)
          else reject(new Error('Failed to export composite image'))
        },
        'image/png',
      )
    })
  } finally {
    URL.revokeObjectURL(foregroundUrl)
  }
}

export function isTransparentBackground(background) {
  return background === 'transparent'
}
