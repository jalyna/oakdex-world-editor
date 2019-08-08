import { Tileset } from 'components/TilesetEditor/reducers/tilesetData'
import { Layer } from 'components/MapEditor/reducers/mapData'

interface TilesetImages {
  [key: string]: {
    [versionId: string]: HTMLImageElement
  }
}

let tilesetImages = {} as TilesetImages

async function tilesetsToMap (tilesets: Tileset[]): Promise<TilesetImages> {
  for(let i = 0; i < tilesets.length; i++) {
    if (!tilesetImages[tilesets[i].title]) {
      tilesetImages[tilesets[i].title] = {
        default: await loadImage(tilesets[i].imageBase64)
      }
      if (tilesets[i].versions) {
        for(let j = 0; j < tilesets[i].versions.length; j++) {
          tilesetImages[tilesets[i].title][tilesets[i].versions[j].name] = await loadImage(tilesets[i].versions[j].imageBase64)
        }
      }
    }
  }

  return tilesetImages
}

async function loadImage (base64: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const img = new Image()
    img.src = base64
    img.onload = () => resolve(img)
    setTimeout(() => resolve(img), 1000)
  })
}

interface Version {
  name: string,
  tilesetVersions: {
    tilesetId: string,
    versionId: string
  }[]
}

export async function drawMap (canvas: HTMLCanvasElement, layers: Layer[], tilesets: Tileset[], version: Version, type?: string) {
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const tilesetImages = await tilesetsToMap(tilesets)

  layers.forEach((layer) => {
    layer.fields.forEach((field) => {
      const tilesetVersion = version.tilesetVersions.find(v => v.tilesetId === field.tilesetTitle)
      const versionId = tilesetVersion && tilesetVersion.versionId ? tilesetVersion.versionId : 'default'
      const image = tilesetImages[field.tilesetTitle][versionId]
      if (!image) {
        return
      }
      const tileset = tilesets.find((t) => t.title === field.tilesetTitle)
      const isObject = tileset.objects[field.tilesetY] && tileset.objects[field.tilesetY][field.tilesetX]
      if (type === 'background' && isObject) {
        return
      } else if (type === 'foreground' && !isObject) {
        return
      }
      ctx.drawImage(image, field.tilesetX * 16, field.tilesetY * 16, 16, 16, field.x * 16, field.y * 16, 16, 16)
    })
  })
}
