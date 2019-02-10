import * as React from 'react'
import styled from 'styled-components'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDotCircle } from '@fortawesome/free-solid-svg-icons'

import { Tileset } from 'components/TilesetEditor/reducers/tilesetData'
import { Coordinate } from 'components/TilesetEditor/reducers/currentCoordinates'
import { TEAL_90, TEAL_50 } from 'shared/theme'
import getCoordinates from 'shared/getCoordinates'
import Tile from 'shared/Tile'
import { CHANGE_CURRENT_COORDINATES, REMOVE_CURRENT_COORDINATES } from 'components/TilesetEditor/actionTypes'

interface ContentProps {
  tilesetData: Tileset,
  currentCoordinates: Coordinate | null,
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void,
  onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => void
}

function mapStateToProps ({ tilesetData, currentCoordinates }: any) {
  return {
    tilesetData,
    currentCoordinates
  }
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {
    onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => {
      dispatch({ type: CHANGE_CURRENT_COORDINATES, ...getCoordinates(e) })
    },
    onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => {
      dispatch({ type: REMOVE_CURRENT_COORDINATES })
    }
  }
}

function Content ({ tilesetData, currentCoordinates, onMouseMove, onMouseLeave }: ContentProps) {
  const tilesetStyle = {
    width: tilesetData.width * 16,
    height: tilesetData.height * 16,
    backgroundImage: 'url(' + tilesetData.imageBase64 + ')'
  }
  let coordinates = '-'
  if (currentCoordinates) {
    coordinates = currentCoordinates.x + ' | ' + currentCoordinates.y
  }
  return (
    <StyledContent>
      <Coordinates>{coordinates}</Coordinates>
      <TilesetWrapper
        style={tilesetStyle}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}>
        {currentCoordinates !== null && <HoverTile {...currentCoordinates} />}
      </TilesetWrapper>
    </StyledContent>
  )
}

const StyledContent = styled.div`
  box-sizing: border-box;
  padding: 15px;
  position: relative;
`

const TilesetWrapper = styled.div`
  box-sizing: border-box;
  image-rendering: pixelated;
  margin: 0 auto;
  cursor: pointer;
  position: relative;
`

const Coordinates = styled.div`
  box-sizing: border-box;
  padding: 10px;
  background: ${TEAL_90};
  text-align: center;
  font-weight: bold;
  position: fixed;
  width: 200px;
  top: 0;
  left: 50%;
  margin-left: -100px;
`

const HoverTile = styled(Tile)`
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid ${TEAL_50};
`

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Content)
