import { Reducer } from 'redux'

import { Tileset } from 'components/TilesetEditor/reducers/tilesetData'

import { UPLOAD_MAP, UPDATE_MAP, RESET_MAP } from '../actionTypes'

export interface TilesetField {
  tilesetTitle: string,
  tilesetX: number,
  tilesetY: number
}

export interface LayerField extends TilesetField {
  x: number,
  y: number
}

export interface Layer {
  title: string,
  fields: LayerField[]
}

export interface MapData {
  title: string,
  width: number,
  height: number,
  layers: Layer[]
}

const mapData: Reducer<MapData> = (state: MapData | null = null, action): MapData | null => {
  switch (action.type) {
    case UPLOAD_MAP:
      return {
        layers: [{
          title: 'Layer 1',
          fields: []
        }],
        width: 30,
        height: 20,
        title: 'New Map',
        ...action.data
      }
    case UPDATE_MAP:
      return {
        ...state,
        ...action.data
      }
    case RESET_MAP:
      return null
    default:
      return state
  }
}

export default mapData
