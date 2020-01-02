import * as React from 'react'
import styled from 'styled-components'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import { MapData } from 'components/MapEditor/reducers/mapData'

interface StartPositionProps {
  x: number,
  y: number,
  preview?: {
    x: number,
    y: number
  }
}

function mapStateToProps ({ mapData, editorData }: { mapData: MapData, editorData: any }) {
  return {
    x: 0,
    y: 0,
    ...(mapData.startPosition ? mapData.startPosition : {}),
    preview: editorData.currentCoordinates
  }
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {

  }
}

function StartPosition ({ x, y, preview }: StartPositionProps) {
  return (
    <React.Fragment>
      {preview && <PreviewSquare style={{ left: preview.x * 16, top: preview.y * 16 }} />}
      <Square style={{ left: x * 16, top: y * 16 }} />
    </React.Fragment>
  )
}

const Square = styled.div`
  width: 16px;
  height: 16px;
  background: red;
  opacity: 0.7;
  position: absolute;
  border: 1px solid #000;
`

const PreviewSquare = styled.div`
  width: 16px;
  height: 16px;
  background: orange;
  opacity: 0.4;
  position: absolute;
`

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StartPosition)
