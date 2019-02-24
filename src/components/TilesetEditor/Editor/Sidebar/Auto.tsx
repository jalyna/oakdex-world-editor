import * as React from 'react'
import styled from 'styled-components'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEraser, faPaintBrush, faTrash } from '@fortawesome/free-solid-svg-icons'

import t from 'shared/translate'
import { TabData } from 'components/TilesetEditor/reducers/tabData'
import { AutoTile } from 'components/TilesetEditor/reducers/tilesetData'
import Button from 'shared/Button'
import TextField from 'shared/TextField'
import store from 'components/TilesetEditor/store'
import { CHANGE_TAB_DATA, UPDATE_TILESET } from 'components/TilesetEditor/actionTypes'
import ListItem, { ItemTitle, Actions } from 'shared/ListItem'

interface ObjectsProps {
  tabData: TabData,
  autoTiles: AutoTile[],
  onChangeTitle: (e: React.FormEvent) => void,
  onAutoTileAdd: () => void,
  onSelectAutoTile: (title: string) => void,
  onRemoveAutoTile: (title: string) => void
}

function mapStateToProps ({ tabData, tilesetData }: any) {
  return {
    tabData,
    autoTiles: tilesetData.autoTiles
  }
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {
    onChangeTitle: (e: React.ChangeEvent) => {
      const target = e.target as HTMLInputElement
      dispatch({
        type: CHANGE_TAB_DATA,
        data: {
          nextAutoTileTitle: target.value
        }
      })
    },
    onAutoTileAdd: () => {
      const state = store.getState()
      let autoTiles = state.tilesetData.autoTiles.slice()
      autoTiles.push({
        title: state.tabData.nextAutoTileTitle,
        fields: []
      } as AutoTile)
      dispatch({ type: UPDATE_TILESET, data: { autoTiles } })
      dispatch({
        type: CHANGE_TAB_DATA,
        data: {
          nextAutoTileTitle: '',
          selectedAutoTile: state.tabData.nextAutoTileTitle
        }
      })
    },
    onSelectAutoTile: (title: string) => {
      const state = store.getState()
      if (state.tabData.selectedAutoTile === title) {
        dispatch({ type: CHANGE_TAB_DATA, data: { selectedAutoTile: undefined } })
      } else {
        dispatch({ type: CHANGE_TAB_DATA, data: { selectedAutoTile: title } })
      }
    },
    onRemoveAutoTile: (title: string) => {
      const state = store.getState()
      if (state.tabData.selectedAutoTile === title) {
        dispatch({ type: CHANGE_TAB_DATA, data: { selectedAutoTile: undefined } })
      }
      let autoTiles = state.tilesetData.autoTiles.slice().filter((autoTile) => {
        return autoTile.title !== title
      })
      dispatch({ type: UPDATE_TILESET, data: { autoTiles } })
    }
  }
}

function Auto ({
  tabData,
  autoTiles,
  onChangeTitle,
  onAutoTileAdd,
  onSelectAutoTile,
  onRemoveAutoTile
}: ObjectsProps) {
  return (
    <div>
      <AutoTileList>
        {autoTiles.map((autoTile) => {
          return (
            <ListItem key={autoTile.title} selected={tabData.selectedAutoTile === autoTile.title}>
              <ItemTitle onClick={onSelectAutoTile.bind(this, autoTile.title)}>{autoTile.title}</ItemTitle>
              <Actions>
                <Button onClick={onRemoveAutoTile.bind(this, autoTile.title)}><FontAwesomeIcon icon={faTrash} /></Button>
              </Actions>
            </ListItem>
          )
        })}
      </AutoTileList>
      <Form>
        <InputWrapper>
          <TextField
            onChange={onChangeTitle}
            value={tabData.nextAutoTileTitle}
            placeholder="Autotile Title" />
        </InputWrapper>
        <Button onClick={onAutoTileAdd}>{t('add')}</Button>
      </Form>
      {t('autotile_description')}
    </div>
  )
}

const AutoTileList = styled.div`
  margin-bottom: 30px;
`

const Form = styled.div`
  display: flex;
  margin-bottom: 20px;
`

const InputWrapper = styled.div`
  flex-grow: 1;
  flex-basis: 90%;
  margin-right: 10px;
`

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Auto)
