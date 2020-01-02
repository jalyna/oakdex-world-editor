import { Direction } from 'oakdex-world-engine'

import { Tileset, Credit, EMPTY_WALK, Walkability } from 'components/TilesetEditor/reducers/tilesetData'
import { MapData, LayerField } from 'components/MapEditor/reducers/mapData'
import { drawMap } from 'components/MapEditor/Editor/Content/canvas'

interface GameChar {
  x: number,
  y: number,
  id: string,
  dir: Direction,
  image: string,
  hidden?: boolean,
  walkThrough?: boolean,
  event?: {
    onTalk?: object,
    onWalkOver?: object,
    onMapEnter?: object
  }
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
  chars?: GameChar[],
  startPosition: {
    x: number,
    y: number
  },
  versions?: {
    name: string,
    mapBackgroundImage: string,
    mapForegroundImage: string
  }[],
  gifLayer?: {
    tilesets: {
      [titlesetTitle: string]: {
        imageBase64: string,
        versions?: {
          name: string,
          imageBase64: string
        }[]
      }
    },
    fields: LayerField[]
  }
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

export function getWalkability (mapData: MapData, tilesets: Tileset[]): Walkability[][] {
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
      walkThrough: char.walkThrough,
      event: char.event
    }
  }).filter((c) => c)
}

function getGifLayer (mapData: MapData, tilesets: Tileset[]): GameMap['gifLayer'] {
  let tilesetList = {} as GameMap['gifLayer']['tilesets']
  let fields = [] as LayerField[]

  mapData.layers.forEach((layer) => {
    layer.fields.forEach((field) => {
      const tileset = tilesets.find((t) => t.title === field.tilesetTitle)
      if (!tileset) {
        return
      }
      if (!tileset.imageBase64.startsWith('data:image/gif')) {
        return
      }

      fields.push(field)
      tilesetList[tileset.title] = {
        imageBase64: tileset.imageBase64,
        versions: (mapData.versions || []).map(version => {
          const tilesetVersion = version.tilesetVersions.find(t => t.tilesetId === tileset.title)
          const tVersion = (tileset.versions || []).find(v => !tilesetVersion ? false : v.name === tilesetVersion.versionId)
          return {
            name: version.name,
            imageBase64: tVersion ? tVersion.imageBase64 : tileset.imageBase64
          }
        })
      }
    })
  })

  return {
    tilesets: tilesetList,
    fields
  }
}

export default async function (canvas: HTMLCanvasElement, mapData: MapData, tilesets: Tileset[]): Promise<GameMap> {
  await drawMap(canvas, mapData.layers, tilesets, { name: 'default', tilesetVersions: [] }, 'background')
  const mapBackgroundImage = canvas.toDataURL('image/png')
  await drawMap(canvas, mapData.layers, tilesets, { name: 'default', tilesetVersions: [] }, 'foreground')
  const mapForegroundImage = canvas.toDataURL('image/png')

  let versions = []
  const mapVersions = mapData.versions || []

  for(let i = 0; i < mapVersions.length; i++) {
    await drawMap(canvas, mapData.layers, tilesets, mapVersions[i], 'background')
    let versionMapBackgroundImage = canvas.toDataURL('image/png')
    await drawMap(canvas, mapData.layers, tilesets, mapVersions[i], 'foreground')
    let versionMapForegroundImage = canvas.toDataURL('image/png')
    versions.push({
      name: mapVersions[i].name,
      mapBackgroundImage: versionMapBackgroundImage,
      mapForegroundImage: versionMapForegroundImage
    })
  }

  return {
    title: mapData.title,
    width: mapData.width,
    height: mapData.height,
    startPosition: {
      x: 0,
      y: 0,
      ...mapData.startPosition
    },
    credits: getCredits(tilesets),
    specialTiles: getSpecialTiles(mapData, tilesets),
    walkability: getWalkability(mapData, tilesets),
    chars: getChars(mapData, tilesets),
    mapBackgroundImage,
    mapForegroundImage,
    versions,
    gifLayer: getGifLayer(mapData, tilesets)
  }
}
