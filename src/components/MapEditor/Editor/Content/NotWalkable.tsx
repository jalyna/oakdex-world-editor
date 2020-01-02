import * as React from 'react'
import styled from 'styled-components'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import { getWalkability } from 'shared/mapToGameMap'
import { Walkability, Tileset } from 'components/TilesetEditor/reducers/tilesetData'
import { MapData } from 'components/MapEditor/reducers/mapData'

interface StartPositionProps {
  walkability: Walkability[][]
}

function mapStateToProps ({ mapData, tilesets }: { mapData: MapData, tilesets: Tileset[] }) {
  return {
    walkability: getWalkability(mapData, tilesets)
  }
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {

  }
}

function NotWalkable ({ walkability }: StartPositionProps) {
  return (
    <React.Fragment>
      {walkability.map((row, y) => {
        return (
          <div key={y}>
            {row.map((walkability, x) => {
              if (walkability.top === 1 && walkability.bottom === 1 && walkability.right === 1 && walkability.left === 1) {
                return <NotWalkableSquare style={{ left: x * 16, top: y * 16 }} />
              }

              return (<React.Fragment>
                {walkability.top === 1 && <NotWalkableSquareSmallTop style={{ left: x * 16, top: y * 16 }} />}
                {walkability.bottom === 1 && <NotWalkableSquareSmallBottom style={{ left: x * 16, top: y * 16 }} />}
                {walkability.left === 1 && <NotWalkableSquareSmallLeft style={{ left: x * 16, top: y * 16 }} />}
                {walkability.right === 1 && <NotWalkableSquareSmallRight style={{ left: x * 16, top: y * 16 }} />}
              </React.Fragment>)
            })}
          </div>
        )
      })}
    </React.Fragment>
  )
}

const NotWalkableSquare = styled.div`
  width: 16px;
  height: 16px;
  background: red;
  opacity: 0.4;
  position: absolute;
`

const NotWalkableSquareSmall = styled(NotWalkableSquare)`
  width: 8px;
  height: 8px;
`

const NotWalkableSquareSmallTop = styled(NotWalkableSquareSmall)`
  margin-left: 4px;
`

const NotWalkableSquareSmallBottom = styled(NotWalkableSquareSmall)`
  margin-left: 4px;
  margin-top: 8px;
`

const NotWalkableSquareSmallLeft = styled(NotWalkableSquareSmall)`
  margin-top: 4px;
`

const NotWalkableSquareSmallRight = styled(NotWalkableSquareSmall)`
  margin-top: 4px;
  margin-left: 8px;
`

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotWalkable)
