import { Dispatch } from 'redux'
import store from 'components/MapEditor/store'
import { AnyAction } from 'redux'

import { Coordinate } from 'components/TilesetEditor/reducers/currentCoordinates'
import drawFields from './drawFields'
import getCoordinates from 'shared/getCoordinates'
import { LayerField, TilesetField } from 'components/MapEditor/reducers/mapData'
import { tilesetAreaToBox } from 'components/MapEditor/reducers/editorData'

import { UPDATE_MAP } from 'components/MapEditor/actionTypes'

function isSameTileset (field: TilesetField | null, target: TilesetField | null) {
  if (!field && !target) {
    return true
  }

  if (!field || !target) {
    return false
  }

  return field.tilesetX === target.tilesetX && field.tilesetY === target.tilesetY && field.tilesetTitle === target.tilesetTitle
}

function changeField (fields: LayerField[], coordinates: Coordinate, replacement: TilesetField): LayerField[] {
  let newFields = fields.slice().filter((field) => {
    return field.x !== coordinates.x || field.y !== coordinates.y
  })

  newFields.push({
    ...coordinates,
    ...replacement
  } as LayerField)

  return newFields
}

function floodFill (fields: LayerField[], coordinates: Coordinate, target: TilesetField | null, replacement: TilesetField): LayerField[] {
  if (coordinates.x < 0 || coordinates.y < 0 || coordinates.x >= store.getState().mapData.width || coordinates.y >= store.getState().mapData.height) {
    return fields
  }
  const field = fields.find((f) => f.x === coordinates.x && f.y === coordinates.y)
  
  if (isSameTileset(target, replacement) || isSameTileset(field, replacement) || !isSameTileset(field, target)) {
    return fields
  }

  let newFields = changeField(fields, coordinates, replacement)

  newFields = floodFill(newFields, { ...coordinates, y: coordinates.y + 1 }, target, replacement)
  newFields = floodFill(newFields, { ...coordinates, y: coordinates.y - 1 }, target, replacement)
  newFields = floodFill(newFields, { ...coordinates, x: coordinates.x - 1 }, target, replacement)
  newFields = floodFill(newFields, { ...coordinates, x: coordinates.x + 1 }, target, replacement)

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


  const mapData = store.getState().mapData
  let layers = mapData.layers.slice()
  const tilesetAreaBox = tilesetAreaToBox(selectedTilesetArea)
  const newTilesetField = {
    tilesetTitle: activeTileset,
    tilesetX: tilesetAreaBox.x,
    tilesetY: tilesetAreaBox.y
  } as TilesetField
  const field = layers[currentLayer].fields.find((f) => f.x === coordinates.x && f.y === coordinates.y)
  layers[currentLayer].fields = floodFill(layers[currentLayer].fields,
                                          coordinates,
                                          field,
                                          newTilesetField)

  dispatch({
    type: UPDATE_MAP,
    data: {
      layers
    }
  })
}
