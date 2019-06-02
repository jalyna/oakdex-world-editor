import * as React from 'react'
import styled from 'styled-components'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import { MapChar } from 'components/MapEditor/reducers/mapData'
import { Tileset } from 'components/TilesetEditor/reducers/tilesetData'
import { Coordinate } from 'components/TilesetEditor/reducers/currentCoordinates'
import { Direction } from 'oakdex-world-engine'

import CharPreview from './CharPreview'

interface CharsProps {
  chars: MapChar[],
  tilesets: Tileset[],
  currentCoordinates?: Coordinate,
  selectedCharset?: string
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
  return <CharPreview
    x={coordinates.x}
    y={coordinates.y}
    hidden={false}
    charset={charset}
    direction={Direction.Down} />
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
        return <CharPreview
          key={c.id}
          x={c.x}
          y={c.y}
          hidden={c.hidden}
          charset={charset}
          direction={c.dir} />
      })}
    </React.Fragment>
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Chars)
