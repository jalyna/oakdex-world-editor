import { Reducer } from 'redux'

import { CHANGE_TAB_DATA } from '../actionTypes'

export interface TabData {
  objectsTool: string,
  walkabilityMode: string,
  autoTool: string,
  zoom: number,
  nextAutoTileTitle: string,
  selectedAutoTile?: string
}

const defaultTabData: TabData = {
  objectsTool: 'default',
  walkabilityMode: 'default',
  autoTool: 'default',
  nextAutoTileTitle: '',
  zoom: 1
}

const tabData: Reducer<TabData> = (state: TabData = defaultTabData, action): TabData => {
  switch (action.type) {
    case CHANGE_TAB_DATA:
      return {
        ...state,
        ...action.data
      }
    default:
      return state
  }
}

export default tabData
