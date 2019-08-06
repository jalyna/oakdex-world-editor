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

export interface Credit {
  title: string,
  url?: string
}

export interface Charset {
  title: string,
  imageBase64: string
}

export interface Tileset {
  title: string,
  width: number,
  height: number,
  imageBase64: string,
  versions?: {
    name: string,
    imageBase64: string
  }[],
  walkability: Walkability[][],
  objects: boolean[][],
  autoTiles: AutoTile[],
  specialTiles: SpecialTile[],
  credits?: Credit[],
  charsets?: Charset[]
}

export const EMPTY_WALK = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0
} as Walkability

function generateDefaultObjects(width: number, height: number): boolean[][] {
  return new Array(height).fill(new Array(width).fill(false).map(() => false))
}

function generateDefaultWalkability(width: number, height: number): Walkability[][] {
  return new Array(height).fill(new Array(width).fill(0).map(() => EMPTY_WALK))
}

function adjustWalkability (width: number, height: number, walkability: Walkability[][]): Walkability[][] {
  const diffY = height - walkability.length
  const diffX = width - walkability[0].length

  const newY = new Array(diffY).fill(new Array(width).fill(0).map(() => EMPTY_WALK))

  let newWalkability = walkability.map((row) => {
    const newX = new Array(diffX).fill(0).map(() => EMPTY_WALK)
    return row.concat(newX)
  })

  return newWalkability.concat(newY)
}

function adjustObjects (width: number, height: number, objects: boolean[][]): boolean[][] {
  const diffY = height - objects.length
  const diffX = width - objects[0].length

  const newY = new Array(diffY).fill(new Array(width).fill(0).map(() => false))

  let newObjects = objects.map((row) => {
    const newX = new Array(diffX).fill(0).map(() => false)
    return row.concat(newX)
  })

  return newObjects.concat(newY)
}

const tilesetData: Reducer<Tileset> = (state: Tileset | null = null, action): Tileset | null => {
  let newState: Tileset | null = null
  switch (action.type) {
    case UPLOAD_TILESET:
      newState = {
        walkability: generateDefaultWalkability(action.data.width, action.data.height),
        objects: generateDefaultObjects(action.data.width, action.data.height),
        autoTiles: [],
        specialTiles: [],
        ...action.data
      }
      if (action.data.walkability) {
        newState.walkability = adjustWalkability(action.data.width, action.data.height, action.data.walkability)
      }
      if (action.data.objects) {
        newState.objects = adjustObjects(action.data.width, action.data.height, action.data.objects)
      }
      return newState
    case UPDATE_TILESET:
      newState = {
        ...state,
        ...action.data
      }
      if (action.data.width || action.data.height) {
        newState.walkability = adjustWalkability(newState.width, newState.height, newState.walkability)
        newState.objects = adjustObjects(newState.width, newState.height, newState.objects)
      }
      return newState
    case RESET_TILESET:
      return null
    default:
      return state
  }
}

export default tilesetData
