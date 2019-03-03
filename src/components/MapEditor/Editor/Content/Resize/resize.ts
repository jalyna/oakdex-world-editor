import { Dispatch } from 'redux'

import store from 'components/MapEditor/store'
import { UPDATE_MAP } from 'components/MapEditor/actionTypes'
import { Layer } from 'components/MapEditor/reducers/mapData'

interface MapDataSubset {
  width?: number,
  height?: number,
  layers?: Layer[]
}

function moveLayersByOffset (layers: Layer[], offsetX: number, offsetY: number): Layer[] {
  return layers.slice().map((layer) => {
    let newLayer = { ...layer }
    newLayer.fields = newLayer.fields.slice().map((field) => {
      return {
        ...field,
        x: field.x + offsetX,
        y: field.y + offsetY
      }
    })
    return newLayer
  })
}

function changeDimensions(direction: string, changeBy: number) {
  const mapData = store.getState().mapData
  let data = {
    width: mapData.width,
    height: mapData.height
  } as MapDataSubset

  if (direction === 'top' || direction === 'bottom') {
    data.height = mapData.height + changeBy
  } else if (direction === 'left' || direction === 'right') {
    data.width = mapData.width + changeBy
  }

  return data
}

function removeOutsideTiles (mapData: MapDataSubset, layers: Layer[]): Layer[] {
  return layers.map((layer) => {
    let newLayer = { ...layer }
    newLayer.fields = newLayer.fields.slice().filter((field) => {
      return field.x < mapData.width && field.y < mapData.height && field.x >= 0 && field.y >= 0
    })
    return newLayer
  })
}


export default function (dispatch: Dispatch, direction: string, changeBy: number) {
  const mapData = store.getState().mapData
  let data = changeDimensions(direction, changeBy)

  data.layers = removeOutsideTiles(data, moveLayersByOffset(
    mapData.layers.slice(),
    (direction === 'left' ? changeBy : 0),
    (direction === 'top' ? changeBy : 0)
  ))

  dispatch({
    type: UPDATE_MAP,
    data
  })
}
