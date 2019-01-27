import * as React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import { Tileset } from 'components/TilesetEditor/reducers/tilesetData'
import Button from 'shared/Button'
import downloadJson from 'shared/downloadJson'

interface SaveButtonProps {
  tilesetData: Tileset
}

function mapStateToProps ({ tilesetData }: any) {
  return {
    tilesetData
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
        Download Tileset
      </Button>
    )
  }

  onClick (e: React.MouseEvent) {
    e.preventDefault()
    const fileName = `${this.props.tilesetData.title}.tileset.json`
    downloadJson(fileName, this.props.tilesetData)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SaveButton)
