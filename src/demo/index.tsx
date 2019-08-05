import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { ActionHandler, timeout, Direction } from 'oakdex-world-engine'

import WorldEditor, { MapData, EventType } from '..'
import { GameEvent } from './GameEvent'

const outdoor = require('../tilesets/outdoor.tileset.json')
const architecture = require('../tilesets/architecture.tileset.json')
const indoor = require('../tilesets/indoor.tileset.json')
const charsets = require('../tilesets/charsets.tileset.json')

const autoOpenMap = require('./auto_open.map.json') as MapData
const eventSchema = require('./event_schema.json')

import * as fillerMap from './fillerMap.png'

let editHandler: (mapData: MapData, background?: React.ReactNode) => void = null

const dirMap = {
  Up: Direction.Up,
  Down: Direction.Down,
  Left: Direction.Left,
  Right: Direction.Right
}

function onEvent(actionHandler: ActionHandler, charId: string, eventType: EventType, e: object) {
  const event = e as GameEvent
  console.log(charId, eventType, event)

  event.commands.forEach(async (command) => {
    switch (command.type) {
      case 'talk':
        console.log(command.text)
        break
      case 'change_char_dir':
        actionHandler.changeCharDir(charId, dirMap[command.dir])
        break
      case 'move_char_to':
        actionHandler.moveCharTo(charId, command.x, command.y)
        break
      case 'hide_char':
        actionHandler.hideChar(charId)
        break
      case 'wait':
        await timeout(command.milliseconds)
        break
      default:
        break
    }
  })
}

function App () {
  const [page, setPage] = React.useState(null)

  return (
    <React.Fragment>
      <WorldEditor
        tilesets={[outdoor, architecture, indoor, charsets]}
        editMap={(fn) => editHandler = fn}
        onPageChange={(page) => setPage(page)}
        eventSchema={eventSchema}
        onDemoEvent={onEvent}
        mapSize={{
          width: 32,
          height: 22
        }}
      />
      {!page && <div style={{ maxWidth: 500, margin: '0 auto' }}>
        <button onClick={() => editHandler && editHandler(autoOpenMap, <div>
          <img src={fillerMap} /><img src={fillerMap} /><img src={fillerMap} />
          <img src={fillerMap} /><img src={fillerMap} /><img src={fillerMap} />
          <img src={fillerMap} /><img src={fillerMap} /><img src={fillerMap} />
        </div>)}>Open demo map</button>
      </div>}
    </React.Fragment>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
)
