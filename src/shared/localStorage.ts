import { MapData } from 'components/MapEditor/reducers/mapData'
import { EditorData } from 'components/MapEditor/reducers/editorData'
import { Tileset } from 'components/TilesetEditor/reducers/tilesetData'

interface StoreState {
  mapData: MapData,
  editorData: EditorData,
  tilesets: Tileset[]
}

export function loadState (): StoreState | void {
  try {
    const serializedState = localStorage.getItem('state')
    if (serializedState === null) {
      return undefined
    }
    return JSON.parse(serializedState)
  } catch (err) {
    return undefined
  }
}

export function saveState (state: Object | null): void {
  try {
    if (state === null) {
      localStorage.removeItem('state')
      return
    }
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  } catch {
    // ignore write errors
  }
}

let inThrottle: boolean
export function throttle (func: Function, limit: number) {
  return function() {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}
