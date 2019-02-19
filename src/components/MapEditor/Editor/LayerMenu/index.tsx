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
  onAdd: (beforeLayerIndex: number | null, inputRef: React.RefObject<HTMLInputElement>) => void,
  onEdit: (layerIndex: number, inputRef: React.RefObject<HTMLInputElement>) => void,
  onFinishEdit: (layerIndex: number, e: React.KeyboardEvent<HTMLInputElement>) => void,
  onChangeTitle: (layerIndex: number, e: React.FormEvent<HTMLInputElement>) => void,
  onMoveUp: (layerIndex: number, e: React.MouseEvent) => void,
  onMoveDown: (layerIndex: number, e: React.MouseEvent) => void
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
    onMoveUp: (layerIndex: number, e: React.MouseEvent) => {
      e.stopPropagation()
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

      dispatch({
        type: CHANGE_EDITOR_DATA,
        data: { activeLayerIndex: layerIndex + 1 }
      })
    },
    onMoveDown: (layerIndex: number, e: React.MouseEvent) => {
      e.stopPropagation()
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

      dispatch({
        type: CHANGE_EDITOR_DATA,
        data: { activeLayerIndex: layerIndex - 1 }
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
    onAdd: (beforeLayerIndex: number | null) => {
      const mapData = store.getState().mapData
      if (!mapData) {
        return
      }
      const newLayer = {
        title: '',
        fields: []
      } as Layer
      let layers = mapData.layers.slice()
      let layerIndex = layers.length

      if (beforeLayerIndex) {
        layers.splice(beforeLayerIndex, 0, newLayer)
        layerIndex = beforeLayerIndex
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

      dispatch({
        type: CHANGE_EDITOR_DATA,
        data: { activeLayerIndex: layerIndex, editTitleLayerIndex: layerIndex }
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
            <LayerItem
              key={i}
              onClick={onSelect.bind(this, i, activeLayerIndex)}
              onDoubleClick={onEdit.bind(this, i)}
              selected={activeLayerIndex === i}>
              <LayerTitle>
                {i !== editTitleLayerIndex && layer.title}
                {i === editTitleLayerIndex && <TextField
                  value={layer.title}
                  autoFocus
                  onKeyPress={onFinishEdit.bind(this, i)}
                  onChange={onChangeTitle.bind(this, i)} />}
              </LayerTitle>
              <Button disabled={i + 1 === reverseLayers.length} onClick={onMoveUp.bind(this, i)}><FontAwesomeIcon icon={faArrowUp} /></Button>
              <Button disabled={i === 0} onClick={onMoveDown.bind(this, i)}><FontAwesomeIcon icon={faArrowDown} /></Button>
              <Button onClick={onDelete.bind(this, i)}><FontAwesomeIcon icon={faTrash} /></Button>
            </LayerItem>
          )
        })}
      </LayerList>
      <Button onClick={onAdd.bind(this, null)}>
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
