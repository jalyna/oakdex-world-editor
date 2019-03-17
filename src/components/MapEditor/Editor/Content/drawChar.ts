import { Dispatch } from 'redux'
import store from 'components/MapEditor/store'
import { Direction } from 'oakdex-world-engine'

import getCoordinates from 'shared/getCoordinates'
import { UPDATE_MAP } from 'components/MapEditor/actionTypes'

export default function (dispatch: Dispatch, e: React.MouseEvent<HTMLDivElement>) {
  const coordinates = getCoordinates(1, e)
  const state = store.getState()
  const selectedCharset = state.editorData.selectedCharset
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
}
