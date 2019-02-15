import { Reducer } from 'redux'

import { Tileset } from 'components/TilesetEditor/reducers/tilesetData'

import { UPLOAD_MAP } from '../actionTypes'

export interface LayerField {
  x: number,
  y: number,
  tilesetTitle: string,
  tilesetX: number,
  tilesetY: number
}

export interface Layer {
  title: string,
  fields: LayerField[]
}

export interface MapData {
  title: string,
  width: number,
  height: number,
  tilesets: Tileset[],
  layers: Layer[]
}

const mapData: Reducer<MapData> = (state: MapData | null = null, action): MapData | null => {
  switch (action.type) {
    case UPLOAD_MAP:
      return {
        layers: [],
        width: 30,
        height: 20,
        title: 'New Map',
        tilesets: [],
        ...action.data
      }
    default:
      return state
  }
}

export default mapData
