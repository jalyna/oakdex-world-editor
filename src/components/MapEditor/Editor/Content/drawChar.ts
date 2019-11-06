import { Dispatch } from 'redux'
import store from 'components/MapEditor/store'
import { Direction } from 'oakdex-world-engine'

import getCoordinates from 'shared/getCoordinates'
import { UPDATE_MAP, CHANGE_EDITOR_DATA } from 'components/MapEditor/actionTypes'

export default function (dispatch: Dispatch, e: React.MouseEvent<HTMLDivElement>) {
  const coordinates = getCoordinates(1, e)
  const state = store.getState()
  const selectedCharset = state.editorData.selectedCharset
  const eventToCopy = state.editorData.eventToCopy

  if (eventToCopy) {
    let chars = (state.mapData.chars || []).slice()
    const toCopy = state.mapData.chars.find(c => c.id === eventToCopy)
    const id = `${toCopy.id}-${Math.floor(Math.random() * 21)}`
    chars.push({
      ...toCopy,
      ...coordinates,
      id
    })

    dispatch({
      type: UPDATE_MAP,
      data: {
        chars
      }
    })

    dispatch({
      type: CHANGE_EDITOR_DATA,
      data: {
        selectedEvent: id
      }
    })

    return
  }

  const parts = selectedCharset.split(',')
  const tileset = state.tilesets.find((t) => t.title === parts[0])
  if (!tileset) { return }
  const charset = (tileset.charsets || []).find((c) => c.title === parts[1])
  if (!charset) { return }
  const id = coordinates.x + '-' + coordinates.y + '-' + charset.title + '-' + Math.floor(Math.random() * 21)

  let chars = (state.mapData.chars || []).slice()
  chars.push({
    ...coordinates,
    tilesetTitle: tileset.title,
    charsetTitle: charset.title,
    id,
    dir: Direction.Down
  })

  dispatch({
    type: UPDATE_MAP,
    data: {
      chars
    }
  })

  dispatch({
    type: CHANGE_EDITOR_DATA,
    data: {
      selectedEvent: id
    }
  })
}
