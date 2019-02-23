import * as React from 'react'
import configureStore, { MockStoreEnhanced } from 'redux-mock-store'
import { Provider } from 'react-redux'
import { mount } from 'enzyme'
import toJson from 'enzyme-to-json'

import MapDimensions from '../MapDimensions'

const mockStore = configureStore()
let store = null as MockStoreEnhanced | null

describe('<MapDimensions>', () => {
  beforeEach(() => {
    store = mockStore({
      mapData: {
        width: 12,
        height: 10
      }
    })
  })

  it('renders correctly', () => {
    const editor = mount(<Provider store={store}><MapDimensions /></Provider>)
    expect(toJson(editor, { noKey: false, mode: 'deep' })).toMatchSnapshot()
  })
})
