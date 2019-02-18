import * as React from 'react'
import styled from 'styled-components'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import { Tileset, OpacityAreas, AutoTile } from 'components/TilesetEditor/reducers/tilesetData'

import { DEFAULT_FONT, GREY_50, GREY_90, GREY_70, TEAL_30, GREY_30 } from 'shared/theme'
import { CHANGE_EDITOR_DATA } from 'components/MapEditor/actionTypes'

interface AutoTilesProps {
  tileset: Tileset,
  activeAutoTileTitle: string,
  selectAutoTile: (activeAutoTile: string) => void
}

interface PreviewTileProps {
  url: string
}

interface AutoTileItemProps {
  active: boolean
}

function mapStateToProps ({ editorData }: any) {
  return {
    activeAutoTileTitle: editorData.activeAutoTile
  }
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {
    selectAutoTile: (activeAutoTile: string) => {
      dispatch({
        type: CHANGE_EDITOR_DATA,
        data: { activeAutoTile }
      })
    }
  }
}

function renderPreviewTile (tileset: Tileset, autoTile: AutoTile, opacityAreas: OpacityAreas): React.ReactNode {
  const field = autoTile.fields.find((f) => Object.entries(f.opacityAreas).sort().toString() === Object.entries(opacityAreas).sort().toString())
  if (!field) {
    return null
  }
  const style = {
    backgroundPosition: (field.x * -16) + 'px ' + (field.y * -16) + 'px'
  }
  return <PreviewTile url={tileset.imageBase64} style={style} />
}

function AutoTiles ({ tileset, activeAutoTileTitle, selectAutoTile }: AutoTilesProps) {
  return (
    <Wrapper>
      {tileset.autoTiles.map((autoTile) => {
        return (
          <AutoTileItem
            key={autoTile.title}
            onClick={selectAutoTile.bind(this, autoTile.title)}
            active={autoTile.title === activeAutoTileTitle}>
            <Preview>
              {renderPreviewTile(tileset, autoTile, {
                topLeft: false,
                topRight: false,
                bottomRight: true,
                bottomLeft: false
              })}
              {renderPreviewTile(tileset, autoTile, {
                topLeft: false,
                topRight: false,
                bottomRight: true,
                bottomLeft: true
              })}
              {renderPreviewTile(tileset, autoTile, {
                topLeft: false,
                topRight: false,
                bottomRight: false,
                bottomLeft: true
              })}
              {renderPreviewTile(tileset, autoTile, {
                topLeft: false,
                topRight: true,
                bottomRight: true,
                bottomLeft: false
              })}
              {renderPreviewTile(tileset, autoTile, {
                topLeft: true,
                topRight: true,
                bottomRight: true,
                bottomLeft: true
              })}
              {renderPreviewTile(tileset, autoTile, {
                topLeft: true,
                topRight: false,
                bottomRight: false,
                bottomLeft: true
              })}
              {renderPreviewTile(tileset, autoTile, {
                topLeft: false,
                topRight: true,
                bottomRight: false,
                bottomLeft: false
              })}
              {renderPreviewTile(tileset, autoTile, {
                topLeft: true,
                topRight: true,
                bottomRight: false,
                bottomLeft: false
              })}
              {renderPreviewTile(tileset, autoTile, {
                topLeft: true,
                topRight: false,
                bottomRight: false,
                bottomLeft: false
              })}
            </Preview>
            {autoTile.title}
          </AutoTileItem>
        )
      })}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  box-sizing: border-box;
  margin-top: 20px;
`

const Preview = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 48px;
  height: 48px;
  line-height: 0;
`

const PreviewTile = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  ${({ url }: PreviewTileProps) => `
    background-image: url(${url});
  `};
`

const AutoTileItem = styled.button`
  position: relative;
  outline: none;
  border: 0;
  background: transparent;
  font-family: ${DEFAULT_FONT};
  font-size: 16px;
  padding: 15px 0 15px 68px;
  border-bottom: 1px solid ${GREY_90};
  display: block;
  width: 100%;
  box-sizing: border-box;
  color: ${GREY_30};
  text-align: left;
  cursor: pointer;
  ${({ active }: AutoTileItemProps) => active && `
    color: white;
    background: ${TEAL_30};
  `};
`

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AutoTiles)
