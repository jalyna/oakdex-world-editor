import { combineReducers, createStore, StoreEnhancer } from 'redux'

import tilesetData from './reducers/tilesetData'
import activeTab from './reducers/activeTab'
import currentCoordinates from './reducers/currentCoordinates'

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: () => StoreEnhancer | null
  }
}

window.__REDUX_DEVTOOLS_EXTENSION__ = window.__REDUX_DEVTOOLS_EXTENSION__ || null

const debug = window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : null

const reducer = combineReducers({
  tilesetData,
  activeTab,
  currentCoordinates
})

const store = debug ? createStore(reducer, {}, debug) : createStore(reducer)

export default store
