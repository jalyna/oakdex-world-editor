import { Reducer } from 'redux'

import { CHANGE_EDITOR_DATA, ADD_TILESET } from '../actionTypes'

export interface EditorData {
  tool: string,
  currentLayer?: number,
  activeTileset?: string,
  activeLayerIndex?: number,
  editTitleLayerIndex?: number,
  close?: () => void
}

const defaultEditorData: EditorData = {
  tool: 'default'
}

const editorData: Reducer<EditorData> = (state: EditorData = defaultEditorData, action): EditorData => {
  switch (action.type) {
    case ADD_TILESET:
      return {
        ...state,
        activeTileset: action.data.title
      }
    case CHANGE_EDITOR_DATA:
      return {
        ...state,
        ...action.data
      }
    default:
      return state
  }
}

export default editorData
