import resize from '../resize'
import { CHANGE_EDITOR_DATA, UPDATE_MAP } from 'components/MapEditor/actionTypes'

import store from 'components/MapEditor/store'

jest.mock('components/MapEditor/store', function () {
  return {
    default: {
      getState: jest.fn(() => ({
        mapData: {
          height: 7,
          width: 10,
          layers: [
            { title: 'a', fields: [{ x: 0, y: 0 }] },
            { title: 'b', fields: [{ x: 6, y: 2 }] }
          ]
        }
      }))
    }
  }
})

describe('.resize', () => {
  const dispatch = jest.fn()

  it('dispatches correct actions when increase size top', () => {
    resize(dispatch, 'top', 1)
    expect(dispatch).toHaveBeenCalledWith({
      type: UPDATE_MAP,
      data: {
        height: 8,
        layers: [
          { title: 'a', fields: [{ x: 0, y: 1 }] },
          { title: 'b', fields: [{ x: 6, y: 3 }] }
        ]
      }
    })
  })

  it('dispatches correct actions when decrease size left', () => {
    resize(dispatch, 'left', -1)
    expect(dispatch).toHaveBeenCalledWith({
      type: UPDATE_MAP,
      data: {
        width: 9,
        layers: [
          { title: 'a', fields: [] },
          { title: 'b', fields: [{ x: 5, y: 2 }] }
        ]
      }
    })
  })

  it('dispatches correct actions when increase size bottom', () => {
    resize(dispatch, 'bottom', 1)
    expect(dispatch).toHaveBeenCalledWith({
      type: UPDATE_MAP,
      data: {
        height: 8,
        layers: [
          { title: 'a', fields: [{ x: 0, y: 0 }] },
          { title: 'b', fields: [{ x: 6, y: 2 }] }
        ]
      }
    })
  })
})
