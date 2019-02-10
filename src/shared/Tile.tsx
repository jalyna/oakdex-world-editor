import * as React from 'react'
import styled from 'styled-components'

interface TileProps {
  x: number,
  y: number,
  className?: string
}

const Tile = styled.div`
  position: absolute;
  box-sizing: border-box;
  width: 16px;
  height: 16px;
`

export default function ({ x, y, className }: TileProps) {
  const style = {
    top: (y * 16) + 'px',
    left: (x * 16) + 'px'
  }
  return <Tile style={style} className={className} />
}
