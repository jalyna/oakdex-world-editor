import * as React from 'react'
import styled from 'styled-components'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEraser, faPaintBrush } from '@fortawesome/free-solid-svg-icons'

import { TabData } from 'components/TilesetEditor/reducers/tabData'
import Button from 'shared/Button'
import { CHANGE_TAB_DATA } from 'components/TilesetEditor/actionTypes'

interface ObjectsProps {
  tabData: TabData,
  changeTool: (tool: string) => void
}

function mapStateToProps ({ tabData }: any) {
  return {
    tabData
  }
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {
    changeTool: (objectsTool: string) => {
      dispatch({ type: CHANGE_TAB_DATA, data: { objectsTool } })
    }
  }
}

function Objects ({ tabData, changeTool }: ObjectsProps) {
  return (
    <div>
      <ActionWrapper>
        <Button isActive={tabData.objectsTool === 'default'}
          onClick={changeTool.bind(this, 'default')}>
          <FontAwesomeIcon icon={faPaintBrush} /> Add objects
        </Button>
        <Button isActive={tabData.objectsTool === 'erase'}
          onClick={changeTool.bind(this, 'erase')}>
          <FontAwesomeIcon icon={faEraser} /> Remove objects
        </Button>
      </ActionWrapper>
      Objects will be placed in the foreground, so
      the player walks in front of them.<br /><br />
      Mark the objects in the map (see the circle).
    </div>
  )
}

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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Objects)
