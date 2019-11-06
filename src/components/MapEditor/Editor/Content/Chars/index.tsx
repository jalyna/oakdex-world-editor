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
  selectedCharset?: string,
  selectedEvent?: string,
  eventToCopy?: string
}

function mapStateToProps ({ mapData, editorData, tilesets }: any) {
  return {
    chars: mapData.chars || [],
    tilesets,
    selectedCharset: editorData.selectedCharset,
    currentCoordinates: editorData.currentCoordinates,
    selectedEvent: editorData.selectedEvent,
    eventToCopy: editorData.eventToCopy
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
  eventToCopy,
  currentCoordinates,
  selectedEvent
}: CharsProps) {
  const eventToCopyData = chars.find(c => c.id === eventToCopy)
  return (
    <React.Fragment>
      {currentCoordinates && selectedCharset && renderPreview(currentCoordinates, selectedCharset, tilesets)}
      {currentCoordinates && eventToCopy && renderPreview(currentCoordinates, `${eventToCopyData.tilesetTitle},${eventToCopyData.charsetTitle}`, tilesets)}
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
          direction={c.dir}
          selected={selectedEvent === c.id} />
      })}
    </React.Fragment>
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Chars)
