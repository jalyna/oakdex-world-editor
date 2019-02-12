import * as React from 'react'
import styled from 'styled-components'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEraser, faPaintBrush, faTrash } from '@fortawesome/free-solid-svg-icons'

import { TabData } from 'components/TilesetEditor/reducers/tabData'
import { AutoTile } from 'components/TilesetEditor/reducers/tilesetData'
import Button from 'shared/Button'
import TextField from 'shared/TextField'
import store from 'components/TilesetEditor/store'
import { CHANGE_TAB_DATA, UPDATE_TILESET } from 'components/TilesetEditor/actionTypes'
import { GREY_90, DEFAULT_FONT, GREY_30, TEAL_30, TEAL_70 } from 'shared/theme'

interface ObjectsProps {
  tabData: TabData,
  autoTiles: AutoTile[],
  changeTool: (tool: string) => void,
  onChangeTitle: (e: React.FormEvent) => void,
  onAutoTileAdd: () => void,
  onSelectAutoTile: (title: string) => void,
  onRemoveAutoTile: (title: string) => void
}

interface AutoTileItemProps {
  selected: boolean
}

function mapStateToProps ({ tabData, tilesetData }: any) {
  return {
    tabData,
    autoTiles: tilesetData.autoTiles
  }
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {
    changeTool: (autoTool: string) => {
      dispatch({ type: CHANGE_TAB_DATA, data: { autoTool } })
    },
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
  changeTool,
  autoTiles,
  onChangeTitle,
  onAutoTileAdd,
  onSelectAutoTile,
  onRemoveAutoTile
}: ObjectsProps) {
  return (
    <div>
      <ActionWrapper>
        <Button isActive={tabData.autoTool === 'default'}
          onClick={changeTool.bind(this, 'default')}>
          <FontAwesomeIcon icon={faPaintBrush} /> Add Tile
        </Button>
        <Button isActive={tabData.autoTool === 'erase'}
          onClick={changeTool.bind(this, 'erase')}>
          <FontAwesomeIcon icon={faEraser} /> Remove Tile
        </Button>
      </ActionWrapper>
      <AutoTileList>
        {autoTiles.map((autoTile) => {
          return (
            <AutoTileItem key={autoTile.title} selected={tabData.selectedAutoTile === autoTile.title}>
              <AutoTileItemTitle onClick={onSelectAutoTile.bind(this, autoTile.title)}>{autoTile.title}</AutoTileItemTitle>
              <Button onClick={onRemoveAutoTile.bind(this, autoTile.title)}><FontAwesomeIcon icon={faTrash} /></Button>
            </AutoTileItem>
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
        <Button onClick={onAutoTileAdd}>Add</Button>
      </Form>
      Auto Tiles should be used for mountain groups, water, pavement.
      Anything that has borders.
    </div>
  )
}

const AutoTileList = styled.div`
  margin-bottom: 30px;
`

const AutoTileItem = styled.div`
  border-bottom: 1px solid ${GREY_90};
  padding: 5px;
  display: flex;
  width: 100%;
  box-sizing: border-box;
  align-items: center;
  background: ${({ selected }: AutoTileItemProps) => selected ? TEAL_70 : 'transparent'};
`

const AutoTileItemTitle = styled.button`
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

const Form = styled.div`
  display: flex;
  margin-bottom: 20px;
`

const InputWrapper = styled.div`
  flex-grow: 1;
  flex-basis: 90%;
  margin-right: 10px;
`

const ActionWrapper = styled.div`
  display: flex;
  margin-bottom: 20px;

  > * {
    margin-right: 10px;

    &:last-child {
      margin-right: 0;
    }
  }
`

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Auto)
