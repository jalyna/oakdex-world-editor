import * as React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import Button from 'shared/Button'
import downloadJson from 'shared/downloadJson'

import { RESET_TILESET } from 'components/TilesetEditor/actionTypes'

interface CloseButtonProps {
  onClick: (e: React.MouseEvent) => void
}

function mapStateToProps () {
  return {}
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {
    onClick: (e: React.MouseEvent) => {
      dispatch({ type: RESET_TILESET })
    }
  }
}

class CloseButton extends React.Component<CloseButtonProps, {}> {
  constructor (props: CloseButtonProps) {
    super(props)
    this.onClick = this.onClick.bind(this)
  }

  render () {
    return (
      <Button onClick={this.onClick}>
        Close
      </Button>
    )
  }

  onClick (e: React.MouseEvent) {
    e.preventDefault()
    this.props.onClick(e)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CloseButton)
