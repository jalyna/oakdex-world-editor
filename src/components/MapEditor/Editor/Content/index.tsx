import * as React from 'react'
import styled from 'styled-components'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import { Tileset } from 'components/TilesetEditor/reducers/tilesetData'
import { MapData, Layer, LayerField } from 'components/MapEditor/reducers/mapData'
import store from 'components/MapEditor/store'
import Tile from 'shared/Tile'
import getCoordinates from 'shared/getCoordinates'

import { CHANGE_EDITOR_DATA } from 'components/MapEditor/actionTypes'
import { GREY_70 } from 'shared/theme'

import draw from './draw'
import fill from './fill'
import drawFields from './drawFields'

interface ContentProps {
  tilesets: Tileset[],
  mapData: MapData,
  previewFields: LayerField[],
  onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => void,
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void,
  onMouseUp: (e: React.MouseEvent<HTMLDivElement>) => void,
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void
}

function mapStateToProps ({ tilesets, mapData, editorData }: any) {
  return {
    tilesets,
    mapData,
    previewFields: editorData.previewFields
  }
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {
    onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => {
      const coordinates = getCoordinates(1, e)
      const editorData = store.getState().editorData
      
      if (editorData.currentCoordinates !== coordinates) {
        dispatch({
          type: CHANGE_EDITOR_DATA,
          data: {
            coordinates,
            previewFields: drawFields(coordinates, editorData.selectedTilesetArea, editorData.activeTileset)
          }
        })
        if (editorData.mapMouseHolding) {
          if (editorData.tool === 'fill') {
            fill(dispatch, e)
          } else {
            draw(dispatch, e)
          }
        }
      }
    },
    onMouseUp: (e: React.MouseEvent<HTMLDivElement>) => {
      dispatch({
        type: CHANGE_EDITOR_DATA,
        data: { mapMouseHolding: false }
      })
    },
    onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => {
      dispatch({
        type: CHANGE_EDITOR_DATA,
        data: { mapMouseHolding: true }
      })
      if (store.getState().editorData.tool === 'fill') {
        fill(dispatch, e)
      } else {
        draw(dispatch, e)
      }
    },
    onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => {
      dispatch({
        type: CHANGE_EDITOR_DATA,
        data: { coordinates: undefined, mapMouseHolding: false }
      })
    }
  }
}

function renderLayer (layerFields: LayerField[], i: number, tilesets: Tileset[]): React.ReactNode {
  return (
    <React.Fragment key={i}>
      {layerFields.map((field) => {
        const tileset = tilesets.find((t) => t.title === field.tilesetTitle)
        const style = {
          backgroundImage: 'url(' + tileset.imageBase64 + ')',
          backgroundPosition: (field.tilesetX * -16) + 'px ' + (field.tilesetY * -16) + 'px'
        }
        return (
          <Tile
            key={field.x + '_' + field.y}
            x={field.x}
            y={field.y}
            style={style}
          />
        )
      })}
    </React.Fragment>
  )
}

function Content ({
  tilesets,
  mapData,
  previewFields,
  onMouseUp,
  onMouseDown,
  onMouseMove,
  onMouseLeave
}: ContentProps) {
  if (!mapData) {
    return
  }

  const mapStyle = {
    width: mapData.width * 16 + 2,
    height: mapData.height * 16 + 2
  }

  return (
    <StyledContent>
      <MapWrapper
        style={mapStyle}
        onMouseUp={onMouseUp}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}>
        {mapData.layers.map((layer: Layer, i: number) => {
          return renderLayer(layer.fields, i, tilesets)
        })}
        <PreviewLayer>
          {renderLayer(previewFields, -1, tilesets)}
        </PreviewLayer>
      </MapWrapper>
    </StyledContent>
  )
}

const StyledContent = styled.div`
  box-sizing: border-box;
  padding: 15px;
`

const MapWrapper = styled.div`
  box-sizing: border-box;
  image-rendering: pixelated;
  cursor: pointer;
  position: relative;
  margin: 0 auto;
  border: 1px solid ${GREY_70};
`

const PreviewLayer = styled.div`
  opacity: 0.6;
  position: absolute;
`

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Content)
