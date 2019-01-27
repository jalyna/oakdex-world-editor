function readJson (file: File): Promise<Object> {
  return new Promise((resolve) => {
    const fileReader = new FileReader()

    fileReader.addEventListener('load', () => {
      resolve(JSON.parse(fileReader.result as string))
    })

    fileReader.readAsText(file)
  })
}

export default readJson
