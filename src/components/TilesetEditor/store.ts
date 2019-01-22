import { combineReducers, createStore } from 'redux'

const testFn = function (): null {
  console.log('test')
  return null
}

const reducers = combineReducers({
  testFn
})

export default createStore(reducers)
