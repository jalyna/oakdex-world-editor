import * as React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import { DEFAULT_FONT, GREY_30, GREY_90 } from 'shared/theme'

import Topbar from './Topbar'
import TilesetMenu from './TilesetMenu'
import LayerMenu from './LayerMenu'
import Content from './Content'
import CharsMenu from './CharsMenu'
import VersionsMenu from './VersionsMenu'

const TOPBAR_HEIGHT = 60
const SIDEBAR_WIDTH = 450

interface EditorProps {
  tool: string
}

function mapStateToProps ({ editorData }: any) {
  return {
    tool: editorData.tool
  }
}

function Editor ({ tool }: EditorProps) {
  if (tool === 'chars') {
    return (
      <Wrapper>
        <TopbarWrapper><Topbar /></TopbarWrapper>
        <ContentWrapper><Content /></ContentWrapper>
        <SidebarWrapper><CharsMenu /></SidebarWrapper>
      </Wrapper>
    )
  }

  if (tool === 'versions') {
    return (
      <Wrapper>
        <TopbarWrapper><Topbar /></TopbarWrapper>
        <ContentWrapper><Content /></ContentWrapper>
        <SidebarWrapper><VersionsMenu /></SidebarWrapper>
      </Wrapper>
    )
  }

  return (
    <Wrapper>
      <TopbarWrapper><Topbar /></TopbarWrapper>
      <ContentWrapper><Content /></ContentWrapper>
      <LayerMenuWrapper>
        <LayerMenu />
      </LayerMenuWrapper>
      <TilesetMenuWrapper>
        <TilesetMenu />
      </TilesetMenuWrapper>
    </Wrapper>
  )
}

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

const LayerMenuWrapper = styled.div`
  height: calc(50% - ${TOPBAR_HEIGHT}px);
  width: ${SIDEBAR_WIDTH}px;
  overflow: auto;
  box-sizing: border-box;
  border-left: 1px solid ${GREY_90};
  border-bottom: 1px solid ${GREY_90};
  float: left;
`

const SidebarWrapper = styled(LayerMenuWrapper)`
  height: calc(100% - ${TOPBAR_HEIGHT}px);
`

const TilesetMenuWrapper = styled.div`
  height: 50%;
  width: ${SIDEBAR_WIDTH}px;
  overflow: auto;
  box-sizing: border-box;
  border-left: 1px solid ${GREY_90};
  float: left;
`

export default connect(
  mapStateToProps
)(Editor)
