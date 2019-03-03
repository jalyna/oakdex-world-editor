import { combineReducers, createStore, StoreEnhancer } from 'redux'

import mapData from './reducers/mapData'
import editorData from './reducers/editorData'
import tilesets from './reducers/tilesets'

import { loadState, saveState, throttle } from 'shared/localStorage'

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

const persistedState = loadState() || {}
const store = debug ? createStore(reducer, persistedState, debug) : createStore(reducer, persistedState)

store.subscribe(throttle(() => {
  saveState(store.getState())
}, 5000))

export default store
