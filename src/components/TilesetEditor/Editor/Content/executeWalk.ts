import { AnyAction } from 'redux'
import store from 'components/TilesetEditor/store'

import { Coordinate } from 'components/TilesetEditor/reducers/currentCoordinates'
import { Walkability } from 'components/TilesetEditor/reducers/tilesetData'
import { UPDATE_TILESET } from 'components/TilesetEditor/actionTypes'

function positionInGrid (coordinates: Coordinate, zoom: number, e: React.MouseEvent<HTMLDivElement>): string | null {
  const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
  const x = (e.pageX - rect.left - coordinates.x * 16 * zoom) / zoom
  const y = (e.pageY - rect.top - coordinates.y * 16 * zoom) / zoom

  if (x >= 5 && x <= 12 && y >= 0 && y <= 7) {
    return 'top'
  } else if (x >= 5 && x <= 12 && y >= 7 && y <= 16) {
    return 'bottom'
  } else if (x >= 0 && x <= 7 && y >= 5 && y <= 12) {
    return 'left'
  } else if (x >= 7 && x <= 16 && y >= 5 && y <= 12) {
    return 'right'
  }

  return null
}

export default function executeWalk (e: React.MouseEvent<HTMLDivElement>, coordinates: Coordinate): AnyAction {
  const state = store.getState()
  const mode = state.tabData.walkabilityMode
  const prop = mode === 'details' ? positionInGrid(coordinates, state.tabData.zoom, e) : 'top'

  if (!prop) {
    return null
  }

  let newValue = state.tilesetData.walkability[coordinates.y][coordinates.x].top
  if (prop === 'left') {
    newValue = state.tilesetData.walkability[coordinates.y][coordinates.x].left
  } else if (prop === 'right') {
    newValue = state.tilesetData.walkability[coordinates.y][coordinates.x].right
  } else if (prop === 'bottom') {
    newValue = state.tilesetData.walkability[coordinates.y][coordinates.x].bottom
  }

  if (newValue + 1 > 2) {
    newValue = 0
  } else {
    newValue++
  }

  let walkability = state.tilesetData.walkability.map((row, y) => {
    if (y === coordinates.y) {
      return row.slice()
    } else {
      return row
    }
  })

  if (mode === 'details') {
    walkability[coordinates.y][coordinates.x] = {
      ...walkability[coordinates.y][coordinates.x]
    }
    if (prop === 'left') {
      walkability[coordinates.y][coordinates.x].left = newValue
    } else if (prop === 'right') {
      walkability[coordinates.y][coordinates.x].right = newValue
    } else if (prop === 'bottom') {
      walkability[coordinates.y][coordinates.x].bottom = newValue
    } else {
      walkability[coordinates.y][coordinates.x].top = newValue
    }
  } else {
    walkability[coordinates.y][coordinates.x] = {
      top: newValue,
      left: newValue,
      right: newValue,
      bottom: newValue
    }
  }

  return {
    type: UPDATE_TILESET,
    data: { walkability }
  }
}
