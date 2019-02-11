import * as React from 'react'
import styled from 'styled-components'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faCircle, faThLarge, faSquare } from '@fortawesome/free-solid-svg-icons'

import { TabData } from 'components/TilesetEditor/reducers/tabData'
import Button from 'shared/Button'
import { CHANGE_TAB_DATA } from 'components/TilesetEditor/actionTypes'

interface WalkProps {
  tabData: TabData,
  changeTool: (walkabilityMode: string) => void
}

function mapStateToProps ({ tabData }: any) {
  return {
    tabData
  }
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {
    changeTool: (walkabilityMode: string) => {
      dispatch({ type: CHANGE_TAB_DATA, data: { walkabilityMode } })
    }
  }
}

function Walk ({ tabData, changeTool }: WalkProps) {
  return (
    <div>
      <ActionWrapper>
        <Button isActive={tabData.walkabilityMode === 'default'}
          onClick={changeTool.bind(this, 'default')}>
          <FontAwesomeIcon icon={faSquare} /> Simple
        </Button>
        <Button isActive={tabData.walkabilityMode === 'details'}
          onClick={changeTool.bind(this, 'details')}>
          <FontAwesomeIcon icon={faThLarge} /> Details
        </Button>
      </ActionWrapper>
      There are three types of walkability settings.
      The default is walkable (O).
      Then there is a simple block (<FontAwesomeIcon icon={faTimes} />).
      And additionally you can override the blocks e.g.
      for Bridges (<FontAwesomeIcon icon={faCircle} />).
      <br /><br />
      You can either set this for the whole tile or for all 4 corners.
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
)(Walk)
