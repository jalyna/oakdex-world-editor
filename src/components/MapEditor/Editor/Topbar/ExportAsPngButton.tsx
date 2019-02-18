import * as React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage } from '@fortawesome/free-solid-svg-icons'

import { Layer } from 'components/MapEditor/reducers/mapData'

import { Tileset } from 'components/TilesetEditor/reducers/tilesetData'
import { MapData } from 'components/MapEditor/reducers/mapData'
import Button from 'shared/Button'
import { DEFAULT_FONT, GREY_90, GREY_70, GREY_50 } from 'shared/theme'

interface ExportAsPngButtonProps {
  mapData: MapData,
  tilesets: Tileset[]
}

interface ExportAsPngButtonState {
  href: string
}

interface TilesetImages {
  [key: string]: HTMLImageElement
}

function mapStateToProps ({ tilesets, mapData }: any) {
  return {
    tilesets,
    mapData
  }
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {}
}

function drawCanvas (canvas: HTMLCanvasElement, layers: Layer[], tilesets: Tileset[]) {
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  let tilesetImages = {} as TilesetImages
  tilesets.forEach((tileset) => {
    const img = new Image()
    img.src = tileset.imageBase64
    tilesetImages[tileset.title] = img
  })

  layers.forEach((layer) => {
    layer.fields.forEach((field) => {
      const image = tilesetImages[field.tilesetTitle]
      if (!image) {
        return
      }
      ctx.drawImage(image, field.tilesetX * 16, field.tilesetY * 16, 16, 16, field.x * 16, field.y * 16, 16, 16)
    })
  })
}

class ExportAsPngButton extends React.Component<ExportAsPngButtonProps, ExportAsPngButtonState> {
  constructor (props: ExportAsPngButtonProps) {
    super(props)
    this.onClick = this.onClick.bind(this)
    this.state = {
      href: '#'
    }
  }

  private canvas = React.createRef<HTMLCanvasElement>()
  private link = React.createRef<HTMLAnchorElement>()

  render () {
    const fileName = `${this.props.mapData.title}.map.png`
    return (
      <React.Fragment>
        <ExportLink
          download={fileName}
          ref={this.link}
          href={this.state.href}>
          Export
        </ExportLink>
        <Button
          onClick={this.onClick}>
          <Canvas
            ref={this.canvas}
            width={this.props.mapData.width * 16}
            height={this.props.mapData.height * 16} />
          <FontAwesomeIcon icon={faImage} />
          &nbsp;
          Export as PNG
        </Button>
      </React.Fragment>
    )
  }

  onClick (e: React.MouseEvent) {
    console.log('UUU', e)
    e.preventDefault()
    if (!this.canvas.current) {
      return
    }
    drawCanvas(this.canvas.current, this.props.mapData.layers, this.props.tilesets)
    this.setState({
      href: this.canvas.current.toDataURL('image/png')
    }, () => {
      this.link.current.click()
    })
  }
}

const Canvas = styled.canvas`
  display: none;
`

const ExportLink = styled.a`
  display: none;
`

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExportAsPngButton)
