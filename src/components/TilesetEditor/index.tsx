import * as React from 'react'
import { Provider, connect } from 'react-redux'
import { Dispatch } from 'redux'

import { GREY_50 } from 'shared/theme'

import store from './store'

import { Tileset } from './reducers/tilesetData'
import Editor from './Editor'

interface AppProps {
  tilesetData: Tileset | null
}

function mapStateToProps ({ tilesetData }: any) {
  return {
    tilesetData
  }
}

function AppComponent ({ tilesetData }: AppProps) {
  if (tilesetData) {
    return <Editor />
  } else {
    return null
  }
}

const App = connect(
  mapStateToProps,
  (d: Dispatch) => { return {} },
)(AppComponent)

export default function TilesetEditor () {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  )
}
