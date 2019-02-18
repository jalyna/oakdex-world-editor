import { Dispatch } from 'redux'
import store from 'components/MapEditor/store'
import { AnyAction } from 'redux'

import { LayerField } from 'components/MapEditor/reducers/mapData'
import { tilesetAreaToBox, SelectedTilesetArea, TilesetAreaBox } from 'components/MapEditor/reducers/editorData'
import { Coordinate } from 'components/TilesetEditor/reducers/currentCoordinates'
import getCoordinates from 'shared/getCoordinates'

import { UPDATE_MAP } from 'components/MapEditor/actionTypes'

export function drawFields (coordinates: Coordinate, selectedTilesetArea?: SelectedTilesetArea, activeTileset?: string): LayerField[] {
  if (!selectedTilesetArea || !activeTileset) {
    return []
  }

  const tilesetAreaBox = tilesetAreaToBox(selectedTilesetArea)
  let newFields = [] as LayerField[];

  [...Array(tilesetAreaBox.height)].forEach((_, offsetY) => {
    [...Array(tilesetAreaBox.width)].forEach((_, offsetX) => {
      newFields.push({
        x: coordinates.x + offsetX,
        y: coordinates.y + offsetY,
        tilesetTitle: activeTileset,
        tilesetX: tilesetAreaBox.x + offsetX,
        tilesetY: tilesetAreaBox.y + offsetY
      }) 
    })
  })

  return newFields
}

export default function (dispatch: Dispatch, e: React.MouseEvent<HTMLDivElement>) {
  const coordinates = getCoordinates(1, e)
  const state = store.getState()
  const selectedTilesetArea = state.editorData.selectedTilesetArea
  const activeTileset = state.editorData.activeTileset
  const currentLayer = state.editorData.activeLayerIndex

  if (!selectedTilesetArea || !activeTileset || currentLayer === undefined) {
    return
  }

  let layers = store.getState().mapData.layers.slice()
  const newFields = drawFields(coordinates, selectedTilesetArea, activeTileset)

  layers[currentLayer].fields = layers[currentLayer].fields.filter((field) => {
    return field.x !== coordinates.x || field.y !== coordinates.y
  })
  layers[currentLayer].fields = newFields.concat(layers[currentLayer].fields)

  dispatch({
    type: UPDATE_MAP,
    data: {
      layers
    }
  })
}
