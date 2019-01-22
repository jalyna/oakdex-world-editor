import { Reducer } from 'redux'

import { UPLOAD_TILESET } from './actionTypes'

export interface Tileset {
  width: number,
  height: number,
  imageBase64: string
}

const tilesetData: Reducer<Tileset> = (state: Tileset | null = null, action): Tileset | null => {
  switch (action.type) {
    case UPLOAD_TILESET:
      return {
        ...action.data
      }
    default:
      return state
  }
}

export default tilesetData
