import * as React from 'react'
import styled from 'styled-components'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import { Tileset, OpacityAreas, AutoTile } from 'components/TilesetEditor/reducers/tilesetData'

import { CHANGE_EDITOR_DATA } from 'components/MapEditor/actionTypes'

import AutoTileItem from './AutoTileItem'

interface AutoTilesProps {
  tileset: Tileset,
  activeAutoTileTitle: string,
  selectAutoTile: (activeAutoTile: string) => void
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

function AutoTiles ({ tileset, activeAutoTileTitle, selectAutoTile }: AutoTilesProps) {
  return (
    <Wrapper>
      {tileset.autoTiles.map((autoTile) => {
        return (
          <AutoTileItem
            key={autoTile.title}
            onSelect={selectAutoTile}
            tileset={tileset}
            data={autoTile}
            active={autoTile.title === activeAutoTileTitle} />
        )
      })}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  box-sizing: border-box;
  margin-top: 20px;
`

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AutoTiles)
