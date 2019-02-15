import { Reducer } from 'redux'

import { CHANGE_EDITOR_DATA } from '../actionTypes'

export interface EditorData {
  tool: string,
  currentLayer?: number
}

const defaultEditorData: EditorData = {
  tool: 'default'
}

const editorData: Reducer<EditorData> = (state: EditorData = defaultEditorData, action): EditorData => {
  switch (action.type) {
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
