import { Tileset } from 'components/TilesetEditor/reducers/tilesetData'
import { Layer } from 'components/MapEditor/reducers/mapData'

interface TilesetImages {
  [key: string]: {
    [versionId: string]: {
      isGif: boolean,
      element: HTMLImageElement
    }
  }
}

let tilesetImages = {} as TilesetImages

async function loadImage (base64: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const img = new Image()
    img.src = base64
    img.onload = () => resolve(img)
    setTimeout(() => resolve(img), 1000)
  })
}

let loadImageFn = loadImage

export function setLoadImageFn(fn: (base64: string) => Promise<HTMLImageElement>) {
  loadImageFn = fn
}

async function tilesetsToMap (tilesets: Tileset[]): Promise<TilesetImages> {
  for(let i = 0; i < tilesets.length; i++) {
    if (!tilesetImages[tilesets[i].title]) {
      tilesetImages[tilesets[i].title] = {
        default: {
          element: await loadImageFn(tilesets[i].imageBase64),
          isGif: tilesets[i].imageBase64.startsWith('data:image/gif')
        }
      }
      if (tilesets[i].versions) {
        for(let j = 0; j < tilesets[i].versions.length; j++) {
          tilesetImages[tilesets[i].title][tilesets[i].versions[j].name] = {
            element: await loadImageFn(tilesets[i].versions[j].imageBase64),
            isGif: tilesets[i].versions[j].imageBase64.startsWith('data:image/gif')
          }
        }
      }
    }
  }

  return tilesetImages
}

interface Version {
  name: string,
  tilesetVersions: {
    tilesetId: string,
    versionId: string
  }[]
}

export async function drawMap (canvas: HTMLCanvasElement | HTMLDivElement, layers: Layer[], tilesets: Tileset[], version: Version, type?: string) {
  let ctx: CanvasRenderingContext2D

  if (canvas.tagName === 'CANVAS') {
    canvas = canvas as HTMLCanvasElement
    ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

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

      if (image.isGif) {
        if (type === 'gif') {
          canvas = canvas as HTMLDivElement
          const div = document.createElement('div')
          div.style.cssText = `width:16px;height:16px;position:absolute;overflow:hidden;left:${field.x * 16}px;top:${field.y * 16}px;`
          div.style.backgroundImage = 'url(' + image.element.src + ')'
          div.style.backgroundPosition = `-${field.tilesetX * 16}px -${field.tilesetY * 16}px`
          canvas.appendChild(div)
        }
        return
      } else if (type === 'background' && isObject) {
        return
      } else if (type === 'foreground' && !isObject) {
        return
      }

      if (canvas.tagName === 'CANVAS') {
        ctx.drawImage(image.element, field.tilesetX * 16, field.tilesetY * 16, 16, 16, field.x * 16, field.y * 16, 16, 16)
      }
    })
  })
}
