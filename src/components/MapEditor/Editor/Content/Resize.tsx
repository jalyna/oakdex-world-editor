import * as React from 'react'
import styled from 'styled-components'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretRight, faCaretDown, faCaretLeft, faCaretUp } from '@fortawesome/free-solid-svg-icons'

import Button from 'shared/Button'

import { Layer } from 'components/MapEditor/reducers/mapData'
import { UPDATE_MAP } from 'components/MapEditor/actionTypes'
import store from 'components/MapEditor/store'

interface ResizeProps {
  changeSize: (direction: string, changeBy: number) => void
}

function mapStateToProps ({ mapData, editorData }: any) {
  return {}
}

function moveLayersByOffset (layers: Layer[], offsetX: number, offsetY: number): Layer[] {
  return layers.slice().map((layer) => {
    let newLayer = { ...layer }
    newLayer.fields = newLayer.fields.slice().map((field) => {
      return {
        ...field,
        x: field.x + offsetX,
        y: field.y + offsetY
      }
    })
    return newLayer
  })
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {
    changeSize: (direction: string, changeBy: number) => {
      let mapData = { ...store.getState().mapData }
      if (direction === 'top' || direction === 'bottom') {
        mapData.height = mapData.height + changeBy
      } else if (direction === 'left' || direction === 'right') {
        mapData.width = mapData.width + changeBy
      }

      let newLayers = mapData.layers.slice()

      if (direction === 'top') {
        newLayers = moveLayersByOffset(newLayers, 0, changeBy)
      } else if (direction === 'left') {
        newLayers = moveLayersByOffset(newLayers, changeBy, 0)
      }

      newLayers = newLayers.map((layer) => {
        let newLayer = { ...layer }
        newLayer.fields = newLayer.fields.slice().filter((field) => {
          return field.x < mapData.width && field.y < mapData.height && field.x >= 0 && field.y >= 0
        })
        return newLayer
      })

      mapData.layers = newLayers

      dispatch({
        type: UPDATE_MAP,
        data: { ...mapData }
      })
    }
  }
}

function Resize ({ changeSize }: ResizeProps) {
  return (
    <React.Fragment>
      <ResizeRight>
        <Button onClick={changeSize.bind(this, 'right', 1)}><FontAwesomeIcon icon={faCaretRight} /></Button>
        <Button onClick={changeSize.bind(this, 'right', -1)}><FontAwesomeIcon icon={faCaretLeft} /></Button>
      </ResizeRight>
      <ResizeLeft>
        <Button onClick={changeSize.bind(this, 'left', 1)}><FontAwesomeIcon icon={faCaretLeft} /></Button>
        <Button onClick={changeSize.bind(this, 'left', -1)}><FontAwesomeIcon icon={faCaretRight} /></Button>
      </ResizeLeft>
      <ResizeTop>
        <Button onClick={changeSize.bind(this, 'top', 1)}><FontAwesomeIcon icon={faCaretUp} /></Button>
        <Button onClick={changeSize.bind(this, 'top', -1)}><FontAwesomeIcon icon={faCaretDown} /></Button>
      </ResizeTop>
      <ResizeBottom>
        <Button onClick={changeSize.bind(this, 'bottom', 1)}><FontAwesomeIcon icon={faCaretDown} /></Button>
        <Button onClick={changeSize.bind(this, 'bottom', -1)}><FontAwesomeIcon icon={faCaretUp} /></Button>
      </ResizeBottom>
    </React.Fragment>
  )
}

const ResizeItem = styled.div`
  position: absolute;
  width: 45px;
  box-sizing: border-box;
  padding: 5px;
  display: flex;

  button {
    margin: 0 3px;
  }
`

const ResizeItemX = styled(ResizeItem)`
  flex-direction: column;
  justify-content: center;
  align-items: stretch;

  button {
    margin: 3px 0;
    flex-grow: 1;
  }
`

const ResizeRight = styled(ResizeItemX)`
  top: 0;
  bottom: 0;
  left: 100%;
`

const ResizeLeft = styled(ResizeItemX)`
  top: 0;
  bottom: 0;
  right: 100%;
`

const ResizeTop = styled(ResizeItem)`
  left: 0;
  right: 0;
  width: 100%;
  bottom: 100%;
`

const ResizeBottom = styled(ResizeItem)`
  left: 0;
  right: 0;
  width: 100%;
  top: 100%;
`

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Resize)
