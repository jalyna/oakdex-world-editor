import * as React from 'react'
import { shallow } from 'enzyme'
import TilesetEditor from '..'

describe('<TilesetEditor>', () => {
  it('renders', () => {
    const editor = shallow(<TilesetEditor />)
    expect(editor).toMatchSnapshot()
  })
})
