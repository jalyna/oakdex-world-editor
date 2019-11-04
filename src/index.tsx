import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { EventType, ActionHandler } from 'oakdex-world-engine'

import { Tileset } from 'components/TilesetEditor/reducers/tilesetData'
import { MapData } from 'components/MapEditor/reducers/mapData'
import mapToGameMap from 'shared/mapToGameMap'
import { setLoadImageFn } from 'components/MapEditor/Editor/Content/canvas'

export { MapData, Tileset, EventType, mapToGameMap, setLoadImageFn }

import Upload from './components/Upload'

type OnDemoEvent = (actionHandler: ActionHandler, charId: string, eventType: EventType, event: object) => void

export interface WorldEditorProps {
  tilesets?: Tileset[],
  editMap?: (fn: (mapData: MapData) => void) => void,
  onPageChange?: (page?: string) => void,
  eventSchema?: object,
  onDemoEvent?: OnDemoEvent,
  mapSize?: {
    width: number,
    height: number
  }
}

let globalEventSchema = {} as object

let globalOnDemoEvent: OnDemoEvent = null

let defaultMapSize = {
  width: 30,
  height: 20
} as {
  width: number,
  height: number
}

export default function WorldEditor({eventSchema, onDemoEvent, mapSize, ...props}: WorldEditorProps) {
  if (eventSchema) {
    globalEventSchema = eventSchema
  }
  if (onDemoEvent) {
    globalOnDemoEvent = onDemoEvent
  }
  if (mapSize) {
    defaultMapSize = mapSize
  }
  return <Upload {...props} />
}

export function getDefaultMapSize() {
  return defaultMapSize
}

export function getEventSchema() {
  return globalEventSchema
}

export function getOnDemoEvent() {
  return globalOnDemoEvent
}
