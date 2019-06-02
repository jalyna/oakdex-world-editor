import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { Tileset } from 'components/TilesetEditor/reducers/tilesetData'

import Upload from './components/Upload'

export interface WorldEditorProps {
  tilesets?: Tileset[]
}

export default function WorldEditor({ tilesets }: WorldEditorProps) {
  return <Upload tilesets={tilesets} />
}
