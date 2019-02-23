import { Reducer } from 'redux'

import { Tileset } from 'components/TilesetEditor/reducers/tilesetData'

import { ADD_TILESET, RESET_MAP, REMOVE_TILESET } from '../actionTypes'

const tilesets: Reducer<Tileset[]> = (state: Tileset[] = [], action): Tileset[] => {
  switch (action.type) {
    case ADD_TILESET:
      const newTilesets = state.slice()
      newTilesets.push(action.data)
      return newTilesets
    case RESET_MAP:
      return []
    case REMOVE_TILESET:
      return state.slice().filter((t: Tileset) => {
        return t.title !== action.tilesetTitle
      })
    default:
      return state
  }
}

export default tilesets
