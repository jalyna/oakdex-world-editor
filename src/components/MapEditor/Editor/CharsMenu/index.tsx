import * as React from 'react'
import styled from 'styled-components'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faRedo } from '@fortawesome/free-solid-svg-icons'
import { Direction } from 'oakdex-world-engine'

import t from 'shared/translate'
import { DEFAULT_FONT, GREY_50, GREY_90, GREY_70, TEAL_30 } from 'shared/theme'
import Button from 'shared/Button'
import TextField from 'shared/TextField'
import ListItem, { ItemTitle, Actions } from 'shared/ListItem'
import { Tileset } from 'components/TilesetEditor/reducers/tilesetData'

import { MapChar } from 'components/MapEditor/reducers/mapData'
import { CHANGE_EDITOR_DATA, UPDATE_MAP } from 'components/MapEditor/actionTypes'
import store from 'components/MapEditor/store'

interface CharsMenuProps {
  chars: MapChar[],
  tilesets: Tileset[],
  onSelectCharset: (id: string) => void,
  onRemoveChar: (id: string) => void,
  onRotateChar: (id: string) => void,
  selectedCharset?: string
}

interface CharItemProps {
  selected?: boolean
}

function mapStateToProps ({ mapData, editorData, tilesets }: any) {
  return {
    chars: mapData.chars || [],
    tilesets,
    selectedCharset: editorData.selectedCharset
  }
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {
    onSelectCharset: (id: string) => {
      dispatch({
        type: CHANGE_EDITOR_DATA,
        data: {
          selectedCharset: id
        }
      })
    },
    onRemoveChar: (id: string) => {
      const chars = (store.getState().mapData.chars || []).slice().filter((c) => {
        return c.id !== id
      })
      dispatch({
        type: UPDATE_MAP,
        data: { chars }
      })
    },
    onRotateChar: (id: string) => {
      const chars = (store.getState().mapData.chars || []).slice().map((c) => {
        if (c.id === id) {
          let dir = c.dir + 1
          if (dir >= 5) { dir = 1 }
          return {
            ...c,
            dir
          }
        }
        return c
      })
      dispatch({
        type: UPDATE_MAP,
        data: { chars }
      })
    }
  }
}

function CharsMenu ({
  chars,
  tilesets,
  selectedCharset,
  onSelectCharset,
  onRemoveChar,
  onRotateChar
}: CharsMenuProps) {
  return (
    <StyledSidebar>
      <CharBox>
        {tilesets.map((tileset) => {
          return (tileset.charsets || []).map((charset) => {
            const key = tileset.title + ',' + charset.title
            const style = {
              backgroundImage: 'url(' + charset.imageBase64 + ')'
            }
            return <CharItem
              selected={selectedCharset === key}
              key={key}
              onClick={onSelectCharset.bind(this, key)}
              style={style} />
          })
        })}
      </CharBox>
      <ItemList>
        {chars.map((char) => {
          const tileset = tilesets.find((t) => t.title === char.tilesetTitle)
          if (!tileset) { return null }
          const charset = (tileset.charsets || []).find((c) => c.title === char.charsetTitle)
          if (!charset) { return null }

          const style = {
            backgroundImage: 'url(' + charset.imageBase64 + ')'
          }

          return (
            <ListItem key={char.id}>
              <ItemTitle>
                <InnerTitle>
                  <CharPreview style={style} />
                  {char.id} | {char.x}, {char.y}
                </InnerTitle>
              </ItemTitle>
              <Actions>
                <Button onClick={onRotateChar.bind(this, char.id)}><FontAwesomeIcon icon={faRedo} /></Button>&nbsp;
                <Button onClick={onRemoveChar.bind(this, char.id)}><FontAwesomeIcon icon={faTrash} /></Button>
              </Actions>
            </ListItem>
          )
        })}
      </ItemList>
    </StyledSidebar>
  )
}

const InnerTitle = styled.div`
  display: flex;
  align-items: center;
`

const ItemList = styled.div`
  margin-bottom: 20px;
`

const CharPreview = styled.div`
  width: 32px;
  height: 32px;
  image-rendering: pixelated;
  background-position: -32px 0px;
  flex-grow: 0;
`

const CharItem = styled.div`
  width: 32px;
  height: 32px;
  image-rendering: pixelated;
  cursor: pointer;
  background-position: -32px -2px;
  border: 1px solid transparent;
  box-sizing: border-box;
  ${({ selected }: CharItemProps) => selected && `
    border-color: ${TEAL_30};
    background-color: ${GREY_90};
  `}
`

const CharBox = styled.div`
  height: 150px;
  overflow-y: auto;
  border: 1px solid ${GREY_70};
  padding: 7px;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
`

const StyledSidebar = styled.div`
  box-sizing: border-box;
  padding: 15px;
`

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CharsMenu)
