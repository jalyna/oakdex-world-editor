export interface ImageData {
  title: string,
  width: number,
  height: number,
  imageBase64: string
}

function readImage (file: File): Promise<ImageData> {
  return new Promise((resolve) => {
    const fileReader = new FileReader()
    const img = new Image()

    fileReader.addEventListener('load', () => {
      img.addEventListener('load', () => {
        resolve({
          title: file.name.split('.')[0],
          imageBase64: fileReader.result as string,
          width: img.naturalWidth / 16,
          height: img.naturalHeight / 16
        })
      })
      img.src = (fileReader.result as string)
    })

    fileReader.readAsDataURL(file)
  })
}

export default readImage
