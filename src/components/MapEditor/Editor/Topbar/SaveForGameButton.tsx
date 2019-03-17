import * as React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons'

import t from 'shared/translate'
import { Tileset } from 'components/TilesetEditor/reducers/tilesetData'
import { MapData } from 'components/MapEditor/reducers/mapData'
import Button from 'shared/Button'
import downloadJson from 'shared/downloadJson'
import mapToGameMap from 'shared/mapToGameMap'

interface SaveButtonProps {
  mapData: MapData,
  tilesets: Tileset[]
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

class SaveForGameButton extends React.Component<SaveButtonProps, {}> {
  constructor (props: SaveButtonProps) {
    super(props)
    this.onClick = this.onClick.bind(this)
  }

  private canvas = React.createRef<HTMLCanvasElement>()

  render () {
    return (
      <Button onClick={this.onClick}>
        <Canvas
          ref={this.canvas}
          width={this.props.mapData.width * 16}
          height={this.props.mapData.height * 16} />
        <FontAwesomeIcon icon={faDownload} />
        &nbsp;
        {t('save_for_game')}
      </Button>
    )
  }

  async onClick (e: React.MouseEvent) {
    e.preventDefault()
    if (!this.canvas.current) {
      return
    }
    const fileName = `${this.props.mapData.title}.gamemap.json`
    const { mapData, tilesets } = this.props
    const json = await mapToGameMap(this.canvas.current, mapData, tilesets)
    downloadJson(fileName, json)
  }
}

const Canvas = styled.canvas`
  display: none;
`

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SaveForGameButton)
