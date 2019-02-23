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
import { GREY_90, DEFAULT_FONT, GREY_30, TEAL_30, TEAL_70 } from 'shared/theme'

interface SpecialProps {
  tabData: TabData,
  specialTiles: SpecialTile[],
  changeTool: (tool: string) => void,
  onChangeTitle: (e: React.FormEvent) => void,
  onSpecialTileAdd: () => void,
  onSelectSpecialTile: (title: string) => void,
  onRemoveSpecialTile: (title: string) => void
}

interface SpecialTileItemProps {
  selected: boolean
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
            <SpecialTileItem key={specialTile.title} selected={tabData.selectedSpecialTile === specialTile.title}>
              <SpecialTileItemTitle onClick={onSelectSpecialTile.bind(this, specialTile.title)}>{specialTile.title}</SpecialTileItemTitle>
              <Button onClick={onRemoveSpecialTile.bind(this, specialTile.title)}><FontAwesomeIcon icon={faTrash} /></Button>
            </SpecialTileItem>
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

const SpecialTileItem = styled.div`
  border-bottom: 1px solid ${GREY_90};
  padding: 5px;
  display: flex;
  width: 100%;
  box-sizing: border-box;
  align-items: center;
  background: ${({ selected }: SpecialTileItemProps) => selected ? TEAL_70 : 'transparent'};
`

const SpecialTileItemTitle = styled.button`
  flex-grow: 2;
  flex-basis: 200%;
  outline: none;
  border: 0;
  background: transparent;
  font-size: ${DEFAULT_FONT};
  font-size: 18px;
  padding: 4px;
  box-sizing: border-box;
  text-align: left;
  color: ${GREY_30}
  cursor: pointer;

  &:hover {
    color: ${TEAL_30};
  }
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
