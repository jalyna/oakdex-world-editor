import * as React from 'react'
import styled from 'styled-components'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faCircle } from '@fortawesome/free-solid-svg-icons'

import { Tileset, Walkability } from 'components/TilesetEditor/reducers/tilesetData'
import { TabData } from 'components/TilesetEditor/reducers/tabData'
import { Coordinate } from 'components/TilesetEditor/reducers/currentCoordinates'
import { TEAL_90, TEAL_50 } from 'shared/theme'
import Tile from 'shared/Tile'

interface WalkProps {
  walkability: Walkability[][],
  tabData: TabData
}

function mapStateToProps ({ tilesetData, tabData }: any) {
  return {
    walkability: tilesetData.walkability,
    tabData
  }
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {}
}

function allSame (tile: Walkability, status: number): boolean {
  return Object.values(tile).every((v: number) => v === status)
}

function renderSimple (cell: Walkability): React.ReactNode {
  if (allSame(cell, 2)) {
    return <FontAwesomeIcon icon={faTimes} />
  } else if (allSame(cell, 1)) {
    return <FontAwesomeIcon icon={faCircle} />
  } else if (allSame(cell, 0)) {
    return 'O'
  } else {
    return '~'
  }
}

function renderType (status: number): React.ReactNode | string {
  if (status === 2) {
    return <FontAwesomeIcon icon={faTimes} />
  } else if (status === 1) {
    return <FontAwesomeIcon icon={faCircle} />
  } else {
    return 'O'
  }
}

function renderGrid (cell: Walkability): React.ReactNode {
  return (
    <React.Fragment>
      <SubTile key='top' style={{ top: 0, left: 4 }}>{renderType(cell.top)}</SubTile>
      <SubTile key='bottom' style={{ bottom: 0, left: 4 }}>{renderType(cell.bottom)}</SubTile>
      <SubTile key='left' style={{ top: 4, left: 0 }}>{renderType(cell.left)}</SubTile>
      <SubTile key='right' style={{ top: 4, right: 0 }}>{renderType(cell.right)}</SubTile>
    </React.Fragment>
  )
}

function Walk ({ walkability, tabData }: WalkProps) {
  const WalkTile = tabData.walkabilityMode === 'details' ? WalkGrid : WalkSimple
  return (
    <React.Fragment>
      {walkability.map((rows, y) => {
        return rows.map((cell, x) => {
          return (
            <WalkTile key={y + '_' + x} x={x} y={y}>
              {tabData.walkabilityMode === 'details' ? renderGrid(cell) : renderSimple(cell)}
            </WalkTile>
          )
        })
      })}
    </React.Fragment>
  )
}

const WalkSimple = styled(Tile)`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  opacity: 0.6;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);

  svg {
    filter: drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.5));
  }
`

const WalkGrid = styled(Tile)`
  color: white;
  opacity: 0.6;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);

  svg {
    filter: drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.5));
  }
`

const SubTile = styled.div`
  position: absolute;
  width: 8px;
  height: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 7px;
  line-height: 1;
`

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Walk)
