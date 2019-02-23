import getCoordinates from '../getCoordinates'

describe('.getCoordinates', () => {
  const zoom = 1
  const e = {
    currentTarget: {
      getBoundingClientRect: () => ({
        left: 100,
        top: 150
      })
    },
    pageX: 120,
    pageY: 200
  } as React.MouseEvent<HTMLDivElement>

  it('calculates coordinate in 16px grid', () => {
    expect(getCoordinates(zoom, e)).toEqual({
      x: 1,
      y: 3
    })
  })

  describe ('with zoom of 2', () => {
    it('calculates coordinate in 32px grid', () => {
      expect(getCoordinates(2, e)).toEqual({
        x: 0,
        y: 1
      })
    })
  })
})
