import * as React from 'react'
import * as ReactDOM from 'react-dom'

import WorldEditor from '..'

const outdoor = require('../tilesets/outdoor.tileset.json')
const architecture = require('../tilesets/architecture.tileset.json')
const indoor = require('../tilesets/indoor.tileset.json')
const charsets = require('../tilesets/charsets.tileset.json')

ReactDOM.render(
  <WorldEditor
    tilesets={[outdoor, architecture, indoor, charsets]}
  />,
  document.getElementById('app')
)
