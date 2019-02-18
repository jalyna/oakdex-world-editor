import { Dispatch } from 'redux'
import store from 'components/MapEditor/store'
import { AnyAction } from 'redux'

import { Coordinate } from 'components/TilesetEditor/reducers/currentCoordinates'
import getCoordinates from 'shared/getCoordinates'

import { CHANGE_EDITOR_DATA } from 'components/MapEditor/actionTypes'

export default function (dispatch: Dispatch, e: React.MouseEvent<HTMLDivElement>) {
  const coordinates = getCoordinates(1, e)
  const area = store.getState().editorData.selectedTilesetArea
  let selectedTilesetArea

  if (area) {
    selectedTilesetArea = { ...area }
    selectedTilesetArea.targetX = coordinates.x
    selectedTilesetArea.targetY = coordinates.y
  } else {
    selectedTilesetArea = {
      x: coordinates.x,
      y: coordinates.y,
      targetX: coordinates.x,
      targetY: coordinates.y
    }
  }

  dispatch({
    type: CHANGE_EDITOR_DATA,
    data: { selectedTilesetArea }
  })
}
