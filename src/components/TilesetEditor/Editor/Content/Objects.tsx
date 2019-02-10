import * as React from 'react'
import styled from 'styled-components'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import { Tileset } from 'components/TilesetEditor/reducers/tilesetData'
import { Coordinate } from 'components/TilesetEditor/reducers/currentCoordinates'
import { TEAL_90, TEAL_50 } from 'shared/theme'
import Tile from 'shared/Tile'

interface ObjectsProps {
  tilesetData: Tileset
}

function mapStateToProps ({ tilesetData }: any) {
  return {
    tilesetData
  }
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {}
}

function Objects ({ tilesetData }: ObjectsProps) {
  return (
    <React.Fragment>
      {tilesetData.objects.map((rows, y) => {
        return rows.map((cell, x) => {
          if (cell) {
            return (
              <ObjectTile key={y + '_' + x} x={x} y={y} />
            )
          }
        })
      })}
    </React.Fragment>
  )
}

const ObjectTile = styled(Tile)`
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.7);
`

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Objects)
