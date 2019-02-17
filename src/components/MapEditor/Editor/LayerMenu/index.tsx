import * as React from 'react'
import styled from 'styled-components'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTrash, faPen, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons'

import { DEFAULT_FONT, GREY_50, GREY_90, GREY_70, TEAL_30 } from 'shared/theme'
import Button from 'shared/Button'
import TextField from 'shared/TextField'

import { Layer } from 'components/MapEditor/reducers/mapData'
import { CHANGE_EDITOR_DATA, UPDATE_MAP } from 'components/MapEditor/actionTypes'
import store from 'components/MapEditor/store'

interface LayerMenuProps {
  layers: Layer[],
  activeLayerIndex?: number,
  editTitleLayerIndex?: number,
  onSelect: (layerIndex: number) => void,
  onDelete: (layerIndex: number) => void,
  onAdd: (beforeLayerIndex?: number) => void,
  onEdit: (layerIndex: number) => void,
  onFinishEdit: (layerIndex: number, e: React.KeyboardEvent<HTMLInputElement>) => void,
  onChangeTitle: (layerIndex: number, e: React.FormEvent<HTMLInputElement>) => void,
  onMoveUp: (layerIndex: number) => void,
  onMoveDown: (layerIndex: number) => void
}

interface LayerItemProps {
  selected?: boolean
}

function mapStateToProps ({ mapData, editorData }: any) {
  return {
    layers: mapData.layers,
    activeLayerIndex: editorData.activeLayerIndex,
    editTitleLayerIndex: editorData.editTitleLayerIndex
  }
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {
    onSelect: (layerIndex: number, activeLayerIndex?: number) => {
      if (activeLayerIndex === layerIndex) {
        dispatch({ type: CHANGE_EDITOR_DATA, data: { activeLayerIndex: undefined }})
      } else {
        dispatch({ type: CHANGE_EDITOR_DATA, data: { activeLayerIndex: layerIndex }})
      }
    },
    onEdit: (layerIndex: number) => {
      dispatch({ type: CHANGE_EDITOR_DATA, data: { editTitleLayerIndex: layerIndex }})
    },
    onFinishEdit: (layerIndex: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        dispatch({ type: CHANGE_EDITOR_DATA, data: { editTitleLayerIndex: undefined }})
      }
    },
    onMoveUp: (layerIndex: number) => {
      const mapData = store.getState().mapData
      if (!mapData) {
        return
      }
      let layers = mapData.layers.slice()
      const layer = layers[layerIndex]
      layers.splice(layerIndex, 1)
      layers.splice(layerIndex + 1, 0, layer)

      dispatch({
        type: UPDATE_MAP,
        data: {
          ...mapData,
          layers: layers
        }
      })
    },
    onMoveDown: (layerIndex: number) => {
      const mapData = store.getState().mapData
      if (!mapData) {
        return
      }
      let layers = mapData.layers.slice()
      const layer = layers[layerIndex]
      layers.splice(layerIndex, 1)
      layers.splice(layerIndex - 1, 0, layer)

      dispatch({
        type: UPDATE_MAP,
        data: {
          ...mapData,
          layers: layers
        }
      })
    },
    onChangeTitle: (layerIndex: number, e: React.FormEvent<HTMLInputElement>) => {
      const mapData = store.getState().mapData
      if (!mapData) {
        return
      }
      let layers = mapData.layers.slice()
      layers[layerIndex].title = e.currentTarget.value
      dispatch({
        type: UPDATE_MAP,
        data: {
          ...mapData,
          layers: layers
        }
      })
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

function LayerMenu ({
  layers,
  activeLayerIndex,
  editTitleLayerIndex,
  onSelect,
  onAdd,
  onDelete,
  onEdit,
  onChangeTitle,
  onFinishEdit,
  onMoveUp,
  onMoveDown
}: LayerMenuProps) {
  const reverseLayers = layers.slice().reverse()
  return (
    <StyledSidebar>
      <LayerList>
        {reverseLayers.map((layer: Layer, j: number) => {
          const i = reverseLayers.length - j - 1
          return (
            <LayerItem key={i} onClick={onSelect.bind(this, i, activeLayerIndex)} selected={activeLayerIndex === i}>
              <LayerTitle>
                {i !== editTitleLayerIndex && layer.title}
                {i === editTitleLayerIndex && <TextField
                  value={layer.title}
                  onKeyPress={onFinishEdit.bind(this, i)}
                  onChange={onChangeTitle.bind(this, i)} />}
              </LayerTitle>
              {i !== 0 && <Button onClick={onMoveDown.bind(this, i)}><FontAwesomeIcon icon={faArrowDown} /></Button>}
              {i + 1 !== reverseLayers.length && <Button onClick={onMoveUp.bind(this, i)}><FontAwesomeIcon icon={faArrowUp} /></Button>}
              <Button onClick={onEdit.bind(this, i)}><FontAwesomeIcon icon={faPen} /></Button>
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
  padding: 3px;
  border-bottom: 1px solid ${GREY_90};
  display: flex;
  align-items: center;
  cursor: pointer;
  ${({ selected }: LayerItemProps) => selected && `
    background: ${TEAL_30};
    color: white;
  `};

  button {
    flex-grow: 0;
    margin-left: 3px;
    width: auto;
  }
`

const LayerTitle = styled.div`
  flex-grow: 2;
  flex-basis: 400%;
  width: 100%;
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