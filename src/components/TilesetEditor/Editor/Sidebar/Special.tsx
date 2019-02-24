import * as React from 'react'
import styled from 'styled-components'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEraser, faPaintBrush, faTrash } from '@fortawesome/free-solid-svg-icons'

import t from 'shared/translate'
import { TabData } from 'components/TilesetEditor/reducers/tabData'
import { SpecialTile } from 'components/TilesetEditor/reducers/tilesetData'
import Button from 'shared/Button'
import TextField from 'shared/TextField'
import store from 'components/TilesetEditor/store'
import { CHANGE_TAB_DATA, UPDATE_TILESET } from 'components/TilesetEditor/actionTypes'
import ListItem, { ItemTitle, Actions } from 'shared/ListItem'

interface SpecialProps {
  tabData: TabData,
  specialTiles: SpecialTile[],
  changeTool: (tool: string) => void,
  onChangeTitle: (e: React.FormEvent) => void,
  onSpecialTileAdd: () => void,
  onSelectSpecialTile: (title: string) => void,
  onRemoveSpecialTile: (title: string) => void
}

function mapStateToProps ({ tabData, tilesetData }: any) {
  return {
    tabData,
    specialTiles: tilesetData.specialTiles
  }
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {
    changeTool: (specialTool: string) => {
      dispatch({ type: CHANGE_TAB_DATA, data: { specialTool } })
    },
    onChangeTitle: (e: React.ChangeEvent) => {
      const target = e.target as HTMLInputElement
      dispatch({
        type: CHANGE_TAB_DATA,
        data: {
          nextSpecialTileTitle: target.value
        }
      })
    },
    onSpecialTileAdd: () => {
      const state = store.getState()
      let specialTiles = state.tilesetData.specialTiles.slice()
      specialTiles.push({
        title: state.tabData.nextSpecialTileTitle,
        fields: []
      } as SpecialTile)
      dispatch({ type: UPDATE_TILESET, data: { specialTiles } })
      dispatch({
        type: CHANGE_TAB_DATA,
        data: {
          nextSpecialTileTitle: '',
          selectedSpecialTile: state.tabData.nextSpecialTileTitle
        }
      })
    },
    onSelectSpecialTile: (title: string) => {
      const state = store.getState()
      if (state.tabData.selectedSpecialTile === title) {
        dispatch({ type: CHANGE_TAB_DATA, data: { selectedSpecialTile: undefined } })
      } else {
        dispatch({ type: CHANGE_TAB_DATA, data: { selectedSpecialTile: title } })
      }
    },
    onRemoveSpecialTile: (title: string) => {
      const state = store.getState()
      if (state.tabData.selectedSpecialTile === title) {
        dispatch({ type: CHANGE_TAB_DATA, data: { selectedSpecialTile: undefined } })
      }
      let specialTiles = state.tilesetData.specialTiles.slice().filter((specialTile) => {
        return specialTile.title !== title
      })
      dispatch({ type: UPDATE_TILESET, data: { specialTiles } })
    }
  }
}

function Special ({
  tabData,
  specialTiles,
  changeTool,
  onChangeTitle,
  onSpecialTileAdd,
  onSelectSpecialTile,
  onRemoveSpecialTile
}: SpecialProps) {
  return (
    <div>
      <ActionWrapper>
        <Button isActive={tabData.specialTool === 'default'}
          onClick={changeTool.bind(this, 'default')}>
          <FontAwesomeIcon icon={faPaintBrush} /> {t('add')}
        </Button>
        <Button isActive={tabData.specialTool === 'erase'}
          onClick={changeTool.bind(this, 'erase')}>
          <FontAwesomeIcon icon={faEraser} /> {t('remove')}
        </Button>
      </ActionWrapper>
      <SpecialTileList>
        {specialTiles.map((specialTile) => {
          return (
            <ListItem key={specialTile.title} selected={tabData.selectedSpecialTile === specialTile.title}>
              <ItemTitle onClick={onSelectSpecialTile.bind(this, specialTile.title)}>{specialTile.title}</ItemTitle>
              <Actions>
                <Button onClick={onRemoveSpecialTile.bind(this, specialTile.title)}><FontAwesomeIcon icon={faTrash} /></Button>
              </Actions>
            </ListItem>
          )
        })}
      </SpecialTileList>
      <Form>
        <InputWrapper>
          <TextField
            onChange={onChangeTitle}
            value={tabData.nextSpecialTileTitle}
            placeholder="Special Title" />
        </InputWrapper>
        <Button onClick={onSpecialTileAdd}>{t('add')}</Button>
      </Form>
      {t('special_description')}
    </div>
  )
}

const SpecialTileList = styled.div`
  margin-bottom: 30px;
`

const ActionWrapper = styled.div `
  display: flex;
  margin-bottom: 20px;

  > * {
    margin-right: 10px;

    &:last-child {
      margin-right: 0;
    }
  }
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
)(Special)
