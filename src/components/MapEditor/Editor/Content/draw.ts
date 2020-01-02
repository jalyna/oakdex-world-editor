import { Dispatch } from 'redux'
import store from 'components/MapEditor/store'
import { AnyAction } from 'redux'

import drawFields from './drawFields'
import getCoordinates from 'shared/getCoordinates'

import { UPDATE_MAP } from 'components/MapEditor/actionTypes'

export default function (dispatch: Dispatch, e: React.MouseEvent<HTMLDivElement>) {
  const coordinates = getCoordinates(1, e)
  const state = store.getState()

  if (state.editorData.tool === 'startPosition') {
    dispatch({
      type: UPDATE_MAP,
      data: {
        startPosition: {
          x: coordinates.x,
          y: coordinates.y
        }
      }
    })

    return
  }

  const selectedTilesetArea = state.editorData.selectedTilesetArea
  const activeTileset = state.editorData.activeTileset
  const currentLayer = state.editorData.activeLayerIndex

  if (!activeTileset || currentLayer === undefined) {
    return
  }

  const mapData = store.getState().mapData
  let layers = mapData.layers.slice()
  const newFields = drawFields(coordinates, selectedTilesetArea, activeTileset)

  layers[currentLayer].fields = layers[currentLayer].fields.filter((field) => {
    return newFields.every((f) => f.x !== field.x || f.y !== field.y)
  })

  if (state.editorData.tool !== 'erase') {
    layers[currentLayer].fields = newFields.filter((field) => {
      return field.x >= 0 && field.x < mapData.width && field.y >= 0 && field.y < mapData.height
    }).concat(layers[currentLayer].fields)
  }

  dispatch({
    type: UPDATE_MAP,
    data: {
      layers
    }
  })
}
