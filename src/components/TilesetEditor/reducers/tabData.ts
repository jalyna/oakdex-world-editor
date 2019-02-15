import { Reducer } from 'redux'

import { CHANGE_TAB_DATA } from '../actionTypes'
import { Tileset } from './tilesetData'

export interface TabData {
  objectsTool: string,
  walkabilityMode: string,
  specialTool: string,
  zoom: number,
  nextAutoTileTitle: string,
  nextSpecialTileTitle: string,
  selectedAutoTile?: string,
  selectedSpecialTile?: string,
  close?: () => void,
  createMap?: (tilesetData: Tileset) => void
}

const defaultTabData: TabData = {
  objectsTool: 'default',
  walkabilityMode: 'default',
  specialTool: 'default',
  nextAutoTileTitle: '',
  nextSpecialTileTitle: '',
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
