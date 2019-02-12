import * as React from 'react'
import styled from 'styled-components'

import { AutoTile } from 'components/TilesetEditor/reducers/tilesetData'
import Tile from 'shared/Tile'

import autoSelection from './autoSelection.png'

interface AutoTileProps {
  autoTile: AutoTile
}

interface StyledAutoTileProps {
  position: string
}

function autoTileToString (tile: AutoTile): string {
  return Object.values(tile.opacityAreas.opacityAreas).map((b) => {
    return b ? '1' : '0'
  }).join(', ')
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
}

export default function ({ autoTile }: AutoTileProps) {
  return (
    <StyledAutoTile
      x={autoTile.x} y={autoTile.y}
      position={AUTO_TILE_MAPPING[autoTileToString(autoTile)]}
    />
  )
}

const StyledAutoTile = styled(Tile)`
  background-image: url(${autoSelection});
  background-position: ${({ position }: StyledAutoTileProps) => position};
`


