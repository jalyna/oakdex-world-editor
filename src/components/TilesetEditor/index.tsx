import * as React from 'react'
import { Provider } from 'react-redux'

import { GREY_50 } from 'shared/theme'

import store from './store'

export default function TilesetEditor ({}) {
  return (
    <Provider store={store}>
      Hello Redux
    </Provider>
  )
}
