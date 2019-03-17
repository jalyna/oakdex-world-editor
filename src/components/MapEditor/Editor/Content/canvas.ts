import { Tileset } from 'components/TilesetEditor/reducers/tilesetData'
import { Layer } from 'components/MapEditor/reducers/mapData'

interface TilesetImages {
  [key: string]: HTMLImageElement
}

let tilesetImages = {} as TilesetImages

async function tilesetsToMap (tilesets: Tileset[]): Promise<TilesetImages> {
  for(let i = 0; i < tilesets.length; i++) {
    if (!tilesetImages[tilesets[i].title]) {
      tilesetImages[tilesets[i].title] = await loadImage(tilesets[i].imageBase64)
    }
  }

  return tilesetImages
}

async function loadImage (base64: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const img = new Image()
    img.src = base64
    img.onload = () => resolve(img)
  })
}

export async function drawMap (canvas: HTMLCanvasElement, layers: Layer[], tilesets: Tileset[], type?: string) {
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const tilesetImages = await tilesetsToMap(tilesets)

  layers.forEach((layer) => {
    layer.fields.forEach((field) => {
      const image = tilesetImages[field.tilesetTitle]
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
