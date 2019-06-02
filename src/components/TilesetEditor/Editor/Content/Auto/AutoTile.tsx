import * as React from 'react'
import styled from 'styled-components'

import { AutoTile, AutoTileField } from 'components/TilesetEditor/reducers/tilesetData'
import Tile from 'shared/Tile'

const autoSelection = 'data:image/png;base64,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'

interface AutoTileProps {
  autoTileField: AutoTileField
}

interface StyledAutoTileProps {
  position: string
}

function autoTileToString (tile: AutoTileField): string {
  return Object.values([tile.opacityAreas.topLeft, tile.opacityAreas.topRight, tile.opacityAreas.bottomLeft, tile.opacityAreas.bottomRight]).map((b) => {
    return b ? '1' : '0'
  }).join(', ')
}

interface AutoTileMapping {
  [key: string]: string
}

const AUTO_TILE_MAPPING = {
  '1, 0, 0, 0': '-32px -32px',
  '0, 1, 0, 0': '0px -32px',
  '0, 0, 1, 0': '-32px 0px',
  '0, 0, 0, 1': '0px 0px',
  '1, 1, 0, 0': '-16px -32px',
  '0, 0, 1, 1': '-16px 0px',
  '0, 1, 0, 1': '0px -16px',
  '1, 0, 1, 0': '-32px -16px',
  '1, 1, 1, 1': '-16px -16px',
  '0, 1, 1, 1': '-64px -16px',
  '1, 0, 1, 1': '-48px -16px',
  '1, 1, 0, 1': '-64px 0px',
  '1, 1, 1, 0': '-48px 0px'
} as AutoTileMapping

export default function ({ autoTileField }: AutoTileProps) {
  return (
    <StyledAutoTile
      x={autoTileField.x} y={autoTileField.y}
      position={AUTO_TILE_MAPPING[autoTileToString(autoTileField)]}
    />
  )
}

const StyledAutoTile = styled(Tile)`
  background-image: url(${autoSelection});
  background-position: ${({ position }: StyledAutoTileProps) => position};
`
