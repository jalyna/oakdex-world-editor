import * as React from 'react'
import { Provider, connect } from 'react-redux'
import { Dispatch } from 'redux'

import store from './store'

import { MapData } from './reducers/mapData'

interface AppProps {
  mapData: MapData | null
}

function mapStateToProps ({ mapData }: any) {
  return {
    mapData
  }
}

function AppComponent ({ mapData }: AppProps): React.ReactElement<any> {
  if (mapData) {
    return <div>MAP EDITOR</div>//<Editor />
  } else {
    return null
  }
}

const App = connect(
  mapStateToProps,
  (d: Dispatch) => { return {} },
)(AppComponent)

export default function MapEditor () {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  )
}
