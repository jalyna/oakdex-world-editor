import { Reducer } from 'redux'
import { Direction } from 'oakdex-world-engine'

import { Tileset } from 'components/TilesetEditor/reducers/tilesetData'

import { UPLOAD_MAP, UPDATE_MAP, RESET_MAP } from '../actionTypes'

import { getDefaultMapSize } from '../../..'

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

export interface MapChar {
  tilesetTitle: string,
  charsetTitle: string,
  id: string,
  x: number,
  y: number,
  dir: Direction,
  hidden?: boolean,
  walkThrough?: boolean,
  event?: {
    onTalk?: object,
    onWalkOver?: object,
    onMapEnter?: object
  }
}

export interface MapData {
  title: string,
  width: number,
  height: number,
  layers: Layer[],
  chars?: MapChar[],
  versions?: {
    name: string,
    tilesetVersions: {
      tilesetId: string,
      versionId: string
    }[]
  }[]
}

const mapData: Reducer<MapData> = (state: MapData | null = null, action): MapData | null => {
  switch (action.type) {
    case UPLOAD_MAP:
      return {
        layers: [{
          title: 'Layer 1',
          fields: []
        }],
        width: getDefaultMapSize().width,
        height: getDefaultMapSize().height,
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
