import { Reducer } from 'redux'

import { UPLOAD_TILESET, UPDATE_TILESET, RESET_TILESET } from '../actionTypes'

// e.g. 1 1 1 1 is full cover
export interface OpacityAreas {
  topLeft: boolean,
  topRight: boolean,
  bottomRight: boolean,
  bottomLeft: boolean,
  [key: string]: boolean
}

export interface AutoTileField {
  opacityAreas: OpacityAreas,
  y: number,
  x: number
}

export interface AutoTile {
  title: string,
  fields: AutoTileField[]
}

export interface Field {
  y: number,
  x: number
}

export interface SpecialTile {
  title: string,
  fields: Field[]
}

export interface Walkability {
  // 0 walkable, 1 blocked, 2 overrides blockes e.g. bridges
  top: number,
  right: number,
  bottom: number,
  left: number
}

export interface Tileset {
  title: string,
  width: number,
  height: number,
  imageBase64: string,
  walkability: Walkability[][],
  objects: boolean[][],
  autoTiles: AutoTile[],
  specialTiles: SpecialTile[]
}

function generateDefaultObjects(width: number, height: number): boolean[][] {
  return new Array(height).fill(new Array(width).fill(false).map(() => false))
}

function generateDefaultWalkability(width: number, height: number): Walkability[][] {
  return new Array(height).fill(new Array(width).fill(0).map(() => ({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  })))
}

const tilesetData: Reducer<Tileset> = (state: Tileset | null = null, action): Tileset | null => {
  switch (action.type) {
    case UPLOAD_TILESET:
      return {
        walkability: generateDefaultWalkability(action.data.width, action.data.height),
        objects: generateDefaultObjects(action.data.width, action.data.height),
        autoTiles: [],
        specialTiles: [],
        ...action.data
      }
    case UPDATE_TILESET:
      return {
        ...state,
        ...action.data
      }
    case RESET_TILESET:
      return null
    default:
      return state
  }
}

export default tilesetData
