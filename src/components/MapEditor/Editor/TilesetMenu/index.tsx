import * as React from 'react'
import styled from 'styled-components'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faObjectUngroup } from '@fortawesome/free-solid-svg-icons'

import { Tileset } from 'components/TilesetEditor/reducers/tilesetData'

import { DEFAULT_FONT, GREY_50, GREY_90, GREY_70, TEAL_30 } from 'shared/theme'
import { CHANGE_EDITOR_DATA } from 'components/MapEditor/actionTypes'

interface TabItemProps {
  isActive?: boolean
}

interface TilesetMenuProps {
  tilesets: Tileset[],
  activeTileset?: string,
  onTabClick: (tilesetTitle: string) => void
}

function mapStateToProps ({ tilesets, editorData }: any) {
  return {
    tilesets,
    activeTileset: editorData.activeTileset
  }
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {
    onTabClick: (tilesetTitle: string) => {
      dispatch({ type: CHANGE_EDITOR_DATA, activeTileset: tilesetTitle })
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

function TilesetMenu ({ tilesets, onTabClick, activeTileset }: TilesetMenuProps) {
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
      {selectedTileset && <TilesetWrapper
        style={styleForTileset(selectedTileset)} />}
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
