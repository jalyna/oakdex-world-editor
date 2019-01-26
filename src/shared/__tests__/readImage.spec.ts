const fs = require('fs')
const path = require('path')

import readImage from '../readImage'

describe('.readImage', () => {
  beforeEach(() => {
    Image.prototype.addEventListener = (name: string, fn: () => void) => {
      if (name === 'load') {
        fn()
      }
    }
  })

  it('reads image from file object', () => {
    const content = fs.readFileSync(path.resolve(__dirname, 'pokeball.png'))
    const base64 = fs.readFileSync(path.resolve(__dirname, 'pokeball.png'), { encoding: 'base64' })
    const file = new File([content], 'myawesome.png', { type: 'image/png' })
    return readImage(file).then((data) => {
      expect(data.title).toEqual('myawesome')
      expect(data.width).toEqual(0)
      expect(data.height).toEqual(0)
      expect(data.imageBase64).toEqual('data:image/png;base64,' + base64)
    })
  })
})
