import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'

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

function App ({ tilesetData }: AppProps) {
  if (tilesetData) {
    return <Editor />
  } else {
    return null
  }
}

export default connect(
  mapStateToProps,
  (d: Dispatch) => { return {} },
)(App)
