import * as React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage } from '@fortawesome/free-solid-svg-icons'

import t from 'shared/translate'
import { Tileset } from 'components/TilesetEditor/reducers/tilesetData'
import { MapData, Layer } from 'components/MapEditor/reducers/mapData'
import { drawMap } from 'components/MapEditor/Editor/Content/canvas'
import Button from 'shared/Button'
import { DEFAULT_FONT, GREY_90, GREY_70, GREY_50 } from 'shared/theme'

interface ExportAsPngButtonProps {
  mapData: MapData,
  tilesets: Tileset[]
}

interface ExportAsPngButtonState {
  href: string
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
          {t('export_as_png')}
        </Button>
      </React.Fragment>
    )
  }

  onClick (e: React.MouseEvent) {
    e.preventDefault()
    if (!this.canvas.current) {
      return
    }
    drawMap(this.canvas.current, this.props.mapData.layers, this.props.tilesets)
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
