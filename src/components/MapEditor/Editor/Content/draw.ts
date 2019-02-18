import { Dispatch } from 'redux'
import store from 'components/MapEditor/store'
import { AnyAction } from 'redux'

import { LayerField } from 'components/MapEditor/reducers/mapData'
import { tilesetAreaToBox } from 'components/MapEditor/reducers/editorData'
import { Coordinate } from 'components/TilesetEditor/reducers/currentCoordinates'
import getCoordinates from 'shared/getCoordinates'

import { UPDATE_MAP } from 'components/MapEditor/actionTypes'

export default function (dispatch: Dispatch, e: React.MouseEvent<HTMLDivElement>) {
  const coordinates = getCoordinates(1, e)
  const state = store.getState()
  const selectedTilesetArea = state.editorData.selectedTilesetArea
  const activeTileset = state.editorData.activeTileset
  const currentLayer = state.editorData.activeLayerIndex

  if (!selectedTilesetArea || !activeTileset || currentLayer === undefined) {
    return
  }

  const tilesetAreaBox = tilesetAreaToBox(selectedTilesetArea)

  let layers = store.getState().mapData.layers.slice()
  const newField = {
    ...coordinates,
    tilesetTitle: activeTileset,
    tilesetX: tilesetAreaBox.x,
    tilesetY: tilesetAreaBox.y
  } as LayerField

  layers[currentLayer].fields = layers[currentLayer].fields.filter((field) => {
    return field.x !== coordinates.x || field.y !== coordinates.y
  })
  layers[currentLayer].fields.push(newField)

  dispatch({
    type: UPDATE_MAP,
    data: {
      layers
    }
  })
}
