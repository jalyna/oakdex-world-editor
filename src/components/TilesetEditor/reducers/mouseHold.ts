import { Reducer } from 'redux'

import { CHANGE_MOUSE_HOLD } from '../actionTypes'

const mouseHold: Reducer<boolean> = (state: boolean = false, action): boolean => {
  switch (action.type) {
    case CHANGE_MOUSE_HOLD:
      return action.hold
    default:
      return state
  }
}

export default mouseHold
