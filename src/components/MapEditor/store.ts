import { combineReducers, createStore, StoreEnhancer } from 'redux'

import mapData from './reducers/mapData'
import editorData from './reducers/editorData'
import tilesets from './reducers/tilesets'

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: () => StoreEnhancer | null
  }
}

window.__REDUX_DEVTOOLS_EXTENSION__ = window.__REDUX_DEVTOOLS_EXTENSION__ || null

const debug = window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : null

const reducer = combineReducers({
  mapData,
  tilesets,
  editorData
})

const store = debug ? createStore(reducer, {}, debug) : createStore(reducer)

export default store
