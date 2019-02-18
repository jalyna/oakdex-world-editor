import { Coordinate } from 'components/TilesetEditor/reducers/currentCoordinates'
import { tilesetAreaToBox, SelectedTilesetArea } from 'components/MapEditor/reducers/editorData'
import { LayerField } from 'components/MapEditor/reducers/mapData'

export default function drawFields (coordinates: Coordinate, selectedTilesetArea?: SelectedTilesetArea, activeTileset?: string): LayerField[] {
  if (!selectedTilesetArea || !activeTileset) {
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
