import * as React from 'react'
import styled from 'styled-components'

import { DEFAULT_FONT, GREY_30, GREY_90 } from 'shared/theme'

import Topbar from './Topbar'
import TilesetMenu from './TilesetMenu'
import LayerMenu from './LayerMenu'

const TOPBAR_HEIGHT = 60
const LAYER_MENU_HEIGHT = 200
const SIDEBAR_WIDTH = 400

export default function Editor () {
  return (
    <Wrapper>
      <TopbarWrapper><Topbar /></TopbarWrapper>
      <ContentWrapper>CONTENT</ContentWrapper>
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
  height: ${LAYER_MENU_HEIGHT}px;
  width: ${SIDEBAR_WIDTH}px;
  overflow: auto;
  box-sizing: border-box;
  border-left: 1px solid ${GREY_90};
  border-bottom: 1px solid ${GREY_90};
  float: left;
`

const TilesetMenuWrapper = styled.div`
  height: calc(100% - ${TOPBAR_HEIGHT}px - ${LAYER_MENU_HEIGHT}px);
  width: ${SIDEBAR_WIDTH}px;
  overflow: auto;
  box-sizing: border-box;
  border-left: 1px solid ${GREY_90};
  float: left;
`
