import * as React from 'react'
import styled from 'styled-components'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import { SpecialTile } from 'components/TilesetEditor/reducers/tilesetData'
import { Coordinate } from 'components/TilesetEditor/reducers/currentCoordinates'
import { TEAL_90, TEAL_50 } from 'shared/theme'
import Tile from 'shared/Tile'

interface SpecialProps {
  specialTile: SpecialTile
}

function mapStateToProps ({ tabData, tilesetData }: any) {
  return {
    specialTile: tilesetData.specialTiles.find((a: SpecialTile) => a.title === tabData.selectedSpecialTile)
  }
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {}
}

function Special ({ specialTile }: SpecialProps) {
  if (!specialTile) {
    return null
  }

  return (
    <React.Fragment>
      {specialTile.fields.map((field) => {
        return <SpecialTile key={field.x + '_' + field.y} x={field.x} y={field.y} />
      })}
    </React.Fragment>
  )
}

const SpecialTile = styled(Tile)`
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.6);
`

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Special)
