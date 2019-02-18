import * as React from 'react'
import styled from 'styled-components'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import { Coordinate } from 'components/TilesetEditor/reducers/currentCoordinates'

interface CurrentCoordinatesProps {
  currentCoordinates?: Coordinate
}

function mapStateToProps ({ editorData }: any) {
  return {
    currentCoordinates: editorData.currentCoordinates
  }
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {}
}

function CurrentCoordinates ({ currentCoordinates }: CurrentCoordinatesProps) {
  if (!currentCoordinates) {
    return null
  }

  return (
    <Wrapper>{currentCoordinates.x} | {currentCoordinates.y}</Wrapper>
  )
}

const Wrapper = styled.div`
  box-sizing: border-box;
  padding: 15px;
`

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CurrentCoordinates)
