import * as React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import t from 'shared/translate'
import Button from 'shared/Button'

import { RESET_TILESET } from 'components/TilesetEditor/actionTypes'

interface CloseButtonProps {
  onClick: (e: React.MouseEvent) => void,
  close: () => void
}

function mapStateToProps ({ tabData }: any) {
  return {
    close: tabData.close
  }
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
        {t('close')}
      </Button>
    )
  }

  onClick (e: React.MouseEvent) {
    e.preventDefault()
    this.props.onClick(e)
    this.props.close()
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CloseButton)
