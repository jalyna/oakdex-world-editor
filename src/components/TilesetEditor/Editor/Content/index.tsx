import * as React from 'react'
import styled from 'styled-components'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDotCircle } from '@fortawesome/free-solid-svg-icons'

import { Tileset } from 'components/TilesetEditor/reducers/tilesetData'
import { DEFAULT_FONT, GREY_50, GREY_90, GREY_70, TEAL_30 } from 'shared/theme'
//import { CHANGE_TAB } from 'components/TilesetEditor/actionTypes'

interface ContentProps {
  tilesetData: Tileset
}

function mapStateToProps ({ tilesetData }: any) {
  return {
    tilesetData
  }
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {
    //onTabClick: (tab: string) => {
    //  dispatch({ type: CHANGE_TAB, tab: tab })
    //}
  }
}

function Content ({ tilesetData }: ContentProps) {
  const tilesetStyle = {
    width: tilesetData.width * 16,
    height: tilesetData.height * 16,
    backgroundImage: 'url(' + tilesetData.imageBase64 + ')'
  }
  return (
    <StyledContent>
      <TilesetWrapper style={tilesetStyle} />
    </StyledContent>
  )
}

const StyledContent = styled.div`
  box-sizing: border-box;
  padding: 15px;
`

const TilesetWrapper = styled.div`
  box-sizing: border-box;
  image-rendering: pixelated;
  margin: 0 auto;
`

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Content)
