import * as React from 'react'
import { mount } from 'enzyme'
import Tile from '../Tile'

describe('<Tile>', () => {
  it('renders correctly', () => {
    const wrapper = mount(
      <Tile x={2} y={3} className='foo' style={{ width: '55px' }}>
        content
      </Tile>
    )
    expect(wrapper).toMatchSnapshot()
    expect(wrapper.childAt(0).prop('style').left).toEqual('32px')
    expect(wrapper.childAt(0).prop('style').top).toEqual('48px')
    expect(wrapper.childAt(0).prop('style').width).toEqual('55px')
  })
})
