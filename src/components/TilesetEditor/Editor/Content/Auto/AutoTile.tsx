import * as React from 'react'
import styled from 'styled-components'

import { AutoTile, AutoTileField } from 'components/TilesetEditor/reducers/tilesetData'
import Tile from 'shared/Tile'

import * as autoSelection from './autoSelection.png'

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
