import { Reducer } from 'redux'

import { CHANGE_EDITOR_DATA, ADD_TILESET } from '../actionTypes'
import { Coordinate } from 'components/TilesetEditor/reducers/currentCoordinates'
import { LayerField } from 'components/MapEditor/reducers/mapData'

export interface SelectedTilesetArea {
  x: number,
  y: number,
  targetX: number,
  targetY: number
}

export interface TilesetAreaBox {
  x: number,
  y: number,
  width: number,
  height: number
}

export interface EditorData {
  tool: string,
  tilesetMouseHolding: boolean,
  mapMouseHolding: boolean,
  activeAutoTile?: string,
  currentCoordinates?: Coordinate,
  activeTileset?: string,
  activeLayerIndex?: number,
  editTitleLayerIndex?: number,
  selectedTilesetArea?: SelectedTilesetArea,
  randomTiles: Coordinate[],
  previewFields: LayerField[],
  close?: () => void
}

const defaultEditorData: EditorData = {
  tool: 'default',
  tilesetMouseHolding: false,
  mapMouseHolding: false,
  previewFields: [],
  randomTiles: []
}

export function tilesetAreaToBox (tilesetArea: SelectedTilesetArea): TilesetAreaBox {
  const x = Math.min(tilesetArea.x, tilesetArea.targetX)
  const y = Math.min(tilesetArea.y, tilesetArea.targetY)
  const goalX = Math.max(tilesetArea.x, tilesetArea.targetX)
  const goalY = Math.max(tilesetArea.y, tilesetArea.targetY)

  return {
    x,
    y,
    width: goalX - x + 1,
    height: goalY - y + 1
  }
}

const editorData: Reducer<EditorData> = (state: EditorData = defaultEditorData, action): EditorData => {
  switch (action.type) {
    case ADD_TILESET:
      return {
        ...state,
        activeTileset: action.data.title
      }
    case CHANGE_EDITOR_DATA:
      return {
        ...state,
        ...action.data
      }
    default:
      return state
  }
}

export default editorData
