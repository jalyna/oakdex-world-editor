import * as React from 'react'
import styled from 'styled-components'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearchMinus, faSearchPlus } from '@fortawesome/free-solid-svg-icons'

import { TabData } from 'components/TilesetEditor/reducers/tabData'
import { TEAL_90, TEAL_50 } from 'shared/theme'
import Button from 'shared/Button'
import { CHANGE_TAB_DATA } from 'components/TilesetEditor/actionTypes'

interface MagnifierProps {
  tabData: TabData,
  changeZoom: (zoom: number) => void
}

function mapStateToProps ({ tabData }: any) {
  return {
    tabData
  }
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {
    changeZoom: (zoom: number) => {
      dispatch({ type: CHANGE_TAB_DATA, data: { zoom } })
    }
  }
}

function Magnifier ({ tabData, changeZoom }: MagnifierProps) {
  return (
    <MagnifierWrapper>
      <Button disabled={tabData.zoom === 1} onClick={changeZoom.bind(this, tabData.zoom - 1)}>
        <FontAwesomeIcon icon={faSearchMinus} />
      </Button>
      <Button disabled={tabData.zoom === 4} onClick={changeZoom.bind(this, tabData.zoom + 1)}>
        <FontAwesomeIcon icon={faSearchPlus} />
      </Button>
    </MagnifierWrapper>
  )
}

const MagnifierWrapper = styled.div`
  position: fixed;
  width: 120px;
  top: 47px;
  left: 50%;
  margin-left: -60px;
  display: flex;
  box-sizing: border-box;
  justify-content: space-between;
`

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Magnifier)
