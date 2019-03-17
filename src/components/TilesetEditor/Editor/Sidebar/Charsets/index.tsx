import * as React from 'react'
import styled from 'styled-components'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEraser, faPaintBrush, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'

import t from 'shared/translate'
import { DEFAULT_FONT, GREY_50 } from 'shared/theme'
import { TabData } from 'components/TilesetEditor/reducers/tabData'
import { Charset } from 'components/TilesetEditor/reducers/tilesetData'
import Button from 'shared/Button'
import store from 'components/TilesetEditor/store'
import { CHANGE_TAB_DATA, UPDATE_TILESET } from 'components/TilesetEditor/actionTypes'
import ListItem, { ItemTitle, Actions } from 'shared/ListItem'

import Upload from './Upload'

interface SpecialProps {
  tabData: TabData,
  charsets: Charset[],
  onRemoveCharset: (title: string) => void
}

function mapStateToProps ({ tabData, tilesetData }: any) {
  return {
    tabData,
    charsets: tilesetData.charsets || []
  }
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {
    onRemoveCharset: (title: string) => {
      const state = store.getState()
      let charsets = (state.tilesetData.charsets || []).slice().filter((charset: Charset) => {
        return charset.title !== title
      })
      dispatch({ type: UPDATE_TILESET, data: { charsets } })
    }
  }
}

function Charsets ({
  tabData,
  charsets,
  onRemoveCharset
}: SpecialProps) {
  return (
    <div>
      <CharsetList>
        {charsets.map((charset: Charset) => {
          const style = {
            backgroundImage: 'url(' + charset.imageBase64 + ')'
          }
          return (
            <ListItem key={charset.title}>
              <ItemTitle>
                <TitleWrapper>
                  <CharsetPreview style={style} />
                  <CharsetTitle>{charset.title}</CharsetTitle>
                </TitleWrapper>
              </ItemTitle>
              <Actions>
                <Button onClick={onRemoveCharset.bind(this, charset.title)}><FontAwesomeIcon icon={faTrash} /></Button>
              </Actions>
            </ListItem>
          )
        })}
      </CharsetList>
      <Upload />
      {t('charsets_description')}
    </div>
  )
}

const CharsetList = styled.div`
  margin-bottom: 30px;
`

const TitleWrapper = styled.div`
  display: flex;
`

const CharsetTitle = styled.div`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  flex-grow: 1;
  max-width: 200px;
`

const CharsetPreview = styled.div`
  image-rendering: pixelated;
  width: 32px;
  margin-right: 16px;
  height: 32px;
  flex-grow: 0;
  background-position: -32px 0px;
`

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Charsets)
