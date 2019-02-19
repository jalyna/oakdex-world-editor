import * as React from 'react'
import styled from 'styled-components'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faObjectUngroup } from '@fortawesome/free-solid-svg-icons'

import { Tileset } from 'components/TilesetEditor/reducers/tilesetData'
import { SelectedTilesetArea, tilesetAreaToBox } from 'components/MapEditor/reducers/editorData'
import { Coordinate } from 'components/TilesetEditor/reducers/currentCoordinates'
import store from 'components/MapEditor/store'
import Tile from 'shared/Tile'

import { DEFAULT_FONT, GREY_50, GREY_90, GREY_70, TEAL_30 } from 'shared/theme'
import { CHANGE_EDITOR_DATA } from 'components/MapEditor/actionTypes'

import draw from './draw'
import AutoTiles from './AutoTiles'

interface TabItemProps {
  isActive?: boolean
}

interface TilesetMenuProps {
  tilesets: Tileset[],
  activeTileset?: string,
  tool: string,
  randomTiles: Coordinate[],
  selectedTilesetArea?: SelectedTilesetArea,
  onTabClick: (tilesetTitle: string) => void,
  onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => void,
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void,
  onMouseUp: (e: React.MouseEvent<HTMLDivElement>) => void,
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void
}

function mapStateToProps ({ tilesets, editorData }: any) {
  return {
    tilesets,
    activeTileset: editorData.activeTileset,
    selectedTilesetArea: editorData.selectedTilesetArea,
    tool: editorData.tool,
    randomTiles: editorData.randomTiles
  }
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {
    onTabClick: (tilesetTitle: string) => {
      dispatch({ type: CHANGE_EDITOR_DATA, activeTileset: tilesetTitle })
    },
    onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => {
      if (store.getState().editorData.tilesetMouseHolding) {
        draw(dispatch, e)
      }
    },
    onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => {
      dispatch({
        type: CHANGE_EDITOR_DATA,
        data: { tilesetMouseHolding: false }
      })
    },
    onMouseUp: (e: React.MouseEvent<HTMLDivElement>) => {
      dispatch({
        type: CHANGE_EDITOR_DATA,
        data: { tilesetMouseHolding: false }
      })
    },
    onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => {
      dispatch({
        type: CHANGE_EDITOR_DATA,
        data: {
          tilesetMouseHolding: true,
          selectedTilesetArea: undefined
        }
      })
      draw(dispatch, e)
    }
  }
}

function styleForTileset (tileset: Tileset) {
  return {
    width: tileset.width * 16,
    height: tileset.height * 16,
    backgroundImage: 'url(' + tileset.imageBase64 + ')'
  }
}

function renderSelectedTilesetArea (selectedTilesetArea?: SelectedTilesetArea): React.ReactNode {
  if (!selectedTilesetArea) {
    return null
  }

  const tilesetBox = tilesetAreaToBox(selectedTilesetArea)

  const style = {
    width: (tilesetBox.width * 16) + 'px',
    height: (tilesetBox.height * 16) + 'px'
  }

  return (
    <SelectedTile style={style} x={tilesetBox.x} y={tilesetBox.y} />
  )
}

function renderRandomTiles (randomTiles: Coordinate[]): React.ReactNode {
  return randomTiles.map((tile, i) => {
    return <SelectedTile key={i} {...tile} />
  })
}

function TilesetMenu ({
  tilesets,
  tool,
  onTabClick,
  activeTileset,
  selectedTilesetArea,
  randomTiles,
  onMouseUp,
  onMouseDown,
  onMouseMove,
  onMouseLeave
}: TilesetMenuProps) {
  const selectedTileset = tilesets.find((t) => t.title === activeTileset)  

  return (
    <StyledSidebar>
      <TabList>
        {tilesets.map((tileset) => {
          return (
            <TabItem
              key={tileset.title}
              onClick={onTabClick.bind(this, tileset.title)}
              isActive={activeTileset === tileset.title}>
              {tileset.title}
            </TabItem>
          )
        })}
      </TabList>
      {selectedTileset && tool !== 'auto' && (
        <TilesetWrapper
          onMouseUp={onMouseUp}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          onContextMenu={(e) => e.preventDefault()}
          style={styleForTileset(selectedTileset)}>
          {tool !== 'random' && renderSelectedTilesetArea(selectedTilesetArea)}
          {tool === 'random' && renderRandomTiles(randomTiles)}
        </TilesetWrapper>
      )}
      {selectedTileset && tool === 'auto' && (
        <AutoTiles tileset={selectedTileset} />
      )}
    </StyledSidebar>
  )
}

const StyledSidebar = styled.div`
  box-sizing: border-box;
  padding: 15px;
`

const TabList = styled.div`
  display: flex;
`

const TilesetWrapper = styled.div`
  margin-top: 20px;
  box-sizing: border-box;
  image-rendering: pixelated;
  cursor: pointer;
  position: relative;
`

const SelectedTile = styled(Tile)`
  background: rgba(43, 111, 219, 0.6);
  border: 1px solid rgb(43, 111, 219);
`

const TabItem = styled.button`
  cursor: pointer;
  font-family: ${DEFAULT_FONT};
  font-size: 16px;
  color: ${({ isActive }: TabItemProps) => isActive ? TEAL_30 : GREY_50};
  border: 1px solid ${GREY_90};
  padding: 5px 10px;
  outline: none;
  background: white;
  box-sizing: border-box;
  flex-grow: 1;

  &:hover {
    border-color: ${GREY_70};
  }
`

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TilesetMenu)
