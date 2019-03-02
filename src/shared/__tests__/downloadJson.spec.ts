import downloadJson from '../downloadJson'
import { saveAs } from 'file-saver'

jest.mock('file-saver', function () {
  return {
    saveAs: jest.fn()
  }
})

describe('.downloadJson', () => {
  const json = {
    a: 'b',
    c: 'd'
  }
  const fileName = 'test.json'

  it('adds json to link', () => {
    downloadJson(fileName, json)
    const blob = new Blob([JSON.stringify(json, null, 2)], {
      type: 'application/json'
    })
    expect(saveAs).toHaveBeenCalledWith(blob, 'test.json')
  })
})
