import { Dispatch } from 'redux'
import store from 'components/TilesetEditor/store'
import { AnyAction } from 'redux'

import getCoordinates from 'shared/getCoordinates'
import { Coordinate } from 'components/TilesetEditor/reducers/currentCoordinates'
import { UPDATE_TILESET } from 'components/TilesetEditor/actionTypes'

function executeObjects (coordinates: Coordinate): AnyAction {
  const state = store.getState()
  let objects = JSON.parse(JSON.stringify(state.tilesetData.objects))
  const newBool = state.tabData.objectsTool === 'erase' ? false : true
  objects[coordinates.y][coordinates.x] = newBool
  return {
    type: UPDATE_TILESET,
    data: { objects }
  }
}

export default function (dispatch: Dispatch, e: React.MouseEvent<HTMLDivElement>) {
  const coordinates = getCoordinates(e)
  const tab = store.getState().activeTab
  switch (tab) {
    case 'objects':
      dispatch(executeObjects(coordinates))
      break
  }
}
