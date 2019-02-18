import * as React from 'react'
import styled from 'styled-components'

interface TileProps {
  x: number,
  y: number,
  className?: string,
  style?: any,
  children?: React.ReactNode
}

const Tile = styled.div`
  position: absolute;
  box-sizing: border-box;
  width: 16px;
  height: 16px;
`

export default function ({ x, y, className, children, style }: TileProps) {
  const newStyle = {
    top: (y * 16) + 'px',
    left: (x * 16) + 'px'
  }
  return <Tile style={{ ...style, ...newStyle }} className={className}>{children}</Tile>
}
