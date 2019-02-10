import { Dispatch } from 'redux'
import store from 'components/TilesetEditor/store'
import { AnyAction } from 'redux'

import getCoordinates from 'shared/getCoordinates'
import { Coordinate } from 'components/TilesetEditor/reducers/currentCoordinates'
import { UPDATE_TILESET } from 'components/TilesetEditor/actionTypes'

function executeObjects (coordinates: Coordinate): AnyAction {
  let objects = JSON.parse(JSON.stringify(store.getState().tilesetData.objects))
  objects[coordinates.y][coordinates.x] = !objects[coordinates.y][coordinates.x]
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
