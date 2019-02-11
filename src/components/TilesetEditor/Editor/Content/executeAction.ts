import { Dispatch } from 'redux'
import store from 'components/TilesetEditor/store'
import { AnyAction } from 'redux'

import getCoordinates from 'shared/getCoordinates'
import { Coordinate } from 'components/TilesetEditor/reducers/currentCoordinates'
import { UPDATE_TILESET } from 'components/TilesetEditor/actionTypes'
import { Walkability } from 'components/TilesetEditor/reducers/tilesetData'

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

function executeWalk (coordinates: Coordinate): AnyAction {
  const state = store.getState()
  let newValue = state.tilesetData.walkability[coordinates.y][coordinates.x].top + 1
  if (newValue > 2) {
    newValue = 0
  }
  let walkability = state.tilesetData.walkability.map((row, y) => {
    if (y === coordinates.y) {
      return row.slice()
    } else {
      return row
    }
  })

  walkability[coordinates.y][coordinates.x] = {
    top: newValue,
    left: newValue,
    right: newValue,
    bottom: newValue
  }

  return {
    type: UPDATE_TILESET,
    data: { walkability }
  }
}

export default function (dispatch: Dispatch, e: React.MouseEvent<HTMLDivElement>) {
  const coordinates = getCoordinates(store.getState().tabData.zoom, e)
  const tab = store.getState().activeTab
  switch (tab) {
    case 'objects':
      dispatch(executeObjects(coordinates))
      break
    case 'walk':
      dispatch(executeWalk(coordinates))
      break
  }
}
