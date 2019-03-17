import * as React from 'react'
import styled from 'styled-components'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import { MapChar } from 'components/MapEditor/reducers/mapData'
import { Tileset } from 'components/TilesetEditor/reducers/tilesetData'
import { Coordinate } from 'components/TilesetEditor/reducers/currentCoordinates'
import { Direction } from 'oakdex-world-engine'

interface CharsProps {
  chars: MapChar[],
  tilesets: Tileset[],
  currentCoordinates?: Coordinate,
  selectedCharset?: string
}

interface CharItemProps {
  direction: Direction
}

function mapStateToProps ({ mapData, editorData, tilesets }: any) {
  return {
    chars: mapData.chars || [],
    tilesets,
    selectedCharset: editorData.selectedCharset,
    currentCoordinates: editorData.currentCoordinates
  }
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {

  }
}

function renderPreview (coordinates: Coordinate, charsetTitle: string, tilesets: Tileset[]) {
  const parts = charsetTitle.split(',')
  const tileset = tilesets.find((t) => t.title === parts[0])
  if (!tileset) { return null }
  const charset = (tileset.charsets || []).find((c) => c.title === parts[1])
  if (!charset) { return null }
  const style = {
    backgroundImage: 'url(' + charset.imageBase64 + ')',
    left: coordinates.x * 16,
    top: coordinates.y * 16,
    opacity: 0.75
  }
  return <CharItem style={style} direction={Direction.Down} />
}

function Chars ({
  chars,
  tilesets,
  selectedCharset,
  currentCoordinates
}: CharsProps) {
  return (
    <React.Fragment>
      {currentCoordinates && selectedCharset && renderPreview(currentCoordinates, selectedCharset, tilesets)}
      {chars.map((c) => {
        const tileset = tilesets.find((t) => t.title === c.tilesetTitle)
        if (!tileset) { return null }
        const charset = (tileset.charsets || []).find((ch) => ch.title === c.charsetTitle)
        if (!charset) { return null }
        const style = {
          backgroundImage: 'url(' + charset.imageBase64 + ')',
          left: c.x * 16,
          top: c.y * 16,
          opacity: c.hidden ? 0.3 : 1
        }
        return <CharItem
          key={c.id}
          style={style}
          direction={c.dir} />
      })}
    </React.Fragment>
  )
}

const CharItem = styled.div`
  position: absolute;
  image-rendering: pixelated;
  width: 32px;
  height: 32px;
  margin-top: -16px;
  margin-left: -8px;
  ${({ direction }: CharItemProps) => direction === Direction.Down && `
    background-position: -32px 0px;
  `}
  ${({ direction }: CharItemProps) => direction === Direction.Up && `
    background-position: -32px -96px;
  `}
  ${({ direction }: CharItemProps) => direction === Direction.Left && `
    background-position: -32px -32px;
  `}
  ${({ direction }: CharItemProps) => direction === Direction.Right && `
    background-position: -32px -64px;
  `}
`

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Chars)
