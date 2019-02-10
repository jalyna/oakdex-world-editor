import * as React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import { DEFAULT_FONT, GREY_30, GREY_90 } from 'shared/theme'

import { Tileset } from '../reducers/tilesetData'

import Topbar from './Topbar'
import Sidebar from './Sidebar'

const TOPBAR_HEIGHT = 80
const SIDEBAR_WIDTH = 400

interface EditorProps {
  tilesetData: Tileset
}

function mapStateToProps ({ tilesetData }: any) {
  return {
    tilesetData
  }
}

function Editor ({ tilesetData }: EditorProps) {
  return (
    <Wrapper>
      <TopbarWrapper><Topbar /></TopbarWrapper>
      <ContentWrapper>foo</ContentWrapper>
      <SidebarWrapper><Sidebar /></SidebarWrapper>
    </Wrapper>
  )
}

export default connect(
  mapStateToProps,
  (d: Dispatch) => { return {} },
)(Editor)

const Wrapper = styled.div`
  font-family: ${DEFAULT_FONT};
  color: ${GREY_30};
  font-size: 16px;
  line-height: 1.66;
  width: 100vw;
  height: 100vh;
`

const TopbarWrapper = styled.div`
  height: ${TOPBAR_HEIGHT}px;
  width: 100%;
  overflow: auto;
  box-sizing: border-box;
  border-bottom: 1px solid ${GREY_90};
`

const ContentWrapper = styled.div`
  height: calc(100% - ${TOPBAR_HEIGHT}px);
  width: calc(100% - ${SIDEBAR_WIDTH}px);
  overflow: auto;
  box-sizing: border-box;
  float: left;
`

const SidebarWrapper = styled.div`
  height: calc(100% - ${TOPBAR_HEIGHT}px);
  width: ${SIDEBAR_WIDTH}px;
  overflow: auto;
  box-sizing: border-box;
  border-left: 1px solid ${GREY_90};
  float: left;
`
