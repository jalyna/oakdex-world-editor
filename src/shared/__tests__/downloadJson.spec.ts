import downloadJson from '../downloadJson'

describe('.downloadJson', () => {
  const json = {
    a: 'b',
    c: 'd'
  }
  const fileName = 'test.json'
  const anchorElem = {
    setAttribute: jest.fn(),
    click: jest.fn()
  }
  beforeEach(() => {
    window.document.getElementById = jest.fn((id: string) => {
      return anchorElem
    })
  })

  it('adds json to link', () => {
    downloadJson(fileName, json)
    expect(anchorElem.setAttribute).toHaveBeenCalledWith('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(json, null, 2)))
    expect(anchorElem.setAttribute).toHaveBeenCalledWith('download', 'test.json')
    expect(anchorElem.click).toHaveBeenCalled()
  })
})
