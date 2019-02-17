import * as React from 'react'
import styled from 'styled-components'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'

import { DEFAULT_FONT, GREY_50, GREY_90, GREY_70, TEAL_30 } from 'shared/theme'
import Button from 'shared/Button'
import TextField from 'shared/TextField'

import { Layer } from 'components/MapEditor/reducers/mapData'
import { CHANGE_EDITOR_DATA, UPDATE_MAP } from 'components/MapEditor/actionTypes'
import store from 'components/MapEditor/store'

interface LayerMenuProps {
  layers: Layer[],
  activeLayerIndex?: number,
  onSelect: (layerIndex: number) => void,
  onDelete: (layerIndex: number) => void,
  onAdd: (beforeLayerIndex?: number) => void
}

function mapStateToProps ({ mapData, editorData }: any) {
  return {
    layers: mapData.layers,
    activeLayerIndex: editorData.activeLayerIndex
  }
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {
    onSelect: (layerIndex: number, activeLayerIndex?: number) => {
      if (activeLayerIndex === layerIndex) {
        dispatch({ type: CHANGE_EDITOR_DATA, activeLayerIndex: undefined })
      } else {
        dispatch({ type: CHANGE_EDITOR_DATA, activeLayerIndex: layerIndex })
      }
    },
    onAdd: (beforeLayerIndex?: number) => {
      const mapData = store.getState().mapData
      if (!mapData) {
        return
      }
      const newLayer = {
        title: 'New Layer',
        fields: []
      } as Layer
      let layers = mapData.layers.slice()

      if (beforeLayerIndex) {
        layers.splice(beforeLayerIndex, 0, newLayer)
      } else {
        layers.push(newLayer)
      }

      dispatch({
        type: UPDATE_MAP,
        data: {
          ...mapData,
          layers: layers
        }
      })
    },
    onDelete: (layerIndex: number) => {
      const mapData = store.getState().mapData
      if (!mapData) {
        return
      }
      let layers = mapData.layers.slice()
      layers.splice(layerIndex, 1)
      dispatch({
        type: UPDATE_MAP,
        data: {
          ...mapData,
          layers: layers
        }
      })
    }
  }
}

function LayerMenu ({ layers, activeLayerIndex, onSelect, onAdd, onDelete }: LayerMenuProps) {
  return (
    <StyledSidebar>
      <LayerList>
        {layers.map((layer: Layer, i: number) => {
          return (
            <LayerItem key={i}>
              {layer.title}
              <Button onClick={onDelete.bind(this, i)}><FontAwesomeIcon icon={faTrash} /></Button>
            </LayerItem>
          )
        })}
      </LayerList>
      <Button onClick={onAdd.bind(this, undefined)}>
        <FontAwesomeIcon icon={faPlus} />&nbsp;
        New Layer
      </Button>
    </StyledSidebar>
  )
}

const LayerItem = styled.div`
  margin-bottom: 3px;
  padding: 3px 0;
  border-bottom: 1px solid ${GREY_90};
  display: flex;
`

const LayerList = styled.div`
  margin-bottom: 20px;
`

const StyledSidebar = styled.div`
  box-sizing: border-box;
  padding: 15px;
`

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LayerMenu)
