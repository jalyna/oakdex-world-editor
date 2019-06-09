import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { Tileset } from 'components/TilesetEditor/reducers/tilesetData'
import { MapData } from 'components/MapEditor/reducers/mapData'

export { MapData, Tileset }

import Upload from './components/Upload'

export interface WorldEditorProps {
  tilesets?: Tileset[],
  editMap?: (fn: (mapData: MapData) => void) => void,
  onPageChange?: (page?: string) => void,
  eventSchema?: object
}

let globalEventSchema = {} as object

export default function WorldEditor({eventSchema, ...props}: WorldEditorProps) {
  if (eventSchema) {
    globalEventSchema = eventSchema
  }
  return <Upload {...props} />
}

export function getEventSchema() {
  return globalEventSchema
}
