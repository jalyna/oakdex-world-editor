import { Dispatch } from 'redux'

import store from 'components/MapEditor/store'
import { CHANGE_EDITOR_DATA, UPDATE_MAP } from 'components/MapEditor/actionTypes'

export default function (dispatch: Dispatch, layerIndex: number, direction: number) {
  const mapData = store.getState().mapData
  if (!mapData) {
    return
  }
  let layers = mapData.layers.slice()
  const layer = layers[layerIndex]
  layers.splice(layerIndex, 1)
  layers.splice(layerIndex + direction, 0, layer)

  dispatch({
    type: UPDATE_MAP,
    data: { layers }
  })

  dispatch({
    type: CHANGE_EDITOR_DATA,
    data: { activeLayerIndex: layerIndex + direction }
  })
}
