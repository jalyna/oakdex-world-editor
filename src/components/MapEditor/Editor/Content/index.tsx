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
import drawChar from './drawChar'
import drawFields from './drawFields'
import { drawMap } from './canvas'
import Resize from './Resize'
import Chars from './Chars'

interface ContentProps {
  tilesets: Tileset[],
  mapData: MapData,
  activeVersion: string,
  tool?: string,
  previewFields: LayerField[],
  background?: React.ReactNode,
  onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => void,
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void,
  onMouseUp: (e: React.MouseEvent<HTMLDivElement>) => void,
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void
}

function mapStateToProps ({ tilesets, mapData, editorData }: any) {
  return {
    tilesets,
    mapData,
    background: editorData.background,
    previewFields: editorData.previewFields,
    tool: editorData.tool,
    activeVersion: editorData.activeVersion || 'default'
  }
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {
    onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => {
      const coordinates = getCoordinates(1, e)
      const editorData = store.getState().editorData
      
      if (editorData.currentCoordinates !== coordinates) {
        if (editorData.tool === 'versions') {
          dispatch({
            type: CHANGE_EDITOR_DATA,
            data: {
              currentCoordinates: coordinates,
              previewFields: []
            }
          })
          return
        }

        dispatch({
          type: CHANGE_EDITOR_DATA,
          data: {
            currentCoordinates: coordinates,
            previewFields: drawFields(coordinates, editorData.selectedTilesetArea, editorData.activeTileset)
          }
        })
        if (editorData.mapMouseHolding) {
          if (editorData.tool === 'fill') {
            fill(dispatch, e)
          } else if (editorData.tool === 'chars') {
            drawChar(dispatch, e)
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
      if (store.getState().editorData.tool === 'versions') {
        return
      }
      if (store.getState().editorData.tool === 'fill') {
        fill(dispatch, e)
      } else if (store.getState().editorData.tool === 'chars') {
        drawChar(dispatch, e)
      } else {
        draw(dispatch, e)
      }
    },
    onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => {
      dispatch({
        type: CHANGE_EDITOR_DATA,
        data: { currentCoordinates: undefined, mapMouseHolding: false }
      })
    }
  }
}

function renderLayer (layerFields: LayerField[], i: number, tilesets: Tileset[]): React.ReactNode {
  return (
    <React.Fragment key={i}>
      {layerFields.map((field) => {
        const tileset = tilesets.find((t) => t.title === field.tilesetTitle)
        
        if (!tileset) {
          return (
            <Tile
              key={field.x + '_' + field.y}
              x={field.x}
              y={field.y}
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            />
          )
        }

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

class Content extends React.Component<ContentProps, {}> {
  constructor (props: ContentProps) {
    super(props)
  }

  private canvas = React.createRef<HTMLCanvasElement>()

  render () {
    const {
      tilesets,
      mapData,
      tool,
      background,
      previewFields,
      onMouseUp,
      onMouseDown,
      onMouseMove,
      onMouseLeave
    } = this.props

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
          {background && <Background mapWidth={mapData.width * 16} mapHeight={mapData.height * 16}>{background}</Background>}
          <Canvas hasBackground={!!background} ref={this.canvas} width={mapData.width * 16} height={mapData.height * 16} />
          {tool !== 'chars' && <PreviewLayer>
            {renderLayer(previewFields, -1, tilesets)}
          </PreviewLayer>}
          {tool !== 'chars' && <Resize />}
          {tool === 'chars' && <Chars />}
        </MapWrapper>
      </StyledContent>
    )
  }

  componentDidUpdate () {
    this.redraw()
  }

  componentDidMount () {
    this.redraw()
  }

  async redraw () {
    const version = (this.props.mapData.versions || []).find(v => v.name === this.props.activeVersion) || {
      name: 'default',
      tilesetVersions: []
    }
    await drawMap(this.canvas.current, this.props.mapData.layers, this.props.tilesets, version)
  }
}

interface CanvasProps {
  hasBackground?: boolean;
}

const Canvas = styled.canvas`
  position: absolute;
  background-color: white;
  ${({ hasBackground }: CanvasProps) => hasBackground && `
    border: 1px solid rgba(255, 255, 255, 0.4);
  `}
`

interface BackgroundProps {
  mapWidth: number,
  mapHeight: number
}

const Background = styled.div`
  position: absolute;
  ${({ mapWidth, mapHeight }: BackgroundProps) => `
    width: ${mapWidth * 3}px;
    height: ${mapHeight * 3}px;
    margin-left: -${mapWidth * 1.5}px;
    margin-top: -${mapHeight * 1.5}px;
  `}
  left: 50%;
  top: 50%;
`

const StyledContent = styled.div`
  box-sizing: border-box;
  padding: 100px;
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
  top: 0;
  left: 0;
`

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Content)
