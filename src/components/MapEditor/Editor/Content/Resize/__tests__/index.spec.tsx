import * as React from 'react'
import configureStore, { MockStoreEnhanced } from 'redux-mock-store'
import { Provider } from 'react-redux'
import { mount } from 'enzyme'
import toJson from 'enzyme-to-json'

import Resize from '..'

const mockStore = configureStore()
let store = null as MockStoreEnhanced | null

describe('<Resize>', () => {
  beforeEach(() => {
    store = mockStore({})
  })

  it('renders correctly', () => {
    const editor = mount(<Provider store={store}><Resize /></Provider>)
    expect(toJson(editor, { noKey: false, mode: 'deep' })).toMatchSnapshot()
  })
})
