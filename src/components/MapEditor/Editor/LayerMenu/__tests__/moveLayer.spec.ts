import moveLayer from '../moveLayer'
import { CHANGE_EDITOR_DATA, UPDATE_MAP } from 'components/MapEditor/actionTypes'

import store from 'components/MapEditor/store'

jest.mock('components/MapEditor/store', function () {
  return {
    default: {
      getState: jest.fn(() => ({
        mapData: {
          layers: [
            { title: 'a' },
            { title: 'b' }
          ]
        }
      }))
    }
  }
})

describe('.moveLayer', () => {
  const dispatch = jest.fn()
  it('dispatches correct actions', () => {
    moveLayer(dispatch, 1, -1)
    expect(dispatch).toHaveBeenCalledWith({
      type: UPDATE_MAP,
      data: {
        layers: [
          { title: 'b' },
          { title: 'a' }
        ]
      }
    })
    expect(dispatch).toHaveBeenCalledWith({
      type: CHANGE_EDITOR_DATA,
      data: { activeLayerIndex: 0 }
    })
  })
})
