import * as React from 'react'
import styled from 'styled-components'

import { GREY_90, TEAL_30 } from 'shared/theme'
import base64Dimensions from 'shared/base64Dimensions'

import { Charset } from 'components/TilesetEditor/reducers/tilesetData'
import { Direction } from 'oakdex-world-engine'

interface CharItemProps {
  direction: Direction
}

const CharItem = styled.div`
  position: absolute;
  image-rendering: pixelated;
  width: 32px;
  height: 32px;
  margin-top: -16px;
  margin-left: -8px;
  ${({ direction, isBig }: CharItemProps) => direction === Direction.Down && `
    background-position: ${isBig ? '0' : '-32px'} 0px;
  `}
  ${({ direction, isBig }: CharItemProps) => direction === Direction.Up && `
    background-position: ${isBig ? '0' : '-32px'} -96px;
  `}
  ${({ direction, isBig }: CharItemProps) => direction === Direction.Left && `
    background-position: ${isBig ? '0' : '-32px'} -32px;
  `}
  ${({ direction, isBig }: CharItemProps) => direction === Direction.Right && `
    background-position: ${isBig ? '0' : '-32px'} -64px;
  `}
`

interface CharItemProps {
  direction: Direction,
  isBig: boolean
}

interface CharPreviewProps {
  direction: Direction,
  charset: Charset,
  x: number,
  y: number,
  hidden: boolean
}

export default function CharPreview({ direction, charset, x, y, hidden }: CharPreviewProps) {
  const [width, setWidth] = React.useState(null)

  React.useEffect(() => {
    base64Dimensions(charset.imageBase64).then((dimensions) => setWidth(dimensions.width))
  })

  const style = {
    backgroundImage: 'url(' + charset.imageBase64 + ')',
    left: x * 16,
    top: y * 16,
    opacity: hidden ? 0.3 : 1
  }

  return <CharItem
    direction={direction}
    isBig={width === 160}
    style={style} />
}
