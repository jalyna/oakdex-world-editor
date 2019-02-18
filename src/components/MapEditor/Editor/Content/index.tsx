import * as React from 'react'
import styled from 'styled-components'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import { Tileset } from 'components/TilesetEditor/reducers/tilesetData'
import { MapData, Layer } from 'components/MapEditor/reducers/mapData'
import store from 'components/MapEditor/store'
import Tile from 'shared/Tile'
import getCoordinates from 'shared/getCoordinates'

import { CHANGE_EDITOR_DATA } from 'components/MapEditor/actionTypes'
import { GREY_70 } from 'shared/theme'

import draw from './draw'

interface ContentProps {
  tilesets: Tileset[],
  mapData: MapData,
  onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => void,
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void,
  onMouseUp: (e: React.MouseEvent<HTMLDivElement>) => void,
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void
}

function mapStateToProps ({ tilesets, mapData }: any) {
  return {
    tilesets,
    mapData
  }
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {
    onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => {
      const coordinates = getCoordinates(1, e)
      const currentCoordinates = store.getState().editorData.currentCoordinates
      
      if (currentCoordinates !== coordinates) {
        dispatch({
          type: CHANGE_EDITOR_DATA,
          data: { coordinates }
        })
        if (store.getState().editorData.mapMouseHolding) {
          draw(dispatch, e)
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
      draw(dispatch, e)
    },
    onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => {
      dispatch({
        type: CHANGE_EDITOR_DATA,
        data: { coordinates: undefined, mapMouseHolding: false }
      })
    }
  }
}

function renderLayer (layer: Layer, i: number, tilesets: Tileset[]): React.ReactNode {
  return (
    <React.Fragment key={i}>
      {layer.fields.map((field) => {
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
  onMouseUp,
  onMouseDown,
  onMouseMove,
  onMouseLeave
}: ContentProps) {
  if (!mapData) {
    return
  }

  const mapStyle = {
    width: mapData.width * 16,
    height: mapData.height * 16
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
          return renderLayer(layer, i, tilesets)
        })}
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Content)
