import { Reducer } from 'redux'

import { CHANGE_TAB } from '../actionTypes'

const activeTab: Reducer<string> = (state: string = 'objects', action): string => {
  switch (action.type) {
    case CHANGE_TAB:
      return action.tab
    default:
      return state
  }
}

export default activeTab
