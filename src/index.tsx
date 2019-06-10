import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { EventType, ActionHandler } from 'oakdex-world-engine'

import { Tileset } from 'components/TilesetEditor/reducers/tilesetData'
import { MapData } from 'components/MapEditor/reducers/mapData'

export { MapData, Tileset, EventType }

import Upload from './components/Upload'

type OnDemoEvent = (actionHandler: ActionHandler, charId: string, eventType: EventType, event: object) => void

export interface WorldEditorProps {
  tilesets?: Tileset[],
  editMap?: (fn: (mapData: MapData) => void) => void,
  onPageChange?: (page?: string) => void,
  eventSchema?: object,
  onDemoEvent?: OnDemoEvent
}

let globalEventSchema = {} as object

let globalOnDemoEvent: OnDemoEvent = null

export default function WorldEditor({eventSchema, onDemoEvent, ...props}: WorldEditorProps) {
  if (eventSchema) {
    globalEventSchema = eventSchema
  }
  if (onDemoEvent) {
    globalOnDemoEvent = onDemoEvent
  }
  return <Upload {...props} />
}

export function getEventSchema() {
  return globalEventSchema
}

export function getOnDemoEvent() {
  return globalOnDemoEvent
}
