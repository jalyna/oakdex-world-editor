import { Coordinate } from 'components/TilesetEditor/reducers/currentCoordinates'
import { tilesetAreaToBox, SelectedTilesetArea } from 'components/MapEditor/reducers/editorData'
import { LayerField, Layer } from 'components/MapEditor/reducers/mapData'
import { AutoTile, OpacityAreas, Tileset } from 'components/TilesetEditor/reducers/tilesetData'

import store from 'components/MapEditor/store'

import drawAutoFields from './drawAutoFields'

export default function drawFields (coordinates: Coordinate, selectedTilesetArea?: SelectedTilesetArea, activeTileset?: string): LayerField[] {
  if (!activeTileset) {
    return []
  }

  const editorData = store.getState().editorData
  const tool = editorData.tool

  if (tool === 'auto') {
    return drawAutoFields(coordinates, activeTileset)
  } else if (tool === 'erase') {
    return [{
      ...coordinates,
      tilesetX: -1,
      tilesetY: -1,
      tilesetTitle: ''
    } as LayerField]
  } else if (tool === 'random') {
    if (editorData.randomTiles.length === 0) {
      return []
    }

    const tilesetCoordinates = editorData.randomTiles[Math.floor(Math.random() * editorData.randomTiles.length)]

    return [{
      ...coordinates,
      tilesetX: tilesetCoordinates.x,
      tilesetY: tilesetCoordinates.y,
      tilesetTitle: activeTileset
    } as LayerField]
  }

  if (!selectedTilesetArea) {
    return []
  }

  const tilesetAreaBox = tilesetAreaToBox(selectedTilesetArea)
  let newFields = [] as LayerField[];

  [...Array(tilesetAreaBox.height)].forEach((_, offsetY) => {
    [...Array(tilesetAreaBox.width)].forEach((_, offsetX) => {
      newFields.push({
        x: coordinates.x - Math.floor(tilesetAreaBox.width / 2) + offsetX,
        y: coordinates.y - Math.floor(tilesetAreaBox.height / 2) + offsetY,
        tilesetTitle: activeTileset,
        tilesetX: tilesetAreaBox.x + offsetX,
        tilesetY: tilesetAreaBox.y + offsetY
      }) 
    })
  })

  return newFields
}
