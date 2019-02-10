import { Reducer } from 'redux'

import { CHANGE_CURRENT_COORDINATES, REMOVE_CURRENT_COORDINATES } from '../actionTypes'

export interface Coordinate {
  x: number,
  y: number
}

const currentCoordinates: Reducer<Coordinate> = (state: Coordinate | null = null, action): Coordinate | null => {
  switch (action.type) {
    case CHANGE_CURRENT_COORDINATES:
      return {
        x: action.x,
        y: action.y
      }
    case REMOVE_CURRENT_COORDINATES:
      return null
    default:
      return state
  }
}

export default currentCoordinates
