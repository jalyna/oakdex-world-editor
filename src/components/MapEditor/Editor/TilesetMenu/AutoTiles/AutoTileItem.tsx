import * as React from 'react'
import styled from 'styled-components'

import { Tileset, OpacityAreas, AutoTile } from 'components/TilesetEditor/reducers/tilesetData'
import { DEFAULT_FONT, GREY_50, GREY_90, GREY_70, TEAL_30, GREY_30 } from 'shared/theme'

interface AutoTileItemProps {
  active?: boolean,
  onSelect: (activeAutoTile: string) => void,
  data: AutoTile,
  tileset: Tileset
}

interface StyledAutoTileItemProps {
  active: boolean
}

const PREVIEW_TILES = [
  [
    {
      topLeft: false,
      topRight: false,
      bottomRight: true,
      bottomLeft: false
    },
    {
      topLeft: false,
      topRight: false,
      bottomRight: true,
      bottomLeft: true
    },
    {
      topLeft: false,
      topRight: false,
      bottomRight: false,
      bottomLeft: true
    }
  ],
  [
    {
      topLeft: false,
      topRight: true,
      bottomRight: true,
      bottomLeft: false
    },
    {
      topLeft: true,
      topRight: true,
      bottomRight: true,
      bottomLeft: true
    },
    {
      topLeft: true,
      topRight: false,
      bottomRight: false,
      bottomLeft: true
    }
  ],
  [
    {
      topLeft: false,
      topRight: true,
      bottomRight: false,
      bottomLeft: false
    },
    {
      topLeft: true,
      topRight: true,
      bottomRight: false,
      bottomLeft: false
    },
    {
      topLeft: true,
      topRight: false,
      bottomRight: false,
      bottomLeft: false
    }
  ]
] as OpacityAreas[][]

function tilesetToMap (tileset: Tileset): HTMLImageElement {
  const img = new Image()
  img.src = tileset.imageBase64

  return img
}

function drawPreview (canvas: HTMLCanvasElement, image: HTMLImageElement, autoTile: AutoTile) {
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  PREVIEW_TILES.forEach((row, y) => {
    row.forEach((area, x) => {
      const field = autoTile.fields.find((f) => Object.entries(f.opacityAreas).sort().toString() === Object.entries(area).sort().toString())
      ctx.drawImage(image, field.x * 16, field.y * 16, 16, 16, x * 16, y * 16, 16, 16)
    })
  })
}

class AutoTileItem extends React.Component<AutoTileItemProps, {}> {
  constructor (props: AutoTileItemProps) {
    super(props)
  }

  private canvas = React.createRef<HTMLCanvasElement>()

  render () {
    const {
      active,
      onSelect,
      data,
      tileset
    } = this.props

    return (
      <StyledAutoTileItem
        onClick={onSelect.bind(this, data.title)}
        active={active}>
        <Preview ref={this.canvas} width={48} height={48} />
        {data.title}
      </StyledAutoTileItem>
    )
  }

  componentDidUpdate () {
    this.redraw()
  }

  componentDidMount () {
    this.redraw()
  }

  shouldComponentUpdate (nextProps: AutoTileItemProps) {
    return nextProps.active !== this.props.active
  }

  redraw () {
    drawPreview(this.canvas.current, tilesetToMap(this.props.tileset), this.props.data)
  }
}

const Preview = styled.canvas`
  position: absolute;
  left: 0;
  top: 0;
  width: 48px;
  height: 48px;
  line-height: 0;
`

const StyledAutoTileItem = styled.button`
  position: relative;
  outline: none;
  border: 0;
  background: transparent;
  font-family: ${DEFAULT_FONT};
  font-size: 16px;
  padding: 15px 0 15px 68px;
  border-bottom: 1px solid ${GREY_90};
  display: block;
  width: 100%;
  box-sizing: border-box;
  color: ${GREY_30};
  text-align: left;
  cursor: pointer;
  ${({ active }: StyledAutoTileItemProps) => active && `
    color: white;
    background: ${TEAL_30};
  `};
`

export default AutoTileItem
