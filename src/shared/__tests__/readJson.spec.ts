const fs = require('fs')
const path = require('path')

import readJson from '../readJson'

interface Data {
  a: string,
  c: string
}

describe('.readJson', () => {
  it('reads json from file object', () => {
    const content = fs.readFileSync(path.resolve(__dirname, 'jsonTest.json'))
    const base64 = fs.readFileSync(path.resolve(__dirname, 'jsonTest.json'), { encoding: 'base64' })
    const file = new File([content], 'jsonTest.json', { type: 'text/json' })
    return readJson(file).then((data: Data) => {
      expect(data.a).toEqual('b')
      expect(data.c).toEqual('d')
    })
  })
})
