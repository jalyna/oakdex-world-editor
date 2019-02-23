import * as React from 'react'
import styled from 'styled-components'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

import Button from 'shared/Button'
import { CHANGE_EDITOR_DATA, UPDATE_MAP, REMOVE_TILESET } from 'components/MapEditor/actionTypes'
import { Tileset } from 'components/TilesetEditor/reducers/tilesetData'
import { Layer } from 'components/MapEditor/reducers/mapData'

function removeTilesetFromMap (tileset: Tileset, layers: Layer[]): Layer[] {
  return layers.slice().map((layer: Layer) => {
    let fields = layer.fields.slice()
    layer.fields = fields.filter((field) => {
      return field.tilesetTitle !== tileset.title
    })
    return layer
  })
}

interface DeleteProps {
  activeTileset: string,
  layers: Layer[],
  tilesets: Tileset[],
  onDelete: (tileset: Tileset, layers: Layer[]) => void
}

function mapStateToProps ({ editorData, mapData, tilesets }: any) {
  return {
    activeTileset: editorData.activeTileset,
    layers: mapData.layers,
    tilesets
  }
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {
    onDelete: (tileset: Tileset, layers: Layer[]) => {
      if (!confirm('Are you sure you want to delete this tileset?')) {
        return
      }
      dispatch({
        type: CHANGE_EDITOR_DATA,
        data: { activeTileset: undefined }
      })
      dispatch({
        type: UPDATE_MAP,
        data: { layers: removeTilesetFromMap(tileset, layers) }
      })
      dispatch({
        type: REMOVE_TILESET,
        tilesetTitle: tileset.title
      })
    }
  }
}

function Delete ({ tilesets, activeTileset, layers, onDelete }: DeleteProps) {
  const tileset = tilesets.find((t) => t.title === activeTileset)
  if (!tileset) {
    return null
  }
  return (
    <StyledWrapper>
      <Button onClick={onDelete.bind(this, tileset, layers)}>
        <FontAwesomeIcon icon={faTrash} />&nbsp;
        Remove Tileset
      </Button>
    </StyledWrapper>
  )
}

const StyledWrapper = styled.div`
  margin-top: 15px;
  display: inline-block;
`

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Delete)
