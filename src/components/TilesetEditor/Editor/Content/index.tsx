import * as React from 'react'
import styled from 'styled-components'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import { Tileset } from 'components/TilesetEditor/reducers/tilesetData'
import { TabData } from 'components/TilesetEditor/reducers/tabData'
import { Coordinate } from 'components/TilesetEditor/reducers/currentCoordinates'
import { TEAL_90, TEAL_50 } from 'shared/theme'
import getCoordinates from 'shared/getCoordinates'
import Tile from 'shared/Tile'
import { CHANGE_CURRENT_COORDINATES, REMOVE_CURRENT_COORDINATES, CHANGE_MOUSE_HOLD } from 'components/TilesetEditor/actionTypes'

import executeAction from './executeAction'
import Magnifier from './Magnifier'
import Objects from './Objects'
import Walk from './Walk'

interface TilesetWrapperProps {
  zoom: number
}

interface ContentProps {
  tilesetData: Tileset,
  tabData: TabData,
  activeTab: string,
  mouseHold: boolean,
  currentCoordinates: Coordinate | null,
  onMouseMove: (currentCoordinates: Coordinate, zoom: number, mouseHold: boolean, e: React.MouseEvent<HTMLDivElement>) => void,
  onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => void,
  onMouseUp: (e: React.MouseEvent<HTMLDivElement>) => void,
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void
}

function mapStateToProps ({ tilesetData, tabData, currentCoordinates, activeTab, mouseHold }: any) {
  return {
    tilesetData,
    currentCoordinates,
    activeTab,
    mouseHold,
    tabData
  }
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {
    onMouseMove: (currentCoordinates: Coordinate, zoom: number, mouseHold: boolean, e: React.MouseEvent<HTMLDivElement>) => {
      const newCoordinates = getCoordinates(zoom, e)
      if (!currentCoordinates || newCoordinates.x !== currentCoordinates.x || newCoordinates.y !== currentCoordinates.y) {
        dispatch({ type: CHANGE_CURRENT_COORDINATES, ...newCoordinates })
        if (mouseHold) {
          executeAction(dispatch, e)
        }
      }
    },
    onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => {
      dispatch({ type: CHANGE_MOUSE_HOLD, hold: false })
      dispatch({ type: REMOVE_CURRENT_COORDINATES })
    },
    onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => {
      dispatch({ type: CHANGE_MOUSE_HOLD, hold: true })
      executeAction(dispatch, e)
    },
    onMouseUp: (e: React.MouseEvent<HTMLDivElement>) => {
      dispatch({ type: CHANGE_MOUSE_HOLD, hold: false })
      executeAction(dispatch, e)
    }
  }
}

function Content ({
  tilesetData,
  activeTab,
  currentCoordinates,
  tabData,
  mouseHold,
  onMouseMove,
  onMouseDown,
  onMouseLeave,
  onMouseUp
}: ContentProps) {
  const tilesetStyle = {
    width: tilesetData.width * 16,
    height: tilesetData.height * 16,
    backgroundImage: 'url(' + tilesetData.imageBase64 + ')'
  }
  let coordinates = '-'
  if (currentCoordinates) {
    coordinates = currentCoordinates.x + ' | ' + currentCoordinates.y
  }
  return (
    <StyledContent zoom={tabData.zoom}>
      <Coordinates>{coordinates}</Coordinates>
      <Magnifier />
      <TilesetWrapper
        zoom={tabData.zoom}
        style={tilesetStyle}
        onMouseUp={onMouseUp}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove.bind(this, currentCoordinates, tabData.zoom, mouseHold)}
        onMouseLeave={onMouseLeave}>
        {activeTab === 'objects' && <Objects />}
        {activeTab === 'walk' && <Walk />}
        {currentCoordinates !== null && <HoverTile {...currentCoordinates} />}
      </TilesetWrapper>
    </StyledContent>
  )
}

const StyledContent = styled.div`
  box-sizing: border-box;
  padding: 15px;
  position: relative;
  display: flex;
  justify-content: ${({ zoom }: TilesetWrapperProps) => zoom === 1 ? 'center' : 'flex-start'};
  width: 100%;
`

const TilesetWrapper = styled.div`
  box-sizing: border-box;
  image-rendering: pixelated;
  cursor: pointer;
  position: relative;
  transform-origin: 0 0;
  transform: ${({ zoom }: TilesetWrapperProps) => 'scale(' + zoom + ')'};
`

const Coordinates = styled.div`
  box-sizing: border-box;
  padding: 10px;
  background: ${TEAL_90};
  text-align: center;
  font-weight: bold;
  position: fixed;
  width: 200px;
  top: 0;
  left: 50%;
  margin-left: -100px;
`

const HoverTile = styled(Tile)`
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid ${TEAL_50};
`

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Content)
