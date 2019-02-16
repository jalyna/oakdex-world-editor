import * as React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons'

import { Tileset } from 'components/TilesetEditor/reducers/tilesetData'
import { MapData } from 'components/MapEditor/reducers/mapData'
import Button from 'shared/Button'
import downloadJson from 'shared/downloadJson'

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

class SaveButton extends React.Component<SaveButtonProps, {}> {
  constructor (props: SaveButtonProps) {
    super(props)
    this.onClick = this.onClick.bind(this)
  }

  render () {
    return (
      <Button onClick={this.onClick}>
        <FontAwesomeIcon icon={faDownload} />
        &nbsp;
        Download Map
      </Button>
    )
  }

  onClick (e: React.MouseEvent) {
    e.preventDefault()
    const fileName = `${this.props.mapData.title}.map.json`
    const json = {
      ...this.props.mapData,
      tilesets: this.props.tilesets
    }
    downloadJson(fileName, json)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SaveButton)
