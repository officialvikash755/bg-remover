function refineAlphaChannel(data, threshold = 40) {
  for (let i = 3; i < data.length; i += 4) {
    const alpha = data[i]

    if (alpha <= threshold) {
      data[i] = 0
      continue
    }

    const stretched = Math.round(((alpha - threshold) / (255 - threshold)) * 255)
    data[i] = Math.min(255, stretched)
  }
}

export async function refineAlpha(blob, threshold = 40) {
  const bitmap = await createImageBitmap(blob)
  const canvas = typeof OffscreenCanvas !== 'undefined'
    ? new OffscreenCanvas(bitmap.width, bitmap.height)
    : Object.assign(document.createElement('canvas'), {
        width: bitmap.width,
        height: bitmap.height,
      })

  const context = canvas.getContext('2d')
  context.drawImage(bitmap, 0, 0)

  const imageData = context.getImageData(0, 0, bitmap.width, bitmap.height)
  refineAlphaChannel(imageData.data, threshold)
  context.putImageData(imageData, 0, 0)
  bitmap.close()

  if (canvas instanceof OffscreenCanvas) {
    return canvas.convertToBlob({ type: 'image/png' })
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (result) resolve(result)
        else reject(new Error('Failed to refine alpha mask'))
      },
      'image/png',
    )
  })
}
