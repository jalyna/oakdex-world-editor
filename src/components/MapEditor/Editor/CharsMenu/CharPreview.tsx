import * as React from 'react'
import styled from 'styled-components'

import { GREY_90, TEAL_30 } from 'shared/theme'
import base64Dimensions from 'shared/base64Dimensions'

import { Charset } from 'components/TilesetEditor/reducers/tilesetData'

const CharItem = styled.div`
  width: 32px;
  height: 32px;
  image-rendering: pixelated;
  cursor: pointer;
  background-position: -32px -2px;
  border: 1px solid transparent;
  box-sizing: border-box;
  ${({ selected }: CharItemProps) => selected && `
    border-color: ${TEAL_30};
    background-color: ${GREY_90};
  `}
  ${({ isBig }: CharItemProps) => isBig && `
    background-position: 0px 0px;
  `}
`

interface CharItemProps {
  selected?: boolean,
  isBig: boolean
}

interface CharPreviewProps {
  selected?: boolean,
  onClick?: () => void,
  charset: Charset
}

export default function CharPreview({ selected, onClick, charset }: CharPreviewProps) {
  const [width, setWidth] = React.useState(null)

  React.useEffect(() => {
    base64Dimensions(charset.imageBase64).then((dimensions) => setWidth(dimensions.width))
  })

  const style = {
    backgroundImage: 'url(' + charset.imageBase64 + ')'
  }
  return <CharItem
    selected={selected}
    isBig={width === 160}
    onClick={onClick}
    style={style} />
}
