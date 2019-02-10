import * as React from 'react'
import styled from 'styled-components'

interface TileProps {
  x: number,
  y: number
}

const Tile = styled.div`
  position: absolute;
  box-sizing: border-box;
  width: 16px;
  height: 16px;
  top: ${({ y }: TileProps) => y * 16}px;
  left: ${({ x }: TileProps) => x * 16}px;
`

export default Tile
