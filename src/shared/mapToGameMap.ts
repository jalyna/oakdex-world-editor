import { Direction } from 'oakdex-world-engine'

import { Tileset, Credit, EMPTY_WALK, Walkability } from 'components/TilesetEditor/reducers/tilesetData'
import { MapData } from 'components/MapEditor/reducers/mapData'
import { drawMap } from 'components/MapEditor/Editor/Content/canvas'

interface GameChar {
  x: number,
  y: number,
  id: string,
  dir: Direction,
  image: string,
  hidden?: boolean,
  walkThrough?: boolean
}

export interface GameMap {
  title: string,
  width: number,
  height: number,
  credits: Credit[],
  specialTiles: (string | null)[][],
  walkability: Walkability[][],
  mapBackgroundImage: string,
  mapForegroundImage: string,
  chars?: GameChar[]
}

function getCredits (tilesets: Tileset[]): Credit[] {
  const credits = [].concat.apply([], tilesets.map((t) => t.credits)) as Credit[]
  return credits.reduce((uniqueCredits, credit) => {
    if (!credit) {
      return uniqueCredits
    }
    if (uniqueCredits.find((c) => c.title === credit.title)) {
      return uniqueCredits
    } else {
      return uniqueCredits.concat([credit])
    }
  }, [] as Credit[])
}

function getSpecialTiles (mapData: MapData, tilesets: Tileset[]): (string | null)[][] {
  let specialTiles = new Array(mapData.height).fill(0).map(() => new Array(mapData.width).fill(0).map(() => null)) as (null | string)[][]
  mapData.layers.forEach((layer) => {
    layer.fields.forEach((field) => {
      const tileset = tilesets.find((t) => t.title === field.tilesetTitle)
      if (!tileset) {
        return
      }
      const specialTile = tileset.specialTiles.find((s) => s.fields.some((f) => f.x === field.tilesetX && f.y === field.tilesetY))
      if (!specialTile) {
        return
      }
      specialTiles[field.y][field.x] = specialTile.title
    })
  })

  return specialTiles
}

function getWalkability (mapData: MapData, tilesets: Tileset[]): Walkability[][] {
  let walkability = new Array(mapData.height).fill(0).map(() => new Array(mapData.width).fill(0).map(() => ({ ...EMPTY_WALK }))) as Walkability[][]
  
  mapData.layers.forEach((layer) => {
    layer.fields.forEach((field) => {
      const tileset = tilesets.find((t) => t.title === field.tilesetTitle)
      if (!tileset) {
        return
      }
      const next = tileset.walkability[field.tilesetY][field.tilesetX]
      if (!next) {
        return
      }

      const cur = { ...walkability[field.y][field.x] }
      walkability[field.y][field.x] = {
        top: (next.top === 2 ? 0 : Math.max(cur.top, next.top)),
        right: (next.right === 2 ? 0 : Math.max(cur.right, next.right)),
        bottom: (next.bottom === 2 ? 0 : Math.max(cur.bottom, next.bottom)),
        left: (next.left === 2 ? 0 : Math.max(cur.left, next.left))
      }
    })
  })

  return walkability
}

function getChars (mapData: MapData, tilesets: Tileset[]): GameChar[] {
  return (mapData.chars || []).map((char) => {
    const tileset = tilesets.find((t) => t.title === char.tilesetTitle)
    if (!tileset) { return null }
    const charset = (tileset.charsets || []).find((c) => c.title === char.charsetTitle)
    if (!charset) { return null }
    return {
      id: char.id,
      image: charset.imageBase64,
      x: char.x,
      y: char.y,
      dir: char.dir,
      hidden: char.hidden,
      walkThrough: char.walkThrough
    }
  }).filter((c) => c)
}

export default async function (canvas: HTMLCanvasElement, mapData: MapData, tilesets: Tileset[]): Promise<GameMap> {
  await drawMap(canvas, mapData.layers, tilesets, 'background')
  const mapBackgroundImage = canvas.toDataURL('image/png')
  await drawMap(canvas, mapData.layers, tilesets, 'foreground')
  const mapForegroundImage = canvas.toDataURL('image/png')
  
  return {
    title: mapData.title,
    width: mapData.width,
    height: mapData.height,
    credits: getCredits(tilesets),
    specialTiles: getSpecialTiles(mapData, tilesets),
    walkability: getWalkability(mapData, tilesets),
    chars: getChars(mapData, tilesets),
    mapBackgroundImage,
    mapForegroundImage
  }
}
