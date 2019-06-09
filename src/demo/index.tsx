import * as React from 'react'
import * as ReactDOM from 'react-dom'

import WorldEditor, { MapData } from '..'

const outdoor = require('../tilesets/outdoor.tileset.json')
const architecture = require('../tilesets/architecture.tileset.json')
const indoor = require('../tilesets/indoor.tileset.json')
const charsets = require('../tilesets/charsets.tileset.json')

const autoOpenMap = require('./auto_open.map.json') as MapData
const eventSchema = require('./event_schema.json')

let editHandler: (mapData: MapData) => void = null

function App () {
  const [page, setPage] = React.useState(null)

  return (
    <React.Fragment>
      <WorldEditor
        tilesets={[outdoor, architecture, indoor, charsets]}
        editMap={(fn) => editHandler = fn}
        onPageChange={(page) => setPage(page)}
        eventSchema={eventSchema}
      />
      {!page && <div style={{ maxWidth: 500, margin: '0 auto' }}>
        <button onClick={() => editHandler && editHandler(autoOpenMap)}>Open demo map</button>
      </div>}
    </React.Fragment>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
)
