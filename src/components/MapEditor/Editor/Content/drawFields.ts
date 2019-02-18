import { Coordinate } from 'components/TilesetEditor/reducers/currentCoordinates'
import { tilesetAreaToBox, SelectedTilesetArea } from 'components/MapEditor/reducers/editorData'
import { LayerField, Layer } from 'components/MapEditor/reducers/mapData'
import { AutoTile, OpacityAreas, Tileset } from 'components/TilesetEditor/reducers/tilesetData'

import store from 'components/MapEditor/store'

const GRID = [-1, 0, 1]

interface AutoTileMapping {
  [key: string]: string
}

const AUTO_TILE_MAPPING = {
  '-1, -1': '0, 0, 0, 1',
  '-1, 0':  '0, 0, 1, 1',
  '-1, 1':  '0, 0, 1, 0',
  '0, -1':  '0, 1, 0, 1',
  '0, 0':   '1, 1, 1, 1',
  '0, 1':   '1, 0, 1, 0',
  '1, -1':  '0, 1, 0, 0',
  '1, 0':   '1, 1, 0, 0',
  '1, 1':   '1, 0, 0, 0'
} as AutoTileMapping

function sameOpacityAreas (a: OpacityAreas, b: OpacityAreas): boolean {
  return Object.entries(b).sort().toString() === Object.entries(a).sort().toString()
}

function autoTileFieldByPos (autoTile: AutoTile, opacityAreas: OpacityAreas) {
  return autoTile.fields.find((f) => sameOpacityAreas(f.opacityAreas, opacityAreas))
}

function autoTileFieldByCoord(autoTile: AutoTile, coordinates: Coordinate) {
  return autoTile.fields.find((f) => f.x === coordinates.x && f.y === coordinates.y)
}

function stringToOpacityAreas (string: string): OpacityAreas {
  const parts = string.split(', ')
  return {
    topLeft: parts[0] === '1',
    topRight: parts[2] === '1',
    bottomRight: parts[3] === '1',
    bottomLeft: parts[1] === '1'
  }
}

function offsetToOpacityArea (x: number, y: number): OpacityAreas {
  return stringToOpacityAreas(AUTO_TILE_MAPPING[[x, y].join(', ')])
}

function calculateAutoTile (coordinates: Coordinate, autoTile: AutoTile, tileset: Tileset, layer: Layer, offsetX: number, offsetY: number): Coordinate {
  const y = coordinates.y + offsetY
  const x = coordinates.x + offsetX

  const currentField = layer.fields.find((f) => f.x === x && f.y === y)
  let autoTileField = null

  if (!currentField || currentField.tilesetTitle !== tileset.title) {
    autoTileField = autoTileFieldByPos(autoTile, offsetToOpacityArea(offsetX, offsetY))
  } else {
    const currentAutoTileField = autoTileFieldByCoord(autoTile, { x: currentField.tilesetX, y: currentField.tilesetY })
    if (!currentAutoTileField) {
      return autoTileFieldByPos(autoTile, offsetToOpacityArea(offsetX, offsetY))
    }

    const opacityAreasOld = currentAutoTileField.opacityAreas
    const opacityAreasNew = offsetToOpacityArea(offsetX, offsetY)

    let opacityAreas = {
      topLeft: false,
      topRight: false,
      bottomRight: false,
      bottomLeft: false
    } as OpacityAreas
    
    Object.keys(opacityAreasOld).forEach((area) => {
      if (opacityAreasOld[area] || opacityAreasNew[area]) {
        opacityAreas[area] = true
      }
    })

    if (sameOpacityAreas(opacityAreas, {
      topLeft: false,
      topRight: true,
      bottomRight: false,
      bottomLeft: true
    }) || sameOpacityAreas(opacityAreas, {
      topLeft: true,
      topRight: false,
      bottomRight: true,
      bottomLeft: false
    })) {
      opacityAreas = {
        topLeft: true,
        topRight: true,
        bottomRight: true,
        bottomLeft: true
      } as OpacityAreas
    }

    autoTileField = autoTileFieldByPos(autoTile, opacityAreas)
  }

  if (!autoTileField) {
    return
  }

  return {
    x: autoTileField.x,
    y: autoTileField.y
  }
}

function drawAutoFields (coordinates: Coordinate, activeTileset: string): LayerField[] {
  const state = store.getState()
  const tileset = state.tilesets.find((t) => t.title === activeTileset)
  const autoTile = tileset.autoTiles.find((a) => a.title === state.editorData.activeAutoTile)
  const layer = state.mapData.layers[state.editorData.activeLayerIndex]

  if (!autoTile || !layer) {
    return []
  }

  let newFields = [] as LayerField[];

  GRID.forEach((offsetY) => {
    GRID.forEach((offsetX) => {
      const tilesetCoordinates = calculateAutoTile(coordinates, autoTile, tileset, layer, offsetX, offsetY)

      if (!tilesetCoordinates) {
        return
      }

      newFields.push({
        y: coordinates.y + offsetY,
        x: coordinates.x + offsetX,
        tilesetTitle: activeTileset,
        tilesetX: tilesetCoordinates.x,
        tilesetY: tilesetCoordinates.y
      })
    })
  })

  return newFields
}

export default function drawFields (coordinates: Coordinate, selectedTilesetArea?: SelectedTilesetArea, activeTileset?: string): LayerField[] {
  if (!activeTileset) {
    return []
  }

  const tool = store.getState().editorData.tool

  if (tool === 'auto') {
    return drawAutoFields(coordinates, activeTileset)
  }

  if (!selectedTilesetArea) {
    return []
  }

  const tilesetAreaBox = tilesetAreaToBox(selectedTilesetArea)
  let newFields = [] as LayerField[];

  [...Array(tilesetAreaBox.height)].forEach((_, offsetY) => {
    [...Array(tilesetAreaBox.width)].forEach((_, offsetX) => {
      newFields.push({
        x: coordinates.x - Math.floor(tilesetAreaBox.width / 2) + offsetX,
        y: coordinates.y - Math.floor(tilesetAreaBox.height / 2) + offsetY,
        tilesetTitle: activeTileset,
        tilesetX: tilesetAreaBox.x + offsetX,
        tilesetY: tilesetAreaBox.y + offsetY
      }) 
    })
  })

  return newFields
}
