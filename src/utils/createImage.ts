function getFileListFromEvent(event: any): FileList {
  if ('clipboardData' in event && 'files' in event.clipboardData) {
    const { files } = event.clipboardData
    if (files) {
      return files
    } else {
      throw new TypeError('TypeError')
    }
  }
  if ('dataTransfer' in event) {
    const { files } = (event as DragEvent).dataTransfer as any
    if (files) {
      return files
    } else {
      throw new TypeError('TypeError')
    }
  }
  if (event.target) {
    const { files } = event.target as HTMLInputElement
    if (files) {
      return files
    } else {
      throw new TypeError('TypeError')
    }
  }
  throw new TypeError('TypeError')
}

export function createDataURIImage(event: Event | DragEvent) {
  return new Promise((resolve, reject) => {
    try {
      const files = getFileListFromEvent(event)
      const target = files[0]
      const reader = new FileReader()
      reader.onload = (event: any) => {
        const {
          currentTarget: { result }
        } = event
        resolve(result)
      }
      reader.readAsDataURL(target)
    } catch (e) {
      reject(e)
    }
  })
}

export function createBlogImageFromDataURI(dataURI: string) {
  const byteString = atob(dataURI.split(',')[1])
  const type = dataURI
    .split(',')[0]
    .split(':')[1]
    .split(';')[0]
  const ab = new ArrayBuffer(byteString.length)
  let ia = new Uint8Array(ab)
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  return new Blob([ab], { type })
}
