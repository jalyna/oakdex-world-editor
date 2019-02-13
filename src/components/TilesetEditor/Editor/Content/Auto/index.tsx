import * as React from 'react'
import styled from 'styled-components'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import { AutoTile } from 'components/TilesetEditor/reducers/tilesetData'
import { Coordinate } from 'components/TilesetEditor/reducers/currentCoordinates'
import { TEAL_90, TEAL_50 } from 'shared/theme'

import StyledAutoTile from './AutoTile'

interface AutoProps {
  autoTile?: AutoTile
}

function mapStateToProps ({ tilesetData, tabData }: any) {
  return {
    autoTile: tilesetData.autoTiles.find((a: AutoTile) => a.title === tabData.selectedAutoTile)
  }
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {}
}

function Auto ({ autoTile }: AutoProps) {
  if (!autoTile) {
    return null
  }

  return (
    <React.Fragment>
      {autoTile.fields.map((field) => {
        return <StyledAutoTile key={field.x + '_' + field.y} autoTileField={field} />
      })}
    </React.Fragment>
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Auto)
