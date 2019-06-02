export interface Dimension {
  width: number,
  height: number
}

function base64Dimensions (base64: string): Promise<Dimension> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = function() {
      resolve({
        width: img.width,
        height: img.height
      })
    }
    img.src = base64
  })
}

export default base64Dimensions
