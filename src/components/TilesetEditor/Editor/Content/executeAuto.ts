import { AnyAction } from 'redux'
import store from 'components/TilesetEditor/store'

import { Coordinate } from 'components/TilesetEditor/reducers/currentCoordinates'
import { AutoTileField, AutoTile } from 'components/TilesetEditor/reducers/tilesetData'
import { UPDATE_TILESET } from 'components/TilesetEditor/actionTypes'

function positionInGrid (coordinates: Coordinate, zoom: number, e: React.MouseEvent<HTMLDivElement>): string | null {
  const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
  const x = (e.pageX - rect.left - coordinates.x * 16 * zoom) / zoom
  const y = (e.pageY - rect.top - coordinates.y * 16 * zoom) / zoom

  if (x >= 0 && x < 8 && y >= 0 && y < 8) {
    return 'topLeft'
  } else if (x >= 8 && y >= 0 && y < 8) {
    return 'topRight'
  } else if (x >= 8 && y >= 8) {
    return 'bottomRight'
  } else if (x >= 0 && x < 8 && y >= 8) {
    return 'bottomLeft'
  }

  return null
}

function initField (coordinates: Coordinate): AutoTileField {
  return {
    ...coordinates,
    opacityAreas: {
      topLeft: false,
      topRight: false,
      bottomRight: false,
      bottomLeft: false
    }
  } as AutoTileField
}

export default function executeAuto (e: React.MouseEvent<HTMLDivElement>, coordinates: Coordinate): AnyAction {
  const state = store.getState()
  const selectedAutoTile = state.tabData.selectedAutoTile

  if (!selectedAutoTile) { return }
  if (e.type !== 'mousedown') { return }

  const position = positionInGrid(coordinates, state.tabData.zoom, e)

  let autoTiles = state.tilesetData.autoTiles.slice().map((autoTile: AutoTile) => {
    if (autoTile.title === selectedAutoTile) {
      let fields = autoTile.fields.slice().filter((f: AutoTileField) => f.x !== coordinates.x || f.y !== coordinates.y)
      let field = autoTile.fields.find((f: AutoTileField) => f.x === coordinates.x && f.y === coordinates.y)
      if (!field) {
        field = initField(coordinates)
      }
      field = { ...field }
      if (position === 'topLeft') {
        field.opacityAreas.topLeft = !field.opacityAreas.topLeft
      } else if (position === 'topRight') {
        field.opacityAreas.topRight = !field.opacityAreas.topRight
      } else if (position === 'bottomRight') {
        field.opacityAreas.bottomRight = !field.opacityAreas.bottomRight
      } else if (position === 'bottomLeft') {
        field.opacityAreas.bottomLeft = !field.opacityAreas.bottomLeft
      }

      if (!Object.values(field.opacityAreas).every((f: boolean) => !f)) {
        fields.push(field)
      }
      autoTile.fields = fields
      return { ...autoTile }
    } else {
      return autoTile
    }
  })

  return {
    type: UPDATE_TILESET,
    data: { autoTiles }
  }
}
