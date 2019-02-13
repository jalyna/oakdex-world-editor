import { AnyAction } from 'redux'
import store from 'components/TilesetEditor/store'

import { Coordinate } from 'components/TilesetEditor/reducers/currentCoordinates'
import { Field, SpecialTile } from 'components/TilesetEditor/reducers/tilesetData'
import { UPDATE_TILESET } from 'components/TilesetEditor/actionTypes'

export default function executeSpecial (e: React.MouseEvent<HTMLDivElement>, coordinates: Coordinate): AnyAction {
  const state = store.getState()
  const selectedSpecialTile = state.tabData.selectedSpecialTile
  const tool = state.tabData.specialTool

  if (!selectedSpecialTile) { return }

  let specialTiles = state.tilesetData.specialTiles.slice().map((specialTile: SpecialTile) => {
    if (specialTile.title === selectedSpecialTile) {
      let fields = specialTile.fields.slice().filter((f: Field) => f.x !== coordinates.x || f.y !== coordinates.y)
      
      if (tool === 'default') {
        const field = { ...coordinates } as Field
        fields.push(field)
      }

      specialTile.fields = fields

      return { ...specialTile }
    } else {
      return specialTile
    }
  })

  return {
    type: UPDATE_TILESET,
    data: { specialTiles }
  }
}
