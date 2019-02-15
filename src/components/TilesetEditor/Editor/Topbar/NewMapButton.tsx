import * as React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMap } from '@fortawesome/free-solid-svg-icons'

import Button from 'shared/Button'

import { RESET_TILESET } from 'components/TilesetEditor/actionTypes'
import { Tileset } from 'components/TilesetEditor/reducers/tilesetData'

interface NewMapButtonProps {
  onClick: (e: React.MouseEvent) => void,
  createMap: (tilesetData: Tileset) => void,
  tilesetData: Tileset
}

function mapStateToProps ({ tabData, tilesetData }: any) {
  return {
    createMap: tabData.createMap,
    tilesetData: tilesetData
  }
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {
    onClick: (e: React.MouseEvent) => {
      dispatch({ type: RESET_TILESET })
    }
  }
}

class NewMapButton extends React.Component<NewMapButtonProps, {}> {
  constructor (props: NewMapButtonProps) {
    super(props)
    this.onClick = this.onClick.bind(this)
  }

  render () {
    return (
      <Button onClick={this.onClick}>
        <FontAwesomeIcon icon={faMap} />
        &nbsp;
        New Map
      </Button>
    )
  }

  onClick (e: React.MouseEvent) {
    e.preventDefault()
    this.props.onClick(e)
    this.props.createMap(this.props.tilesetData)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewMapButton)
